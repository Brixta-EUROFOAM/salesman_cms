// src/app/home/sheetsEditor/components/editorUI.tsx
'use client';

import { useState, useRef } from "react";
import TopBar from "./topBar";
import FormulaBar from "./formulaBar";
import SheetCanvas from "./sheetCanvas";

export default function EditorUI() {
  const [sheetData, setSheetData] = useState<any[]>([
    { name: "Sheet1", celldata: [] },
  ]);
  
  // Added for @corbe30/fortune-excel
  const [workbookKey, setWorkbookKey] = useState<number>(0);
  const sheetRef = useRef(null);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden shadow">

      <TopBar 
        setSheetData={setSheetData} 
        setWorkbookKey={setWorkbookKey} 
        sheetRef={sheetRef} 
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