// src/app/dashboard/logisticsIO/page.tsx
import { Suspense } from 'react';
import { LogisticsTabsLoader } from './tabsLoader';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { verifySession, hasPermission } from '@/lib/auth';

export default function LogisticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Logistics Management Page
        </h2>
      </div>

      <Suspense fallback={<p className="text-muted-foreground mt-4">Loading...</p>}>
        <LogisticsDynamicContent />
      </Suspense>
    </div>
  );
}

export async function LogisticsDynamicContent() {
  await connection();

  const session = await verifySession();
  if (!session || !session.userId) {
    redirect('/');
  }

  const userPerms = session.permissions || [];

  const canViewRecords = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canViewUsers = hasPermission(userPerms, ['READ', 'UPDATE', 'WRITE', 'ALL_ACCESS']);

  if (!canViewRecords) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <h2 className="text-3xl font-bold tracking-tight">Access Denied</h2>
        <p className="text-neutral-500">
          You do not have permission to view the Logistics Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 overflow-x-hidden">

      <LogisticsTabsLoader
        canViewRecords={canViewRecords}
        canViewUsers={canViewUsers}
      />
    </div>
  );
}