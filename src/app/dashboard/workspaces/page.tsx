'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { workspacesInfoContent } from '@/config/infoconfig';

export default function WorkspacesPage() {
  return (
    <PageContainer
      pageTitle='Workspaces'
      pageDescription='Manage your workspaces and switch between them'
      infoContent={workspacesInfoContent}
    >
      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            Organization features are not available in the Supabase auth version. This feature would
            require custom Supabase implementation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            To add organization support with Supabase, you would need to create your own
            organizations table and link it to users via a membership table.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
