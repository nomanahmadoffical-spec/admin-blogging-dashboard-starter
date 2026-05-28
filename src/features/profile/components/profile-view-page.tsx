'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserAvatar } from '@/components/user-avatar';
import { Icons } from '@/components/icons';
import type { User } from '@supabase/supabase-js';

export default function ProfileViewPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
      setFullName(user?.user_metadata?.full_name || '');
      setIsLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
    }

    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className='flex w-full flex-col p-4'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 w-32 bg-muted rounded' />
          <div className='h-64 w-full bg-muted rounded' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col p-4 gap-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
        <p className='text-muted-foreground'>Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className='space-y-6'>
            <div className='flex items-center gap-4'>
              {user && <UserAvatar user={user} className='h-20 w-20' />}
              <div>
                <p className='text-sm font-medium'>Avatar</p>
                <p className='text-muted-foreground text-xs'>
                  Avatar is managed through your auth provider
                </p>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' value={user?.email || ''} disabled />
              <p className='text-muted-foreground text-xs'>Email cannot be changed</p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='fullName'>Full Name</Label>
              <Input
                id='fullName'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder='Enter your full name'
              />
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {message.type === 'success' ? (
                  <Icons.check className='h-4 w-4' />
                ) : (
                  <Icons.alertCircle className='h-4 w-4' />
                )}
                {message.text}
              </div>
            )}

            <Button type='submit' isLoading={isUpdating}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium'>Password</p>
              <p className='text-muted-foreground text-sm'>Update your password</p>
            </div>
            <Button variant='outline'>Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
