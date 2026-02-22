'use client';

import { useState } from 'react';
import { generateReflectionPrompts } from '@/ai/flows/generate-reflection-prompts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { Wand2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const THEMES = ['Gratitude', 'Challenges', 'Future Goals', 'Self-Discovery', 'Daily Wins'];

interface AIPromptsProps {
  onInsertPrompt: (prompt: string) => void;
}

export default function AIPrompts({ onInsertPrompt }: AIPromptsProps) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleThemeChange = (theme: string, checked: boolean) => {
    setSelectedThemes((prev) =>
      checked ? [...prev, theme] : prev.filter((t) => t !== theme)
    );
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setPrompts([]);
    try {
      const themesToUse = selectedThemes.length > 0 ? selectedThemes : ['General Introspection'];
      const result = await generateReflectionPrompts({ themes: themesToUse, numberOfPrompts: 3 });
      setPrompts(result.prompts);
    } catch (error) {
      toast({
        title: 'AI Error',
        description: 'Failed to generate prompts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Reflection Prompts
        </CardTitle>
        <CardDescription>
          Select themes to guide your reflection, or generate prompts for general introspection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="font-semibold">Themes</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {THEMES.map((theme) => (
                <div key={theme} className="flex items-center space-x-2">
                  <Checkbox
                    id={theme}
                    onCheckedChange={(checked) => handleThemeChange(theme, !!checked)}
                  />
                  <Label htmlFor={theme} className="text-sm font-normal">
                    {theme}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Generating...
              </>
            ) : (
              'Generate Prompts'
            )}
          </Button>
          {prompts.length > 0 && (
            <div className="space-y-2 pt-4">
               <Label className="font-semibold">Your Prompts</Label>
               <ScrollArea className="h-48">
                 <ul className="space-y-2 pr-4">
                  {prompts.map((prompt, index) => (
                    <li key={index}>
                      <button
                        onClick={() => onInsertPrompt(prompt)}
                        className="w-full rounded-md border bg-accent/20 p-3 text-left text-sm text-foreground transition-colors hover:bg-accent/40"
                      >
                        {prompt}
                      </button>
                    </li>
                  ))}
                </ul>
               </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
