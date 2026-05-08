// src/lib/Reusable-constants.ts

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
export const RESEND_API_KEY = process.env.RESEND_MAIL_API;
export const JWT_KEY = process.env.JWT_SECRET;
export const NEXT_PUBLIC_MYCOCOSERVER_URL = process.env.NEXT_PUBLIC_MYCOCOSERVER_URL;

export const MEGHALAYA_OVERSEER_ID = 256

export const brands = [
  "Star", "Amrit", "Dalmia", 
  "Topcem", "Black Tiger", "Surya Gold", 
  "Max", "Taj", 
  "Specify in remarks"
];

export const dealerTypes = ["Dealer-Best", "Sub Dealer-Best", "Dealer-Non Best", "Sub Dealer-Non Best"];

export const units = ["MT", "KG", "Bags"];

export const Zone = ["All Zone", "Kamrup", "Upper Assam", "Lower Assam", "Central Assam", 
  "Barak Valley", "North Bank", "Meghalaya", "Mizoram", "Nagaland", "Tripura", 
];

export const TSO_AOP_TARGETS = {
  siteVisitNew: 70,
  siteVisitOld: 80,
  dealerRetailer: 50,
  siteConversion: 20,
  volumeConvertedMT: 2000, //2k bags = 1 mt
  influencerVisits: 10,
  enrollmentLifting: 100,
  siteServiceSlab: 5,
  technicalMeet: 5,
};

export const SO_AOP_TARGETS = {
  dealerVisits: 100,
  subDealerVisits: 200,
};

export const ORG_ROLES = [ //fixed
  'Admin', 'Manager', 'Assistant-Manager',  
  'chief-managing-director', 'director', 'president', 
  'senior-general-manager', 'general-manager', 'deputy-general-manager', 'assistant-general-manager',
  'senior-regional-manager', 'regional-manager', 'deputy-manager', 'senior-area-manager', 'area-manager', 
  'senior-executive', 'executive', 'junior-executive'
];

export const JOB_ROLES = [ //can be multiple per ORG_ROLE
  'Admin', 'Manager', 'Assistant-Manager',
  'Sales-Marketing', 'Technical-Sales', 'Reports-MIS', 'IT', 
  'Accounting', 'Logistics', 'Human Resources', 'Factory-Operations'
];