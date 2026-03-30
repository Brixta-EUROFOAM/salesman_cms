// src/app/setup-company/page.tsx
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SetupCompanyForm from './setupCompanyForm';

export default async function SetupCompanyPage() {
  const session = await verifySession();

  // If they are already linked to a company, they shouldn't be here. Send them to dashboard.
  if (session && session.companyId) {
    redirect('/home');
  }

  // Anyone else (signed out, brand new users) can see this page
  return <SetupCompanyForm />;
}