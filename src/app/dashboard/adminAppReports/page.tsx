// src/app/dashboard/adminAppReports/page.tsx
import { Suspense } from 'react';
import { AdminAppReportsTabs } from './tabsLoader';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { verifySession, hasPermission } from '@/lib/auth';

export default function AdminAppReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Admin Reports
        </h2>
      </div>

      <Suspense fallback={<p className="text-muted-foreground mt-4">Loading Reports...</p>}>
        <ReportsDynamicContent />
      </Suspense>
    </div>
  );
}

export async function ReportsDynamicContent() {
  await connection();

  const session = await verifySession();
  if (!session || !session.userId) {
    redirect('/');
  }

  const userPerms = session.permissions || [];
  
  // You can split these into granular permissions later, 
  // but for now we verify basic read access to the reports module.
  const hasAccess = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);

  if (!hasAccess) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <h2 className="text-3xl font-bold tracking-tight">Access Denied</h2>
        <p className="text-neutral-500">
          You do not have permission to view the CMD Dashboard Reports.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 mt-2">
      <AdminAppReportsTabs hasAccess={hasAccess} />
    </div>
  );
}
