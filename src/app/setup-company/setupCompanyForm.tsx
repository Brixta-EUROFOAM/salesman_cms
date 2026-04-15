// src/app/setup-company/setupCompanyForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, Briefcase, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Zone } from '@/lib/Reusable-constants';

export default function SetupCompanyForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    officeAddress: '',
    isHeadOffice: true,
    phoneNumber: '',
    region: '',
    area: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => { if (companyNameRef.current) companyNameRef.current.focus(); }, 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/setup-company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set up company. Please try again.');
      }
      toast.success("Workspace configured successfully! Welcome.");
      router.push('/home'); // Redirect to dashboard since they are now logged in
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred during setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      
      {/* LEFT PANE: Info w/ Deep Blue Theme */}
      <div className="flex-1 bg-slate-900 bg-linear-to-br from-slate-900 to-slate-950 text-white relative flex flex-col justify-between p-8 lg:p-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
            </Button>
          </Link>
        </div>

        <div className="relative z-10 max-w-3xl my-12 lg:my-0">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6">
            <Briefcase className="w-4 h-4" />
            <span>Workspace Initialization</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-slate-100">
            Setup Company & Start <br className="hidden md:block" /> Managing Field Ops.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            Register your organization to instantly deploy dynamic journey plans, manage dealer networks, and assign hierarchical roles across your regions.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg"><User className="w-5 h-5 text-blue-400" /></div>
              <div>
                <h3 className="font-semibold text-slate-200">Admin Privileges</h3>
                <p className="text-sm text-slate-400 mt-1">You will be designated as the Master Admin with full control.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg"><MapPin className="w-5 h-5 text-emerald-400" /></div>
              <div>
                <h3 className="font-semibold text-slate-200">Scale Territories</h3>
                <p className="text-sm text-slate-400 mt-1">Map out your initial Zone and Area to kickstart operations.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500 font-medium">
          <span suppressHydrationWarning>© {new Date().getFullYear()}</span> Made By Brixta.
        </div>
      </div>

      {/* RIGHT PANE: Setup Form */}
      <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0 bg-card flex flex-col justify-start p-8 sm:p-12 border-l border-border relative z-20 shadow-2xl lg:shadow-none h-screen overflow-y-auto custom-scrollbar">
        <div className="w-full space-y-6 pb-8">
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Create Organization</h2>
            <p className="text-muted-foreground text-sm">Fill in your corporate details to initialize the workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Admin Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2 text-primary">Administrator Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={formData.adminFirstName} onChange={(e) => setFormData({ ...formData, adminFirstName: e.target.value })} required className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={formData.adminLastName} onChange={(e) => setFormData({ ...formData, adminLastName: e.target.value })} required className="bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email (Login ID)</Label>
                <Input type="email" value={formData.adminEmail} onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })} required placeholder="admin@company.com" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={formData.adminPassword} onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })} required className="bg-background" />
              </div>
            </div>

            {/* Company Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold border-b pb-2 text-primary">Company Profile</h3>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input ref={companyNameRef} value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required placeholder="e.g., Acme Corp." className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label>Office Address</Label>
                <Textarea value={formData.officeAddress} onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })} required rows={2} className="bg-background resize-none" />
              </div>
              <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg border">
                <Checkbox id="isHeadOffice" checked={formData.isHeadOffice} onCheckedChange={(c) => setFormData({ ...formData, isHeadOffice: !!c })} />
                <Label htmlFor="isHeadOffice" className="text-sm font-medium cursor-pointer">Set as Corporate Head Office</Label>
              </div>
              <div className="space-y-2">
                <Label>Official Phone Number</Label>
                <Input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required placeholder="+91 9876543210" className="bg-background" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                
                {/* --- UPDATED REGION DROPDOWN --- */}
                <div className="space-y-2">
                  <Label>Initial Zone/Region</Label>
                  <Select 
                    value={formData.region} 
                    onValueChange={(v) => setFormData({ ...formData, region: v })} 
                    required
                  >
                    <SelectTrigger className="h-11 bg-background">
                      <SelectValue placeholder="Select Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {Zone.filter(z => z !== "All Zone").map(zone => (
                        <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Initial Area</Label>
                  <Input value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} required placeholder="e.g., Delhi NCR" className="h-11 bg-background" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold mt-4" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Company'}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}