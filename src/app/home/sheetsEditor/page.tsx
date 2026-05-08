// src/app/home/sheetsEditor/page.tsx
import { connection } from 'next/server';
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SheetWrapper from './components/sheetWrapper';

export default async function SheetsEditorPage() {
  await connection();

  const session = await verifySession();

  if (!session || !session.userId) {
    redirect('/');
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Data Entry Hub
        </h2>
      </div>

      {/* We abstract the client-side state into a wrapper */}
      <SheetWrapper />
    </div>
  );
}