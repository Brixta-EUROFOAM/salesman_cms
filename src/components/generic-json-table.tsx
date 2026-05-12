// src/components/generic-json-table.tsx

interface GenericJsonTableProps {
  data: any[];
  title?: string;
}

export function GenericJsonTable({ data, title }: GenericJsonTableProps) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  const formatHeader = (key: string) => {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  return (
    <div className="space-y-3 mb-6">
      {title && (
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      )}
      <div className="rounded-md border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                    {formatHeader(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="transition-colors hover:bg-muted/50">
                  {columns.map((col, colIndex) => {
                    const cellValue = row[col];
                    return (
                      <td key={colIndex} className="p-4 align-middle whitespace-nowrap">
                        {cellValue !== null && cellValue !== undefined && cellValue !== "" 
                          ? String(cellValue) 
                          : <span className="text-muted-foreground">-</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}