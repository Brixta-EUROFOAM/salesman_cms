// src/app/api/me/route.ts
import 'server-only';
import { connection, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { users, roles, userRoles } from '../../../../drizzle';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { verifySession } from '@/lib/auth';

// Schema for validating returned user info
const currentUserSchema = z.object({
  id: z.number(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string(),
  orgRole: z.string(), // Changed to orgRole
  jobRoles: z.array(z.string()).default([]), // Added jobRoles
  companyId: z.number().nullable(),
});

export async function GET() {
  await connection();
  try {
    const session = await verifySession();

    // 1. Authentication Check
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch current user and their mapped roles from the DB
    const result = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        companyId: users.companyId,
        orgRole: roles.orgRole,
        jobRole: roles.jobRole,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(users.id, session.userId));

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Aggregate roles (since a user might have multiple job roles mapping to multiple rows)
    let orgRole = 'Unassigned';
    const jobRoles = new Set<string>();

    for (const row of result) {
      if (row.orgRole && orgRole === 'Unassigned') orgRole = row.orgRole;
      if (row.jobRole) jobRoles.add(row.jobRole);
    }

    // 4. Construct the user object
    const userToValidate = {
      id: result[0].id,
      firstName: result[0].firstName,
      lastName: result[0].lastName,
      email: result[0].email,
      companyId: result[0].companyId,
      orgRole: orgRole,
      jobRoles: Array.from(jobRoles),
    };

    // 5. Validate response data
    const validatedUser = currentUserSchema.parse(userToValidate);

    // 6. Return the validated user object
    return NextResponse.json(validatedUser, { status: 200 });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current user', details: (error as Error).message },
      { status: 500 }
    );
  }
}