// src/app/home/sheetsEditor/components/saveFile.tsx
'use client';

export default function SaveFile() {
  const handleSave = async () => {
    console.log("Saving...");

    // later:
    // 1. get Fortune data
    // 2. transform
    // 3. call API
  };

  return (
    <button
      onClick={handleSave}
      className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Save
    </button>
  );
}