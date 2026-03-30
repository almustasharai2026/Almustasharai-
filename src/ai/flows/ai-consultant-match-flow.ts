'use server';
/**
 * @fileOverview This file implements a Genkit flow for matching users with suitable legal consultants.
 *
 * - matchConsultants - A function that suggests legal consultants based on a user's legal issue description.
 * - ConsultantMatchInput - The input type for the matchConsultants function.
 * - ConsultantMatchOutput - The return type for the matchConsultants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConsultantOutputSchema = z.object({
  name: z.string().describe('The name of the legal consultant.'),
  specialty: z.string().describe('The primary specialty of the legal consultant.'),
  reasonForMatch: z
    .string()
    .describe('A brief explanation why this consultant is suitable for the user\'s legal issue.'),
});

const ConsultantMatchInputSchema = z.object({
  legalIssueDescription: z
    .string()
    .describe('A detailed description of the user\'s legal issue.'),
});
export type ConsultantMatchInput = z.infer<typeof ConsultantMatchInputSchema>;

const ConsultantMatchOutputSchema = z.object({
  consultants: z
    .array(ConsultantOutputSchema)
    .describe('An array of suggested legal consultants, each with a name, specialty, and reason for match.'),
});
export type ConsultantMatchOutput = z.infer<typeof ConsultantMatchOutputSchema>;

export async function matchConsultants(
  input: ConsultantMatchInput
): Promise<ConsultantMatchOutput> {
  return consultantMatchFlow(input);
}

const consultantMatchPrompt = ai.definePrompt({
  name: 'consultantMatchPrompt',
  input: {schema: ConsultantMatchInputSchema},
  output: {schema: ConsultantMatchOutputSchema},
  prompt: `You are an expert legal consultant matching system.
Your goal is to analyze a user's legal issue and suggest the most suitable legal consultants based on their expertise.
Provide up to 3 highly relevant consultants. For each consultant, include their name, primary specialty, and a concise reason explaining why they are a good match for the given legal issue.

Legal Issue Description: {{{legalIssueDescription}}}

Output your response in JSON format, strictly adhering to the ConsultantMatchOutputSchema. Do not include any additional text or formatting outside the JSON object.`,
});

const consultantMatchFlow = ai.defineFlow(
  {
    name: 'consultantMatchFlow',
    inputSchema: ConsultantMatchInputSchema,
    outputSchema: ConsultantMatchOutputSchema,
  },
  async input => {
    const {output} = await consultantMatchPrompt(input);
    return output!;
  }
);
