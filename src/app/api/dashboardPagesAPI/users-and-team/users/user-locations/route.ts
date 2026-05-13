// src/app/api/dashboardPagesAPI/users-and-team/users/user-locations/route.ts
import "server-only";
import { connection, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { users } from "../../../../../../../drizzle/schema";
import { isNotNull } from "drizzle-orm";

export async function GET() {
  await connection();
  try {
    const session = await verifySession(); 
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // DISTINCT zones
    const uniqueZones = await db
      .selectDistinct({ zone: users.zone })
      .from(users)
      .where(isNotNull(users.zone));

    // DISTINCT areas
    const uniqueAreas = await db
      .selectDistinct({ area: users.area })
      .from(users)
      .where(isNotNull(users.area));

    const zones = uniqueZones
      .map((z) => z.zone ?? "")
      .filter(Boolean);

    const areas = uniqueAreas
      .map((a) => a.area ?? "")
      .filter(Boolean);

    return NextResponse.json({ zones, areas }, { status: 200 }); // Swapped regions array to zones
  } catch (error) {
    console.error("Error fetching user locations:", error);
    return NextResponse.json({ error: "Failed to fetch user locations" }, { status: 500 });
  }
}