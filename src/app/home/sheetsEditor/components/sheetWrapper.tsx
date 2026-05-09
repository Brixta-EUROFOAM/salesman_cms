// src/app/home/sheetsEditor/components/sheetWrapper.tsx
'use client';

import { useState } from 'react';
import EditorUI from './editorUI';
import { COLLECTION_TEMPLATE, JUD_OUTSTANDING, JSB_OUTSTANDING, SALES_TEMPLATE } from '../lib/templates';

export default function SheetWrapper() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any[] | null>(null);

  const handleSelect = (reportType: string) => {
    setSelectedReport(reportType);
    if (reportType === 'outstanding') {
      setInitialData([JSB_OUTSTANDING, JUD_OUTSTANDING]);
    } else if (reportType === 'sales') {
      setInitialData([SALES_TEMPLATE]);
    } else if (reportType === 'collection') {
      setInitialData([COLLECTION_TEMPLATE]);
    } else {
      setInitialData([{ name: "Sheet1", celldata: [] }]);
    }
  };

  if (!selectedReport) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)] p-6 bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* Left Column: Preloaded Templates */}
          <div className="flex flex-col gap-4 md:border-r border-gray-100 md:pr-8">
            <div className="mb-2 border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-800">Preloaded Templates</h3>
              <p className="text-sm text-gray-500 mt-1">Select a formatted template to begin data entry.</p>
            </div>
            
            <button
              onClick={() => handleSelect('outstanding')}
              className="text-left px-5 py-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium transition-all"
            >
              Outstanding Reports
            </button>
            <button
              onClick={() => handleSelect('sales')}
              className="text-left px-5 py-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium transition-all"
            >
              Sales Reports
            </button>
            <button
              onClick={() => handleSelect('collection')}
              className="text-left px-5 py-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium transition-all"
            >
              Collection Reports
            </button>
          </div>

          {/* Right Column: Blank Sheet */}
          <div className="flex flex-col gap-4 md:pl-4">
            <div className="mb-2 border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-800">Custom Workspace</h3>
              <p className="text-sm text-gray-500 mt-1">Start from scratch with an empty grid.</p>
            </div>

            <button
              onClick={() => handleSelect('blank')}
              className="group flex flex-col items-center justify-center h-full min-h-40 px-5 py-4 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <span className="text-2xl text-gray-400 group-hover:text-gray-600 mb-2">+</span>
              <span className="text-gray-600 font-medium group-hover:text-gray-800">Create Blank Sheet</span>
            </button>
          </div>

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