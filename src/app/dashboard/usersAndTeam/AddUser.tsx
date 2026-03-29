// src/app/users/AddUser.tsx
'use client';

import { useState } from 'react';
import { Plus, Loader2, Copy, Check, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Zone, JOB_ROLES, ORG_ROLES } from '@/lib/Reusable-constants';

interface AddUserProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  onRefresh: () => void;
}

interface GeneratedCredentials {
  dashboardEmail?: string;
  dashboardPassword?: string;
  salesmanId?: string;
  salesmanPassword?: string;
  techId?: string;
  techPassword?: string;
  adminId?: string;
  adminPassword?: string;
}

export function AddUserDialog({ onSuccess, onError, onRefresh }: AddUserProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Credentials Success View State
  const [createdCredentials, setCreatedCredentials] = useState<GeneratedCredentials | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    orgRole: 'junior-executive',
    jobRole: [] as string[],
    region: Zone[0] || '',
    area: '',
    isDashboardUser: false,
    isSalesAppUser: false,
    isTechnicalRole: false,
    isAdminAppUser: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Map orgRole to the 'role' field to maintain backward compatibility with the users table schema
    const payload = {
      ...formData,
      role: formData.orgRole
    };

    try {
      const response = await fetch('/api/dashboardPagesAPI/users-and-team/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        let successMsg = `User ${formData.firstName} created successfully!`;
        if (formData.isDashboardUser || formData.isSalesAppUser || formData.isTechnicalRole || formData.isAdminAppUser) {
          successMsg += ` Credentials have been sent to ${formData.email}.`;
        } else {
          successMsg += ` No app access was granted.`;
        }

        onSuccess(successMsg);
        onRefresh();
        setOpen(false);
        resetForm();
      } else {
        onError(data.error || 'Failed to create user');
      }
    } catch (err) {
      onError('An error occurred during creation.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdCredentials) return;
    let text = "User Credentials:\n";
    if (createdCredentials.dashboardEmail) text += `\n[Web Dashboard]\nID: ${createdCredentials.dashboardEmail}\nPassword: ${createdCredentials.dashboardPassword}\n`;
    if (createdCredentials.salesmanId) text += `\n[Sales App]\nID: ${createdCredentials.salesmanId}\nPassword: ${createdCredentials.salesmanPassword}\n`;
    if (createdCredentials.techId) text += `\n[Technical App]\nID: ${createdCredentials.techId}\nPassword: ${createdCredentials.techPassword}\n`;
    if (createdCredentials.adminId) text += `\n[Admin App]\nID: ${createdCredentials.adminId}\nPassword: ${createdCredentials.adminPassword}\n`;

    navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setFormData({
      email: '', 
      firstName: '', 
      lastName: '', 
      phoneNumber: '',
      orgRole: 'junior-executive', 
      jobRole: [] as string[],
      region: Zone[0] || '', area: '',
      isDashboardUser: false, isSalesAppUser: false, isTechnicalRole: false, isAdminAppUser: false,
    });
  };

  const handleDone = () => {
    setOpen(false);
    onSuccess(`User ${formData.firstName} created successfully!`);
    onRefresh();
    // Delay resetting states so it doesn't flash during modal exit transition
    setTimeout(() => {
      resetForm();
      setCreatedCredentials(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setTimeout(() => {
          resetForm();
          setCreatedCredentials(null);
        }, 300);
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Configure the user's role and select which platforms they are allowed to access.
          </p>
        </DialogHeader>

        {createdCredentials ? (
          // --- SUCCESS CREDENTIALS VIEW ---
          <div className="space-y-4 py-4">
            <Alert className="bg-emerald-50 border-emerald-200 text-emerald-900">
              <KeyRound className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-emerald-800 font-bold">Success!</AlertTitle>
              <AlertDescription className="text-emerald-700">
                The user accounts have been created. Save these details.
              </AlertDescription>
            </Alert>

            <div className="bg-slate-50 border rounded-md p-4 space-y-4 font-mono text-sm max-h-[40vh] overflow-y-auto">
              {createdCredentials.dashboardEmail && (
                <div>
                  <h5 className="font-bold text-slate-700 border-b pb-1 mb-2">Web Dashboard</h5>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-500">Email/ID:</span>
                    <span className="font-bold text-slate-900">{createdCredentials.dashboardEmail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-bold text-blue-600">{createdCredentials.dashboardPassword}</span>
                  </div>
                </div>
              )}
              {createdCredentials.salesmanId && (
                <div>
                  <h5 className="font-bold text-slate-700 border-b pb-1 mb-2">Sales App</h5>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-500">Login ID:</span>
                    <span className="font-bold text-slate-900">{createdCredentials.salesmanId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-bold text-blue-600">{createdCredentials.salesmanPassword}</span>
                  </div>
                </div>
              )}
              {createdCredentials.techId && (
                <div>
                  <h5 className="font-bold text-slate-700 border-b pb-1 mb-2">Technical App</h5>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-500">Login ID:</span>
                    <span className="font-bold text-slate-900">{createdCredentials.techId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-bold text-blue-600">{createdCredentials.techPassword}</span>
                  </div>
                </div>
              )}
              {createdCredentials.adminId && (
                <div>
                  <h5 className="font-bold text-slate-700 border-b pb-1 mb-2">Admin App</h5>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-500">Login ID:</span>
                    <span className="font-bold text-slate-900">{createdCredentials.adminId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-bold text-blue-600">{createdCredentials.adminPassword}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <Button type="button" variant="outline" className="w-full gap-2 border-slate-300" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Credentials'}
              </Button>
              <Button type="button" className="w-full" onClick={handleDone}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          // --- FORM VIEW ---
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">

            {/* Identity Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-1">Identity Details</h4>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email" type="email" required placeholder="user@email.com"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName" required placeholder="First Name"
                    value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName" placeholder="Last Name" required
                    value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber" type="tel" placeholder="9999900000"
                  value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Role & Location Section */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-semibold border-b pb-1">Role & Territory</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Role</Label>
                  <Select value={formData.orgRole} onValueChange={(v) => setFormData({ ...formData, orgRole: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ORG_ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role.replace(/-/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="mb-2">Job Roles</Label>
                  <MultiSelect
                    options={JOB_ROLES.map(role => ({ label: role.replace(/-/g, ' '), value: role }))}
                    selectedValues={formData.jobRole}
                    onValueChange={(vals) => setFormData({ ...formData, jobRole: vals })}
                    placeholder="Select Job Roles..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Region (Zone)</Label>
                  <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Zone.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Area</Label>
                  <Input value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} placeholder="e.g. Central" />
                </div>
              </div>
            </div>

            {/* Access Control Section */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-semibold border-b pb-1 text-primary">Platform Access Permissions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md border">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="acc-dashboard"
                    checked={formData.isDashboardUser}
                    onCheckedChange={(c) => setFormData({ ...formData, isDashboardUser: !!c })}
                  />
                  <Label htmlFor="acc-dashboard" className="cursor-pointer">Web Dashboard Access</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="acc-sales"
                    checked={formData.isSalesAppUser}
                    onCheckedChange={(c) => setFormData({ ...formData, isSalesAppUser: !!c })}
                  />
                  <Label htmlFor="acc-sales" className="cursor-pointer">Sales App Access</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="acc-tech"
                    checked={formData.isTechnicalRole}
                    onCheckedChange={(c) => setFormData({ ...formData, isTechnicalRole: !!c })}
                  />
                  <Label htmlFor="acc-tech" className="cursor-pointer">Technical App Access</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="acc-admin"
                    checked={formData.isAdminAppUser}
                    onCheckedChange={(c) => setFormData({ ...formData, isAdminAppUser: !!c })}
                  />
                  <Label htmlFor="acc-admin" className="cursor-pointer">Admin App Access</Label>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create User & Send Invites'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}