// src/app/home/sheetsEditor/components/saveFile.tsx
'use client';
import { useState } from "react";
import { saveOutstandingReportsAction } from "../serverActions/saveOutstandingReports";
import { saveSalesReportsAction } from "../serverActions/saveSalesReports";
import { saveCollectionReportsAction } from "../serverActions/saveCollectionReports";
import { saveFinanceReportsAction } from "../serverActions/saveFinanceReports";
import { saveAccountsReportsAction } from "../serverActions/saveAccountsReports";
import { saveHrReportsAction } from "../serverActions/saveHrReports";
import { saveLogisticsReportsAction } from "../serverActions/saveLogisticsReports";
import { saveProcessReportsAction } from "../serverActions/saveProcessReports";
import { savePurchaseReportsAction } from "../serverActions/savePurchaseReports";

export default function SaveFile({ sheetRef, reportType }: { sheetRef: any, reportType: string }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!sheetRef.current) return;
    setIsSaving(true);

    try {
      const allSheets = sheetRef.current.getAllSheets();

      if (!allSheets || allSheets.length === 0) {
        console.warn("No sheets found");
        setIsSaving(false);
        return;
      }

      const transformedData = [];
      let lastKnownDate: string | null = null;

      // 🛠️ DASHBOARD TRACKERS: Initialized outside the row loop to collect data cleanly
      let currentSection = "UNKNOWN";

      let financeData = { plbsStatus: [] as any[], costSheetJSB: [] as any[], costSheetJUD: [] as any[], investorQueries: [] as any[], rawRows: [] as any[], detectedMonths: {} };
      let hrData = { vacancies: [] as any[], underperformersPlant: [] as any[], underperformersHO: [] as any[], statutoryClearances: [] as any[], interviewCandidates: [] as any[], rawRows: [] as any[] };
      let logisticsData = { cementDispatchData: [] as any[], rawMaterialStockData: [] as any[], transporterPaymentData: [] as any[], rawRows: [] as any[] };
      let processData = { dailyStatusReports: [] as any[], closingStock: [] as any[], coalConsumption: [] as any[], targetAchievement: [] as any[], rawRows: [] as any[] };
      let purchaseData = { dailyMaterials: [] as any[], monthlyImportantMaterials: [] as any[], reportStatus: [] as any[], rawRows: [] as any[] };

      for (const currentSheet of allSheets) {
        if (!currentSheet || !currentSheet.data) continue;

        const gridData = currentSheet.data;
        const headerRow = gridData[0];

        if (reportType === 'finance') {
          financeData.detectedMonths = {
            previous: headerRow[3] ? String(headerRow[3].v || headerRow[3].m) : "Previous Month",
            current: headerRow[4] ? String(headerRow[4].v || headerRow[4].m) : "Current Month"
          };
        }

        // ROW PROCESSING LOOP
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
          if (finalDate) lastKnownDate = finalDate;
          else finalDate = lastKnownDate;

          // Update Section Tracker (used by all Dashboards)
          const sectionCol = getVal(1);
          if (sectionCol && String(sectionCol).trim() !== "") {
            currentSection = String(sectionCol).trim().toUpperCase();
          }

          // ---------------------------------------------------------
          // LINE-BY-LINE REPORTS (Pushes immediately)
          // ---------------------------------------------------------
          if (reportType === 'outstanding') {
            const institution = getVal(1);
            const dealerName = getVal(3);
            const pendingAmt = getVal(5);

            const dynamicAgeingData: Record<string, any> = {};
            for (let c = 6; c < headerRow.length; c++) {
              const headerName = headerRow[c] ? (headerRow[c].v || headerRow[c].m) : null;
              if (headerName && String(headerName).trim() !== "") dynamicAgeingData[String(headerName)] = getVal(c);
            }

            if ((dealerName || pendingAmt) && finalDate) {
              transformedData.push({
                reportDate: finalDate,
                institution: institution ? String(institution) : null,
                verifiedDealerId: getVal(2) ? parseInt(String(getVal(2))) : null,
                dealerName: String(dealerName || ""),
                securityDepositAmt: getVal(4) ? String(getVal(4)) : null,
                pendingAmt: pendingAmt ? String(pendingAmt) : null,
                ageingData: dynamicAgeingData
              });
            }
          }
          else if (reportType === 'sales') {
            const dealerName = getVal(2);
            if (dealerName && String(dealerName).trim() !== "" && finalDate) {
              const dayPayload: Record<string, string | null> = {};
              for (let i = 1; i <= 31; i++) dayPayload[`day${i}`] = getVal(i + 3) !== null ? String(getVal(i + 3)) : null;

              transformedData.push({
                reportDate: finalDate,
                area: getVal(1) ? String(getVal(1)).trim() : null,
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
            const voucher = getVal(1);
            const party = getVal(3);
            if (voucher && party && String(voucher).trim() !== "" && finalDate) {
              transformedData.push({
                institution: getVal(0) ? String(getVal(0)).trim() : null,
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
          else if (reportType === 'accounts') {
            // Accounts is a 13-column flat line-by-line layout
            if ((getVal(1) || getVal(2) || getVal(3)) && finalDate) {
              transformedData.push({
                reportDate: finalDate,
                collectionTargetLakhs: getVal(1) !== null ? String(getVal(1)) : null,
                collectionAchievementLakhs: getVal(2) !== null ? String(getVal(2)) : null,
                spendTargetLakhs: getVal(3) !== null ? String(getVal(3)) : null,
                spendAchievementLakhs: getVal(4) !== null ? String(getVal(4)) : null,
                pettyCashBalanceLakhs: getVal(5) !== null ? String(getVal(5)) : null,
                billsPendingLakhs: getVal(6) !== null ? String(getVal(6)) : null,
                tenDaysCashReqCr: getVal(7) !== null ? String(getVal(7)) : null,
                expectedInflowSalesCr: getVal(8) !== null ? String(getVal(8)) : null,
                cmdPaymentDueLakhs: getVal(9) !== null ? String(getVal(9)) : null,
                cashBookStatusJUD: getVal(10) !== null ? String(getVal(10)) : null,
                cashBookStatusJSB: getVal(11) !== null ? String(getVal(11)) : null,
                remarks: getVal(12) ? String(getVal(12)) : null,
                rawPayload: { rawRow: row.map((c: any) => c ? (c.v || c.m) : null) }
              });
            }
          }

          // ---------------------------------------------------------
          // DASHBOARD REPORTS (Bucketed into JSON Objects)
          // ---------------------------------------------------------
          else if (reportType === 'finance') {
            financeData.rawRows.push(row.map((c: any) => c ? (c.v || c.m) : null));
            const sheetName = currentSheet.name;

            // Grab the specific month headers (e.g. Feb-26 Status) from the P&L sheet
            if (sheetName.includes("P&L") && r === 1 && headerRow) {
              financeData.detectedMonths = {
                previous: headerRow[2] ? String(headerRow[2].v || headerRow[2].m) : "Previous Month",
                current: headerRow[3] ? String(headerRow[3].v || headerRow[3].m) : "Current Month"
              };
            }

            if (sheetName.includes("P&L")) {
              const particulars = getVal(1);
              if (particulars && String(particulars).trim() !== "") {
                financeData.plbsStatus.push({ particulars: String(particulars).trim(), previousMonthValue: getVal(2) !== null ? String(getVal(2)) : null, currentMonthValue: getVal(3) !== null ? String(getVal(3)) : null, remarks: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("JUD")) {
              const particulars = getVal(1);
              if (particulars && String(particulars).trim() !== "") {
                financeData.costSheetJUD.push({ particulars: String(particulars).trim(), previousMonthValue: getVal(2) !== null ? String(getVal(2)) : null, currentMonthValue: getVal(3) !== null ? String(getVal(3)) : null, remarks: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("JSB")) {
              const particulars = getVal(1);
              if (particulars && String(particulars).trim() !== "") {
                financeData.costSheetJSB.push({ particulars: String(particulars).trim(), previousMonthValue: getVal(2) !== null ? String(getVal(2)) : null, currentMonthValue: getVal(3) !== null ? String(getVal(3)) : null, remarks: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("Investor")) {
              const queryDesc = getVal(1);
              if (queryDesc && String(queryDesc).trim() !== "") {
                financeData.investorQueries.push({ queryDescription: String(queryDesc).trim(), statusOrResolution: getVal(2) ? String(getVal(2)) : null });
              }
            }
          }
          else if (reportType === 'hr') {
            hrData.rawRows.push(row.map((c: any) => c ? (c.v || c.m) : null));
            const sheetName = String(currentSheet.name || "").toLowerCase();

            if (sheetName.includes("vac")) {
              const noOfVaccancies = getVal(1);
              if (noOfVaccancies && String(noOfVaccancies).trim() !== "") {
                hrData.vacancies.push({ noOfVaccancies: String(noOfVaccancies), ho: getVal(2) ? String(getVal(2)) : null, jsb: getVal(3) ? String(getVal(3)) : null, jud: getVal(4) ? String(getVal(4)) : null, remarks: getVal(5) ? String(getVal(5)) : null });
              }
            }
            else if (sheetName.includes("interview")) {
              const candidate = getVal(1);
              if (candidate && String(candidate).trim() !== "") {
                hrData.interviewCandidates.push({ candidateName: String(candidate), position: getVal(2) ? String(getVal(2)) : null, location: getVal(3) ? String(getVal(3)) : null, status: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("plant")) {
              const plantName = getVal(1);
              const empName = getVal(2);

              if (empName && String(empName).trim() !== "") {
                hrData.underperformersPlant.push({ plantName: String(plantName || ""), employeeName: String(empName), department: getVal(3) ? String(getVal(3)) : null, designation: getVal(4) ? String(getVal(4)) : null, remarks: getVal(5) ? String(getVal(5)) : null });
              }
            }
            else if (sheetName.includes("ho") || sheetName.includes("office")) {
              const empName = getVal(1);

              if (empName && String(empName).trim() !== "") {
                hrData.underperformersHO.push({ employeeName: String(empName), department: getVal(2) ? String(getVal(2)) : null, designation: getVal(3) ? String(getVal(3)) : null, remarks: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("statutory")) {
              const plantName = getVal(1);
              const clearance = getVal(2);

              if (clearance && String(clearance).trim() !== "") {
                hrData.statutoryClearances.push({ plantName: String(plantName || ""), clearanceType: String(clearance), dueDate: getVal(3) ? String(getVal(3)) : null, status: getVal(4) ? String(getVal(4)) : null });
              }
            }
          }
          else if (reportType === 'logistics') {
            logisticsData.rawRows.push(row.map((c: any) => c ? (c.v || c.m) : null));
            const sheetName = currentSheet.name;

            if (sheetName.includes("Dispatch")) {
              const area = getVal(1);
              if (area && String(area).trim() !== "") {
                logisticsData.cementDispatchData.push({ area: String(area).trim(), targetQty: getVal(2) !== null ? String(getVal(2)) : null, achievementQty: getVal(3) !== null ? String(getVal(3)) : null, remarks: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("Stock")) {
              const material = getVal(1);
              if (material && String(material).trim() !== "") {
                logisticsData.rawMaterialStockData.push({ material: String(material).trim(), unit: getVal(2) ? String(getVal(2)) : null, jsbStock: getVal(3) !== null ? String(getVal(3)) : null, judStock: getVal(4) !== null ? String(getVal(4)) : null, totalStock: getVal(5) !== null ? String(getVal(5)) : null, remarks: getVal(6) ? String(getVal(6)) : null });
              }
            }
            else if (sheetName.includes("Transporter") || sheetName.includes("Payment")) {
              const transporterName = getVal(1);
              if (transporterName && String(transporterName).trim() !== "") {
                logisticsData.transporterPaymentData.push({ transporterName: String(transporterName).trim(), amount: getVal(2) !== null ? String(getVal(2)) : null, remarks: getVal(3) ? String(getVal(3)) : null });
              }
            }
          }
          else if (reportType === 'process') {
            processData.rawRows.push(row.map((c: any) => c ? (c.v || c.m) : null));
            const sheetName = currentSheet.name;

            if (sheetName.includes("Status")) {
              const item = getVal(1);
              if (item && String(item).trim() !== "") {
                processData.dailyStatusReports.push({ item: String(item).trim(), status: getVal(2) ? String(getVal(2)) : null, timeRef: getVal(3) ? String(getVal(3)) : null, remarks: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("Stock")) {
              const material = getVal(1);
              if (material && String(material).trim() !== "") {
                processData.closingStock.push({ material: String(material).trim(), unit: getVal(2) ? String(getVal(2)) : null, closingStock: getVal(3) !== null ? String(getVal(3)) : null, remarks: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("Coal")) {
              const metric = getVal(1);
              if (metric && String(metric).trim() !== "") {
                processData.coalConsumption.push({ metric: String(metric).trim(), unit: getVal(2) ? String(getVal(2)) : null, value: getVal(3) !== null ? String(getVal(3)) : null, remarks: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("Target")) {
              const item = getVal(1);
              if (item && String(item).trim() !== "") {
                processData.targetAchievement.push({ item: String(item).trim(), unit: getVal(2) ? String(getVal(2)) : null, target: getVal(3) !== null ? String(getVal(3)) : null, achievement: getVal(4) !== null ? String(getVal(4)) : null, variance: getVal(5) !== null ? String(getVal(5)) : null, achvPct: getVal(6) !== null ? String(getVal(6)) : null, remarks: getVal(7) ? String(getVal(7)) : null });
              }
            }
          }
          else if (reportType === 'purchase') {
            purchaseData.rawRows.push(row.map((c: any) => c ? (c.v || c.m) : null));
            const sheetName = currentSheet.name;

            if (sheetName.includes("Daily")) {
              const material = getVal(1);
              if (material && String(material).trim() !== "") {
                purchaseData.dailyMaterials.push({ materialName: String(material).trim(), vendorName: getVal(2) ? String(getVal(2)) : null, amount: getVal(3) !== null ? String(getVal(3)) : null, statusOrRemarks: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("Monthly")) {
              const material = getVal(1);
              if (material && String(material).trim() !== "") {
                purchaseData.monthlyImportantMaterials.push({ materialName: String(material).trim(), vendorName: getVal(2) ? String(getVal(2)) : null, expectedQtyOrValue: getVal(3) !== null ? String(getVal(3)) : null, statusOrRemarks: getVal(4) ? String(getVal(4)) : null });
              }
            }
            else if (sheetName.includes("Status")) {
              const reportName = getVal(1);
              if (reportName && String(reportName).trim() !== "") {
                purchaseData.reportStatus.push({ reportName: String(reportName).trim(), status: getVal(2) ? String(getVal(2)) : null, remarks: getVal(3) ? String(getVal(3)) : null });
              }
            }
          }
        } // End of Row Loop
      } // End of Sheet Loop

      // ---------------------------------------------------------
      // PUSH DASHBOARD PAYLOADS AFTER ROW LOOP FINISHES
      // ---------------------------------------------------------
      if (lastKnownDate) {
        if (reportType === 'finance') {
          transformedData.push({ reportDate: lastKnownDate, rawPayload: { rows: financeData.rawRows }, detectedMonths: financeData.detectedMonths, plbsStatus: financeData.plbsStatus, costSheetJSB: financeData.costSheetJSB, costSheetJUD: financeData.costSheetJUD, investorQueries: financeData.investorQueries });
        } else if (reportType === 'hr') {
          transformedData.push({ reportDate: lastKnownDate, rawPayload: { rows: hrData.rawRows }, vacancies: hrData.vacancies, underperformersPlant: hrData.underperformersPlant, underperformersHO: hrData.underperformersHO, statutoryClearances: hrData.statutoryClearances, interviewCandidates: hrData.interviewCandidates });
        } else if (reportType === 'logistics') {
          transformedData.push({ reportDate: lastKnownDate, rawPayload: { rows: logisticsData.rawRows }, cementDispatchData: logisticsData.cementDispatchData, rawMaterialStockData: logisticsData.rawMaterialStockData, transporterPaymentData: logisticsData.transporterPaymentData });
        } else if (reportType === 'process') {
          transformedData.push({ reportDate: lastKnownDate, rawPayload: { rows: processData.rawRows }, dailyStatusReports: processData.dailyStatusReports, closingStock: processData.closingStock, coalConsumption: processData.coalConsumption, targetAchievement: processData.targetAchievement });
        } else if (reportType === 'purchase') {
          transformedData.push({ reportDate: lastKnownDate, rawPayload: { rows: purchaseData.rawRows }, dailyMaterials: purchaseData.dailyMaterials, monthlyImportantMaterials: purchaseData.monthlyImportantMaterials, reportStatus: purchaseData.reportStatus });
        }
      }

      if (transformedData.length === 0) {
        alert("No valid data found to save. Please ensure you entered a Date.");
        setIsSaving(false);
        return;
      }

      // 🛠️ FIRE THE CORRECT API ROUTE
      let result;
      if (reportType === 'outstanding') result = await saveOutstandingReportsAction(transformedData);
      else if (reportType === 'sales') result = await saveSalesReportsAction(transformedData);
      else if (reportType === 'collection') result = await saveCollectionReportsAction(transformedData);
      else if (reportType === 'accounts') result = await saveAccountsReportsAction(transformedData);
      else if (reportType === 'finance') result = await saveFinanceReportsAction(transformedData);
      else if (reportType === 'hr') result = await saveHrReportsAction(transformedData);
      else if (reportType === 'logistics') result = await saveLogisticsReportsAction(transformedData);
      else if (reportType === 'process') result = await saveProcessReportsAction(transformedData);
      else if (reportType === 'purchase') result = await savePurchaseReportsAction(transformedData);

      alert(`Success! Saved ${result?.insertedIds?.length || 1} records into the database.`);

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
      className={`text-sm px-4 py-1.5 text-white rounded font-medium shadow-sm ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
    >
      {isSaving ? 'Processing...' : 'Save & Send'}
    </button>
  );
}
