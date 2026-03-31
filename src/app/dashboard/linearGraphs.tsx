// src/app/dashboard/linearGraphs.tsx
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChartAreaInteractive } from '@/components/chart-area-reusable';

import {
  RawGeoTrackingRecord,
  rawGeoTrackingSchema,
  RawSalesOrderReportRecord,
  rawSalesOrderSchema,
} from './data-format';

// --- Graph Data Types ---
type GeoTrackingData = { name: string; distance: number };
type SalesQuantityData = { name: string; quantity: number };

export default function LinearGraphs() {
  const [rawGeoTrackingRecords, setRawGeoTrackingRecords] = useState<RawGeoTrackingRecord[]>([]);
  const [rawSalesOrders, setRawSalesOrders] = useState<RawSalesOrderReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSalesman] = useState<string | 'all'>('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [geoRes, salesRes] = await Promise.all([
        fetch(`/api/dashboardPagesAPI/slm-geotracking?pageSize=1000`, { cache: 'no-store' }),
        fetch(`/api/dashboardPagesAPI/reports/sales-orders?pageSize=1000`, { cache: 'no-store' }),
      ]);

      if (!geoRes.ok) throw new Error(`Geo API: ${geoRes.status}`);
      if (!salesRes.ok) throw new Error(`Sales API: ${salesRes.status}`);

      const [geoData, salesData] = await Promise.all([
        geoRes.json(),
        salesRes.json(),
      ]);

      const extractData = (res: any) => Array.isArray(res) ? res : (res.data || []);

      const validatedGeo = rawGeoTrackingSchema.array().parse(extractData(geoData)).map(d => ({
        ...d,
        id: d.id?.toString() || d.opId?.toString() || `${Math.random()}`
      })) as RawGeoTrackingRecord[];

      const validatedSales = rawSalesOrderSchema.array().parse(extractData(salesData)).map(d => ({
        ...d,
        id: d.id?.toString() || `${Math.random()}`
      })) as RawSalesOrderReportRecord[];

      setRawGeoTrackingRecords(validatedGeo);
      setRawSalesOrders(validatedSales);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      console.error('Dashboard load error:', e);
      setError(msg);
      toast.error('Failed to load linear graphs data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const geoGraphData: GeoTrackingData[] = useMemo(() => {
    let filtered = rawGeoTrackingRecords;
    if (selectedSalesman !== 'all') filtered = filtered.filter(r => r.salesmanName === selectedSalesman);
    
    const agg: Record<string, number> = {};
    filtered.forEach(item => {
      const dateStr = item.recordedAt || item.createdAt;
      if (!dateStr) return;
      
      const key = new Date(dateStr).toISOString().slice(0, 10);
      agg[key] = (agg[key] || 0) + (item.totalDistanceTravelled ?? 0);
    });
    return Object.keys(agg).sort().map(k => ({ name: k, distance: agg[k] }));
  }, [rawGeoTrackingRecords, selectedSalesman]);

  const salesQuantityGraphData: SalesQuantityData[] = useMemo(() => {
    let filtered = rawSalesOrders;
    if (selectedSalesman !== 'all') filtered = filtered.filter(r => r.salesmanName === selectedSalesman);
    const agg: Record<string, number> = {};
    filtered.forEach(item => {
      const key = item.orderDate; 
      const qty = item.orderQty ?? 0;
      agg[key] = (agg[key] || 0) + (isNaN(qty) ? 0 : qty);
    });
    return Object.keys(agg).sort().map(k => ({ name: k, quantity: agg[k] }));
  }, [rawSalesOrders, selectedSalesman]);

  if (loading) return <div className="flex justify-center items-center min-h-[300px]">Loading graph data...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-8 border rounded-lg bg-card">
        Error: {error}
        <Button onClick={fetchData} className="ml-4">Retry</Button>
      </div>
    );

  return (
    <div className="space-y-6">

      {/* Graph Grid (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Geo-Tracking */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Geo-Tracking Activity</CardTitle>
            <CardDescription>Total distance travelled per day (km).</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartAreaInteractive data={geoGraphData} dataKey="distance" title="Distance Travelled" />
          </CardContent>
        </Card>

        {/* Sales Quantity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Sales Order Quantity</CardTitle>
            <CardDescription>Total unit quantity ordered per day.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartAreaInteractive data={salesQuantityGraphData} dataKey="quantity" title="Sales Volume" />
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}