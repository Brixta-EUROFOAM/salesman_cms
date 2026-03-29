// src/app/dashboard/assignTasks/page.tsx
import { Suspense } from 'react';
import { AssignTasksTabs } from './tabsLoader';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { verifySession, hasPermission } from '@/lib/auth';

export default function AssignTasksPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Sales PJP Management
        </h2>
      </div>

      <Suspense fallback={<p className="text-muted-foreground mt-4">Loading...</p>}>
        <AssignTasksDynamicContent />
      </Suspense>
    </div>
  );
}

export async function AssignTasksDynamicContent() {
  await connection();

  const session = await verifySession();
  if (!session || !session.userId) {
    redirect('/');
  }

  const userPerms = session.permissions || [];

  const canSeeTasksList = hasPermission(userPerms, ['READ', 'ALL_ACCESS']);
  const canSeeVerifyTasks = hasPermission(userPerms, ['READ', 'UPDATE', 'ALL_ACCESS']);

  if (!canSeeTasksList && !canSeeVerifyTasks) {
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
    <div className="flex-1 p-0">
      <AssignTasksTabs
        canSeeTasksList={canSeeTasksList}
        canSeeVerifyTasks={canSeeVerifyTasks}
      />
    </div>
  );
}