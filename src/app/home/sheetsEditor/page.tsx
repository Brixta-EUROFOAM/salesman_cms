// src/app/home/sheetsEditor/page.tsx
import { connection } from 'next/server';
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EditorUI from './components/editorUI';

export default async function SheetsEditorPage() {
  await connection();

  const session = await verifySession();

  // Double-checking auth before rendering the UI
  if (!session || !session.userId) {
    redirect('/');
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Sheets Editor
        </h2>
      </div>

      <div className="h-[calc(100vh-80px)]">
        <EditorUI />
      </div>
    </div>
  );
}