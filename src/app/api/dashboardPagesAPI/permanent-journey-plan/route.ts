// src/app/api/dashboardPagesAPI/permanent-journey-plan/route.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { users, permanentJourneyPlans, dealers } from '../../../../../drizzle/schema';
import { eq, and, or, ilike, desc, asc, aliasedTable, getTableColumns, count, gte, lte, SQL } from 'drizzle-orm';
import { verifySession, hasPermission } from '@/lib/auth';

const getISTDate = (date: string | Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};

export async function GET(request: NextRequest) {
    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!hasPermission(session.permissions, "READ")) {
            return NextResponse.json({ error: 'Forbidden: READ access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        // --- Action: Fetch Distinct Filters ---
        if (action === 'fetch_filters') {
            const distinctSalesmen = await db
                .selectDistinct({ id: users.id, username: users.username, email: users.email })
                .from(permanentJourneyPlans)
                .innerJoin(users, eq(permanentJourneyPlans.userId, users.id))
                .orderBy(asc(users.username));

            const distinctStatuses = await db
                .selectDistinct({ status: permanentJourneyPlans.status })
                .from(permanentJourneyPlans);

            return NextResponse.json({
                salesmen: distinctSalesmen,
                statuses: distinctStatuses.map(s => s.status).filter(Boolean).sort()
            }, { status: 200 });
        }

        // --- Default Action: Fetch Paginated PJPs ---
        const page = Number(searchParams.get('page') ?? 0);
        const pageSize = Math.min(Number(searchParams.get('pageSize') ?? 500), 500);

        const search = searchParams.get('search');
        const salesmanId = searchParams.get('salesmanId');
        const status = searchParams.get('status');
        const verificationStatus = searchParams.get('verificationStatus');
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');

        const createdByUsers = aliasedTable(users, 'createdByUsers');
        const filters: SQL[] = [];

        if (verificationStatus && verificationStatus !== 'all' && verificationStatus !== 'null') {
            filters.push(ilike(permanentJourneyPlans.verificationStatus, verificationStatus));
        }

        if (search) {
            filters.push(
                or(
                    ilike(users.username, `%${search}%`),
                    ilike(permanentJourneyPlans.areaToBeVisited, `%${search}%`)
                )!
            );
        }

        if (salesmanId && salesmanId !== 'all') filters.push(eq(permanentJourneyPlans.userId, Number(salesmanId)));
        if (status && status !== 'all') filters.push(ilike(permanentJourneyPlans.status, status));
        if (fromDate) filters.push(gte(permanentJourneyPlans.planDate, fromDate));
        if (toDate) filters.push(lte(permanentJourneyPlans.planDate, toDate));

        const whereClause = filters.length > 0 ? and(...filters) : undefined;

        const rawPlans = await db
            .select({
                ...getTableColumns(permanentJourneyPlans),
                salesmanUsername: users.username,
                salesmanEmail: users.email,
                createdByUsername: createdByUsers.username,
                createdByEmail: createdByUsers.email,
                dealerName: dealers.dealerPartyName, 
            })
            .from(permanentJourneyPlans)
            .leftJoin(users, eq(permanentJourneyPlans.userId, users.id))
            .leftJoin(createdByUsers, eq(permanentJourneyPlans.createdById, createdByUsers.id))
            .leftJoin(dealers, eq(permanentJourneyPlans.dealerId, dealers.id))
            .where(whereClause)
            .orderBy(desc(permanentJourneyPlans.planDate), desc(permanentJourneyPlans.createdAt))
            .limit(pageSize)
            .offset(page * pageSize);

        const totalCountResult = await db
            .select({ count: count() })
            .from(permanentJourneyPlans)
            .leftJoin(users, eq(permanentJourneyPlans.userId, users.id))
            .where(whereClause);

        const totalCount = Number(totalCountResult[0].count);

        const formattedData = rawPlans.map((row) => {
            const salesmanName = row.salesmanUsername || row.salesmanEmail || 'Unknown';
            const createdByName = row.createdByUsername || row.createdByEmail || 'Unknown';

            return {
                ...row,
                salesmanName,
                createdByName,
                planDate: getISTDate(row.planDate),
                visitDealerName: row.dealerName ?? null, 
                createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
                updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString(),
            };
        });

        return NextResponse.json({
            data: formattedData,
            totalCount,
            page,
            pageSize
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching permanent journey plans:', error);
        return NextResponse.json({ error: 'Failed to fetch', details: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!hasPermission(session.permissions, "DELETE")) {
            return NextResponse.json({ error: 'Forbidden: DELETE access required' }, { status: 403 });
        }

        const url = new URL(request.url);
        const pjpId = url.searchParams.get('id');
        if (!pjpId) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const pjpToDeleteResult = await db
            .select({ id: permanentJourneyPlans.id })
            .from(permanentJourneyPlans)
            .where(eq(permanentJourneyPlans.id, pjpId))
            .limit(1);

        if (!pjpToDeleteResult[0]) {
            return NextResponse.json({ error: 'PJP Not Found' }, { status: 404 });
        }

        await db.delete(permanentJourneyPlans).where(eq(permanentJourneyPlans.id, pjpId));

        return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting PJP:', error);
        return NextResponse.json({ error: 'Failed to delete', details: (error as Error).message }, { status: 500 });
    }
}