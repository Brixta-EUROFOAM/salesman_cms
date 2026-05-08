// src/app/home/sheetsEditor/components/topBar.tsx
import ImportFile from "./importFile";
import SaveFile from "./saveFile";

export default function TopBar({ setSheetData, setWorkbookKey, sheetRef, reportType, onBack }: any) {
    const titleMap: Record<string, string> = {
        outstanding: "Outstanding Reports Data Entry",
        sales: "Sales Reports Data Entry",
        collection: "Collection Reports Data Entry",
    };

    return (
        <div className="h-12 flex items-center px-4 border-b bg-gray-50 gap-3">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-900 mr-2 text-sm">
                ← Back
            </button>
            <h2 className="font-semibold text-gray-800">{titleMap[reportType] || "Sheet1"}</h2>

            <div className="ml-auto flex items-center gap-2">
                <ImportFile
                    setSheetData={setSheetData}
                    setWorkbookKey={setWorkbookKey}
                    sheetRef={sheetRef}
                />
                <SaveFile sheetRef={sheetRef} reportType={reportType} />
            </div>
        </div>
    );
}