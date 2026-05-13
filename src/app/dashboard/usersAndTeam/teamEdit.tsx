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
  zone?: string | null;
}

interface TeamEditProps {
  member: TeamMember;
  allTeamMembers: TeamMember[];
  currentUserRole: string | null;
  onSaveRole: (userId: number, newOrgRole: string, newJobRoles: string[]) => Promise<void>;
  onSaveMapping: (userId: number, reportsToId: number | null, managesIds: number[]) => Promise<void>;
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

// --- MAIN EXPORT COMPONENT ---
export default function TeamEditModal({
  member, allTeamMembers, currentUserRole, onSaveRole, onSaveMapping,
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
            </TabsList>

            <div className="mt-2 flex-1">
              <TabsContent value="role" className="m-0 h-full"><RoleTab member={member} currentUserRole={currentUserRole} onSave={onSaveRole} /></TabsContent>
              <TabsContent value="hierarchy" className="m-0 h-full"><HierarchyTab member={member} allTeamMembers={allTeamMembers} currentUserRole={currentUserRole} onSave={onSaveMapping} /></TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}