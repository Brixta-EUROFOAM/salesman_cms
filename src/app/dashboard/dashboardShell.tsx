// src/app/dashboard/dashboardShell.tsx
'use client';

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface User {
  id: number;
  email: string;
  username: string | null;
  role?: string;
}

interface DashboardShellProps {
  user: User;
  children: React.ReactNode;
  role?: string;
  permissions?: string[];
  jobRoles?: string[];
}

export default function DashboardShell({ 
  children, 
  role,
  permissions = [],
  jobRoles = [],
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar 
        userRole={role || ''} 
        permissions={permissions} 
        jobRoles={jobRoles} 
      />
      <SidebarInset className="pl-4 pt-4 md:pl-6 md:pt-6">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2 @container/main">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}