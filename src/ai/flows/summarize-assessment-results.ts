'use server';

/**
 * @fileOverview Summarizes PCOS risk assessment results in plain language.
 *
 * - summarizeAssessmentResults - A function that summarizes the assessment results.
 * - SummarizeAssessmentResultsInput - The input type for the summarizeAssessmentResults function.
 * - SummarizeAssessmentResultsOutput - The return type for the summarizeAssessmentResults function.
 */

import {ai, isAIEnabled} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAssessmentResultsInputSchema = z.object({
  assessmentResult: z.object({
    riskLabel: z.string().describe('The risk label (No Risk / Early / High).'),
    probability: z.number().describe('The probability of PCOS risk.'),
    featureImportance: z.record(z.number()).describe('A map of feature names to their importance in the prediction.'),
  }).describe('The PCOS risk assessment results.'),
  medicalHistory: z.string().optional().describe('The user medical history, if available'),
  lifestyleFactors: z.string().optional().describe('The user lifestyle factors, if available')
});
export type SummarizeAssessmentResultsInput = z.infer<typeof SummarizeAssessmentResultsInputSchema>;

const SummarizeAssessmentResultsOutputSchema = z.object({
  summary: z.string().describe('A plain language summary of the PCOS risk assessment results, including key factors influencing the prediction.'),
});
export type SummarizeAssessmentResultsOutput = z.infer<typeof SummarizeAssessmentResultsOutputSchema>;

let summarizeAssessmentResultsFlow: ((input: SummarizeAssessmentResultsInput) => Promise<SummarizeAssessmentResultsOutput>) | null = null;

if (isAIEnabled && ai) {
  const prompt = ai.definePrompt({
    name: 'summarizeAssessmentResultsPrompt',
    input: {schema: SummarizeAssessmentResultsInputSchema},
    output: {schema: SummarizeAssessmentResultsOutputSchema},
    prompt: `You are an AI assistant specializing in summarizing PCOS risk assessment results for users in plain language.

  Given the following assessment results and user information, provide a concise and easy-to-understand summary of the user's PCOS risk, highlighting the key factors that influenced the prediction.

  Assessment Result:
  Risk Label: {{{assessmentResult.riskLabel}}}
  Probability: {{{assessmentResult.probability}}}
  Feature Importance: {{#each assessmentResult.featureImportance}}{{{@key}}}: {{{this}}}, {{/each}}

  Medical History: {{{medicalHistory}}}
  Lifestyle Factors: {{{lifestyleFactors}}}

  Summary:
  `,
  });

  summarizeAssessmentResultsFlow = ai.defineFlow(
    {
      name: 'summarizeAssessmentResultsFlow',
      inputSchema: SummarizeAssessmentResultsInputSchema,
      outputSchema: SummarizeAssessmentResultsOutputSchema,
    },
    async input => {
      const {output} = await prompt(input);
      return output!;
    }
  );
}

export async function summarizeAssessmentResults(input: SummarizeAssessmentResultsInput): Promise<SummarizeAssessmentResultsOutput> {
  if (!isAIEnabled || !ai || !summarizeAssessmentResultsFlow) {
    throw new Error('AI is not enabled. Please set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.');
  }
  return summarizeAssessmentResultsFlow(input);
}
