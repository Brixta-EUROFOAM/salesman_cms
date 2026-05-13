// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { users, roles, userRoles } from '../../../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Find user by Dashboard Login ID
    const userResult = await db
      .select({
        user: users,
      })
      .from(users)
      .where(eq(users.dashboardLoginId, email))
      .limit(1);

    const row = userResult[0];

    // Immediate null check: if no row is returned, the email doesn't exist
    if (!row || !row.user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = row.user;

    // 2. IMMEDIATE SECURITY CHECK
    // Check if they are allowed to use the dashboard
    if (!user.isDashboardUser) {
      return NextResponse.json({ error: 'Invalid email or ID' }, { status: 403 });
    }

    // Check if the password is correct
    if (user.dashboardHashedPassword !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 3. FETCH ROLES & PERMISSIONS
    // Since we know the user is valid now, we fetch their assigned Job Roles and the associated CRUD permissions
    const userRolesResult = await db
      .select({
        orgRole: roles.orgRole,
        jobRole: roles.jobRole,
        rawPermissions: roles.grantedPerms
      })
      .from(userRoles)
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id));

    const orgRolesList = userRolesResult.map(r => r.orgRole).filter(Boolean) as string[];
    const primaryOrgRole = orgRolesList.length > 0 ? orgRolesList[0] : '';
    const jobRoleNames = Array.from(new Set(userRolesResult.map(r => r.jobRole).filter(Boolean))) as string[];

    // Safely extract and flatten the permissions
    let extractedPerms: string[] = [];
    userRolesResult.forEach(row => {
      if (Array.isArray(row.rawPermissions)) {
        extractedPerms.push(...row.rawPermissions);
      } else if (typeof row.rawPermissions === 'string') {
        // In case the DB returns a stringified array like '["READ", "WRITE"]'
        try {
          const parsed = JSON.parse(row.rawPermissions);
          if (Array.isArray(parsed)) extractedPerms.push(...parsed);
        } catch (e) {
          console.error("Failed to parse permissions string:", row.rawPermissions);
        }
      }
    });

    // Create unique set
    const allPerms = Array.from(new Set(extractedPerms));

    // 4. Update Status if needed
    if (user.status !== 'active') {
      await db.update(users).set({ status: 'active' }).where(eq(users.id, user.id));
    }

    // 5. Create the JWT payload
    const sessionData = {
      userId: user.id,
      email: user.email,
      username: user.username,       // Consolidated from firstName/lastName
      orgRole: primaryOrgRole,       // e.g., 'executive', 'general-manager'
      jobRoles: jobRoleNames,        // e.g., ['Sales-Marketing', 'Technical-Sales']
      permissions: allPerms,         // e.g., ['READ', 'WRITE', 'UPDATE']
    };

    // 6. Encrypt and set cookie
    const token = await encrypt(sessionData);
    const cookieStore = await cookies();

    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      message: 'Login successful',
      user: {
        isDashboardUser: user.isDashboardUser,
        isSalesAppUser: user.isSalesAppUser // Swapped from isAdminAppUser
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}