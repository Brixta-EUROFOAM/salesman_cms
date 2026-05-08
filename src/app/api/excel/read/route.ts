// src/app/api/excel/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { NEXT_PUBLIC_MYCOCOSERVER_URL } from "@/lib/Reusable-constants";

export async function GET(req: NextRequest) {
  const session = await verifySession();

  if (!session?.token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);

  const res = await fetch(
    `${NEXT_PUBLIC_MYCOCOSERVER_URL}/api/excel/read?${url.searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}