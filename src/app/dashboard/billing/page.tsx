'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { billingInfoContent } from '@/config/infoconfig';

export default function BillingPage() {
  return (
    <PageContainer
      accessFallback={
        <div className='flex min-h-[400px] items-center justify-center'>
          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-semibold'>Please Sign In</h2>
            <p className='text-muted-foreground'>Please sign in to view billing information.</p>
          </div>
        </div>
      }
      infoContent={billingInfoContent}
      pageTitle='Billing & Plans'
      pageDescription='Manage your subscription and usage limits'
    >
      <div className='space-y-6'>
        <Alert>
          <Icons.info className='h-4 w-4' />
          <AlertDescription>
            Billing features are not available in the Supabase auth version. For production apps,
            you would integrate with Stripe or another payment provider.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Choose a plan that fits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              Billing integration would require Stripe or a similar payment provider setup.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
