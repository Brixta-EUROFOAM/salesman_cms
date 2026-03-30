// src/app/api/dashboardPagesAPI/users-and-team/users/route.ts
import "server-only";
import { connection, NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { users, companies, roles as rolesTable, userRoles } from "../../../../../../drizzle";
import { eq, and, desc, inArray } from "drizzle-orm";
import { generateRandomPassword, sendInvitationEmailResend } from "./helpers";

// =================
// POST ROUTE 
// =================

export async function POST(request: NextRequest) {
    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!session.permissions.includes("WRITE")) {
            return NextResponse.json({ error: 'Forbidden: WRITE access required' }, { status: 403 });
        }

        const adminUserResult = await db
            .select({
                id: users.id,
                email: users.email,
                companyId: users.companyId,
                firstName: users.firstName,
                lastName: users.lastName,
                companyName: companies.companyName
            })
            .from(users)
            .leftJoin(companies, eq(users.companyId, companies.id))
            .where(eq(users.id, session.userId))
            .limit(1);

        const adminUser = adminUserResult[0];
        if (!adminUser) return NextResponse.json({ error: 'Admin record not found' }, { status: 404 });

        // --- 2. PARSE REQUEST DATA ---
        const body = await request.json();
        const {
            email, firstName, lastName, phoneNumber, jobRole, orgRole, region, area,
            isDashboardUser, isSalesAppUser, isTechnicalRole, isAdminAppUser
        } = body;

        // jobRole is likely an array now based on your multi-role requirement
        const jobRolesArray = Array.isArray(jobRole) ? jobRole : [jobRole].filter(Boolean);

        if (!email || !firstName || (!orgRole && !jobRole)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // --- 3. EXISTING USER CHECK ---
        const existingUserResult = await db
            .select({ id: users.id })
            .from(users)
            .where(and(eq(users.companyId, adminUser.companyId), eq(users.email, email)))
            .limit(1);

        if (existingUserResult[0]) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }

        // --- 4. TRANSACTIONAL INSERT (User + Roles) ---
        const { newUser, emailPayload } = await db.transaction(async (tx) => {

            const newUserData: any = {
                email,
                firstName,
                lastName,
                phoneNumber,
                role: orgRole || jobRole,
                region,
                area,
                companyId: adminUser.companyId,
                status: "active",
                isDashboardUser: !!isDashboardUser,
                isSalesAppUser: !!isSalesAppUser,
                isTechnicalRole: !!isTechnicalRole,
                isAdminAppUser: !!isAdminAppUser,
            };

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
            }

            if (newUserData.isSalesAppUser) {
                let salesmanId = `EMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                const salesPassword = generateRandomPassword();
                newUserData.salesmanLoginId = salesmanId;
                newUserData.hashedPassword = salesPassword;
            }

            if (newUserData.isTechnicalRole) {
                let techId = `TSE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                const techPassword = generateRandomPassword();
                newUserData.techLoginId = techId;
                newUserData.techHashPassword = techPassword;
            }

            if (newUserData.isAdminAppUser) {
                let adminId = `ADM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                const adminAppPassword = generateRandomPassword();
                newUserData.adminAppLoginId = adminId;
                newUserData.adminAppHashedPassword = adminAppPassword;
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

            // Prepare Email Payload
            const safeOrgRole = (orgRole || '').replace(/-/g, ' ');
            const safeJobRole = jobRolesArray.join(', ').replace(/-/g, ' ');
            const displayRole = safeJobRole ? `${safeOrgRole} (${safeJobRole})` : safeOrgRole;

            const payload = {
                to: email,
                firstName,
                lastName,
                companyName: adminUser.companyName ?? "Best Cement",
                adminName: `${adminUser.firstName ?? ''} ${adminUser.lastName ?? ''}`.trim(),
                role: displayRole,
                dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
                dashboardEmail: newUserData.isDashboardUser ? email : undefined,
                dashboardTempPassword: newUserData.dashboardHashedPassword,
                salesmanLoginId: newUserData.salesmanLoginId,
                salesmanTempPassword: newUserData.hashedPassword,
                techLoginId: newUserData.techLoginId,
                techTempPassword: newUserData.techHashPassword,
                adminAppLoginId: newUserData.adminAppLoginId,
                adminAppTempPassword: newUserData.adminAppHashedPassword
            };

            return { newUser: createdUser, emailPayload: payload };
        });

        // --- 5. SEND EMAIL NOTIFICATION ---
        if (newUser.isDashboardUser || newUser.isSalesAppUser || newUser.isTechnicalRole || newUser.isAdminAppUser) {
            await sendInvitationEmailResend(emailPayload);
        }

        return NextResponse.json({
            message: 'User created and credentials delivered successfully',
            user: newUser
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
    await connection();
    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!session.permissions.includes("READ")) {
            return NextResponse.json({ error: 'Forbidden: READ access required' }, { status: 403 });
        }

        const adminUserResult = await db
            .select({ companyId: users.companyId })
            .from(users)
            .where(eq(users.id, session.userId))
            .limit(1);

        const adminUser = adminUserResult[0];

        // 1. Fetch all users in the company, explicitly joining roles to get orgRole and jobRole
        const rawData = await db
            .select({
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                region: users.region,
                area: users.area,
                status: users.status,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
                phoneNumber: users.phoneNumber,
                isTechnicalRole: users.isTechnicalRole,
                isAdminAppUser: users.isAdminAppUser,
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
            .where(eq(users.companyId, adminUser.companyId))
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
                    firstName: row.firstName,
                    lastName: row.lastName,
                    region: row.region,
                    area: row.area,
                    status: row.status,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    phoneNumber: row.phoneNumber,
                    isTechnicalRole: row.isTechnicalRole,
                    isAdminAppUser: row.isAdminAppUser,
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