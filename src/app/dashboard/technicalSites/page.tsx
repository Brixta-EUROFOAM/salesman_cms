// src/app/dashboard/technicalSites/page.tsx
import { Suspense } from 'react';
import { TechnicalSitesTabs } from './tabsLoader';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { verifySession, hasPermission } from '@/lib/auth';

export default function TechnicalSitesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Technical Sites Management Page
        </h2>
      </div>

      <Suspense fallback={<p className="text-muted-foreground mt-4">Loading...</p>}>
        <TechnicalSitesDynamicContent />
      </Suspense>
    </div>
  );
}

export async function TechnicalSitesDynamicContent() {
  await connection();

  const session = await verifySession();
  if (!session || !session.userId) {
    redirect('/');
  }

  const userPerms = session.permissions || [];

  const canViewSites = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);

  if (!canViewSites) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <h2 className="text-3xl font-bold tracking-tight">Access Denied</h2>
        <p className="text-neutral-500">
          You do not have permission to view this section.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">

      <TechnicalSitesTabs
        canViewSites={canViewSites}
      />
    </div>
  );
}