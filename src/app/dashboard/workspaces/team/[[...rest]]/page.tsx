'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { teamInfoContent } from '@/config/infoconfig';

export default function TeamPage() {
  return (
    <PageContainer
      pageTitle='Team Management'
      pageDescription='Manage your workspace team, members, roles, security and more.'
      infoContent={teamInfoContent}
    >
      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>
            Team management features are not available in the Supabase auth version. This feature
            would require custom Supabase implementation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            To add team management with Supabase, you would need to create your own teams and
            memberships tables.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
