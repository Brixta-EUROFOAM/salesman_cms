// src/app/api/me/route.ts
import 'server-only';
import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await verifySession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Just return the decrypted JWT session directly!
    // It already has id, firstName, lastName, companyName, orgRole, and permissions.
    return NextResponse.json(session, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current user' },
      { status: 500 }
    );
  }
}