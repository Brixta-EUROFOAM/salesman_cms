// src/app/dashboard/reports/page.tsx
import { Suspense } from 'react';
import { ReportsTabs } from './tabsLoader';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { verifySession, hasPermission } from '@/lib/auth';

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Reports Management Page
        </h2>
      </div>

      <Suspense fallback={<p className="text-muted-foreground mt-4">Loading...</p>}>
        <ReportsDynamicContent />
      </Suspense>
    </div>
  );
}

// The page component is now an 'async' function
export async function ReportsDynamicContent() {
  await connection();

  const session = await verifySession();
  if (!session || !session.userId) {
    redirect('/');
  }

  const userPerms = session.permissions || [];

  const canSeeDVR = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeeTVR = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeeDvrTvr = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeeSalesOrders = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeeCompetition = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeeTsoPerformanceMetrics = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);

  const canSeeAnyReport = canSeeDVR || canSeeTVR || canSeeSalesOrders || canSeeCompetition || canSeeTsoPerformanceMetrics;

  // 3. Handle users who can't see anything
  if (!canSeeAnyReport) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <h2 className="text-3xl font-bold tracking-tight">Access Denied</h2>
        <p className="text-neutral-500">
          You do not have permission to view this section.
        </p>
      </div>
    );
  }

  // 4. Render the page, passing permissions to the client component
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">

      <ReportsTabs
        canSeeDVR={canSeeDVR}
        canSeeTVR={canSeeTVR}
        canSeeDvrTvr={canSeeDvrTvr}
        canSeeSalesOrders={canSeeSalesOrders}
        canSeeCompetition={canSeeCompetition}
        canSeeTsoPerformanceMetrics={canSeeTsoPerformanceMetrics}
      />
    </div>
  );
}