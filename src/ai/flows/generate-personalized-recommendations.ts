'use server';

/**
 * @fileOverview Generates personalized lifestyle recommendations based on PCOS risk assessment and profile data.
 *
 * - generatePersonalizedRecommendations - A function that generates personalized lifestyle recommendations.
 * - PersonalizedRecommendationsInput - The input type for the generatePersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the generatePersonalizedRecommendations function.
 */

import {ai, isAIEnabled} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  pcosRiskAssessmentResult: z.string().describe('The result of the PCOS risk assessment (e.g., No Risk, Early, High).'),
  age: z.number().describe('The age of the user.'),
  height: z.number().describe('The height of the user in cm.'),
  weight: z.number().describe('The weight of the user in kg.'),
  medicalHistory: z.string().describe('The medical history of the user.'),
  lifestyle: z.string().describe('The lifestyle information of the user.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  dietRecommendations: z.string().describe('Personalized diet recommendations for the user.'),
  exerciseSuggestions: z.string().describe('Personalized exercise suggestions for the user.'),
  stressManagementTechniques: z.string().describe('Personalized stress management techniques for the user.'),
  followUpSuggestions: z.string().describe('Suggestions for when to consult a doctor and recommended tests.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

let generatePersonalizedRecommendationsFlow: ((input: PersonalizedRecommendationsInput) => Promise<PersonalizedRecommendationsOutput>) | null = null;

if (isAIEnabled && ai) {
  const prompt = ai.definePrompt({
    name: 'personalizedRecommendationsPrompt',
    input: {schema: PersonalizedRecommendationsInputSchema},
    output: {schema: PersonalizedRecommendationsOutputSchema},
    prompt: `You are an AI assistant specialized in providing personalized lifestyle recommendations for women with or at risk of PCOS.

  Based on the user's PCOS risk assessment result, age, height, weight, medical history and lifestyle information, generate personalized recommendations for diet, exercise, stress management, and follow-up actions.

  PCOS Risk Assessment Result: {{{pcosRiskAssessmentResult}}}
  Age: {{{age}}} years
  Height: {{{height}}} cm
  Weight: {{{weight}}} kg
  Medical History: {{{medicalHistory}}}
  Lifestyle: {{{lifestyle}}}

  Provide the recommendations in a clear and actionable format.

  Output the recommendations in the following JSON format:
  {
    "dietRecommendations": "...",
    "exerciseSuggestions": "...",
    "stressManagementTechniques": "...",
    "followUpSuggestions": "..."
  }`,
  });

  generatePersonalizedRecommendationsFlow = ai.defineFlow(
    {
      name: 'generatePersonalizedRecommendationsFlow',
      inputSchema: PersonalizedRecommendationsInputSchema,
      outputSchema: PersonalizedRecommendationsOutputSchema,
    },
    async input => {
      const {output} = await prompt(input);
      return output!;
    }
  );
}

export async function generatePersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  if (!isAIEnabled || !ai || !generatePersonalizedRecommendationsFlow) {
    throw new Error('AI is not enabled. Please set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.');
  }
  return generatePersonalizedRecommendationsFlow(input);
}
