// src/app/home/sheetsEditor/components/formulaBar.tsx
export default function FormulaBar() {
  return (
    <div className="h-10 flex items-center gap-2 px-4 border-b bg-white">
      <span className="text-gray-500 text-sm">fx</span>
      <input
        className="flex-1 border rounded px-2 py-1 text-sm"
        placeholder="Select a cell..."
      />
    </div>
  );
}