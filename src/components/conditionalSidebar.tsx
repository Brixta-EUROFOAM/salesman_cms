// src/components/conditionalSidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';

interface ConditionalSidebarProps {
  children: React.ReactNode;
}

interface CurrentUser {
  id: number;
  role: string; // Now 'Admin', 'manager', etc.
  permissions: string[]; // ['READ', 'WRITE', 'UPDATE']
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
}

export function ConditionalSidebar({ children }: ConditionalSidebarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // MOVE this to the top so we can use it inside the useEffect
  const hideSidebar = pathname === '/' 
                    || pathname === '/home' // keep for layout formatting
                    || pathname === '/dashboard' // keep for layout formatting
                    || pathname.startsWith('/auth')
                    || pathname.startsWith('/setup-company')
                    || pathname.startsWith('/login'); 

  useEffect(() => {
    // STOP the fetch if we are on a public/logged-out page
    if (hideSidebar) {
      setLoading(false);
      return;
    }

  // Fetch current user role using existing users API with query param
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/me', { cache: 'no-store' }); 
        if (response.ok) {
          const sessionData = await response.json();
          
          // Map the session data directly to your state
          setCurrentUser({
            id: sessionData.userId,
            role: sessionData.orgRole,
            permissions: sessionData.permissions || [],
            firstName: sessionData.firstName || '',
            lastName: sessionData.lastName || '',
            email: sessionData.email || '',
            companyName: sessionData.companyName || ''
          });
        } else {
          console.error('Failed to fetch current user:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [hideSidebar]);

  // Return early if sidebar is hidden
  if (hideSidebar) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="w-64 bg-sidebar border-r">
          <div className="p-4">Loading...</div>
        </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <AppSidebar 
        userRole={currentUser?.role || 'junior-executive'} 
        permissions={currentUser?.permissions || []}
      />
      <main className="flex-1 w-full">
        {children}
      </main>
    </SidebarProvider>
  );
}