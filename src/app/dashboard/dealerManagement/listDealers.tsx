// src/app/dashboard/dealerManagement/listDealers.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2, MapPin, ExternalLink } from 'lucide-react'; 

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Reusable Components
import { DataTableReusable } from '@/components/data-table-reusable';
import { RefreshDataButton } from '@/components/RefreshDataButton';
import { GlobalFilterBar } from '@/components/global-filter-bar'; 
import { useDebounce } from '@/hooks/use-debounce-search';
import { useDealerLocations } from '@/components/reusable-dealer-locations';

// 1. PERFECTLY ALIGNED SCHEMA
const dealerFrontendSchema = z.object({
  id: z.number(),
  dealerPartyName: z.string(),
  contactPersonName: z.string().nullable().optional(),
  contactPersonNumber: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  gstNo: z.string().nullable().optional(),
  panNo: z.string().nullable().optional(),
  zone: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  area: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  pinCode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  isVerified: z.boolean().nullable().optional(),
});

type DealerRecord = z.infer<typeof dealerFrontendSchema>;

const DEALER_LOCATIONS_API = `/api/dashboardPagesAPI/dealerManagement`;

export default function ListDealersPage() {
  const [dealers, setDealers] = useState<DealerRecord[]>([]);
  const [loadingDealers, setLoadingDealers] = useState(true);
  const [errorDealers, setErrorDealers] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealerToDeleteId, setDealerToDeleteId] = useState<number | null>(null);

  const [page, setPage] = useState(0);
  const [pageSize] = useState(500);
  const [totalCount, setTotalCount] = useState(0);

  // --- Standardized Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [zoneFilters, setZoneFilters] = useState<string[]>([]);
  const [areaFilters, setAreaFilters] = useState<string[]>([]);

  // --- Backend Filter Options ---
  const { locations, loading: locationsLoading, error: locationsError } = useDealerLocations();

  // Reset page on filter change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchQuery, zoneFilters, areaFilters]);

  const fetchDealers = useCallback(async () => {
    setLoadingDealers(true);
    setErrorDealers(null);
    try {
      const url = new URL(DEALER_LOCATIONS_API, window.location.origin);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('pageSize', pageSize.toString());

      if (debouncedSearchQuery) url.searchParams.append('search', debouncedSearchQuery);
      
      // Join arrays for multi-select
      if (areaFilters.length > 0) url.searchParams.append('area', areaFilters.join(','));
      if (zoneFilters.length > 0) url.searchParams.append('zone', zoneFilters.join(',')); // Changed 'region' to 'zone' to match DB

      url.searchParams.append('_t', Date.now().toString());

      const response = await fetch(url.toString(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch');

      const rawData = result.data || result; 
      setTotalCount(result.totalCount || 0);

      // Will confidently parse now
      const validatedDealers = z.array(dealerFrontendSchema).parse(rawData);
      setDealers(validatedDealers);
    } catch (e: any) {
      console.error('Failed to fetch dealers:', e);
      const msg = e instanceof z.ZodError
        ? 'Data validation failed. Schema mismatch with backend.'
        : (e.message || 'An unknown error occurred.');
      toast.error(`Failed to load dealers: ${msg}`);
      setErrorDealers(msg);
    } finally {
      setLoadingDealers(false);
    }
  }, [page, pageSize, debouncedSearchQuery, zoneFilters, areaFilters]);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  // --- Map raw string arrays to `{ label, value }` Options ---
  const zoneOptions = useMemo(() => (locations.zones || []).filter(Boolean).sort().map(r => ({ label: r, value: r })), [locations.zones]);
  const areaOptions = useMemo(() => (locations.areas || []).filter(Boolean).sort().map(a => ({ label: a, value: a })), [locations.areas]);

  const handleDelete = async () => {
    if (!dealerToDeleteId) return;
    try {
      const response = await fetch(`${DEALER_LOCATIONS_API}?id=${dealerToDeleteId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to delete dealer.');
      }
      toast.success('Dealer deleted successfully!');
      setIsDeleteDialogOpen(false);
      setDealerToDeleteId(null);
      fetchDealers();
    } catch (e: any) {
      console.error('Error deleting dealer:', e);
      toast.error(e.message || 'An unexpected error occurred.');
    }
  };

  const getGoogleMapsLink = (lat?: number | null, lng?: number | null) => {
    if (!lat || !lng) return null;
    return `http://googleusercontent.com/maps.google.com/?q=${lat},${lng}`;
  };

  // 2. PERFECTLY ALIGNED COLUMNS
  const dealerColumns: ColumnDef<DealerRecord>[] = [
    { accessorKey: 'dealerPartyName', header: 'Party / Business Name', cell: info => <span className="font-semibold text-[15px]">{info.getValue() as string}</span> },
    { accessorKey: 'contactPersonName', header: 'Contact Person', cell: info => info.getValue() || '-' },
    { accessorKey: 'contactPersonNumber', header: 'Phone No.', cell: info => info.getValue() || '-' },
    {
      header: 'Location',
      accessorKey: 'address', 
      cell: ({ row }) => {
        const { zone, area, latitude, longitude } = row.original;
        const mapLink = getGoogleMapsLink(latitude, longitude);

        return (
          <div className="flex flex-col min-w-[180px] text-xs space-y-1">
            <div className="flex items-center gap-1 font-semibold text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{zone || '-'} / {area || '-'}</span>
            </div>
            {mapLink ? (
              <a 
                href={mapLink} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1 text-blue-600 hover:underline w-fit"
              >
                <ExternalLink className="h-3 w-3" /> View on Map
              </a>
            ) : (
               <span className="text-gray-400 italic text-[10px]">No GPS Coords</span>
            )}
          </div>
        );
      }
    },
    { accessorKey: 'gstNo', header: 'GST Number', cell: info => info.getValue() || '-' },
    {
      accessorKey: 'isVerified',
      header: 'Status',
      cell: ({ row }) => {
        return row.original.isVerified 
          ? <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 shadow-none">Verified</Badge>
          : <Badge variant="secondary" className="shadow-none">Pending</Badge>;
      }
    },
    { accessorKey: 'createdAt', header: 'Added On', cell: info => new Date(info.getValue() as string).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
  ];

  if (loadingDealers && dealers.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading dealer data...</p>
      </div>
    );
  }
  
  if (errorDealers || locationsError) {
    return <div className="text-center text-red-500 min-h-screen pt-10">Error: {errorDealers || locationsError}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-[100vw] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Manage Dealers</h1>
          <Badge variant="outline" className="text-base px-4 py-1">
            Total Dealers: {totalCount}
          </Badge>
        </div>
        <RefreshDataButton 
          cachePrefix="dealers" 
          onRefresh={fetchDealers} 
        />
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>This action cannot be undone. This will permanently delete the dealer record.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Unified Global Filter Bar --- */}
      <div className="w-full mb-6 relative z-50">
        <GlobalFilterBar 
          showSearch={true}
          showRole={false} // Removed because "type" doesn't exist
          showZone={true}
          showArea={true}
          showDateRange={false}
          showStatus={false}

          searchVal={searchQuery}
          zoneVals={zoneFilters}
          areaVals={areaFilters}

          zoneOptions={zoneOptions}
          areaOptions={areaOptions}

          onSearchChange={setSearchQuery}
          onZoneChange={setZoneFilters}
          onAreaChange={setAreaFilters}
        />
      </div>

      {dealers.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 bg-muted/20 rounded-lg">No dealers found matching the selected filters.</div>
      ) : (
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden p-1 relative z-0">
          <DataTableReusable
            columns={dealerColumns}
            data={dealers}
            enableRowDragging={false}
            onRowOrderChange={() => { }}
          />
        </div>
      )}
    </div>
  );
}