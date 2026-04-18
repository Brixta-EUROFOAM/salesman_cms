// src/app/home/sheetsEditor/components/editorUI.tsx
'use client';

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function EditorUI() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/excel/read?fileId=xxx&sheetName=Sheet1&range=A1:D10`
        );
        
        if (!res.ok) {
          throw new Error('Failed to fetch sheet data');
        }

        const json = await res.json();
        setData(json.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center border rounded-lg bg-muted/20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}