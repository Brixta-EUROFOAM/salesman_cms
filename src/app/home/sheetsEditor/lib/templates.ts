// src/app/home/sheetsEditor/lib/templates.ts
const outstandingConfig = {
  columnlen: { "0": 110, "1": 100, "2": 130, "3": 280, "4": 130, "5": 120 }
};

export const JSB_OUTSTANDING = {
  name: "JSB Outstanding",
  color: "#166df9", // Orange tab
  index: 0, status: 1, order: 0, hide: 0, row: 500, column: 20,
  defaultRowHeight: 25, defaultColWidth: 125,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Report Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "institution", m: "Institution", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "verified_dealer_id", m: "Verified Dealer ID", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "dealerName", m: "Dealer Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 4, v: { v: "securityDepositAmt", m: "Security Deposit", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 5, v: { v: "pendingAmt", m: "Pending Amt", bg: "#f3f4f6", bl: 1 } },
    // JSB Specific Ageing
    { r: 0, c: 6, v: { v: "< 10 days", m: "< 10 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 7, v: { v: "10-15 days", m: "10-15 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 8, v: { v: "15-21 DAYS", m: "15-21 DAYS", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 9, v: { v: "21-30 days", m: "21-30 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 10, v: { v: "30-45 days", m: "30-45 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 11, v: { v: "45-60 days", m: "45-60 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 12, v: { v: "60-75 days", m: "60-75 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 13, v: { v: "75-90 days", m: "75-90 days", bg: "#fed7aa", bl: 1 } },
    { r: 0, c: 14, v: { v: ">90 days", m: ">90 days", bg: "#fca5a5", bl: 1 } }
  ],
  config: outstandingConfig
};

export const JUD_OUTSTANDING = {
  name: "JUD Outstanding",
  color: "#10b981", // Green tab
  index: 1, status: 0, order: 1, hide: 0, row: 500, column: 20,
  defaultRowHeight: 25, defaultColWidth: 125,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Report Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "institution", m: "Institution", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "verified_dealer_id", m: "Verified Dealer ID", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "dealerName", m: "Dealer Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 4, v: { v: "securityDepositAmt", m: "Security Deposit", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 5, v: { v: "pendingAmt", m: "Pending Amt", bg: "#f3f4f6", bl: 1 } },
    // JUD Specific Ageing
    { r: 0, c: 6, v: { v: "< 10 days", m: "< 10 days", bg: "#a7f3d0", bl: 1 } },
    { r: 0, c: 7, v: { v: "10-15 days", m: "10-15 days", bg: "#a7f3d0", bl: 1 } },
    { r: 0, c: 8, v: { v: "15-30 days", m: "15-30 days", bg: "#a7f3d0", bl: 1 } },
    { r: 0, c: 9, v: { v: "30-45 days", m: "30-45 days", bg: "#a7f3d0", bl: 1 } },
    { r: 0, c: 10, v: { v: "45-60 days", m: "45-60 days", bg: "#a7f3d0", bl: 1 } },
    { r: 0, c: 11, v: { v: "60-90 days", m: "60-90 days", bg: "#a7f3d0", bl: 1 } },
    { r: 0, c: 12, v: { v: ">90 days", m: ">90 days", bg: "#fca5a5", bl: 1 } }
  ],
  config: outstandingConfig
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
      "0": 110, "2": 250, "3": 180
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
      "1": 150, "3": 250, "6": 180,  "7": 250
    }
  }
};

export const ACCOUNTS_TEMPLATE = {
  name: "Accounts Dashboard",
  color: "#14b8a6", // Teal
  index: 0, status: 1, order: 0, hide: 0, row: 500, column: 15,
  defaultRowHeight: 25, defaultColWidth: 120,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "colTarget", m: "Collection Target", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 2, v: { v: "colAch", m: "Collection Achv.", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 3, v: { v: "spendTarget", m: "Spend Target", bg: "#fee2e2", bl: 1 } },
    { r: 0, c: 4, v: { v: "spendAch", m: "Spend Achv.", bg: "#fee2e2", bl: 1 } },
    { r: 0, c: 5, v: { v: "pettyCash", m: "Petty Cash", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 6, v: { v: "billsPending", m: "Bills Pending", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 7, v: { v: "tenDaysReq", m: "10 Days Cash Req", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 8, v: { v: "expInflow", m: "Exp. Inflow", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 9, v: { v: "cmdDue", m: "CMD Due", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 10, v: { v: "cbJUD", m: "CB JUD", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 11, v: { v: "cbJSB", m: "CB JSB", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 12, v: { v: "remarks", m: "Remarks", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { 
    "0": 100, "1": 130, "2": 130, 
    "3": 130, "4": 130, "12": 200 
  } }
};

export const FINANCE_PLBS = {
  name: "P&L & BS Status",
  color: "#2563eb", // Blue
  index: 0, status: 1, order: 0, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "particulars", m: "Particulars", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "prevMonth", m: "Previous Month", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 3, v: { v: "currMonth", m: "Current Month", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "remarks", m: "Remarks / Action", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 250, "2": 150, "3": 150, "4": 250 } }
};

export const FINANCE_COST_JUD = {
  name: "Cost Sheet - JUD",
  color: "#3b82f6", 
  index: 1, status: 0, order: 1, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "particulars", m: "Particulars", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "prevMonth", m: "Previous Month", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 3, v: { v: "currMonth", m: "Current Month", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "remarks", m: "Remarks / Action", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 250, "2": 150, "3": 150, "4": 250 } }
};

export const FINANCE_COST_JSB = {
  name: "Cost Sheet - JSB",
  color: "#60a5fa", 
  index: 2, status: 0, order: 2, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "particulars", m: "Particulars", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "prevMonth", m: "Previous Month", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 3, v: { v: "currMonth", m: "Current Month", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "remarks", m: "Remarks / Action", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 250, "2": 150, "3": 150, "4": 250 } }
};

export const FINANCE_INVESTOR = {
  name: "Investor Queries",
  color: "#93c5fd", 
  index: 3, status: 0, order: 3, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "query", m: "Query Description", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "status", m: "Status / Resolution", bg: "#dcfce3", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 350, "2": 250, "3": 250 } }
};

export const HR_VACCANCIES = {
  name: "Total Vaccancies",
  color: "#d946ef", 
  index: 0, status: 1, order: 0, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    // Headers
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "noOfVaccancies", m: "Total No of vaccancies", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "ho", m: "Head Office", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 3, v: { v: "jsb", m: "JSB", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "jud", m: "JUD", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 5, v: { v: "remarks", m: "Remarks / Action", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 250, "4": 250 } }
};

export const HR_INTERVIEWS = {
  name: "Interview Candidates",
  color: "#86198f", 
  index: 3, status: 0, order: 3, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "candidate", m: "Candidate Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "position", m: "Position", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 3, v: { v: "location", m: "Location", bg: "#fef3c7", bl: 1 } },
    { r: 0, c: 4, v: { v: "status", m: "Status", bg: "#dcfce3", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 250, "2": 200, "3": 150, "4": 150 } }
};

export const HR_PLANT = {
  name: "Top Underperformers - Plant",
  color: "#d946ef", 
  index: 0, status: 1, order: 0, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    // Headers
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "plant", m: "Plant Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "empName", m: "Employee Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "department", m: "Department", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "designation", m: "Designation", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 5, v: { v: "remarks", m: "Remarks / Action", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 250, "4": 250 } }
};

export const HR_HO = {
  name: "Top Underperformers - HO",
  color: "#c026d3", 
  index: 1, status: 0, order: 1, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "empName", m: "Employee Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "department", m: "Department", bg: "#fee2e2", bl: 1 } },
    { r: 0, c: 3, v: { v: "designation", m: "Designation", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 3, v: { v: "remarks", m: "Remarks / Action", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 250, "2": 200, "3": 250 } }
};

export const HR_STATUTORY = {
  name: "Statutory Clearances",
  color: "#a21caf", 
  index: 2, status: 0, order: 2, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "plantName", m: "Plant Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "clearance", m: "Clearance Type", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "dueDate", m: "Due Date", bg: "#fef3c7", bl: 1 } },
    { r: 0, c: 4, v: { v: "status", m: "Status", bg: "#e0f2fe", bl: 1 } },
    
    { r: 1, c: 1, v: { v: "Pollution Control", m: "Pollution Control" } }, 
    { r: 2, c: 1, v: { v: "Factory License", m: "Factory License" } },
    { r: 3, c: 1, v: { v: "Labour Compliance", m: "Labour Compliance" } },
    { r: 4, c: 1, v: { v: "Environmantal Clearance", m: "Environmantal Clearance" } },
    { r: 5, c: 1, v: { v: "Safety Compliance", m: "Safety Compliance" } },
  ],
  config: { columnlen: { "0": 110, "1": 250, "2": 150, "4": 250 } }
};

export const PURCHASE_DAILY = {
  name: "Daily Materials (Top 5)",
  color: "#f59e0b", // Amber
  index: 0, status: 1, order: 0, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "material", m: "Material Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "vendor", m: "Vendor Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "amount", m: "Amount", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "status", m: "Status / Remarks", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 250, "2": 250, "3": 150, "4": 250 } }
};

export const PURCHASE_MONTHLY = {
  name: "Monthly Important (Top 10)",
  color: "#d97706", 
  index: 1, status: 0, order: 1, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "material", m: "Material Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "vendor", m: "Vendor Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "qty", m: "Expected Qty / Value", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "status", m: "Status / Remarks", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 250, "2": 250, "3": 200, "4": 250 } }
};

export const PURCHASE_STATUS = {
  name: "Report Status",
  color: "#b45309", 
  index: 2, status: 0, order: 2, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "reportName", m: "Report Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "status", m: "Status", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 3, v: { v: "remarks", m: "Remarks", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 300, "2": 200, "3": 250 } }
};

export const PROCESS_STATUS = {
  name: "Daily Status",
  color: "#f43f5e", 
  index: 0, status: 1, order: 0, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "item", m: "Item", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "status", m: "Status", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 3, v: { v: "timeRef", m: "Time / Ref.", bg: "#fef3c7", bl: 1 } },
    { r: 0, c: 4, v: { v: "remarks", m: "Remarks", bg: "#f3f4f6", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 300, "2": 150, "3": 150, "4": 250 } }
};

export const PROCESS_STOCK = {
  name: "Closing Stock",
  color: "#e11d48", 
  index: 1, status: 0, order: 1, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "material", m: "Material", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "unit", m: "Unit", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 3, v: { v: "closingStock", m: "Closing Stock", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "remarks", m: "Remarks", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 300, "2": 100, "3": 150, "4": 250 } }
};

export const PROCESS_COAL = {
  name: "Coal Consumption",
  color: "#be123c", 
  index: 2, status: 0, order: 2, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "metric", m: "Metric", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "unit", m: "Unit", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 3, v: { v: "value", m: "Value", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "remarks", m: "Remarks", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 350, "2": 100, "3": 150, "4": 250 } }
};

export const PROCESS_TARGET_ACHV = {
  name: "Target vs Achievement",
  color: "#9f1239", 
  index: 3, status: 0, order: 3, hide: 0, row: 100, column: 12,
  defaultRowHeight: 25, defaultColWidth: 120,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "item", m: "Item", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "unit", m: "Unit", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 3, v: { v: "target", m: "Target", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "achievement", m: "Achievement", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 5, v: { v: "variance", m: "Variance", bg: "#fee2e2", bl: 1 } },
    { r: 0, c: 6, v: { v: "achvPct", m: "Achv. %", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 7, v: { v: "remarks", m: "Remarks", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 200, "2": 100, "7": 250 } }
};

export const LOGISTICS_DISPATCH = {
  name: "Cement Dispatch (FOR)",
  color: "#4f46e5", // Indigo
  index: 0, status: 1, order: 0, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "area", m: "Area", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "target", m: "Target Dispatch Qty (MT)", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 3, v: { v: "achievement", m: "Ach. Dispatch Qty (MT)", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 4, v: { v: "remarks", m: "Remarks", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 200, "2": 180, "3": 180, "4": 250 } }
};

export const LOGISTICS_STOCK = {
  name: "Raw Materials Closing Stock",
  color: "#6366f1", 
  index: 1, status: 0, order: 1, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "material", m: "Material", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "unit", m: "Unit", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 3, v: { v: "jsbStock", m: "JSB Closing Stock", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 4, v: { v: "judStock", m: "JUD Closing Stock", bg: "#e0f2fe", bl: 1 } },
    { r: 0, c: 5, v: { v: "totalStock", m: "Total Stock", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 6, v: { v: "remarks", m: "Remarks", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 200, "2": 100, "3": 150, "4": 150, "5": 150, "6": 200 } }
};

export const LOGISTICS_TRANSPORTER = {
  name: "Transporter Payments",
  color: "#818cf8", 
  index: 2, status: 0, order: 2, hide: 0, row: 100, column: 10,
  defaultRowHeight: 25, defaultColWidth: 150,
  celldata: [
    { r: 0, c: 0, v: { v: "reportDate", m: "Date", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 1, v: { v: "transporterName", m: "Transporter Name", bg: "#f3f4f6", bl: 1 } },
    { r: 0, c: 2, v: { v: "amount", m: "Payment Amount (₹)", bg: "#dcfce3", bl: 1 } },
    { r: 0, c: 3, v: { v: "remarks", m: "Remarks", bg: "#fef3c7", bl: 1 } },
  ],
  config: { columnlen: { "0": 110, "1": 300, "2": 200, "3": 250 } }
};
