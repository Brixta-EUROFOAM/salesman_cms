// src/app/home/sheetsEditor/components/saveFile.tsx
'use client';
import { useState } from "react";
import { saveOutstandingReportsAction } from "../serverActions/saveOutstandingReports";
import { saveSalesReportsAction } from "../serverActions/saveSalesReports";
import { saveCollectionReportsAction } from "../serverActions/saveCollectionReports";

export default function SaveFile({ sheetRef, reportType }: { sheetRef: any, reportType: string }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!sheetRef.current) return;
    setIsSaving(true);

    try {
      const allSheets = sheetRef.current.getAllSheets();
      
      // 🛠️ CLEANED UP: Removed the duplicate outer variable declarations
      if (!allSheets || allSheets.length === 0) {
        console.warn("No sheets found");
        setIsSaving(false);
        return;
      }

      const transformedData = [];

      // 🛠️ Loop through EVERY tab at the bottom of the editor
      for (const currentSheet of allSheets) {
        if (!currentSheet || !currentSheet.data) continue;

        const gridData = currentSheet.data;
        const headerRow = gridData[0]; // We use this to read the bucket names dynamically!

        for (let r = 1; r < gridData.length; r++) {
          const row = gridData[r];
          if (!row || !row.some((cell: any) => cell?.v || cell?.m)) continue;

          const getVal = (colIdx: number) => {
            const cell = row[colIdx];
            return cell ? (cell.v !== undefined ? cell.v : cell.m) : null;
          };

          const dateColIdx = reportType === 'collection' ? 2 : 0;
          const dateCell = row[dateColIdx];

          let finalDate = null;
          if (dateCell) {
            if (typeof dateCell.m === 'string' && dateCell.m.includes('-')) {
              finalDate = dateCell.m.split('T')[0];
            } else if (!isNaN(Number(dateCell.v))) {
              const excelEpoch = new Date(1899, 11, 30);
              finalDate = new Date(excelEpoch.getTime() + Number(dateCell.v) * 86400000).toISOString().split('T')[0];
            }
          }

          if (reportType === 'outstanding') {
            const institution = getVal(1);
            const verifiedDealerId = getVal(2);
            const dealerName = getVal(3);
            const securityDepositAmt = getVal(4);
            const pendingAmt = getVal(5);

            // 🛠️ DYNAMIC JSONB BUILDER: Reads whatever buckets are in Row 0 starting from Column 6
            const dynamicAgeingData: Record<string, any> = {};
            for (let c = 6; c < headerRow.length; c++) {
              const headerName = headerRow[c] ? (headerRow[c].v || headerRow[c].m) : null;
              if (headerName && String(headerName).trim() !== "") {
                dynamicAgeingData[String(headerName)] = getVal(c);
              }
            }

            if (dealerName || pendingAmt) {
              transformedData.push({
                reportDate: finalDate,
                institution: institution ? String(institution) : null,
                verifiedDealerId: verifiedDealerId ? parseInt(String(verifiedDealerId)) : null,
                dealerName: String(dealerName || ""),
                securityDepositAmt: securityDepositAmt ? String(securityDepositAmt) : null,
                pendingAmt: pendingAmt ? String(pendingAmt) : null,
                ageingData: dynamicAgeingData // Perfectly structured for JSONB!
              });
            }
          }
          else if (reportType === 'sales') {
            const area = getVal(1);
            const dealerName = getVal(2);

            if (dealerName && String(dealerName).trim() !== "") {
              const dayPayload: Record<string, string | null> = {};
              for (let i = 1; i <= 31; i++) {
                const val = getVal(i + 3);
                dayPayload[`day${i}`] = val !== null ? String(val) : null;
              }

              transformedData.push({
                reportDate: finalDate,
                area: area ? String(area).trim() : null,
                dealerName: String(dealerName),
                responsiblePerson: getVal(3) ? String(getVal(3)) : null,
                ...dayPayload,
                currentMonthMTDSales: getVal(35) !== null ? String(getVal(35)) : null,
                currentMonthTarget: getVal(36) !== null ? String(getVal(36)) : null,
                percentageTargetAchieved: getVal(37) !== null ? String(getVal(37)) : null,
                balance: getVal(38) !== null ? String(getVal(38)) : null,
                prorataSalesTarget: getVal(39) !== null ? String(getVal(39)) : null,
                percentageAsPerProrata: getVal(40) !== null ? String(getVal(40)) : null,
                askingRate: getVal(41) !== null ? String(getVal(41)) : null,
                rawPayload: { rawRow: row.map((c: any) => c ? (c.v || c.m) : null) },
              });
            }
          }
          else if (reportType === 'collection') {
            const institution = getVal(0);
            const voucher = getVal(1);
            const party = getVal(3);

            if (voucher && party && String(voucher).trim() !== "") {
              transformedData.push({
                institution: institution ? String(institution).trim() : null,
                voucherNo: String(voucher).trim(),
                voucherDate: finalDate,
                partyName: String(party),
                zone: getVal(4) ? String(getVal(4)) : null,
                district: getVal(5) ? String(getVal(5)) : null,
                salesPromoterName: getVal(6) ? String(getVal(6)) : null,
                bankAccount: getVal(7) ? String(getVal(7)) : null,
                amount: getVal(8) !== null ? String(getVal(8)) : null,
                remarks: getVal(9) ? String(getVal(9)) : null,
              });
            }
          }
        }
      }

      // 🛠️ SAFETY CHECK: Don't hit the server if the user just clicked save on an empty sheet
      if (transformedData.length === 0) {
         alert("No valid data found to save.");
         setIsSaving(false);
         return;
      }

      // Fire the correct API Action based on the report type
      let result;
      if (reportType === 'outstanding') {
        result = await saveOutstandingReportsAction(transformedData);
      } else if (reportType === 'sales') {
        result = await saveSalesReportsAction(transformedData);
      } else if (reportType === 'collection') {
        result = await saveCollectionReportsAction(transformedData);
      }

      alert(`Success! Inserted ${result?.insertedIds?.length || 0} records into the database.`);

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