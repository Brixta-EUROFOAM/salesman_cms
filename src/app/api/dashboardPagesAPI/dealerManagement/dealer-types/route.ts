// src/app/api/dashboardPagesAPI/dealerManagement/dealer-types/route.ts
import 'server-only';
import { connection, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { dealers } from '../../../../../../drizzle';
import { asc } from 'drizzle-orm';
import { verifySession } from '@/lib/auth';

export async function GET() {
  await connection();

  try {
    const session = await verifySession();

    if (!session || !session.userId) {
      return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } );
}

    if (!session.permissions.includes('READ')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 } );
    }

    const [uniqueZones, uniqueAreas] = await Promise.all([
      db
        .selectDistinct({
          zone: dealers.zone,
        })
        .from(dealers)
        .orderBy(asc(dealers.zone)),

      db
        .selectDistinct({
          area: dealers.area,
        })
        .from(dealers)
        .orderBy(asc(dealers.area)),
    ]);

    const zones = uniqueZones
      .map((z) => z.zone)
      .filter(
        (z): z is string =>
          Boolean(z && z.trim() !== '')
      );

    const areas = uniqueAreas
      .map((a) => a.area)
      .filter(
        (a): a is string =>
          Boolean(a && a.trim() !== '')
      );

    return NextResponse.json(
      {
        zones,
        areas,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error fetching dealer locations:', error);

    return NextResponse.json(
      {
        error: `Failed to fetch locations: ${error.message}`,
      },
      { status: 500 }
    );
  }
}