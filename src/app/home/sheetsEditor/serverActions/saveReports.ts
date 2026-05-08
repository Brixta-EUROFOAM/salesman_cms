// src/app/home/sheetsEditor/serverActions/saveReports.ts
'use server';

import { NEXT_PUBLIC_MYCOCOSERVER_URL } from '@/lib/Reusable-constants';
import { verifySession } from '@/lib/auth';

export async function saveOutstandingReportsAction(records: any[]) {
  const backendUrl = NEXT_PUBLIC_MYCOCOSERVER_URL;

  // 1. Grab the actual user's session token from Next.js cookies
  const session = await verifySession();

  if (!session || !session.token) {
    throw new Error("Unauthorized: No valid session token found.");
  }

  try {
    const response = await fetch(`${backendUrl}/api/excel/outstanding/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 2. Pass the real user token to Express
        'Authorization': `Bearer ${session.token}`
      },
      body: JSON.stringify({ records })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.details || "Failed to save reports to database");
    }

    return result;
  } catch (error: any) {
    console.error("Express Fetch Error:", error);
    throw new Error(error.message || "Failed to communicate with Express server");
  }
}