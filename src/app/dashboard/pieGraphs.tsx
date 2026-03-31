// src/app/dashboard/pieGraphs.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { CalendarX, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { RawAttendanceRecord, RawLeaveRecord } from './data-format';

const COLORS = ['#10b981', '#f43f5e', '#f59e0b']; // Present (Emerald), Leave (Rose), Pending (Amber)

export default function PieGraphs() {
  const [attendance, setAttendance] = useState<RawAttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<RawLeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      
      const [attRes, leavesRes] = await Promise.all([
        fetch(`/api/dashboardPagesAPI/slm-attendance?startDate=${todayStr}&endDate=${todayStr}`, { cache: 'no-store' }),
        // Assuming your leave API can filter by active dates, or we just fetch all recent and filter client-side
        fetch(`/api/dashboardPagesAPI/slm-leaves`, { cache: 'no-store' }) 
      ]);

      const attData = attRes.ok ? await attRes.json() : [];
      const leavesData = leavesRes.ok ? await leavesRes.json() : [];

      const extractedAtt = Array.isArray(attData) ? attData : (attData.data || []);
      const extractedLeaves = Array.isArray(leavesData) ? leavesData : (leavesData.data || []);

      setAttendance(extractedAtt);
      setLeaves(extractedLeaves);
    } catch (e) {
      console.error('Failed to fetch pie chart data:', e);
      toast.error('Failed to load attendance ratios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayDate = new Date();

    // 1. Calculate Present
    const presentCount = attendance.filter(a => {
      const d = a.date || a.attendanceDate;
      if (!d) return false;
      return format(new Date(d), 'yyyy-MM-dd') === todayStr && a.inTime;
    }).length;

    // 2. Calculate Leaves (Active today & approved)
    const leaveCount = leaves.filter(l => {
      if (l.status && l.status.toUpperCase() !== 'APPROVED') return false;
      if (!l.startDate || !l.endDate) return false;
      
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      return todayDate >= start && todayDate <= end;
    }).length;

    const total = presentCount + leaveCount;
    const presentRatio = total === 0 ? 0 : Math.round((presentCount / total) * 100);
    const leaveRatio = total === 0 ? 0 : Math.round((leaveCount / total) * 100);

    return {
      presentCount,
      leaveCount,
      total,
      presentRatio,
      leaveRatio,
      chartData: [
        { name: 'Present', value: presentCount, color: COLORS[0] },
        { name: 'On Leave', value: leaveCount, color: COLORS[1] }
      ]
    };
  }, [attendance, leaves]);

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>Today's Workforce Availability</CardTitle>
        <CardDescription>Ratio of field staff marked present vs. on leave for {format(new Date(), 'PP')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center min-h-[300px]">
        
        {loading ? (
          <div className="w-full flex justify-center items-center h-full text-muted-foreground">Loading chart...</div>
        ) : stats.total === 0 ? (
          <div className="w-full flex justify-center items-center h-full text-muted-foreground">No attendance or leave data recorded for today.</div>
        ) : (
          <>
            {/* Left Part: The Pie Chart */}
            <div className="w-full md:w-1/2 h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Right Part: Legend & Stats */}
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 md:pl-12 mt-8 md:mt-0">
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="p-3 bg-emerald-500 rounded-lg text-white">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-900 uppercase tracking-wide">Present Today</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-emerald-700">{stats.presentCount}</span>
                    <span className="text-emerald-600 font-medium mb-1">({stats.presentRatio}%)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-50 border border-rose-100">
                <div className="p-3 bg-rose-500 rounded-lg text-white">
                  <CalendarX className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-rose-900 uppercase tracking-wide">On Leave</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-rose-700">{stats.leaveCount}</span>
                    <span className="text-rose-600 font-medium mb-1">({stats.leaveRatio}%)</span>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}