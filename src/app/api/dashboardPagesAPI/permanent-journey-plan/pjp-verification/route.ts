// src/app/api/dashboardPagesAPI/permanent-journey-plan/pjp-verification/route.ts
import 'server-only';
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/drizzle';
import { users, permanentJourneyPlans, dealers } from '../../../../../../drizzle/schema';
import { eq, or, asc, aliasedTable, getTableColumns, ilike } from 'drizzle-orm';
import { verifySession, hasPermission } from '@/lib/auth';

const getISTDate = (date: string | Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};

async function getPendingPJPs() {
    const createdByUsers = aliasedTable(users, 'createdByUsers');

    const results = await db
        .select({
            ...getTableColumns(permanentJourneyPlans),
            salesmanUsername: users.username,
            salesmanEmail: users.email,
            salesmanZone: users.zone,
            salesmanArea: users.area,
            createdByUsername: createdByUsers.username,
            createdByEmail: createdByUsers.email,
            dealerName: dealers.dealerPartyName,
        })
        .from(permanentJourneyPlans)
        .leftJoin(users, eq(permanentJourneyPlans.userId, users.id))
        .leftJoin(createdByUsers, eq(permanentJourneyPlans.createdById, createdByUsers.id))
        .leftJoin(dealers, eq(permanentJourneyPlans.dealerId, dealers.id))
        .where(
            or(
                ilike(permanentJourneyPlans.status, 'pending'),
                ilike(permanentJourneyPlans.verificationStatus, 'pending')
            )
        )
        .orderBy(asc(permanentJourneyPlans.planDate));

    return results.map((row) => {
        const salesmanName = row.salesmanUsername || row.salesmanEmail || 'Unknown';
        const createdByName = row.createdByUsername || row.createdByEmail || 'Unknown';

        return {
            ...row,
            salesmanName,
            createdByName,
            planDate: getISTDate(row.planDate),
            visitDealerName: row.dealerName ?? null,
            verificationStatus: row.verificationStatus ? row.verificationStatus.toUpperCase() : 'PENDING',
            salesmanZone: row.salesmanZone,
            salesmanArea: row.salesmanArea,
            createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString(),
        };
    });
}

export async function GET(request: NextRequest) {
    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!hasPermission(session.permissions, "READ")) {
            return NextResponse.json({ error: 'Forbidden: READ access required' }, { status: 403 });
        }

        const formattedPlans = await getPendingPJPs();
        
        return NextResponse.json({ plans: formattedPlans }, { status: 200 });
    } catch (error) {
        console.error('Error fetching pending PJPs (GET):', error);
        return NextResponse.json({ error: 'Failed to fetch', details: (error as Error).message }, { status: 500 });
    }
}