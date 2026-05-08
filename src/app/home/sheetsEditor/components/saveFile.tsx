'use client';
import { useState } from "react";
import { saveOutstandingReportsAction } from "../serverActions/saveOutstandingReports";
import { saveSalesReportsAction } from "../serverActions/saveSalesReports";

export default function SaveFile({ sheetRef, reportType }: { sheetRef: any, reportType: string }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!sheetRef.current) return;
    setIsSaving(true);

    try {
      const allSheets = sheetRef.current.getAllSheets();
      const activeSheet = allSheets[0];

      if (!activeSheet || !activeSheet.data) {
        console.warn("No data found in sheet");
        return;
      }

      const gridData = activeSheet.data;
      const transformedData = [];

      for (let r = 1; r < gridData.length; r++) {
        const row = gridData[r];

        if (!row || !row.some((cell: any) => cell?.v || cell?.m)) continue;

        const getVal = (colIdx: number) => {
          const cell = row[colIdx];
          return cell ? (cell.v !== undefined ? cell.v : cell.m) : null;
        };

        // 🛠️ DATE FIX: Extracted so both reports can use it
        const dateCell = row[0];
        let finalDate = null;

        if (dateCell) {
          if (typeof dateCell.m === 'string' && dateCell.m.includes('-')) {
            finalDate = dateCell.m.split('T')[0];
          } else if (!isNaN(Number(dateCell.v))) {
            const excelEpoch = new Date(1899, 11, 30);
            const dateObj = new Date(excelEpoch.getTime() + Number(dateCell.v) * 86400000);
            finalDate = dateObj.toISOString().split('T')[0];
          }
        }

        if (reportType === 'outstanding') {
          const institution = getVal(1);
          const verifiedDealerId = getVal(2);
          const dealerName = getVal(3);
          const securityDepositAmt = getVal(4);
          const pendingAmt = getVal(5);

          const ageingData = {
            "< 10 days": getVal(6), "10-15 days": getVal(7), "15 - 21 days": getVal(8),
            "21 - 30 days": getVal(9), "15-30 days": getVal(10), "30-45 days": getVal(11),
            "45-60 days": getVal(12), "60-75 days": getVal(13), "75-90 days": getVal(14),
            "60-90 days": getVal(15), ">90 days": getVal(16),
          };

          if (dealerName || pendingAmt) {
            transformedData.push({
              reportDate: finalDate,
              institution: institution ? String(institution) : null,
              verifiedDealerId: verifiedDealerId ? parseInt(String(verifiedDealerId)) : null,
              dealerName: String(dealerName || ""),
              securityDepositAmt: securityDepositAmt ? String(securityDepositAmt) : null,
              pendingAmt: pendingAmt ? String(pendingAmt) : null,
              ageingData: ageingData
            });
          }
        }
        else if (reportType === 'sales') {
          const area = getVal(1);
          const dealerName = getVal(2);
          const responsiblePerson = getVal(3);

          if (dealerName && String(dealerName).trim() !== "") {
            transformedData.push({
              reportDate: finalDate,
              area: area ? String(area) : null,
              dealerName: String(dealerName),
              responsiblePerson: responsiblePerson ? String(responsiblePerson) : null,
              currentMonthMTDSales: Number(getVal(4)) || 0,
              currentMonthTarget: Number(getVal(5)) || 0,
              // Cast numeric Postgres fields to String as expected by the backend schema
              percentageTargetAchieved: getVal(6) !== null ? String(getVal(6)) : null,
              balance: Number(getVal(7)) || 0,
              prorataSalesTarget: Number(getVal(8)) || 0,
              percentageAsPerProrata: getVal(9) !== null ? String(getVal(9)) : null,
              askingRate: getVal(10) !== null ? String(getVal(10)) : null,

              // Maintain required JSONB fields
              rawPayload: { rawRow: row.map((c: any) => c ? (c.v || c.m) : null) },
              salesDataPayload: {}, // No dynamic daily data in this template
              collectionDataPayload: {},
              nonTradeDataPayload: {}
            });
          }
        }
      }

      // Fire the correct API Action based on the report type
      let result;
      if (reportType === 'outstanding') {
        result = await saveOutstandingReportsAction(transformedData);
      } else if (reportType === 'sales') {
        result = await saveSalesReportsAction(transformedData);
      }

      alert(`Success! Inserted ${result.insertedIds.length} records into the database.`);

    } catch (error: any) {
      console.error("Failed to parse and save:", error);
      alert(error.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className={`text-sm px-4 py-1.5 text-white rounded font-medium shadow-sm 
        ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
    >
      {isSaving ? 'Processing...' : 'Save & Send'}
    </button>
  );
}