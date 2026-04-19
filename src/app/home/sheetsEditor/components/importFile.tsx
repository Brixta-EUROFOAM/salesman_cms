// src/app/home/sheetsEditor/components/importFile.tsx
'use client';

import { transformExcelToFortune } from "@corbe30/fortune-excel";

export default function ImportFile({ 
    setSheetData, 
    setWorkbookKey, 
    sheetRef 
}: { 
    setSheetData: any, 
    setWorkbookKey: any, 
    sheetRef: any 
}) {

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await transformExcelToFortune(
                file,
                setSheetData,
                setWorkbookKey,
                sheetRef
            );
        } catch (error) {
            console.error("FortuneExcel Import failed:", error);
        }

        // Reset the input
        e.target.value = '';
    };

    return (
        <label className="cursor-pointer text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400">
            Import
            <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
            />
        </label>
    );
}