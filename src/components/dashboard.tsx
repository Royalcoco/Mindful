'use client';

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import SidebarContent from '@/components/sidebar-content';
import JournalEditor from '@/components/journal/journal-editor';
import { useAuth } from '@/hooks/use-auth';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (!user) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="bg-background">
        <Sidebar>
          <SidebarContent
            user={user}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </Sidebar>
        <SidebarInset>
          <main className="h-screen overflow-y-auto">
            <JournalEditor key={selectedDate.toDateString()} user={user} selectedDate={selectedDate} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
