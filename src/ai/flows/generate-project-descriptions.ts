'use server';

/**
 * @fileOverview A flow to generate project descriptions from project images.
 *
 * - generateProjectDescriptions - A function that generates project descriptions based on uploaded images.
 * - GenerateProjectDescriptionsInput - The input type for the generateProjectDescriptions function.
 * - GenerateProjectDescriptionsOutput - The return type for the generateProjectDescriptions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProjectDescriptionsInputSchema = z.object({
  imageUris: z
    .array(z.string())
    .describe(
      'An array of project images, as data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.',
    ),
  numDescriptions: z
    .number()
    .min(1)
    .max(5)
    .default(3)
    .describe('The number of project descriptions to generate.'),
});
export type GenerateProjectDescriptionsInput = z.infer<
  typeof GenerateProjectDescriptionsInputSchema
>;

const GenerateProjectDescriptionsOutputSchema = z.object({
  descriptions: z.array(z.string()).describe('Generated project descriptions.'),
});
export type GenerateProjectDescriptionsOutput = z.infer<
  typeof GenerateProjectDescriptionsOutputSchema
>;

export async function generateProjectDescriptions(
  input: GenerateProjectDescriptionsInput,
): Promise<GenerateProjectDescriptionsOutput> {
  return generateProjectDescriptionsFlow(input);
}

const generateDescriptionsPrompt = ai.definePrompt({
  name: 'generateDescriptionsPrompt',
  input: { schema: GenerateProjectDescriptionsInputSchema },
  output: { schema: GenerateProjectDescriptionsOutputSchema },
  prompt: `You are a creative marketing expert. Generate {{{numDescriptions}}} project descriptions based on the following images. Focus on highlighting the key features and benefits of each project in a concise and compelling manner. Each description should be around 50-75 words.

{{#each imageUris}}
Image {{@index}}:
{{media url=this}}
{{/each}}`,
});

const generateProjectDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionsFlow',
    inputSchema: GenerateProjectDescriptionsInputSchema,
    outputSchema: GenerateProjectDescriptionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateDescriptionsPrompt(input);
    return output!;
  },
);
