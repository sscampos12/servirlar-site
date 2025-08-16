'use server';

/**
 * @fileOverview Analyzes user reviews of service providers to identify areas for improvement.
 *
 * - analyzeUserReviews - A function that analyzes user reviews and provides feedback.
 * - AnalyzeUserReviewsInput - The input type for the analyzeUserReviews function.
 * - AnalyzeUserReviewsOutput - The return type for the analyzeUserreviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserReviewsInputSchema = z.object({
  reviews: z.array(z.string()).describe('An array of user review strings.'),
  serviceProviderName: z.string().describe('The name of the service provider.'),
});
export type AnalyzeUserReviewsInput = z.infer<typeof AnalyzeUserReviewsInputSchema>;

const AnalyzeUserReviewsOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback for the service provider based on the reviews.'),
});
export type AnalyzeUserReviewsOutput = z.infer<typeof AnalyzeUserReviewsOutputSchema>;

export async function analyzeUserReviews(input: AnalyzeUserReviewsInput): Promise<AnalyzeUserReviewsOutput> {
  return analyzeUserReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserReviewsPrompt',
  input: {schema: AnalyzeUserReviewsInputSchema},
  output: {schema: AnalyzeUserReviewsOutputSchema},
  prompt: `You are an AI assistant designed to analyze user reviews for service providers and provide constructive feedback for professional development.

  Analyze the following reviews for {{serviceProviderName}}:

  {{#each reviews}}
  - {{{this}}}
  {{/each}}

  Based on these reviews, provide specific and actionable feedback to {{serviceProviderName}} on areas where they can improve their services. Focus on common themes and recurring issues mentioned in the reviews. Be direct and honest, while encouraging them to improve.
  `,
});

const analyzeUserReviewsFlow = ai.defineFlow(
  {
    name: 'analyzeUserReviewsFlow',
    inputSchema: AnalyzeUserReviewsInputSchema,
    outputSchema: AnalyzeUserReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
