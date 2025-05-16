'use server';

/**
 * @fileOverview Gemini AI chat response generator flow.
 *
 * - generateChatResponse - A function that generates chat responses using the Gemini AI model.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatResponseInputSchema = z.object({
  message: z.string().describe('The user message to generate a response for.'),
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;

const GenerateChatResponseOutputSchema = z.object({
  response: z.string().describe('The generated chat response from Gemini AI.'),
});
export type GenerateChatResponseOutput = z.infer<typeof GenerateChatResponseOutputSchema>;

export async function generateChatResponse(input: GenerateChatResponseInput): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const generateChatResponsePrompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: {schema: GenerateChatResponseInputSchema},
  output: {schema: GenerateChatResponseOutputSchema},
  prompt: `You are a helpful AI assistant. Respond to the following user message: {{{message}}}`,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async input => {
    const {output} = await generateChatResponsePrompt(input);
    return output!;
  }
);
