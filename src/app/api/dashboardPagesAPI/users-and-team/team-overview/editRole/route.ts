// src/app/api/dashboardPagesAPI/users-and-team/team-overview/editRole/route.ts
import 'server-only';
import { NextResponse, NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/drizzle';
import { users, roles, userRoles } from '../../../../../../../drizzle';
import { eq, inArray, and, sql } from 'drizzle-orm';
import { z } from 'zod'; 
import { canAssignRole } from '@/lib/roleHierarchy';

const editRoleSchema = z.object({
  userId: z.number(),
  newOrgRole: z.string().min(1, "New role is required"),
  newJobRoles: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const hasRequiredPerms = session.permissions.includes('UPDATE') || session.permissions.includes('WRITE');
    if (!hasRequiredPerms) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const validatedBody = editRoleSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json({ message: 'Invalid request body', errors: validatedBody.error.format() }, { status: 400 });
    }

    const { userId, newOrgRole, newJobRoles } = validatedBody.data;

    // 1. Verify user exists and get their CURRENT orgRole from the join table
    const targetUserQuery = await db
      .select({ 
        companyId: users.companyId, 
        orgRole: roles.orgRole 
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(users.id, userId));

    if (targetUserQuery.length === 0 || targetUserQuery[0].companyId !== session.companyId) {
      return NextResponse.json({ error: 'User not found or belongs to a different company' }, { status: 404 });
    }

    const currentOrgRole = targetUserQuery[0].orgRole || 'Unassigned';

    // 2. Hierarchy Checks
    if (currentOrgRole !== 'Unassigned' && !canAssignRole(session.orgRole, currentOrgRole)) {
      return NextResponse.json({ error: 'Forbidden: You do not have authority to modify this user.' }, { status: 403 });
    }
    if (!canAssignRole(session.orgRole, newOrgRole)) {
      return NextResponse.json({ error: 'Forbidden: You cannot assign this role level.' }, { status: 403 });
    }

    // 3. Database Transaction
    await db.transaction(async (tx) => {
      // Step A: Find matching role IDs in the `roles` table
      let roleQuery;
      if (newJobRoles.length > 0) {
        roleQuery = await tx.select({ id: roles.id })
          .from(roles)
          .where(and(eq(roles.orgRole, newOrgRole), inArray(roles.jobRole, newJobRoles)));
      } else {
        // Fallback: If no job roles selected, just find the base orgRole
        roleQuery = await tx.select({ id: roles.id })
          .from(roles)
          .where(eq(roles.orgRole, newOrgRole))
          .limit(1);
      }

      const roleIds = roleQuery.map(r => r.id);
      if (roleIds.length === 0) {
        throw new Error("No roles found in the database matching this configuration. Please contact admin.");
      }

      // Step B: Wipe old mappings for this user
      await tx.delete(userRoles).where(eq(userRoles.userId, userId));

      // Step C: Insert new mappings
      const newMappings = roleIds.map(rId => ({ userId, roleId: rId }));
      await tx.insert(userRoles).values(newMappings);

      // Step D: Update the `isTechnicalRole` cache flag on the `users` table
      const isTech = newJobRoles.includes('Technical-Sales');
      await tx.update(users)
        .set({ isTechnicalRole: isTech, updatedAt: sql`now()` })
        .where(eq(users.id, userId));
    });

    return NextResponse.json({ message: 'Roles updated successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating user roles:', error);
    return NextResponse.json({ error: error.message || 'Failed to update user roles' }, { status: 500 });
  }
}