// src/app/api/delete-user/route.ts
import 'server-only';
import { NextResponse } from 'next/server';
import { verifySession, hasPermission } from '@/lib/auth';
import { db } from '@/lib/drizzle';
import { users, userRoles } from '../../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        // Use the new helper function for authorization
        if (!hasPermission(session.permissions, 'DELETE')) {
            return NextResponse.json({ error: 'You do not have DELETE permission' }, { status: 403 });
        }

        const body = await request.json();
        const { targetUserId } = body; 

        if (!targetUserId) {
            return NextResponse.json({ error: 'Target User ID is required' }, { status: 400 });
        }

        // Execution: Transactional Delete
        await db.transaction(async (tx) => {
            // Ensure the user exists
            const targetUser = await tx
                .select({ id: users.id })
                .from(users)
                .where(eq(users.id, targetUserId))
                .limit(1);

            if (targetUser.length === 0) {
                throw new Error('User not found');
            }

            // A. Delete from user_roles join table first
            // (Even if schema has "onDelete: cascade", doing it explicitly in tx is a good safeguard)
            await tx.delete(userRoles).where(eq(userRoles.userId, targetUserId));

            // B. Delete the main user record
            await tx.delete(users).where(eq(users.id, targetUserId));
            
            return { success: true };
        });

        return NextResponse.json({
            message: 'User and associated roles deleted successfully.'
        }, { status: 200 });

    } catch (error: any) {
        console.error('❌ Critical error in delete-user route:', error.message);

        if (error.message === 'User not found') {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ error: 'Failed to process deletion' }, { status: 500 });
    }
}