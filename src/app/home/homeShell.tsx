// src/app/home/homeShell.tsx
'use client';
import { usePathname } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface Company {
  id: number;
  companyName: string;
  adminUserId: string;
}

interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role?: string;
  company: Company;
}

interface HomeShellProps {
  user: User;
  company: Company;
  children: React.ReactNode;
  role?: string;
  permissions?: string[];
  jobRoles?: string[];
}

export default function HomeShell({
  children,
  role,
  company,
  permissions = [],
  jobRoles = [],
}: HomeShellProps) {
  const pathname = usePathname();
  
  // Determine if we should hide the sidebar
  const isSheetsEditor = pathname.startsWith('/home/sheetsEditor');

  // If it's the sheets editor, return just the children (no sidebar, no header)
  if (isSheetsEditor) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        userRole={role || ''} 
        permissions={permissions}
        companyId={company.id} 
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
