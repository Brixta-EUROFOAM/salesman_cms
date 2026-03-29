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

        const url = new URL(request.url);
        const isCurrentOnly = url.searchParams.get("current") === "true";

        if (!isCurrentOnly && !session.permissions.includes("READ")) {
            return NextResponse.json({ error: "Forbidden: READ access required" }, { status: 403 });
        }

        const currentUserResult = await db
            .select({
                id: users.id,
                email: users.email,
                companyId: users.companyId,
                firstName: users.firstName,
                lastName: users.lastName,
                region: users.region,
                area: users.area,
                isTechnicalRole: users.isTechnicalRole,
                isAdminAppUser: users.isAdminAppUser,
                deviceId: users.deviceId,
                companyName: companies.companyName,
            })
            .from(users)
            .leftJoin(companies, eq(users.companyId, companies.id))
            .where(eq(users.id, session.userId))
            .limit(1);

        const currentUser = currentUserResult[0];

        if (!currentUser)
            return NextResponse.json({ error: "User not found" }, { status: 404 });

        if (url.searchParams.get("current") === "true") {
            return NextResponse.json({
                currentUser: {
                    id: currentUser.id,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    companyName: currentUser.companyName,
                    region: currentUser.region,
                    area: currentUser.area,
                    isTechnical: currentUser.isTechnicalRole,
                    isAdminAppUser: currentUser.isAdminAppUser,
                    deviceId: currentUser.deviceId,
                    permissions: session.permissions || []
                },
            });
        }

        const companyUsers = await db
            .select()
            .from(users)
            .where(eq(users.companyId, currentUser.companyId))
            .orderBy(desc(users.createdAt));
            
        // 2. Extract IDs to fetch their linked job roles
        const userIds = companyUsers.map(u => u.id);
        let allUserRoles: any[] = [];
        
        // 3. Query the user_roles linking table and join with roles table
        if (userIds.length > 0) {
            allUserRoles = await db
                .select({
                    userId: userRoles.userId,
                    jobRole: rolesTable.jobRole
                })
                .from(userRoles)
                .innerJoin(rolesTable, eq(userRoles.roleId, rolesTable.id))
                .where(inArray(userRoles.userId, userIds));
        }

        // 4. Attach the array of job roles to each respective user object
        const formattedUsers = companyUsers.map(u => ({
            ...u,
            jobRoles: allUserRoles
                .filter(ur => ur.userId === u.id)
                .map(ur => ur.jobRole)
                .filter(Boolean)
        }));

        return NextResponse.json({
            users: formattedUsers,
            currentUser: {
                companyName: currentUser.companyName,
                region: currentUser.region,
                area: currentUser.area,
                isTechnical: currentUser.isTechnicalRole,
                isAdminAppUser: currentUser.isAdminAppUser,
                deviceId: currentUser.deviceId,
                permissions: session.permissions || []
            },
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}