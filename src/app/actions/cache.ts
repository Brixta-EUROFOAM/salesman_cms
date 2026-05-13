// src/app/actions/cache.ts
'use server';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { db } from '@/lib/drizzle';
import { users } from '../../../drizzle';
import { eq } from 'drizzle-orm';
import { verifySession } from '@/lib/auth';

export async function refreshCompanyCache(cachePrefix: string) {
  try {
    const session = await verifySession();
    if (!session || !session.userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const result = await db
      .select({ userId: users.id })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    const currentUser = result[0];

    if (!currentUser) throw new Error('User not found');

    // Define tags that are global and shouldn't get a companyId attached
    const globalTags = [''];

    // If it's a global tag, use it exactly as is. Otherwise, append the companyId.
    const targetTag = globalTags.includes(cachePrefix)
      ? cachePrefix
      : `${cachePrefix}-${currentUser.userId}`;

    // Nuke the cache!
    revalidateTag(targetTag, { expire: 0 });

    return { success: true, message: `Cache cleared for ${targetTag}` };
  } catch (error) {
    console.error('Error clearing cache:', error);
    return { success: false, error: 'Failed to clear cache' };
  }
}