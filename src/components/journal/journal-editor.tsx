'use client';

import { useState, useEffect, useTransition } from 'react';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import AIPrompts from './ai-prompts';

interface JournalEditorProps {
  user: User;
  selectedDate: Date;
}

export default function JournalEditor({ user, selectedDate }: JournalEditorProps) {
  const [content, setContent] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useTransition();
  const { toast } = useToast();

  const getFormattedDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const docId = `${user.uid}_${getFormattedDate(selectedDate)}`;
  const journalDocRef = doc(db, 'journals', docId);

  useEffect(() => {
    const fetchEntry = async () => {
      setIsFetching(true);
      try {
        const docSnap = await getDoc(journalDocRef);
        if (docSnap.exists()) {
          setContent(docSnap.data().content);
        } else {
          setContent('');
        }
      } catch (error) {
        toast({
          title: 'Error fetching entry',
          description: 'Could not retrieve journal entry for this date.',
          variant: 'destructive',
        });
      } finally {
        setIsFetching(false);
      }
    };
    fetchEntry();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, user.uid]);

  const handleSave = () => {
    setIsSaving(async () => {
      try {
        await setDoc(journalDocRef, {
          content,
          userId: user.uid,
          date: Timestamp.fromDate(selectedDate),
          updatedAt: serverTimestamp(),
        }, { merge: true });
        toast({
          title: 'Entry Saved',
          description: 'Your thoughts are safe with us.',
        });
      } catch (error) {
        toast({
          title: 'Error Saving',
          description: 'Could not save your journal entry.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleInsertPrompt = (prompt: string) => {
    setContent(prev => `${prev}\n\n${prompt}\n`);
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {selectedDate.toDateString() === new Date().toDateString()
            ? "What's on your mind today?"
            : "A look back in time."}
        </p>
      </header>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isFetching ? (
            <div className="flex h-96 items-center justify-center rounded-lg border bg-card">
              <Spinner size="lg" />
            </div>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts here..."
              className="min-h-[60vh] rounded-lg border p-4 text-base shadow-sm"
              aria-label="Journal Entry"
            />
          )}
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Spinner size="sm" className="mr-2" />}
              {isSaving ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-1">
          <AIPrompts onInsertPrompt={handleInsertPrompt} />
        </div>
      </div>
    </div>
  );
}
