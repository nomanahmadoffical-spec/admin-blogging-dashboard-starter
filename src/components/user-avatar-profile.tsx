import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@supabase/supabase-js';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: User | null;
}

export function UserAvatarProfile({ className, showInfo = false, user }: UserAvatarProfileProps) {
  const fullName = user?.user_metadata?.full_name;
  const avatarUrl = user?.user_metadata?.avatar_url;
  const email = user?.email;

  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={avatarUrl || ''} alt={fullName || ''} />
        <AvatarFallback className='rounded-lg'>
          {fullName?.slice(0, 2)?.toUpperCase() || email?.slice(0, 2)?.toUpperCase() || 'CN'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{fullName || ''}</span>
          <span className='truncate text-xs'>{email || ''}</span>
        </div>
      )}
    </div>
  );
}
