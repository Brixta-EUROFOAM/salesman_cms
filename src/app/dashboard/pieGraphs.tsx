// src/app/dashboard/pieGraphs.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { CalendarX, UserCheck, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { RawAttendanceRecord, RawLeaveRecord } from './data-format';

const COLORS = ['#10b981', '#f43f5e', '#f59e0b']; // Present (Emerald), Leave (Rose), Pending (Amber)

// Helper to reliably get current IST date as YYYY-MM-DD
const getTodayIST = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};

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
    const todayISTStr = getTodayIST();

    // 1. Calculate Present (Exact Match)
    const presentCount = attendance.filter(a => {
      const d = a.date || a.attendanceDate;
      if (!d) return false;
      return d.substring(0, 10) === todayISTStr && a.inTime;
    }).length;

    // 2. Calculate Approved Leaves (Range Match)
    const approvedLeaveCount = leaves.filter(l => {
      if (l.status && l.status.toUpperCase() !== 'APPROVED') return false;
      if (!l.startDate || !l.endDate) return false;
      
      const start = l.startDate.substring(0, 10);
      const end = l.endDate.substring(0, 10);
      return todayISTStr >= start && todayISTStr <= end;
    }).length;

    // 3. Calculate Pending Leaves (Range Match)
    const pendingLeaveCount = leaves.filter(l => {
      if (l.status && l.status.toUpperCase() !== 'PENDING') return false;
      if (!l.startDate || !l.endDate) return false;
      
      const start = l.startDate.substring(0, 10);
      const end = l.endDate.substring(0, 10);
      return todayISTStr >= start && todayISTStr <= end;
    }).length;

    // 4. Calculate Ratios
    const total = presentCount + approvedLeaveCount + pendingLeaveCount;
    const presentRatio = total === 0 ? 0 : Math.round((presentCount / total) * 100);
    const approvedRatio = total === 0 ? 0 : Math.round((approvedLeaveCount / total) * 100);
    const pendingRatio = total === 0 ? 0 : Math.round((pendingLeaveCount / total) * 100);

    return {
      presentCount,
      approvedLeaveCount,
      pendingLeaveCount,
      total,
      presentRatio,
      approvedRatio,
      pendingRatio,
      chartData: [
        { name: 'Present', value: presentCount, color: COLORS[0] },
        { name: 'Approved Leave', value: approvedLeaveCount, color: COLORS[1] },
        { name: 'Pending Leave', value: pendingLeaveCount, color: COLORS[2] }
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
                    data={stats.chartData.filter(entry => entry.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.chartData.filter(entry => entry.value > 0).map((entry, index) => (
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
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 md:pl-12 mt-8 md:mt-0">
              
              {/* Present Block */}
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

              {/* Approved Leave Block */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-50 border border-rose-100">
                <div className="p-3 bg-rose-500 rounded-lg text-white">
                  <CalendarX className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-rose-900 uppercase tracking-wide">Approved Leave</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-rose-700">{stats.approvedLeaveCount}</span>
                    <span className="text-rose-600 font-medium mb-1">({stats.approvedRatio}%)</span>
                  </div>
                </div>
              </div>

              {/* Pending Leave Block */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="p-3 bg-amber-500 rounded-lg text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 uppercase tracking-wide">Pending Leave</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-amber-700">{stats.pendingLeaveCount}</span>
                    <span className="text-amber-600 font-medium mb-1">({stats.pendingRatio}%)</span>
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