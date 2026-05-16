// src/app/dashboard/permanentJourneyPlan/pjpVerify.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import {
  Loader2, Check, ChevronsUpDown, ClipboardCheck, Store
} from 'lucide-react';
import { DateRange } from "react-day-picker";

// Import standard components
import { DataTableReusable } from '@/components/data-table-reusable';
import { RefreshDataButton } from '@/components/RefreshDataButton';
import { GlobalFilterBar } from '@/components/global-filter-bar';
import { useDebounce } from '@/hooks/use-debounce-search'; 

// UI Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

// Fallback schema (assumes you have a base schema in drizzle/zodSchemas)
// If you don't, you can replace this with a standard z.object({...})
const verificationSchema = z.object({
  id: z.string(),
  planDate: z.string().or(z.date()),
  areaToBeVisited: z.string(),
  route: z.string().nullable().optional(),
  additionalVisitRemarks: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.string(),
  verificationStatus: z.string().nullable().optional(),
  dealerId: z.number().nullable().optional(),
  
  // Joined fields from backend route
  salesmanName: z.string().optional().catch("Unknown"),
  salesmanZone: z.string().nullable().optional(),
  salesmanArea: z.string().nullable().optional(),
  visitDealerName: z.string().nullable().optional(),
  createdByName: z.string().optional().catch("Unknown"),
});

type PermanentJourneyPlanVerification = z.infer<typeof verificationSchema>;
interface PJPModificationState extends PermanentJourneyPlanVerification { id: string; }

interface OptionItem {
  id: string;
  name: string;
  address?: string;
  area?: string;
}

const SearchableSelect = ({ options, value, onChange, placeholder, isLoading }: { options: OptionItem[], value: string, onChange: (id: string, address?: string) => void, placeholder: string, isLoading?: boolean }) => {
  const [open, setOpen] = useState(false);
  const selectedItem = options.find((item) => String(item.id) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between font-normal h-10 bg-background" disabled={isLoading}>
          {value === 'null' || !value ? placeholder : (selectedItem?.name || placeholder)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem value="none" onSelect={() => { onChange("null"); setOpen(false); }}>
                <Check className={cn("mr-2 h-4 w-4", value === "null" ? "opacity-100" : "opacity-0")} />
                -- Unassigned / Manual --
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    onChange(option.id, option.address);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", String(option.id) === value ? "opacity-100" : "opacity-0")} />
                  {option.name} {option.area ? `(${option.area})` : ''}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default function PJPVerifyPage() {
  const [pendingPJPs, setPendingPJPs] = useState<PermanentJourneyPlanVerification[]>([]);
  const [loading, setLoading] = useState(true);

  // Dependency Data
  const [allDealers, setAllDealers] = useState<OptionItem[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal/UI States
  const [isModificationDialogOpen, setIsModificationDialogOpen] = useState(false);
  const [pjpToModify, setPjpToModify] = useState<PJPModificationState | null>(null);
  const [isPatching, setIsPatching] = useState(false);
  const [selectedDealerId, setSelectedDealerId] = useState<string>('null');

  const API_BASE = `/api/dashboardPagesAPI/permanent-journey-plan`;
  const BULK_VERIFY = `/api/dashboardPagesAPI/permanent-journey-plan/pjp-verification/bulk-verify`;

  const fetchPendingPJPs = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE}/pjp-verification`, window.location.origin);
      url.searchParams.append('_t', Date.now().toString());

      const response = await fetch(url.toString(), { cache: 'no-store' });
      const data = await response.json();
      setPendingPJPs(z.array(verificationSchema).parse(data.plans || data));
    } catch (e: any) { toast.error("Error loading verification queue."); } finally { setLoading(false); }
  }, []);

  // Fetch Dealers for the Select dropdown
  const fetchDealers = useCallback(async () => {
    try {
      // Point this to your actual dealers endpoint if different
      const res = await fetch(`/api/dashboardPagesAPI/dealerManagement?pageSize=1000`);
      const data = await res.json();
      if (data.data) {
        setAllDealers(data.data.map((d: any) => ({ id: String(d.id), name: d.dealerPartyName, area: d.area, address: d.address })));
      }
    } catch (e) { console.error("Failed to fetch dealers", e); }
  }, []);

  useEffect(() => { 
    fetchPendingPJPs(); 
    fetchDealers();
  }, [fetchPendingPJPs, fetchDealers]);

  // Client Side Filtering
  const filteredPJPs = useMemo(() => {
    return pendingPJPs.filter(pjp => {
      const search = debouncedSearchQuery.toLowerCase();
      const matchesSearch = !search || 
        (pjp.salesmanName || '').toLowerCase().includes(search) ||
        pjp.areaToBeVisited.toLowerCase().includes(search);

      let matchesDate = true;
      if (dateRange?.from) {
        const planDate = new Date(pjp.planDate);
        const fromDate = new Date(dateRange.from);
        const toDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);

        planDate.setHours(0, 0, 0, 0);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = planDate >= fromDate && planDate <= toDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [pendingPJPs, debouncedSearchQuery, dateRange]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(new Set(filteredPJPs.map(p => p.id)));
    else setSelectedIds(new Set());
  };

  const handleBulkVerify = async () => {
    const idsToVerify = Array.from(selectedIds);
    if (idsToVerify.length === 0) return;

    setIsPatching(true);
    try {
      const res = await fetch(`${BULK_VERIFY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToVerify }),
      });

      if (res.ok) {
        toast.success(`${idsToVerify.length} plans verified!`);
        setSelectedIds(new Set());
        fetchPendingPJPs();
      }
    } catch (error) { toast.error("Bulk verification failed"); } finally { setIsPatching(false); }
  };

  const openModificationDialog = (pjp: PermanentJourneyPlanVerification) => {
    setPjpToModify({
      ...pjp,
      route: pjp.route ?? '',
      description: pjp.description ?? '',
      additionalVisitRemarks: pjp.additionalVisitRemarks ?? '',
    });
    setSelectedDealerId(pjp.dealerId ? String(pjp.dealerId) : 'null');
    setIsModificationDialogOpen(true);
  };

  const handlePatchPJP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pjpToModify) return;
    setIsPatching(true);
    try {
      const payload = {
        ...pjpToModify,
        dealerId: selectedDealerId === 'null' ? null : Number(selectedDealerId),
      };
      const res = await fetch(`${API_BASE}/pjp-verification/${pjpToModify.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Modification failed");
      toast.success("PJP Modified and Verified!");
      setIsModificationDialogOpen(false);
      fetchPendingPJPs();
    } catch (e: any) { toast.error(e.message); } finally { setIsPatching(false); }
  };

  const pjpVerificationColumns: ColumnDef<PermanentJourneyPlanVerification>[] = [
    { accessorKey: 'salesmanName', header: 'Salesman' },
    { accessorKey: 'planDate', header: 'Date' },
    { accessorKey: 'areaToBeVisited', header: 'Area' },
    {
      accessorKey: 'visitDealerName',
      header: 'Visiting',
      cell: ({ row }) => (
        <span className="font-bold">{row.original.visitDealerName || 'N/A'}</span>
      )
    },
    { accessorKey: 'salesmanZone', header: 'Zone' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="outline" size="sm" className="h-8 text-blue-600 border-blue-200" onClick={() => openModificationDialog(row.original)}>
          Review & Verify
        </Button>
      )
    },
    {
      id: 'select',
      header: () => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            onChange={selectAll}
            checked={selectedIds.size === filteredPJPs.length && filteredPJPs.length > 0}
            className="h-4 w-4 rounded border-slate-300 text-primary cursor-pointer"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={selectedIds.has(row.original.id)}
            onChange={() => toggleSelect(row.original.id)}
            className="h-4 w-4 rounded border-slate-300 text-primary cursor-pointer"
          />
        </div>
      ),
      size: 40,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground w-full">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">PJP Verification Queue</h2>
            <RefreshDataButton cachePrefix="pjp-verification" onRefresh={fetchPendingPJPs} />
          </div>
        </div>

        {/* BULK ACTION BAR */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                {selectedIds.size}
              </div>
              <div>
                <p className="text-amber-900 font-medium">Items Selected</p>
                <p className="text-xs text-amber-700">Bulk verify will approve these plans without modifications.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="text-amber-800 hover:bg-amber-100">Cancel</Button>
              <Button onClick={handleBulkVerify} disabled={isPatching} className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                {isPatching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />} Verify Selected PJPs
              </Button>
            </div>
          </div>
        )}

        <div className="w-full relative z-50">
          <GlobalFilterBar 
            showSearch={true} showRole={false} showZone={false} showArea={false} showDateRange={true} showStatus={false}
            searchVal={searchQuery} dateRangeVal={dateRange}
            onSearchChange={setSearchQuery} onDateRangeChange={setDateRange}
          />
        </div>

        <div className="bg-card p-1 rounded-lg border border-border shadow-sm relative z-0">
          {loading && pendingPJPs.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 gap-2">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="text-muted-foreground">Loading verification queue...</p>
            </div>
          ) : filteredPJPs.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No pending plans found matching the filters.</div>
          ) : (
            <DataTableReusable columns={pjpVerificationColumns} data={filteredPJPs} />
          )}
        </div>
      </div>

      {/* MODIFICATION DIALOG */}
      <Dialog open={isModificationDialogOpen} onOpenChange={setIsModificationDialogOpen}>
        <DialogContent className="sm:max-w-xl bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ClipboardCheck className="text-primary" /> Review & Link PJP</DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePatchPJP} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Store className="w-3 h-3" /> Link Dealer (Optional)</Label>
              <SearchableSelect
                options={allDealers}
                value={selectedDealerId}
                placeholder="Search Dealers..."
                onChange={(id, address) => {
                  setSelectedDealerId(id);
                  if (address) setPjpToModify(p => p ? { ...p, route: address } : null);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-xs">Plan Date</Label><Input type="date" value={typeof pjpToModify?.planDate === 'string' ? pjpToModify.planDate.split('T')[0] : ''} onChange={e => setPjpToModify(p => p ? { ...p, planDate: e.target.value } : null)} className="bg-muted/50" /></div>
              <div className="space-y-1"><Label className="text-xs">Route Address</Label><Input value={pjpToModify?.route ?? ''} onChange={e => setPjpToModify(p => p ? { ...p, route: e.target.value } : null)} className="bg-muted/50 text-xs font-mono" /></div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Salesman Description</Label>
              <div className="p-3 bg-secondary/30 rounded-md text-sm border italic text-muted-foreground">{pjpToModify?.description || 'No description provided.'}</div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Verification Remarks (Admin)</Label>
              <Textarea placeholder="Verification Remarks..." value={pjpToModify?.additionalVisitRemarks ?? ''} onChange={e => setPjpToModify(p => p ? { ...p, additionalVisitRemarks: e.target.value } : null)} className="bg-muted/50 h-20" />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModificationDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPatching}>
                {isPatching ? <Loader2 className="animate-spin mr-2" /> : null} Finalize & Verify
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}