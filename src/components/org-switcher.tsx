'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import type { User } from '@supabase/supabase-js';

export function OrgSwitcher() {
  const { isMobile, state } = useSidebar();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const fullName = user?.user_metadata?.full_name;
  const email = user?.email;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          onClick={() => router.push('/dashboard/profile')}
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg'>
            <Icons.logo className='size-4' />
          </div>
          <div
            className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${
              state === 'collapsed'
                ? 'invisible max-w-0 overflow-hidden opacity-0'
                : 'visible max-w-full opacity-100'
            }`}
          >
            <span className='truncate font-medium'>{fullName || 'User'}</span>
            <span className='text-muted-foreground truncate text-xs'>{email || 'No email'}</span>
          </div>
          <Icons.chevronsUpDown
            className={`ml-auto transition-all duration-200 ease-in-out ${
              state === 'collapsed'
                ? 'invisible max-w-0 opacity-0'
                : 'visible max-w-full opacity-100'
            }`}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
