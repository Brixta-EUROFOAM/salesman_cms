// src/app/dashboard/usersAndTeam/teamEdit.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, PencilIcon, StoreIcon, UsersIcon, ShieldCheck, Trash2
} from 'lucide-react';
import { toast } from 'sonner';

// Shared Components
import { MultiSelect } from '@/components/multi-select';
import { useDealerLocations } from '@/components/reusable-dealer-locations';
import { 
  canAssignRole, 
  getRoleWeight, 
  isSuperUser, 
  ORG_ROLE_WEIGHTS, 
  SUPER_USER_ROLES 
} from '@/lib/roleHierarchy';
import { JOB_ROLES } from '@/lib/Reusable-constants';

// --- TYPES ---
export interface TeamMember {
  id: number;
  name: string;
  orgRole: string; 
  jobRole?: string[] | null; 
  managedBy: string | null;
  manages: string;
  managedById: number | null;
  managesIds: number[];
  managesReports: { name: string; orgRole: string }[];
  area?: string | null;
  region?: string | null;
  isTechnicalRole: boolean;
}

interface TeamEditProps {
  member: TeamMember;
  allTeamMembers: TeamMember[];
  currentUserRole: string | null;
  onSaveRole: (userId: number, newOrgRole: string, newJobRoles: string[]) => Promise<void>;
  onSaveMapping: (userId: number, reportsToId: number | null, managesIds: number[]) => Promise<void>;
  onSaveDealerMapping: (userId: number, dealerIds: string[]) => Promise<void>;
  onSaveMasonMapping: (userId: number, masonIds: string[]) => Promise<void>;
}

const allRoles = [...SUPER_USER_ROLES, ...Object.keys(ORG_ROLE_WEIGHTS)];
const jobRoleOptions = JOB_ROLES.map(role => ({ value: role, label: role }));

// --- SUB-COMPONENTS FOR TABS ---

// 1. Role Tab
const RoleTab = ({ member, currentUserRole, onSave }: { member: TeamMember, currentUserRole: string | null, onSave: any }) => {
  const [newOrgRole, setNewOrgRole] = useState(member.orgRole);
  const [newJobRoles, setNewJobRoles] = useState<string[]>(member.jobRole || []);
  const [isSaving, setIsSaving] = useState(false);

  const assignableRoles = useMemo(() => {
    if (!currentUserRole) return [];
    return allRoles.filter((r) => canAssignRole(currentUserRole, r));
  }, [currentUserRole]);

  const rolesToShow = useMemo(() => {
    const set = new Set<string>();
    if (member.orgRole) set.add(member.orgRole);
    assignableRoles.forEach(r => set.add(r));
    return Array.from(set);
  }, [assignableRoles, member.orgRole]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(member.id, newOrgRole, newJobRoles);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = newOrgRole !== member.orgRole || JSON.stringify(newJobRoles) !== JSON.stringify(member.jobRole || []);

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        {/* Org Role */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Organization Role (Hierarchy)</label>
          <Select value={newOrgRole} onValueChange={setNewOrgRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select Organization Role" />
            </SelectTrigger>
            <SelectContent>
              {rolesToShow.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Dictates where the user sits in the reporting structure.</p>
        </div>

        {/* Job Roles */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Roles (Functional Responsibilities)</label>
          <MultiSelect
            options={jobRoleOptions}
            selectedValues={newJobRoles}
            onValueChange={setNewJobRoles}
            placeholder="Select Job Roles..."
          />
          <p className="text-xs text-muted-foreground">Dictates what tasks and dashboards the user can access.</p>
        </div>
      </div>

      <Button onClick={handleSave} disabled={!hasChanges || isSaving} className="w-full">
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Roles
      </Button>
    </div>
  );
};

// 2. Hierarchy Tab
const HierarchyTab = ({ member, allTeamMembers, currentUserRole, onSave }: { member: TeamMember, allTeamMembers: TeamMember[], currentUserRole: string | null, onSave: any }) => {
  const [newReportsToId, setNewReportsToId] = useState<number | null>(member.managedById);
  const [newManagesIds, setNewManagesIds] = useState<number[]>(member.managesIds ?? []);
  const [isSaving, setIsSaving] = useState(false);

  const targetWeight = getRoleWeight(member.orgRole);

  const managerOptions = useMemo(() => {
    return allTeamMembers
      .filter((m) => m.id !== member.id) 
      .filter((m) => isSuperUser(m.orgRole) || getRoleWeight(m.orgRole) > targetWeight) 
      .map((m) => ({ value: m.id.toString(), label: `${m.name} (${m.orgRole})` }));
  }, [allTeamMembers, member.id, targetWeight]);

  const juniorOptions = useMemo(() => {
    return allTeamMembers
      .filter((m) => m.id !== member.id) 
      .filter((m) => !isSuperUser(m.orgRole) && getRoleWeight(m.orgRole) < targetWeight) 
      .map((m) => ({ value: m.id.toString(), label: `${m.name} (${m.orgRole})` }));
  }, [allTeamMembers, member.id, targetWeight]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(member.id, newReportsToId, newManagesIds);
    } catch (error) {
      console.error("Failed to save hierarchy:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Reports To (Manager/Senior)</label>
        <Select
          value={newReportsToId?.toString() ?? 'none'}
          onValueChange={(val) => setNewReportsToId(val === 'none' ? null : Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {managerOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Manages (Subordinates)</label>
        <MultiSelect
          options={juniorOptions}
          selectedValues={newManagesIds.map(String)}
          onValueChange={(vals) => setNewManagesIds(vals.map(Number))}
          placeholder="Select Juniors..."
        />
      </div>
      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Hierarchy
      </Button>
    </div>
  );
};

// 3. Location Filter Helper Component
const LocationFilter = ({
  areas, regions, selectedArea, selectedRegion, onAreaChange, onRegionChange, onClear
}: any) => (
  <div className="flex flex-col md:flex-row gap-3 p-4 bg-muted/40 rounded-lg border border-border/50">
    <div className="flex-1 space-y-1">
      <label className="text-xs font-medium text-muted-foreground">Filter by Area</label>
      <Select value={selectedArea ?? "all"} onValueChange={(v) => onAreaChange(v === "all" ? null : v)}>
        <SelectTrigger className="w-full bg-background"><SelectValue placeholder="All Areas" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Areas</SelectItem>
          {areas.sort().map((a: string) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
    <div className="flex-1 space-y-1">
      <label className="text-xs font-medium text-muted-foreground">Filter by Region</label>
      <Select value={selectedRegion ?? "all"} onValueChange={(v) => onRegionChange(v === "all" ? null : v)}>
        <SelectTrigger className="w-full bg-background"><SelectValue placeholder="All Regions" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          {regions.sort().map((r: string) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
    <div className="flex items-end justify-end">
      <Button variant="outline" size="sm" onClick={onClear} disabled={!selectedArea && !selectedRegion} className="h-9">
        Clear
      </Button>
    </div>
  </div>
);

// 4. Dealer Tab
const DealerTab = ({ member, onSave }: { member: TeamMember, onSave: any }) => {
  const [selectedDealerIds, setSelectedDealerIds] = useState<string[]>([]);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { locations, loading: locLoading } = useDealerLocations();
  const [area, setArea] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  useEffect(() => {
    if (locLoading) return;
    (async () => {
      setLoading(true);
      try {
        const url = new URL(`/api/dashboardPagesAPI/users-and-team/team-overview/editDealerMapping`, window.location.origin);
        url.searchParams.append('userId', String(member.id));
        if (area) url.searchParams.append('area', area);
        if (region) url.searchParams.append('region', region);

        const res = await fetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          setOptions(data.dealers.map((d: any) => ({ value: d.id, label: d.name })));
          if (!area && !region) setSelectedDealerIds(data.assignedDealerIds ?? []);
        }
      } catch (e) { toast.error("Failed to load dealers"); }
      finally { setLoading(false); }
    })();
  }, [member.id, area, region, locLoading]);

  return (
    <div className="space-y-4 py-4 flex flex-col h-full">
      <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border border-primary/10">
        <h4 className="font-medium text-sm text-foreground">Dealer Assignment</h4>
        <Badge variant="default" className="text-sm px-3 py-1">
          Total Assigned: {selectedDealerIds.length}
        </Badge>
      </div>

      <LocationFilter
        areas={locations.areas} regions={locations.regions}
        selectedArea={area} selectedRegion={region}
        onAreaChange={setArea} onRegionChange={setRegion}
        onClear={() => { setArea(null); setRegion(null); }}
      />
      
      <div className="flex-1 min-h-[250px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground border rounded-lg border-dashed">
             <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading dealers...
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Select Dealers</label>
            <MultiSelect
              options={options}
              selectedValues={selectedDealerIds}
              onValueChange={setSelectedDealerIds}
              placeholder="Search and select dealers..."
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-auto">
        <Button
          variant="outline"
          onClick={() => setSelectedDealerIds([])}
          disabled={isSaving || selectedDealerIds.length === 0}
          className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Unassign All
        </Button>

        <Button
          onClick={async () => {
            setIsSaving(true);
            try { await onSave(member.id, selectedDealerIds); } 
            finally { setIsSaving(false); }
          }}
          disabled={isSaving}
          className="w-full flex-1"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Dealer Mapping
        </Button>
      </div>
    </div>
  );
};

// 5. Mason Tab
const MasonTab = ({ member, onSave }: { member: TeamMember, onSave: any }) => {
  if (!member.isTechnicalRole) return <div className="py-12 text-center text-muted-foreground flex flex-col items-center"><ShieldCheck className="w-12 h-12 mb-3 opacity-20"/>This user is not in a technical role.</div>;

  const [selectedMasonIds, setSelectedMasonIds] = useState<string[]>([]);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { locations, loading: locLoading } = useDealerLocations();
  const [area, setArea] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  useEffect(() => {
    if (locLoading) return;
    (async () => {
      setLoading(true);
      try {
        const url = new URL(`/api/dashboardPagesAPI/users-and-team/team-overview/editMasonMapping`, window.location.origin);
        url.searchParams.append('userId', String(member.id));
        if (area) url.searchParams.append('area', area);
        if (region) url.searchParams.append('region', region);

        const res = await fetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          setOptions(data.masons.map((m: any) => ({
            value: m.id,
            label: `${m.name} (${m.dealer?.name || 'No Dealer'})`
          })));
          if (!area && !region) setSelectedMasonIds(data.assignedMasonIds ?? []);
        }
      } catch (e) { toast.error("Failed to load masons"); }
      finally { setLoading(false); }
    })();
  }, [member.id, area, region, locLoading]);

  return (
    <div className="space-y-4 py-4 flex flex-col h-full">
      <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border border-primary/10">
        <h4 className="font-medium text-sm text-foreground">Mason Assignment</h4>
        <Badge variant="default" className="text-sm px-3 py-1">
          Total Assigned: {selectedMasonIds.length}
        </Badge>
      </div>

      <LocationFilter
        areas={locations.areas} regions={locations.regions}
        selectedArea={area} selectedRegion={region}
        onAreaChange={setArea} onRegionChange={setRegion}
        onClear={() => { setArea(null); setRegion(null); }}
      />
      
      <div className="flex-1 min-h-[250px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground border rounded-lg border-dashed">
             <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading masons...
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Select Masons</label>
            <MultiSelect
              options={options}
              selectedValues={selectedMasonIds}
              onValueChange={setSelectedMasonIds}
              placeholder="Search and select masons..."
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-auto">
        <Button
          variant="outline"
          onClick={() => setSelectedMasonIds([])}
          disabled={isSaving || selectedMasonIds.length === 0}
          className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Unassign All
        </Button>

        <Button
          onClick={async () => {
            setIsSaving(true);
            try { await onSave(member.id, selectedMasonIds); } 
            finally { setIsSaving(false); }
          }}
          disabled={isSaving}
          className="w-full flex-1"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Mason Mapping
        </Button>
      </div>
    </div>
  );
};

// --- MAIN EXPORT COMPONENT ---
export default function TeamEditModal({
  member, allTeamMembers, currentUserRole, onSaveRole, onSaveMapping, onSaveDealerMapping, onSaveMasonMapping
}: TeamEditProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUserRole) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 border-blue-500 hover:bg-blue-50"
        >
          <PencilIcon className="w-4 h-4 mr-2" />
          View & Edit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col overflow-hidden p-0">
        <div className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">Manage: {member.name}</DialogTitle>
          <DialogDescription className="mt-1">
            Current Org Role: <span className="font-semibold text-foreground">{member.orgRole}</span>
            {member.jobRole && member.jobRole.length > 0 && (
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">{member.jobRole.join(', ')}</span>
            )}
          </DialogDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          <Tabs defaultValue="role" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 sticky top-0 z-10">
              <TabsTrigger value="role" className="flex gap-2"><ShieldCheck className="w-4 h-4 hidden sm:block" /> Roles</TabsTrigger>
              <TabsTrigger value="hierarchy" className="flex gap-2"><UsersIcon className="w-4 h-4 hidden sm:block" /> Hierarchy</TabsTrigger>
              <TabsTrigger value="dealers" className="flex gap-2"><StoreIcon className="w-4 h-4 hidden sm:block" /> Dealers</TabsTrigger>
              <TabsTrigger value="masons" className="flex gap-2"><PencilIcon className="w-4 h-4 hidden sm:block" /> Masons</TabsTrigger>
            </TabsList>

            <div className="mt-2 flex-1">
              <TabsContent value="role" className="m-0 h-full"><RoleTab member={member} currentUserRole={currentUserRole} onSave={onSaveRole} /></TabsContent>
              <TabsContent value="hierarchy" className="m-0 h-full"><HierarchyTab member={member} allTeamMembers={allTeamMembers} currentUserRole={currentUserRole} onSave={onSaveMapping} /></TabsContent>
              <TabsContent value="dealers" className="m-0 h-full"><DealerTab member={member} onSave={onSaveDealerMapping} /></TabsContent>
              <TabsContent value="masons" className="m-0 h-full"><MasonTab member={member} onSave={onSaveMasonMapping} /></TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}