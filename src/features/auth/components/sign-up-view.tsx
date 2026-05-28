'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { InteractiveGridPattern } from './interactive-grid';

export default function SignUpViewPage({ stars }: { stars: number }) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    router.push('/dashboard/overview');
    router.refresh();
  };

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/auth/sign-in'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Sign In
      </Link>
      <div className='relative hidden h-full flex-col p-10 lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-sidebar' />
        <div className='text-sidebar-foreground relative z-20 flex items-center text-lg font-medium'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          Logo
        </div>
        <InteractiveGridPattern
          className={cn(
            'mask-[radial-gradient(400px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[0%] h-full skew-y-12'
          )}
        />
        <div className='text-sidebar-foreground relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;This starter template has saved me countless hours of work and helped me
              deliver projects to my clients faster than ever before.&rdquo;
            </p>
            <footer className='text-sidebar-foreground/70 text-sm'>Random Dude</footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <Link
            className={cn('group inline-flex hover:text-yellow-200')}
            target='_blank'
            href={'https://github.com/kiranism/next-shadcn-dashboard-starter'}
          >
            <div className='flex items-center'>
              <GitHubLogoIcon className='size-4' />
              <span className='ml-1 inline'>Star on GitHub</span>{' '}
            </div>
            <div className='ml-2 flex items-center gap-1 text-sm md:flex'>
              <Icons.exclusive
                className='size-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300'
                fill='currentColor'
              />
              <span className='font-display font-medium'>{stars}</span>
            </div>
          </Link>

          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                {error && (
                  <div className='bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-3 text-sm'>
                    <Icons.alertCircle className='h-4 w-4' />
                    {error}
                  </div>
                )}

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength={6}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>Confirm Password</Label>
                  <Input
                    id='confirmPassword'
                    type='password'
                    placeholder='••••••••'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength={6}
                  />
                </div>

                <Button type='submit' className='w-full' isLoading={isLoading}>
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className='text-muted-foreground space-y-2 px-8 text-center text-xs'>
            <p>
              This is an{' '}
              <Link href='/about' className='hover:text-primary underline underline-offset-4'>
                open-source project
              </Link>{' '}
              for demo purposes. Authentication is handled securely by Supabase.
            </p>
            <p>
              <Link
                href='https://github.com/kiranism/next-shadcn-dashboard-starter'
                target='_blank'
                className='hover:text-primary underline underline-offset-4'
              >
                View on GitHub
              </Link>
            </p>
          </div>

          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms-of-service'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy-policy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
