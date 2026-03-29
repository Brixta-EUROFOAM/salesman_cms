// src/app/dashboard/permanentJourneyPlan/page.tsx
import { Suspense } from 'react';
import { PermanentJourneyPlanTabs } from './tabsLoader';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { verifySession, hasPermission } from '@/lib/auth';

export default function PermanentJourneyPlanPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Technical PJP Management
        </h2>
      </div>

      <Suspense fallback={<p className="text-muted-foreground mt-4">Loading...</p>}>
        <PermanentJourneyPlanDynamicContent />
      </Suspense>
    </div>
  );
}

// The page component is now an 'async' function
export async function PermanentJourneyPlanDynamicContent() {
  await connection();

  const session = await verifySession();
  if (!session || !session.userId) {
    redirect('/');
  }

  const userPerms = session.permissions || [];

  const canSeePjpList = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeePjpVerify = hasPermission(userPerms, ['READ', 'UPDATE', 'ALL_ACCESS']);

  // 3. Handle users who can't see anything
  if (!canSeePjpList && !canSeePjpVerify) {
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

      <PermanentJourneyPlanTabs
        canSeePjpList={canSeePjpList}
        canSeePjpVerify={canSeePjpVerify}
      />
    </div>
  );
}