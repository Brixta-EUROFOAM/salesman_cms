// src/app/setup-company/page.tsx
import { verifySession } from '@/lib/auth';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import SetupCompanyForm from './setupCompanyForm';

async function SetupCompanyAuthWrapper() {
  const session = await verifySession();

  if (session && session.companyId) {
    redirect('/home');
  }

  return <SetupCompanyForm />;
}

export default function SetupCompanyPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground mt-4">Loading...</p>}>
      <SetupCompanyAuthWrapper />
    </Suspense>
  );
}