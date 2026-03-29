// src/app/account/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    
    // Destroy the auth token
    cookieStore.delete('auth_token');

    // Redirect the user back to the signed out home page
    return NextResponse.redirect(new URL('/', request.url));
}