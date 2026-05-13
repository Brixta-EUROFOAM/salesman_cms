// src/app/dashboard/dealerManagement/tabsLoader.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ListDealersPage from '@/app/dashboard/dealerManagement/listDealers';

interface DealerManagementTabsProps {
  canSeeListDealers: boolean;
}

export function DealerManagementTabs({
  canSeeListDealers,
}: DealerManagementTabsProps) {

  // Determine the default tab based on the first permission they have
  let defaultTab = "";
  if (canSeeListDealers) defaultTab = "ListDealers";

  return (
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList>
        {canSeeListDealers && (
          <TabsTrigger value="ListDealers">List Dealers</TabsTrigger>
        )}
      </TabsList>

      {/* --- Tab Content --- */}
      {canSeeListDealers && (
        <TabsContent value="ListDealers" className="space-y-4">
          <ListDealersPage />
        </TabsContent>
      )}
    </Tabs>
  );
}