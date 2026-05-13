// drizzle/zodSchema.ts
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, roles, userRoles, dealers, permanentJourneyPlans, dailyVisitReports, 
    salesmanLeaveApplications, salesmanAttendance, geoTracking, journeys, syncState, 
    journeyOps, journeyBreadcrumbs, 
} from "../drizzle/index";

/* ================================= XXXXXXXXXXX ================================ */
/* ========================= drizzle-zod insert schemas ========================= */
/* ================================= XXXXXXXXXXX ================================ */

export const insertUserSchema = createInsertSchema(users);
export const insertRolesSchema = createInsertSchema(roles);
export const insertUserRolesSchema = createInsertSchema(userRoles);
export const insertDailyVisitReportSchema = createInsertSchema(dailyVisitReports);
export const insertPermanentJourneyPlanSchema = createInsertSchema(permanentJourneyPlans);
export const insertDealerSchema = createInsertSchema(dealers);
export const insertSalesmanAttendanceSchema = createInsertSchema(salesmanAttendance);
export const insertSalesmanLeaveApplicationSchema = createInsertSchema(salesmanLeaveApplications);

// journey + geotracking
export const insertGeoTrackingSchema = createInsertSchema(geoTracking);
export const insertJourneyOpsSchema = createInsertSchema(journeyOps);
export const insertJourneysSchema = createInsertSchema(journeys);
export const insertJourneyBreadcrumbsSchema = createInsertSchema(journeyBreadcrumbs);
export const insertSyncStateSchema = createInsertSchema(syncState);

/* ================================= XXXXXXXXXXX ================================ */
/* ========================= drizzle-zod select schemas ========================= */
/* ================================= XXXXXXXXXXX ================================ */

export const selectUserSchema = createSelectSchema(users);
export const selectRolesSchema = createSelectSchema(roles);
export const selectUserRolesSchema = createSelectSchema(userRoles);
export const selectDailyVisitReportSchema = createSelectSchema(dailyVisitReports);
export const selectPermanentJourneyPlanSchema = createSelectSchema(permanentJourneyPlans);
export const selectDealerSchema = createSelectSchema(dealers);
export const selectSalesmanAttendanceSchema = createSelectSchema(salesmanAttendance);
export const selectSalesmanLeaveApplicationSchema = createSelectSchema(salesmanLeaveApplications);

// journey + geotracking
export const selectGeoTrackingSchema = createSelectSchema(geoTracking);
export const selectJourneyOpsSchema = createSelectSchema(journeyOps);
export const selectJourneysSchema = createSelectSchema(journeys);
export const selectJourneyBreadcrumbsSchema = createSelectSchema(journeyBreadcrumbs);
export const selectSyncStateSchema = createSelectSchema(syncState);