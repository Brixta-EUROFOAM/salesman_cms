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
  column: 60,
  defaultRowHeight: 25,
  defaultColWidth: 125,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Report Date (YYYY-MM-DD)", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "area", m: "Area", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "dealerName", m: "Dealer Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "responsiblePerson", m: "Responsible Person", bg: "#f3f4f6", bl: 1 } },

    { r: 0, c: 4, v: { v: "day1", m: "Day 1", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 5, v: { v: "day2", m: "Day 2", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 6, v: { v: "day3", m: "Day 3", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 7, v: { v: "day4", m: "Day 4", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 8, v: { v: "day5", m: "Day 5", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 9, v: { v: "day6", m: "Day 6", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 10, v: { v: "day7", m: "Day 7", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 11, v: { v: "day8", m: "Day 8", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 12, v: { v: "day9", m: "Day 9", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 13, v: { v: "day10", m: "Day 10", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 14, v: { v: "day11", m: "Day 11", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 15, v: { v: "day12", m: "Day 12", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 16, v: { v: "day13", m: "Day 13", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 17, v: { v: "day14", m: "Day 14", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 18, v: { v: "day15", m: "Day 15", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 19, v: { v: "day16", m: "Day 16", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 20, v: { v: "day17", m: "Day 17", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 21, v: { v: "day18", m: "Day 18", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 22, v: { v: "day19", m: "Day 19", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 23, v: { v: "day20", m: "Day 20", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 24, v: { v: "day21", m: "Day 21", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 25, v: { v: "day22", m: "Day 22", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 26, v: { v: "day23", m: "Day 23", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 27, v: { v: "day24", m: "Day 24", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 28, v: { v: "day25", m: "Day 25", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 29, v: { v: "day26", m: "Day 26", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 30, v: { v: "day27", m: "Day 27", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 31, v: { v: "day28", m: "Day 28", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 32, v: { v: "day29", m: "Day 29", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 33, v: { v: "day30", m: "Day 30", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 34, v: { v: "day31", m: "Day 31", bg: "#e0f2fe", bl: 1 } },

    { r: 0, c: 35, v: { v: "currentMonthMTDSales", m: "MTD Sales", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 36, v: { v: "currentMonthTarget", m: "Target", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 37, v: { v: "percentageTargetAchieved", m: "% Achieved", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 38, v: { v: "balance", m: "Balance", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 39, v: { v: "prorataSalesTarget", m: "Prorata Target", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 40, v: { v: "percentageAsPerProrata", m: "% Prorata", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 41, v: { v: "askingRate", m: "Asking Rate", bg: "#dcfce3", bl: 1 } },
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