// src/app/api/dashboardPagesAPI/users-and-team/users/route.ts
import "server-only";
import { connection, NextRequest, NextResponse } from "next/server";
import { verifySession, hasPermission } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { users, roles as rolesTable, userRoles } from "../../../../../../drizzle/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { generateRandomPassword } from "./helpers";

// =================
// POST ROUTE 
// =================

export async function POST(request: NextRequest) {
    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!hasPermission(session.permissions, "WRITE")) {
            return NextResponse.json({ error: 'Forbidden: WRITE access required' }, { status: 403 });
        }

        // --- 1. PARSE REQUEST DATA ---
        const body = await request.json();
        const {
            email, username, phoneNumber, jobRole, orgRole, zone, area,
            isDashboardUser, isSalesAppUser
        } = body;

        // jobRole is likely an array now based on your multi-role requirement
        const jobRolesArray = Array.isArray(jobRole) ? jobRole : [jobRole].filter(Boolean);

        if (!email || !username || (!orgRole && !jobRole)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // --- 2. EXISTING USER CHECK ---
        const existingUserResult = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUserResult[0]) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }

        // --- 3. TRANSACTIONAL INSERT (User + Roles) ---
        const { newUser, generatedCredentials } = await db.transaction(async (tx) => {

            const newUserData: any = {
                email,
                username,
                phoneNumber,

                // BACKWARD COMPATIBILITY save orgRole to legacy role column
                role: orgRole || 'junior-executive',

                zone,
                area,
                status: "active",
                isDashboardUser: !!isDashboardUser,
                isSalesAppUser: !!isSalesAppUser,
            };

            const credentials: any = {};

            // Credential Generation Logic
            if (newUserData.isDashboardUser) {
                const emailLocalPart = email.split('@')[0];
                let dashPassword = "";

                // if email is user.abc@mail.com, pass is user@123
                if (emailLocalPart.includes('.')) {
                    dashPassword = emailLocalPart.split('.')[0] + '@123';
                    // if email is userabc@mail.com, pass is userab@123
                } else {
                    dashPassword = emailLocalPart.substring(0, 6) + '@123';
                }
                newUserData.dashboardLoginId = email;
                newUserData.dashboardHashedPassword = dashPassword;
                credentials.dashboardEmail = email;
                credentials.dashboardPassword = dashPassword;
            }

            if (newUserData.isSalesAppUser) {
                let salesmanId = `EMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                const salesPassword = generateRandomPassword();
                newUserData.salesmanLoginId = salesmanId;
                newUserData.salesAppPassword = salesPassword; // Swapped to new schema column name
                credentials.salesmanId = salesmanId;
                credentials.salesmanPassword = salesPassword;
            }

            // A. Insert User
            const inserted = await tx.insert(users).values(newUserData).returning();
            const createdUser = inserted[0];

            // B. Map and Insert Job Roles into userRoles table
            if (jobRolesArray.length > 0) {
                const dbRoles = await tx
                    .select({ id: rolesTable.id })
                    .from(rolesTable)
                    .where(
                        and(
                            eq(rolesTable.orgRole, newUserData.role),
                            inArray(rolesTable.jobRole, jobRolesArray)
                        )
                    );

                if (dbRoles.length > 0) {
                    const roleLinks = dbRoles.map(r => ({
                        userId: createdUser.id,
                        roleId: r.id
                    }));
                    await tx.insert(userRoles).values(roleLinks);
                }
            }

            return { newUser: createdUser, generatedCredentials: credentials };
        });

        // 4. Return Data (No email sending)
        return NextResponse.json({
            message: 'User created successfully',
            user: newUser,
            credentials: generatedCredentials
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

// =======================================================
// GET
// =======================================================

export async function GET(request: NextRequest) {
    if (typeof connection === 'function') await connection();

    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!hasPermission(session.permissions, "READ")) {
            return NextResponse.json({ error: 'Forbidden: READ access required' }, { status: 403 });
        }

        // 1. Fetch all users explicitly joining roles to get orgRole and jobRole
        const rawData = await db
            .select({
                id: users.id,
                email: users.email,
                username: users.username,
                zone: users.zone,
                area: users.area,
                status: users.status,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
                phoneNumber: users.phoneNumber,
                deviceId: users.deviceId,
                isDashboardUser: users.isDashboardUser,
                isSalesAppUser: users.isSalesAppUser,
                salesmanLoginId: users.salesmanLoginId,
                // Role Data from JOIN
                orgRole: rolesTable.orgRole,
                jobRole: rolesTable.jobRole,
            })
            .from(users)
            .leftJoin(userRoles, eq(users.id, userRoles.userId))
            .leftJoin(rolesTable, eq(userRoles.roleId, rolesTable.id))
            .orderBy(desc(users.createdAt));

        // 2. Aggregate the multiple rows per user into a single object
        const usersMap = new Map();

        for (const row of rawData) {
            const userId = row.id;

            if (!usersMap.has(userId)) {
                // First time seeing this user, set up the base object
                usersMap.set(userId, {
                    id: row.id,
                    email: row.email,
                    username: row.username,
                    zone: row.zone,
                    area: row.area,
                    status: row.status,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    phoneNumber: row.phoneNumber,
                    deviceId: row.deviceId,
                    isDashboardUser: row.isDashboardUser,
                    isSalesAppUser: row.isSalesAppUser,
                    salesmanLoginId: row.salesmanLoginId,
                    // Role processing
                    orgRole: row.orgRole || 'Unassigned',
                    jobRoles: new Set<string>(), // Use a Set to collect job roles without duplicates
                });
            }

            const u = usersMap.get(userId);

            // Add the job role from this row to the user's Set
            if (row.jobRole) {
                u.jobRoles.add(row.jobRole);
            }

            // If the first row we hit had a null orgRole, but a subsequent row has one, use it.
            if (row.orgRole && u.orgRole === 'Unassigned') {
                u.orgRole = row.orgRole;
            }
        }

        // 3. Format the final array, converting Set to Array
        const formattedUsers = Array.from(usersMap.values()).map(u => ({
            ...u,
            jobRole: Array.from(u.jobRoles) // Convert Set to Array for JSON transmission
        }));

        return NextResponse.json({ users: formattedUsers }, { status: 200 });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}