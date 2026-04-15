// src/app/dashboard/reports/tabsLoader.tsx
'use client';

import React from 'react'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import CompetitionReportsPage from './competitionReports';
import DailyVisitReportsPage from './dailyVisitReports';
import TechnicalVisitReportsPage from './technicalVisitReports';
import HybridReportsPage from './dvrAndTvr';
import TsoPerformanceMetricsPage from './tsoPerformanceMetrics';
import SoPerformanceMetricsPage from './soPerformanceMetrics';

// This component receives the permissions as props
// from the server component (page.tsx)
interface ReportsTabsProps {
  canSeeDVR: boolean;
  canSeeTVR: boolean;
  canSeeDvrTvr: boolean;
  canSeeCompetition: boolean;
  canSeeTsoPerformanceMetrics: boolean;
  canSeeSoPerformanceMetrics: boolean;
}

export function ReportsTabs({
  canSeeDVR,
  canSeeTVR,
  canSeeDvrTvr,
  canSeeCompetition,
  canSeeTsoPerformanceMetrics,
  canSeeSoPerformanceMetrics
}: ReportsTabsProps) {

  // 1. State to track hydration completion
  const [isClient, setIsClient] = React.useState(false);
  const searchParams = useSearchParams();

  // 2. Set the client state after mounting
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Determine the default tab based on URL params first, then permissions
  const defaultTab = React.useMemo(() => {

    // Fallback logic if no valid URL param or lacking permission
    if (canSeeDVR) return "dailyVisitReport";
    if (canSeeTVR) return "technicalVisitReport";
    if (canSeeDvrTvr) return "dvrAndTvr"
    if (canSeeCompetition) return "competitionReport";
    if (canSeeTsoPerformanceMetrics) return "tsoPerformanceMetrics";
    if (canSeeSoPerformanceMetrics) return "soPerformanceMetrics";
    return ""; // Should not happen if canSeeAnyReport is checked in parent
  }, [searchParams, canSeeDVR, canSeeTVR, canSeeDvrTvr, canSeeCompetition, canSeeTsoPerformanceMetrics, canSeeSoPerformanceMetrics]);


  // 3. Prevent rendering the component that generates unstable IDs during SSR
  if (!isClient) {
    // Render a safe, placeholder div during SSR/Hydration
    // This allows the browser to show *something* quickly without triggering the mismatch.
    return <div className="min-h-[300px] w-full flex items-center justify-center text-muted-foreground">
      Loading Reports UI...
    </div>;
  }

  // 4. Render the full component only on the client
  return (
    // Note: We use the memoized defaultTab value
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList>
        {canSeeDVR && (
          <TabsTrigger value="dailyVisitReport">DVR Report</TabsTrigger>
        )}
        {canSeeDVR && (
          <TabsTrigger value="dvrAndTvr">DVR/TVR (Kamrup-TSO)</TabsTrigger>
        )}
        {canSeeTVR && (
          <TabsTrigger value="technicalVisitReport">TVR Report</TabsTrigger>
        )}
        {canSeeTsoPerformanceMetrics && (
          <TabsTrigger value="tsoPerformanceMetrics">TSO Metrics</TabsTrigger>
        )}
        {canSeeSoPerformanceMetrics && (
          <TabsTrigger value="soPerformanceMetrics">SO Metrics</TabsTrigger>
        )}
        {/* {canSeeCompetition && (
          <TabsTrigger value="competitionReport">Competition Report</TabsTrigger>
        )} */}
        
      </TabsList>

      {/* --- Tab Content --- */}
      {canSeeDVR && (
        <TabsContent value="dailyVisitReport" className="space-y-4">
          <DailyVisitReportsPage />
        </TabsContent>
      )}
      {canSeeDvrTvr && (
        <TabsContent value="dvrAndTvr" className="space-y-4">
          <HybridReportsPage />
        </TabsContent>
      )}
      {canSeeTVR && (
        <TabsContent value="technicalVisitReport" className="space-y-4">
          <TechnicalVisitReportsPage />
        </TabsContent>
      )}
      {canSeeTsoPerformanceMetrics && (
        <TabsContent value="tsoPerformanceMetrics" className="space-y-4">
          <TsoPerformanceMetricsPage />
        </TabsContent>
      )}
      {canSeeSoPerformanceMetrics && (
        <TabsContent value="soPerformanceMetrics" className="space-y-4">
          <SoPerformanceMetricsPage />
        </TabsContent>
      )}
      {/* {canSeeCompetition && (
        <TabsContent value="competitionReport" className="space-y-4">
          <CompetitionReportsPage />
        </TabsContent>
      )} */}
      
    </Tabs>
  );
}