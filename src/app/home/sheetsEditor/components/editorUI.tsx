// src/app/home/sheetsEditor/components/editorUI.tsx
'use client';

import { useState, useRef, useEffect } from "react";
import TopBar from "./topBar";
import FormulaBar from "./formulaBar";
import SheetCanvas from "./sheetCanvas";

export default function EditorUI({ initialData, reportType, onBack }: any) {
  const [sheetData, setSheetData] = useState<any[]>(
    initialData || [{ name: "Sheet1", celldata: [] }]
  );
  
  const [workbookKey, setWorkbookKey] = useState<number>(0);
  const sheetRef = useRef<any>(null);

  // Sync state if initialData changes (e.g. user selects a different template)
  useEffect(() => {
    if (initialData) {
      setSheetData(initialData);
      setWorkbookKey(prev => prev + 1);
    }
  }, [initialData]);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden shadow">
      <TopBar 
        setSheetData={setSheetData} 
        setWorkbookKey={setWorkbookKey} 
        sheetRef={sheetRef}
        reportType={reportType}
        onBack={onBack}
      />
      <FormulaBar />
      <div className="flex-1 min-h-0">
        <SheetCanvas 
            data={sheetData} 
            workbookKey={workbookKey} 
            sheetRef={sheetRef} 
        />
      </div>
    </div>
  );
}