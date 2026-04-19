// src/app/home/sheetsEditor/components/topBar.tsx
import ImportFile from "./importFile";
import SaveFile from "./saveFile";

export default function TopBar({ setSheetData, setWorkbookKey, sheetRef }: any) {
    return (
        <div className="h-12 flex items-center px-4 border-b bg-gray-50 gap-3">

            <h2 className="font-semibold">Sheet1</h2>

            <div className="ml-auto flex items-center gap-2">
                <ImportFile
                    setSheetData={setSheetData}
                    setWorkbookKey={setWorkbookKey}
                    sheetRef={sheetRef}
                />
                <SaveFile />
            </div>

        </div>
    );
}