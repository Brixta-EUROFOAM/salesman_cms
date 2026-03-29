// src/app/dashboard/masonpcSide/page.tsx
import { Suspense } from 'react';
import { MasonPcTabs } from './tabsLoader';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { verifySession, hasPermission } from '@/lib/auth';

export default function MasonPcPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Mason-PC Management Page
        </h2>
      </div>

      <Suspense fallback={<p className="text-muted-foreground mt-4">Loading...</p>}>
        <MasonPcDynamicContent />
      </Suspense>
    </div>
  );
}


// The page component is now an 'async' function
export async function MasonPcDynamicContent() {
  await connection();

  const session = await verifySession();
  if (!session || !session.userId) {
    redirect('/');
  }

  const userPerms = session.permissions || [];

  const canSeeMasonPc = hasPermission(userPerms, ['READ', 'UPDATE', 'ALL_ACCESS']);
  const canSeeBagsLift = hasPermission(userPerms, ['READ', 'UPDATE', 'ALL_ACCESS']);
  const canSeeTsoMeetings = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeeSchemesOffers = hasPermission(userPerms, ['READ', 'UPDATE', 'WRITE', 'ALL_ACCESS']);
  const canSeePointsLedger = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeeRewardsRedemption = hasPermission(userPerms, ['READ', 'UPDATE', 'ALL_ACCESS']);

  // Check if the user can see any of the tabs
  const canSeeAnything = canSeeMasonPc || canSeeTsoMeetings || canSeeSchemesOffers || canSeeBagsLift || canSeePointsLedger || canSeeRewardsRedemption;

  // 3. Handle users who can't see anything
  if (!canSeeAnything) {
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

      <MasonPcTabs
        canSeeMasonPc={canSeeMasonPc}
        canSeeTsoMeetings={canSeeTsoMeetings}
        canSeeSchemesOffers={canSeeSchemesOffers}
        canSeeBagsLift={canSeeBagsLift}
        canSeePointsLedger={canSeePointsLedger}
        canSeeRewardsRedemption={canSeeRewardsRedemption}
      />
    </div>
  );
}