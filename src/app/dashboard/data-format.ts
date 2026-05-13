// src/app/dashboard/data-format.ts
import { z } from 'zod';

import { 
  selectJourneyOpsSchema, 
  selectDailyVisitReportSchema,
  selectSalesmanAttendanceSchema,
  selectSalesmanLeaveApplicationSchema
} from '../../../drizzle/zodSchemas';

// ---------------------------------------------------------------------
// 1. Exporting Extended Schemas (Adding Joins & Coercing Strings to Numbers)
// ---------------------------------------------------------------------

export const rawGeoTrackingSchema = selectJourneyOpsSchema.partial().extend({
  id: z.string().optional(),
  serverSeq: z.coerce.bigint().optional(),
  salesmanName: z.string().optional().catch("Unknown"),
  totalDistanceTravelled: z.coerce.number().optional().catch(0),
  employeeId: z.string().nullable().optional(),
  locationType: z.string().nullable().optional(),
  recordedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

export const rawDailyVisitReportSchema = selectDailyVisitReportSchema.extend({
  reportDate: z.coerce.date().nullable().optional(),
  checkInTime: z.coerce.date().nullable().optional(),
  checkOutTime: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  expectedActivationDate: z.coerce.date().nullable().optional(),
  salesmanName: z.string().optional().catch("Unknown"),
  dealerName: z.string().nullable().optional(),
  todayCollectionRupees: z.coerce.number().optional().catch(0),
  latitude: z.coerce.number().optional().catch(0),
  longitude: z.coerce.number().optional().catch(0),
  dealerTotalPotential: z.coerce.number().optional().catch(0),
  dealerBestPotential: z.coerce.number().optional().catch(0),
  todayOrderMt: z.coerce.number().optional().catch(0),
  overdueAmount: z.coerce.number().nullable().optional().catch(0),
});

export const rawAttendanceSchema = selectSalesmanAttendanceSchema.extend({
  id: z.any().optional(),
  date: z.string().optional(),
  attendanceDate: z.string().optional(),
  inTime: z.string().nullable().optional(),
  salesmanName: z.string().optional().catch("Unknown")
});

export const rawLeaveSchema = selectSalesmanLeaveApplicationSchema.extend({
  id: z.any().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
  salesmanName: z.string().optional().catch("Unknown")
});

// ---------------------------------------------------------------------
// 2. Exporting Inferred Types (Ensuring 'id' is strictly a string for Tables)
// ---------------------------------------------------------------------
export type RawGeoTrackingRecord = Omit<z.infer<typeof rawGeoTrackingSchema>, 'id'> & { id: string };
export type RawDailyVisitReportRecord = Omit<z.infer<typeof rawDailyVisitReportSchema>, 'id'> & { id: string };
export type RawAttendanceRecord = z.infer<typeof rawAttendanceSchema>;
export type RawLeaveRecord = z.infer<typeof rawLeaveSchema>;

// ---------------------------------------------------------------------
// 3. Types for Aggregated Graph Data
// ---------------------------------------------------------------------
export type DailyVisitsData = {
  name: string; // Date
  visits: number;
};

export type GeoTrackingData = {
  name: string; // Date
  distance: number;
};