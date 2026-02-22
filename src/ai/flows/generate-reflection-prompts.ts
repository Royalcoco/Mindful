'use server';
/**
 * @fileOverview A Genkit flow that generates personalized, thought-provoking reflection prompts based on customizable themes.
 *
 * - generateReflectionPrompts - A function that handles the generation of reflection prompts.
 * - GenerateReflectionPromptsInput - The input type for the generateReflectionPrompts function.
 * - GenerateReflectionPromptsOutput - The return type for the generateReflectionPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReflectionPromptsInputSchema = z.object({
  themes: z
    .array(z.string())
    .describe(
      'A list of themes or topics the user wants reflection prompts to be based on. e.g., gratitude, challenges, future goals.'
    ),
  numberOfPrompts: z
    .number()
    .optional()
    .default(3)
    .describe('The desired number of reflection prompts to generate.'),
});
export type GenerateReflectionPromptsInput = z.infer<
  typeof GenerateReflectionPromptsInputSchema
>;

const GenerateReflectionPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('A list of generated reflection prompts.'),
});
export type GenerateReflectionPromptsOutput = z.infer<
  typeof GenerateReflectionPromptsOutputSchema
>;

export async function generateReflectionPrompts(
  input: GenerateReflectionPromptsInput
): Promise<GenerateReflectionPromptsOutput> {
  return generateReflectionPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReflectionPromptsPrompt',
  input: {schema: GenerateReflectionPromptsInputSchema},
  output: {schema: GenerateReflectionPromptsOutputSchema},
  prompt: `You are an AI assistant that specializes in generating insightful and thought-provoking journal reflection prompts.

Generate {{numberOfPrompts}} unique reflection prompts based on the following themes:

{{#if themes}}
Themes: {{#each themes}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{else}}
Themes: General introspection, personal growth, daily experiences.
{{/if}}

Each prompt should be open-ended and encourage deep personal reflection. Present the prompts as a list.

Example Output:
{
  "prompts": [
    "What is one small thing you are grateful for today, and why did it stand out to you?",
    "Describe a challenge you faced recently. How did you respond, and what did you learn from it?",
    "If you could give your past self one piece of advice, what would it be and why?"
  ]
}`,
});

const generateReflectionPromptsFlow = ai.defineFlow(
  {
    name: 'generateReflectionPromptsFlow',
    inputSchema: GenerateReflectionPromptsInputSchema,
    outputSchema: GenerateReflectionPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
