// src/app/dashboard/adminAppReports/tabsLoader.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SalesReportPage from './sales_report';
import FinanceReportPage from './finance_report';
import AccountsReportPage from './accounts_report';
import HrReportPage from './hr_report';
import LogisticsReportPage from './logistics_report';
import PurchaseReportPage from './purchase_report';
import ProcessQualityReportPage from './processQuality_report';
import OutstandingReportPage from './outstanding_report';
import CollectionReportPage from './collection_report';

interface AdminAppReportsTabsProps {
    hasAccess: boolean;
}

export function AdminAppReportsTabs({ hasAccess }: AdminAppReportsTabsProps) {
    // If the user doesn't have access, we return null (though your page.tsx already catches this)
    if (!hasAccess) return null;

    return (
        <Tabs defaultValue="sales" className="space-y-4">
            {/* flex-wrap and h-auto ensure the 9 tabs don't overflow the screen on smaller displays */}
            <TabsList className="flex flex-wrap h-auto justify-start gap-1">
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="collection">Collection</TabsTrigger>
                <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="hr">HR</TabsTrigger>
                <TabsTrigger value="logistics">Logistics</TabsTrigger>
                <TabsTrigger value="purchase">Purchase</TabsTrigger>
                <TabsTrigger value="process">Process & Quality</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-4">
                <SalesReportPage />
            </TabsContent>

            <TabsContent value="collection" className="space-y-4">
                <CollectionReportPage />
            </TabsContent>

            <TabsContent value="outstanding" className="space-y-4">
                <OutstandingReportPage />
            </TabsContent>

            <TabsContent value="finance" className="space-y-4">
                <FinanceReportPage />
            </TabsContent>

            <TabsContent value="accounts" className="space-y-4">
                <AccountsReportPage />
            </TabsContent>

            <TabsContent value="hr" className="space-y-4">
                <HrReportPage />
            </TabsContent>

            <TabsContent value="logistics" className="space-y-4">
                <LogisticsReportPage />
            </TabsContent>

            <TabsContent value="purchase" className="space-y-4">
                <PurchaseReportPage />
            </TabsContent>

            <TabsContent value="process" className="space-y-4">
                <ProcessQualityReportPage />
            </TabsContent>
        </Tabs>
    );
}