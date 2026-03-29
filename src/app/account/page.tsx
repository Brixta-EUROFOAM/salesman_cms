// src/app/account/page.tsx
'use client';

//import * as React from 'react';
import { useRouter } from 'next/navigation';
//import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
//import { cn } from '@/lib/utils';
//import { MessageSquareText } from 'lucide-react'; 

export default function AccountPage() {
  const router = useRouter();

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8 text-foreground">
      <div className="w-full max-w-4xl mx-auto space-y-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Account Overview</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Quick access to manage your personal settings and communicate with support.
          </p>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            TO BE IMPLEMENTED
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Card for "Account Settings" */}
          {/* <Card
            className={cn(
              "bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer", 
            )}
            onClick={() => handleCardClick('/account/settings')}
          >
            
            <CardHeader className="p-0 mb-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto"> 
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold text-card-foreground mb-2">Account Settings</CardTitle>
              <CardDescription className="text-muted-foreground text-base leading-relaxed">
                Manage your profile details, change your password, and set your personal preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
            </CardContent>
          </Card> */}

          {/* Add more cards here following the same pattern */}
        </div>
      </div>
    </div>
  );
}