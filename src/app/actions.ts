'use server'

import { summarizeAssessmentResults, SummarizeAssessmentResultsInput } from '@/ai/flows/summarize-assessment-results';
import { generatePersonalizedRecommendations, PersonalizedRecommendationsInput } from '@/ai/flows/generate-personalized-recommendations';
import { isAIEnabled } from '@/ai/genkit';

// Fallback summary generator
function generateFallbackSummary(input: SummarizeAssessmentResultsInput) {
    const { riskLabel, probability } = input.assessmentResult;
    const topFeatures = Object.entries(input.assessmentResult.featureImportance || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name]) => name);

    return {
        summary: `Based on your assessment, you have a ${riskLabel} risk level (${(probability * 100).toFixed(0)}% probability). The key factors influencing this assessment include ${topFeatures.join(', ')}. ${input.medicalHistory ? `Your medical history: ${input.medicalHistory}.` : ''} ${input.lifestyleFactors ? `Lifestyle factors: ${input.lifestyleFactors}.` : ''} Please consult with a healthcare professional for a formal diagnosis and personalized treatment plan.`
    };
}

// Fallback recommendations generator
function generateFallbackRecommendations(input: PersonalizedRecommendationsInput) {
    const isHighRisk = input.pcosRiskAssessmentResult.toLowerCase().includes('high');
    const bmi = input.weight / Math.pow(input.height / 100, 2);

    return {
        dietRecommendations: isHighRisk
            ? `Focus on a balanced diet rich in whole foods, lean proteins, and complex carbohydrates. Consider reducing processed foods and added sugars. Aim for regular meals to help manage insulin levels. Include plenty of fiber from vegetables, fruits, and whole grains.`
            : `Maintain a balanced diet with a variety of nutrients. Include lean proteins, whole grains, fruits, and vegetables. Stay hydrated and limit processed foods.`,
        exerciseSuggestions: isHighRisk
            ? `Aim for at least 150 minutes of moderate-intensity exercise per week. Include a mix of cardiovascular activities (walking, cycling, swimming) and strength training. Start gradually if you're new to exercise, and consult with a healthcare provider before beginning a new routine.`
            : `Regular physical activity is important for overall health. Aim for at least 30 minutes of moderate exercise most days of the week. Find activities you enjoy to maintain consistency.`,
        stressManagementTechniques: `Practice stress-reduction techniques such as deep breathing, meditation, or yoga. Ensure adequate sleep (7-9 hours per night). Consider talking to a therapist or counselor if stress is significantly impacting your life. Maintain social connections and engage in hobbies you enjoy.`,
        followUpSuggestions: isHighRisk
            ? `Schedule an appointment with a healthcare provider, preferably a gynecologist or endocrinologist, within the next 2-4 weeks. They may recommend blood tests (hormone levels, glucose, lipid panel) and possibly an ultrasound. Keep a symptom diary to share with your doctor.`
            : `Continue monitoring your health and maintain regular check-ups with your healthcare provider. If you notice any changes in your menstrual cycle or new symptoms, consult a doctor promptly.`
    };
}

export async function getAssessmentSummary(input: SummarizeAssessmentResultsInput) {
    try {
        if (!isAIEnabled) {
            return generateFallbackSummary(input);
        }
        const summary = await summarizeAssessmentResults(input);
        return summary;
    } catch (error) {
        console.error("Error generating assessment summary:", error);
        // Return fallback instead of throwing
        return generateFallbackSummary(input);
    }
}

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput) {
    try {
        if (!isAIEnabled) {
            return generateFallbackRecommendations(input);
        }
        const recommendations = await generatePersonalizedRecommendations(input);
        return recommendations;
    } catch (error) {
        console.error("Error generating recommendations:", error);
        // Return fallback instead of throwing
        return generateFallbackRecommendations(input);
    }
}
