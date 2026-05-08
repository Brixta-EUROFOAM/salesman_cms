// src/app/home/sheetsEditor/lib/templates.ts
export const OUTSTANDING_TEMPLATE = {
  name: "Outstanding Reports",
  color: "",
  index: 0,
  status: 1,
  order: 0,
  hide: 0,
  row: 500,
  column: 20,
  defaultRowHeight: 25,
  defaultColWidth: 125,
  celldata: [
    // Headers (Row 0)
    { r: 0, c: 0, v: { v: "reportDate", m: "Report Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "institution", m: "Institution", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "verified_dealer_id", m: "Verified Dealer ID", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "dealerName", m: "Dealer Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 4, v: { v: "securityDepositAmt", m: "Security Deposit", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 5, v: { v: "pendingAmt", m: "Pending Amt", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 6, v: { v: "< 10 days", m: "< 10 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 7, v: { v: "10-15 days", m: "10-15 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 8, v: { v: "15 - 21 days", m: "15 - 21 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 9, v: { v: "21 - 30 days", m: "21 - 30 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 10, v: { v: "15-30 days", m: "15-30 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 11, v: { v: "30-45 days", m: "30-45 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 12, v: { v: "45-60 days", m: "45-60 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 13, v: { v: "60-75 days", m: "60-75 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 14, v: { v: "75-90 days", m: "75-90 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 15, v: { v: "60-90 days", m: "60-90 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 16, v: { v: ">90 days", m: ">90 days", bg: "#fca5a5", bl: 1 } }
  ],
  config: {
    columnlen: { // length of individual cols
      "0": 110, // Report Date
      "1": 100, // Institution
      "2": 130, // Verified Dealer ID
      "3": 280, // Dealer Name (Made very wide since names get long)
      "4": 130, // Security Deposit
      "5": 120, // Pending Amt
    }
  }
};

export const SALES_TEMPLATE = {
  name: "Sales Reports",
  color: "",
  index: 0,
  status: 1,
  order: 0,
  hide: 0,
  row: 1000,
  column: 15,
  defaultRowHeight: 25,
  defaultColWidth: 125,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Report Date (YYYY-MM-DD)", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "area", m: "Area", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "dealerName", m: "Dealer Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "responsiblePerson", m: "Responsible Person", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 4, v: { v: "currentMonthMTDSales", m: "MTD Sales", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 5, v: { v: "currentMonthTarget", m: "Target", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 6, v: { v: "percentageTargetAchieved", m: "% Achieved", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 7, v: { v: "balance", m: "Balance", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 8, v: { v: "prorataSalesTarget", m: "Prorata Target", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 9, v: { v: "percentageAsPerProrata", m: "% Prorata", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 10, v: { v: "askingRate", m: "Asking Rate", bg: "#dcfce3", bl: 1 } },
  ],
  config: {
    columnlen: {
      "0": 110,
      "2": 250,
      "3": 180
    }
  }
};

export const COLLECTION_TEMPLATE = {
  name: "Collection Reports",
  color: "",
  index: 0,
  status: 1,
  order: 0,
  hide: 0,
  row: 300,
  column: 15,
  defaultRowHeight: 25,
  defaultColWidth: 120,
  celldata: [
    { r: 0, c: 0, v: { v: "institution", m: "Institution (JSB/JUD)", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "voucherNo", m: "Voucher No.", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "date", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "partyName", m: "Party name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 4, v: { v: "zone", m: "Zone", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 5, v: { v: "district", m: "District", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 6, v: { v: "salesPromoter", m: "Sales Promoter", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 7, v: { v: "bankAccount", m: "Bank Account", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 8, v: { v: "amount", m: "Amount", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 9, v: { v: "remarks", m: "Remarks (Optional)", bg: "#f3f4f6", bl: 1 } },
  ],
  config: {
    columnlen: {
      "1": 150,
      "3": 250,
      "6": 180,
      "7": 250
    }
  }
};