// src/app/api/dashboardPagesAPI/users-and-team/users/[userId]/route.ts
import 'server-only';
import { connection, NextRequest, NextResponse } from 'next/server';
import { verifySession, hasPermission } from '@/lib/auth';
import { db } from '@/lib/drizzle';
import { users, roles as rolesTable, userRoles } from '../../../../../../../drizzle/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { generateRandomPassword } from '@/app/api/dashboardPagesAPI/users-and-team/users/helpers';

const updateUserSchema = z.object({
  username: z.string().min(1).optional(),
  email: z.string().optional(),
  orgRole: z.string().optional(),
  jobRole: z.union([z.string(), z.array(z.string())]).optional(),
  role: z.string().optional(),
  area: z.string().optional().nullable(),
  zone: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  isDashboardUser: z.boolean().optional(),
  isSalesAppUser: z.boolean().optional(),
  clearDevice: z.boolean().optional(),
}).strict();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const targetUserLocalId = parseInt(userId);

    const session = await verifySession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(session.permissions, ['UPDATE', 'WRITE'])) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const parsedBody = updateUserSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ message: 'Invalid body', errors: parsedBody.error.format() }, { status: 400 });
    }

    const {
      orgRole, jobRole, area, zone, phoneNumber, clearDevice,
      isDashboardUser, isSalesAppUser,
      ...standardData
    } = parsedBody.data;

    const jobRolesArray = Array.isArray(jobRole) ? jobRole : [jobRole].filter(Boolean) as string[];

    const targetUserResult = await db.select().from(users).where(eq(users.id, targetUserLocalId)).limit(1);
    const targetUser = targetUserResult[0];

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // --- TRANSACTION START ---
    const { updatedUser, credentials } = await db.transaction(async (tx) => {

      const drizzleUpdateData: any = {
        ...standardData,
        role: orgRole || jobRole,
        area: area !== undefined ? area : targetUser.area,
        zone: zone !== undefined ? zone : targetUser.zone,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : targetUser.phoneNumber,
        deviceId: clearDevice === true ? null : targetUser.deviceId,
      };

      if (orgRole !== undefined) {
        drizzleUpdateData.role = orgRole;
      }

      const generatedCreds: any = {};

      // --- LOGIC A: Dashboard User Upgrade ---
      if (isDashboardUser === true && !targetUser.dashboardHashedPassword) {
        const emailToUse = standardData.email || targetUser.email || "";
        const emailLocalPart = emailToUse.split('@')[0];
        let dashPassword = "";

        if (emailLocalPart.includes('.')) {
          dashPassword = emailLocalPart.split('.')[0] + '@123';
        } else {
          dashPassword = emailLocalPart.substring(0, 6) + '@123';
        }

        drizzleUpdateData.isDashboardUser = true;
        drizzleUpdateData.dashboardLoginId = standardData.email || targetUser.email;
        drizzleUpdateData.dashboardHashedPassword = dashPassword;
        generatedCreds.dashboardEmail = drizzleUpdateData.dashboardLoginId;
        generatedCreds.dashboardPassword = dashPassword;
      } else if (isDashboardUser !== undefined) {
        drizzleUpdateData.isDashboardUser = isDashboardUser;
      }

      // --- LOGIC B: Sales App Upgrade ---
      if (isSalesAppUser === true && !targetUser.salesmanLoginId) {
        let isUnique = false;
        let newSalesmanId = '';
        while (!isUnique) {
          newSalesmanId = `EMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          const existingSalesman = await db.select({ id: users.id }).from(users).where(eq(users.salesmanLoginId, newSalesmanId)).limit(1);
          if (!existingSalesman[0]) isUnique = true;
        }
        const newSalesmanPassword = generateRandomPassword();
        drizzleUpdateData.isSalesAppUser = true;
        drizzleUpdateData.salesmanLoginId = newSalesmanId;
        drizzleUpdateData.salesAppPassword = newSalesmanPassword;
        generatedCreds.salesmanId = newSalesmanId;
        generatedCreds.salesmanPassword = newSalesmanPassword;
      } else if (isSalesAppUser !== undefined) {
        drizzleUpdateData.isSalesAppUser = isSalesAppUser;
      }

      if (jobRole !== undefined) {
        await tx.delete(userRoles).where(eq(userRoles.userId, targetUserLocalId));

        if (jobRolesArray.length > 0) {
          const resolvedOrgRole = orgRole || '';
          const dbRoles = await tx.select({ id: rolesTable.id })
             .from(rolesTable)
             .where(
                and(
                    eq(rolesTable.orgRole, resolvedOrgRole),
                    inArray(rolesTable.jobRole, jobRolesArray)
                )
             );

          if (dbRoles.length > 0) {
            await tx.insert(userRoles).values(dbRoles.map(r => ({ userId: targetUserLocalId, roleId: r.id })));
          }
        }
      }

      const updated = await tx.update(users).set(drizzleUpdateData).where(eq(users.id, targetUserLocalId)).returning();
      return { updatedUser: updated[0], credentials: generatedCreds };
    });

    return NextResponse.json({ 
      message: 'User updated successfully', 
      user: updatedUser,
      credentials
    });

  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// ==========================================
// GET - Get single user
// ==========================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  await connection();
  try {
    const { userId } = await params;

    const session = await verifySession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(session.permissions, "READ")) {
      return NextResponse.json({ error: 'Forbidden: READ access required' }, { status: 403 });
    }

    const targetUserResult = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        zone: users.zone,
        area: users.area,
        phoneNumber: users.phoneNumber,
        isDashboardUser: users.isDashboardUser,
        isSalesAppUser: users.isSalesAppUser,
        deviceId: users.deviceId,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        dashboardLoginId: users.dashboardLoginId,
        salesmanLoginId: users.salesmanLoginId,
      })
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    const targetUser = targetUserResult[0];

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: targetUser });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}