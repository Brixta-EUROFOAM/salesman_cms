// src/app/home/sheetsEditor/components/sheetCanvas.tsx
'use client';

import dynamic from "next/dynamic";
import "@fortune-sheet/react/dist/index.css";

const Workbook = dynamic(
    () => import("@fortune-sheet/react").then((mod) => mod.Workbook),
    { ssr: false }
);

export default function SheetCanvas({ data, sheetRef, workbookKey }: any) {
    return (
        <div className="w-full h-full relative overflow-hidden text-slate-900 bg-white">
            <style jsx global>{`
        .fortune-container * {
          color: initial;
        }
        .fortune-sheet-area {
          background-color: #fff !important;
        }
      `}</style>
            <Workbook
                data={data}
                ref={sheetRef}
                key={workbookKey}
            />
        </div>
    );
}