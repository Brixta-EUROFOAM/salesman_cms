// src/app/home/sheetsEditor/components/sheetWrapper.tsx
'use client';

import { useState } from 'react';
import EditorUI from './editorUI';
import {
  COLLECTION_TEMPLATE,
  JSB_OUTSTANDING, JUD_OUTSTANDING,
  SALES_TEMPLATE,
  FINANCE_PLBS, FINANCE_COST_JUD, FINANCE_COST_JSB, FINANCE_INVESTOR,
  ACCOUNTS_TEMPLATE,
  HR_HO, HR_INTERVIEWS, HR_PLANT, HR_STATUTORY, HR_VACCANCIES,
  PURCHASE_DAILY, PURCHASE_MONTHLY, PURCHASE_STATUS,
  PROCESS_STATUS, PROCESS_STOCK, PROCESS_COAL, PROCESS_TARGET_ACHV,
  LOGISTICS_DISPATCH, LOGISTICS_STOCK, LOGISTICS_TRANSPORTER
} from '../lib/templates';

const REPORT_OPTIONS = [
  { id: 'outstanding', label: 'Outstanding Reports', color: '#166df9' },
  { id: 'sales', label: 'Sales Reports', color: '#8b5cf6' }, // Default Purple
  { id: 'collection', label: 'Collection Reports', color: '#eab308' }, // Default Yellow
  { id: 'finance', label: 'Finance Reports', color: '#3b82f6' },
  { id: 'accounts', label: 'Accounts Reports', color: '#14b8a6' },
  { id: 'hr', label: 'HR Reports', color: '#d946ef' },
  { id: 'logistics', label: 'Logistics Reports', color: '#6366f1' },
  { id: 'purchase', label: 'Purchase Reports', color: '#f59e0b' },
  { id: 'process', label: 'Process Reports', color: '#f43f5e' },
];

export default function SheetWrapper() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any[] | null>(null);

  const handleSelect = (reportType: string) => {
    setSelectedReport(reportType);

    switch (reportType) {
      case 'outstanding':
        setInitialData([JSB_OUTSTANDING, JUD_OUTSTANDING]);
        break;
      case 'sales':
        setInitialData([SALES_TEMPLATE]);
        break;
      case 'collection':
        setInitialData([COLLECTION_TEMPLATE]);
        break;
      case 'accounts':
        setInitialData([ACCOUNTS_TEMPLATE]);
        break;
      case 'finance':
        setInitialData([FINANCE_PLBS, FINANCE_COST_JUD, FINANCE_COST_JSB, FINANCE_INVESTOR]);
        break;
      case 'hr':
        setInitialData([HR_VACCANCIES, HR_INTERVIEWS, HR_HO, HR_PLANT, HR_STATUTORY]);
        break;
      case 'logistics':
        setInitialData([LOGISTICS_DISPATCH, LOGISTICS_STOCK, LOGISTICS_TRANSPORTER]);
        break;
      case 'purchase':
        setInitialData([PURCHASE_DAILY, PURCHASE_MONTHLY, PURCHASE_STATUS]);
        break;
      case 'process':
        setInitialData([PROCESS_STATUS, PROCESS_STOCK, PROCESS_COAL, PROCESS_TARGET_ACHV]);
        break;
      default:
        setInitialData([{ name: "Sheet1", celldata: [] }]);
    }
  };

  if (!selectedReport) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6 bg-gray-50/50">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">

          <div className="mb-8 border-b border-gray-100 pb-4 flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Select Report Type</h3>
              <p className="text-sm text-gray-500 mt-1">Choose a formatted template to begin data entry.</p>
            </div>
          </div>

          {/* Grid Layout: Responsive 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REPORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                style={{ borderRightColor: option.color, borderRightWidth: '6px' }}
                className="text-left px-5 py-6 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md hover:bg-gray-50 transition-all flex flex-col justify-center bg-white group"
              >
                <span className="text-gray-700 font-semibold text-base group-hover:text-gray-900 transition-colors">
                  {option.label}
                </span>
                <span className="text-xs text-gray-400 mt-1 font-medium">
                  Load Template →
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)]">
      <EditorUI
        initialData={initialData}
        reportType={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    </div>
  );
}