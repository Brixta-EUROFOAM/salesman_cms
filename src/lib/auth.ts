// src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { JWT_KEY } from './Reusable-constants';

// In production, MUST use a strong, random 32+ character string in your .env
const key = new TextEncoder().encode(JWT_KEY);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Session lasts 7 days
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  const payload = await decrypt(token);
  //console.log("Decrypted paylod in auth.ts: ", payload);
  if (!payload) return null;

  return {
    userId: payload.userId as number,
    companyId: payload.companyId as number,
    companyName: payload.companyName as string,
    firstName: payload.firstName as string,
    lastName: payload.lastName as string,
    email: payload.email as string,
    orgRole: (payload.orgRole as string) || '',
    jobRoles: (payload.jobRoles as string[]) || [],
    permissions: (payload.permissions as string[]) || [], 
  };
}

// Simple helper function to use in routes
export function hasPermission(sessionPerms: string[], required: string | string[]): boolean {
  // We can also bake the ALL_ACCESS check right for ADMIN user in here to save time!
  if (sessionPerms.includes('ALL_ACCESS')) return true;
  
  // If an array was passed, check if the user has AT LEAST ONE of them
  if (Array.isArray(required)) {
    return required.some(perm => sessionPerms.includes(perm));
  }
  
  // If a single string was passed, just check that one
  return sessionPerms.includes(required);
}