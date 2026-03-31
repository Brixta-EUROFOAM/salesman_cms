// src/app/dashboard/slmGeotracking/tabsLoader.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, } from 'lucide-react';

// Components
import SalesmanGeoTrackingPage from './slmGeotracking';
import { SalesmanLiveLocation } from './salesmanLiveLocation';

interface TabsProps {
  canSeeGeotracking: boolean;
  canSeeLiveLocation: boolean;
}

export function GeotrackingTabs({ canSeeGeotracking, canSeeLiveLocation }: TabsProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const searchParams = useSearchParams();

  if (!isMounted) return <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10" />;

  // 1. Get the requested tab from the URL
  const requestedTab = searchParams.get('tab');

  // 2. Map the URL param to your actual Tabs values
  let mappedTab = "";
  if (requestedTab === 'salesmanLiveLocation') mappedTab = 'live-map';
  if (requestedTab === 'geotracking') mappedTab = 'geotracking';

  // 3. Determine the default tab (prioritize URL if they have permission, otherwise fallback)
  let defaultTab = "";
  if (mappedTab === 'live-map' && canSeeLiveLocation) {
      defaultTab = 'live-map';
  } else if (mappedTab === 'geotracking' && canSeeGeotracking) {
      defaultTab = 'geotracking';
  } else {
      defaultTab = canSeeGeotracking ? "geotracking" : (canSeeLiveLocation ? "live-map" : "");
  }

  if (!defaultTab) {
      return <div className="p-10 text-center text-muted-foreground">You do not have access to these views.</div>;
  }

  return (
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList>
            {canSeeGeotracking && (
                <TabsTrigger value="geotracking" className="flex gap-2">Geotracking Logs</TabsTrigger>
            )}
            {canSeeLiveLocation && (
                <TabsTrigger value="live-map" className="flex gap-2">Live Location</TabsTrigger>
            )}
        </TabsList>
      </div>
      {canSeeGeotracking && (
        <TabsContent value="geotracking" className="space-y-4">
            <SalesmanGeoTrackingPage />
        </TabsContent>
      )}
      {canSeeLiveLocation && (
        <TabsContent value="live-map" className="space-y-4">
          <SalesmanLiveLocation />
        </TabsContent>
      )}

    </Tabs>
  );
}