// src/app/dashboard/permanentJourneyPlan/pjpList.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { z } from 'zod';
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Eye, MapPin, User, Calendar as CalendarIcon, ClipboardList, Loader2, Route
} from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Reusable Components
import { DataTableReusable } from '@/components/data-table-reusable';
import { RefreshDataButton } from '@/components/RefreshDataButton';
import { GlobalFilterBar } from '@/components/global-filter-bar'; 
import { useDebounce } from '@/hooks/use-debounce-search'; 

const pjpSchema = z.object({
  id: z.string(),
  planDate: z.string().or(z.date()),
  areaToBeVisited: z.string(),
  route: z.string().nullable().optional(),
  additionalVisitRemarks: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.string(),
  verificationStatus: z.string().nullable().optional(),
  
  // Joined fields from backend route
  salesmanName: z.string().optional().catch("Unknown"),
  visitDealerName: z.string().nullable().optional(),
  createdByName: z.string().optional().catch("Unknown"),
});

type PermanentJourneyPlan = z.infer<typeof pjpSchema>;

const InfoField = ({ label, value, icon: Icon, fullWidth = false }: { label: string, value: React.ReactNode, icon?: any, fullWidth?: boolean }) => (
  <div className={`flex flex-col space-y-1.5 ${fullWidth ? 'col-span-2' : ''}`}>
    <Label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1 tracking-wider">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </Label>
    <div className="text-sm font-medium p-2.5 bg-secondary/30 rounded-md border border-border/50 min-h-10 flex items-center">
      {value || <span className="text-muted-foreground italic text-xs">N/A</span>}
    </div>
  </div>
);

export default function PJPListPage() {
  const [pjps, setPjps] = useState<PermanentJourneyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Backend Meta
  const [page, setPage] = useState(0);
  const [pageSize] = useState(500);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Modal State
  const [selectedPjp, setSelectedPjp] = useState<PermanentJourneyPlan | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => { setPage(0); }, [debouncedSearchQuery, dateRange]);

  const fetchPjps = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`/api/dashboardPagesAPI/permanent-journey-plan`, window.location.origin);
      url.searchParams.append('verificationStatus', 'VERIFIED');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('pageSize', pageSize.toString());

      if (debouncedSearchQuery) url.searchParams.append('search', debouncedSearchQuery);
      
      if (dateRange?.from) url.searchParams.append('fromDate', format(dateRange.from, "yyyy-MM-dd"));
      if (dateRange?.to) {
        url.searchParams.append('toDate', format(dateRange.to, "yyyy-MM-dd"));
      } else if (dateRange?.from) {
        url.searchParams.append('toDate', format(dateRange.from, "yyyy-MM-dd"));
      }

      url.searchParams.append('_t', Date.now().toString());

      const response = await fetch(url.toString(), { cache: 'no-store' });
      const result = await response.json();
      const data: any[] = result.data || result;
      
      setTotalCount(result.totalCount || 0);
      setPjps(data.map((item: any) => ({ ...pjpSchema.parse(item), id: String(item.id) })));
    } catch (e: any) {
      setError(e.message);
      toast.error("Failed to load Permanent Journey Plans.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearchQuery, dateRange]);

  useEffect(() => { fetchPjps(); }, [fetchPjps]);

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysPlans = pjps.filter(p => {
      if (!p.planDate) return false;
      return new Date(p.planDate).toISOString().split('T')[0] === todayStr;
    });

    return {
      todayCount: todaysPlans.length,
      totalCount: totalCount, 
    };
  }, [pjps, totalCount]);

  const columns: ColumnDef<PermanentJourneyPlan>[] = [
    { accessorKey: "salesmanName", header: "Salesman" },
    { accessorKey: "planDate", header: "Planned Date" },
    { accessorKey: "areaToBeVisited", header: "Area" },
    {
      accessorKey: "visitDealerName",
      header: "Visiting",
      cell: ({ row }) => {
        const name = row.original.visitDealerName;
        return name ? <span className="font-medium text-sm">{name}</span> : <span className="text-muted-foreground">N/A</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === 'VERIFIED') return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 shadow-none">{status}</Badge>;
        if (status === 'COMPLETED') return <Badge variant="default" className="shadow-none">{status}</Badge>;
        return <Badge variant="secondary" className="shadow-none">{status}</Badge>;
      }
    },
    {
      id: "actions",
      header: "View",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => { setSelectedPjp(row.original); setIsViewModalOpen(true); }}>
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground w-full">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <h2 className="text-3xl font-bold tracking-tight">Verified PJPs</h2>
             <Badge variant="outline" className="text-base px-4 py-1">Total: {stats.totalCount}</Badge>
          </div>
          <RefreshDataButton cachePrefix="permanent-journey-plan" onRefresh={fetchPjps} />
        </div>

        {/* --- Summary Cards --- */}
        <div className="grid gap-4 md:grid-cols-2 lg:w-1/2">
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wide">Today's Verified Plans</CardTitle>
              <ClipboardList className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.todayCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">Active plans for {format(new Date(), "dd MMM, yyyy")}</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/20 border-dashed shadow-none flex flex-col justify-center items-center">
            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">Total Verified Records</span>
            <span className="text-4xl font-black text-foreground">{stats.totalCount}</span>
          </Card>
        </div>

        {/* --- Unified Global Filter Bar --- */}
        <div className="w-full">
          <GlobalFilterBar 
            showSearch={true} showRole={false} showZone={false} showArea={false} showDateRange={true} showStatus={false} 
            searchVal={searchQuery} dateRangeVal={dateRange}
            onSearchChange={setSearchQuery} onDateRangeChange={setDateRange}
          />
        </div>

        <div className="bg-card p-1 rounded-lg border shadow-sm">
          {loading && pjps.length === 0 ? (
             <div className="flex justify-center items-center h-64">
               <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
               <p className="text-muted-foreground">Loading PJPs...</p>
             </div>
          ) : pjps.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No Permanent Journey Plans found matching the selected filters.</div>
          ) : (
            <DataTableReusable columns={columns} data={pjps} enableRowDragging={false} onRowOrderChange={() => {}} />
          )}
        </div>
      </div>

      {/* --- Smart Details Modal --- */}
      {selectedPjp && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-background">
            <div className="px-6 py-4 border-b bg-muted/30 border-l-[6px] border-l-primary">
              <DialogTitle className="text-xl flex items-center justify-between">
                <span>PJP Details</span>
                <Badge className="text-xs uppercase">{selectedPjp.status}</Badge>
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1"><User className="w-3 h-3 text-primary" /> {selectedPjp.salesmanName}</span>
                <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3 text-primary" /> {selectedPjp.planDate.toString().split('T')[0]}</span>
              </DialogDescription>
            </div>

            <div className="p-6 space-y-6">
              <Card className="bg-primary/5 border-primary/10">
                <CardHeader className="p-3 border-b border-dashed">
                  <CardTitle className="text-xs uppercase flex items-center gap-2"><MapPin className="w-3 h-3" /> Visit Location</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  <InfoField label="Area" value={selectedPjp.areaToBeVisited} />
                  <InfoField label="Visiting Dealer" value={selectedPjp.visitDealerName} />
                  <InfoField label="Planned Route" value={selectedPjp.route} icon={Route} />
                </CardContent>
              </Card>

              {selectedPjp.description && (
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Salesman Description</Label>
                  <div className="p-3 bg-secondary/20 rounded-md text-sm italic border">"{selectedPjp.description}"</div>
                </div>
              )}

              {selectedPjp.additionalVisitRemarks && (
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase font-bold text-emerald-700">Verification Remarks (Admin)</Label>
                  <div className="p-3 bg-emerald-50 rounded-md text-sm border border-emerald-100 text-emerald-900">
                    {selectedPjp.additionalVisitRemarks}
                  </div>
                </div>
              )}

              <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Created By</p>
                  <p className="text-sm font-semibold">{selectedPjp.createdByName}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Verification Status</p>
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">{selectedPjp.verificationStatus}</Badge>
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 bg-muted/20 border-t">
              <Button onClick={() => setIsViewModalOpen(false)}>Close View</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}