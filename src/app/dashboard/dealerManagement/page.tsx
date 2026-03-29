// src/app/dashboard/dealerManagement/page.tsx
import { Suspense } from 'react';
import { DealerManagementTabs } from './tabsLoader';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { verifySession, hasPermission } from '@/lib/auth';

// 1. The Static Shell
export default function DealersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Dealers Management Page
        </h2>
      </div>

      <Suspense fallback={<p className="text-muted-foreground mt-4">Loading...</p>}>
        <DealersDynamicContent />
      </Suspense>
    </div>
  );
}

// 2. The Dynamic Content
async function DealersDynamicContent() {
  await connection();

  const session = await verifySession();
  if (!session || !session.userId) {
    redirect('/');
  }

  const userPerms = session.permissions || [];

  const canSeeAddAndListDealers = hasPermission(userPerms, ['READ', 'UPDATE', 'WRITE', 'ALL_ACCESS']);
  const canSeeListDealers = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeeVerifyDealers = hasPermission(userPerms, ['READ', 'UPDATE', 'ALL_ACCESS']);
  const canSeeBrandMapping = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeeListVerifiedDealers = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);

  const canSeeAnything = canSeeAddAndListDealers || canSeeListDealers || canSeeVerifyDealers || canSeeBrandMapping || canSeeListVerifiedDealers;

  // Handle users who can't see anything
  if (!canSeeAnything) {
    return (
      <div className="mt-4">
        <h3 className="text-xl font-semibold tracking-tight text-red-600">Access Denied</h3>
        <p className="text-neutral-500">
          You do not have permission to view this section.
        </p>
      </div>
    );
  }

  // Render the CLIENT component and pass the server-side permissions as props
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 overflow-x-hidden">

      <DealerManagementTabs
        canSeeListDealers={canSeeListDealers}
        canSeeVerifyDealers={canSeeVerifyDealers}
        canSeeBrandMapping={canSeeBrandMapping}
        canSeeListVerifiedDealers={canSeeListVerifiedDealers}
      />
    </div>
  );
}