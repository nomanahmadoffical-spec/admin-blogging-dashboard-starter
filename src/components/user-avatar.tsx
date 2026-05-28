import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@supabase/supabase-js';

interface UserAvatarProps {
  user: User | null;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const fullName = user?.user_metadata?.full_name;
  const avatarUrl = user?.user_metadata?.avatar_url;
  const email = user?.email;

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl || ''} alt={fullName || email || ''} />
      <AvatarFallback className='rounded-lg'>
        {fullName?.slice(0, 2)?.toUpperCase() || email?.slice(0, 2)?.toUpperCase() || 'CN'}
      </AvatarFallback>
    </Avatar>
  );
}
