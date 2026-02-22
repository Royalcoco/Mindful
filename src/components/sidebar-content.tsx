'use client';

import type { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';

import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarHeader,
  SidebarContent as SidebarContentArea,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Logo from '@/components/logo';
import { Separator } from './ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface SidebarContentProps {
  user: User;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function SidebarContent({ user, selectedDate, onDateChange }: SidebarContentProps) {
  const router = useRouter();
  const avatarPlaceholder = PlaceHolderImages.find(img => img.id === 'user-avatar');

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <>
      <SidebarHeader>
        <div className="p-2">
          <Logo />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContentArea className="p-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          className="rounded-md border"
        />
      </SidebarContentArea>
      <Separator />
      <SidebarFooter>
        <div className="flex items-center gap-3 p-4">
          <Avatar>
            {avatarPlaceholder && (
               <AvatarImage src={avatarPlaceholder.imageUrl} alt="User Avatar" data-ai-hint={avatarPlaceholder.imageHint} />
            )}
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user.displayName || user.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
