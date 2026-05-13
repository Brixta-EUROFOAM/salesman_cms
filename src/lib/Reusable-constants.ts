// src/lib/Reusable-constants.ts

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const JWT_KEY = process.env.JWT_SECRET;

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

export const SO_AOP_TARGETS = {
  dealerVisits: 100,
  subDealerVisits: 200,
};

export const ORG_ROLES = [ //fixed
  'Admin', 'Manager', 'Assistant-Manager',  
  
];

export const JOB_ROLES = [ //can be multiple per ORG_ROLE
  'Admin', 'Manager', 'Assistant-Manager',
];