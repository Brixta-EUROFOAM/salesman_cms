// src/app/dashboard/ordersPayments/tabsLoader.tsx
'use client';

import React from 'react'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import SalesOrdersTable from './salesOrders';

// This component receives the permissions as props
// from the server component (page.tsx)
interface OrdersPaymentsTabsProps {
  canSeeSalesOrders: boolean;
}

export function OrdersPaymentsTabs({ 
  canSeeSalesOrders,
}: OrdersPaymentsTabsProps) {

  // 1. State to track hydration completion
  const [isClient, setIsClient] = React.useState(false);
  const searchParams = useSearchParams();

  // 2. Set the client state after mounting
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Determine the default tab based on URL params first, then permissions
  const defaultTab = React.useMemo(() => {
    const requestedTab = searchParams.get('tab');
    
    // Map URL friendly strings to your exact TabsTrigger values
    let mappedTab = "";
    if (requestedTab === 'salesOrders') mappedTab = 'salesOrderReport';
    // Add more mappings here if you add deep-links for other tabs in the future
    
    // Prioritize the requested tab if the user has permission
    if (mappedTab === 'salesOrderReport' && canSeeSalesOrders) return 'salesOrderReport';

    if (canSeeSalesOrders) return "salesOrderReport";
    return ""; // Should not happen if canSeeAnyReport is checked in parent
  }, [searchParams, canSeeSalesOrders,]);


  // 3. Prevent rendering the component that generates unstable IDs during SSR
  if (!isClient) {
    // Render a safe, placeholder div during SSR/Hydration
    // This allows the browser to show *something* quickly without triggering the mismatch.
    return <div className="min-h-[300px] w-full flex items-center justify-center text-muted-foreground">
      Loading Reports UI...
    </div>;
  }

  // 4. Render the full component only on the client
  return (
    // Note: We use the memoized defaultTab value
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList>
        {canSeeSalesOrders && (
          <TabsTrigger value="salesOrderReport">Sales Orders</TabsTrigger>
        )}
      </TabsList>

      {/* --- Tab Content --- */}
      {canSeeSalesOrders && (
        <TabsContent value="salesOrderReport" className="space-y-4">
          <SalesOrdersTable />
        </TabsContent>
      )}
    </Tabs>
  );
}