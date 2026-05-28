'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ExclusivePage() {
  return (
    <PageContainer>
      <div className='space-y-6'>
        <div>
          <h1 className='flex items-center gap-2 text-3xl font-bold tracking-tight'>
            <Icons.badgeCheck className='h-7 w-7 text-green-600' />
            Exclusive Area
          </h1>
          <p className='text-muted-foreground'>
            Welcome to the exclusive area! This page contains features for Pro users.
          </p>
        </div>
        <Alert>
          <Icons.info className='h-4 w-4' />
          <AlertDescription>
            Plan-based access control is not available in the Supabase auth version. This feature
            would require custom implementation with your own user plans table.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Exclusive Content</CardTitle>
            <CardDescription>This is exclusive content for Pro plan users.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-lg'>Have a wonderful day!</div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
