// src/app/home/sheetsEditor/components/sheetWrapper.tsx
'use client';

import { useState } from 'react';
import EditorUI from './editorUI';
import { OUTSTANDING_TEMPLATE } from '../lib/templates';

export default function SheetWrapper() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any[] | null>(null);

  const handleSelect = (reportType: string) => {
    setSelectedReport(reportType);
    if (reportType === 'outstanding') {
      setInitialData([OUTSTANDING_TEMPLATE]);
    } else {
      // Fallback or other templates
      setInitialData([{ name: "Sheet1", celldata: [] }]);
    }
  };

  if (!selectedReport) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] bg-white rounded-lg shadow border border-gray-200 gap-6">
        <h3 className="text-xl font-medium text-gray-700">Select Report Type to Enter Data</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => handleSelect('outstanding')}
            className="px-6 py-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition font-semibold"
          >
            Outstanding Reports
          </button>
          <button 
            onClick={() => handleSelect('sales')}
            className="px-6 py-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition font-semibold"
          >
            Sales Reports
          </button>
          <button 
            onClick={() => handleSelect('collection')}
            className="px-6 py-4 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-100 transition font-semibold"
          >
            Collection Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)]">
      <EditorUI initialData={initialData} reportType={selectedReport} onBack={() => setSelectedReport(null)} />
    </div>
  );
}