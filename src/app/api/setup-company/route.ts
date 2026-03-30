// src/app/api/setup-company/route.ts
import 'server-only';
import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { db } from '@/lib/drizzle';
import { users, companies, roles, userRoles } from '../../../../drizzle'; 
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      companyName, officeAddress, isHeadOffice, phoneNumber, region, area,
      adminFirstName, adminLastName, adminEmail, adminPassword 
    } = body;

    // 1. Basic Validation
    if (!companyName || !adminEmail || !adminPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Check if email is already registered
    const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.email, adminEmail)).limit(1);
    if (existingUser[0]) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    const result = await db.transaction(async (tx) => {
      // A. Create the Company Record
      const [newCompany] = await tx.insert(companies).values({
        companyName,
        officeAddress,
        isHeadOffice,
        phoneNumber,
        region,
        area,
        adminUserId: "temp", // Will update below
      }).returning();

      // B. Create the Admin User
      const [newUser] = await tx.insert(users).values({
        email: adminEmail,
        firstName: adminFirstName,
        lastName: adminLastName,
        companyId: newCompany.id,
        role: 'Admin', // Legacy role column
        region,
        area,
        status: 'active',
        isDashboardUser: true,
        dashboardLoginId: adminEmail,
        dashboardHashedPassword: adminPassword, // Note: For production, hash this with bcrypt
      }).returning();

      // C. Update Company with correct adminUserId
      await tx.update(companies)
        .set({ adminUserId: newUser.id.toString() })
        .where(eq(companies.id, newCompany.id));

      // D. Link to 'Admin' Job Role: Sets ["READ", "WRITE", "UPDATE", "DELETE", ...]
      const adminJobRole = await tx
        .select()
        .from(roles)
        .where(eq(roles.jobRole, 'Admin'))
        .limit(1);
      
      let perms: string[] = [];
      if (adminJobRole[0]) {
        await tx.insert(userRoles).values({
          userId: newUser.id,
          roleId: adminJobRole[0].id
        });
        perms = adminJobRole[0].grantedPerms;
      }

      return { newCompany, newUser, perms };
    });

    // 3. Issue JWT with the new Admin privileges
    const newSessionData = {
      userId: result.newUser.id,
      email: result.newUser.email,
      orgRole: 'Admin',
      jobRoles: ['Admin'],
      permissions: result.perms,
      companyId: result.newCompany.id,
    };

    const newToken = await encrypt(newSessionData);
    const cookieStore = await cookies();
    cookieStore.set('auth_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ 
      message: 'Company and Admin initialized successfully.',
      company: result.newCompany 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Setup Company Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}