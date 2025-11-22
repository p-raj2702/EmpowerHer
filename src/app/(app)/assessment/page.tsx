'use client';

import { useState } from 'react';
import { useForm, FormProvider, FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

// Simplified schema for demonstration
const assessmentSchema = z.object({
  age: z.coerce.number().min(12, 'Age must be at least 12').max(60, 'Age must be at most 60'),
  weight: z.coerce.number().min(30, 'Weight must be at least 30kg').max(200, 'Weight must be at most 200kg'),
  height: z.coerce.number().min(100, 'Height must be at least 100cm').max(250, 'Height must be at most 250cm'),
  cycleRegularity: z.enum(['regular', 'irregular'], { required_error: 'Please select an option.'}),
  exerciseFrequency: z.enum(['none', '1-2_week', '3-4_week', '5-plus_week'], { required_error: 'Please select an option.'}),
  diet: z.enum(['balanced', 'unhealthy', 'other'], { required_error: 'Please select an option.'}),
  medicalHistory: z.string().optional(),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

const Step1 = () => (
  <div className="space-y-4">
    <FormField
      name="age"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Age (years)</FormLabel>
          <FormControl>
            <Input type="number" placeholder="e.g., 28" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <div className="grid grid-cols-2 gap-4">
      <FormField
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weight (kg)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="e.g., 65" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Height (cm)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="e.g., 165" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

const Step2 = () => (
    <div className="space-y-6">
        <FormField
        name="cycleRegularity"
        render={({ field }) => (
            <FormItem className="space-y-3">
            <FormLabel>Is your menstrual cycle regular?</FormLabel>
            <FormControl>
                <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
                >
                <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                    <RadioGroupItem value="regular" />
                    </FormControl>
                    <FormLabel className="font-normal">Regular</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                    <RadioGroupItem value="irregular" />
                    </FormControl>
                    <FormLabel className="font-normal">Irregular</FormLabel>
                </FormItem>
                </RadioGroup>
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
            name="exerciseFrequency"
            render={({ field }) => (
                <FormItem>
                <FormLabel>How often do you exercise?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="none">Rarely or never</SelectItem>
                        <SelectItem value="1-2_week">1-2 times a week</SelectItem>
                        <SelectItem value="3-4_week">3-4 times a week</SelectItem>
                        <SelectItem value="5-plus_week">5 or more times a week</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            name="diet"
            render={({ field }) => (
                <FormItem>
                <FormLabel>How would you describe your diet?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="unhealthy">Mostly unhealthy</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
    </div>
);

const steps = [
  { id: '01', name: 'Personal Details', component: Step1, fields: ['age', 'weight', 'height'] },
  { id: '02', name: 'Lifestyle', component: Step2, fields: ['cycleRegularity', 'exerciseFrequency', 'diet'] },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      age: '' as any,
      weight: '' as any,
      height: '' as any,
      cycleRegularity: undefined,
      exerciseFrequency: undefined,
      diet: undefined,
      medicalHistory: '',
    },
  });

  async function processForm(data: AssessmentFormValues) {
    // In a real app, this would call the /api/predict function
    // and save the assessment to the database.
    console.log('Assessment Data:', data);
    
    // For demo, we'll create a query string and navigate to results.
    const queryString = new URLSearchParams(data as any).toString();
    router.push(`/assessment/result?${queryString}`);
  }

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await form.trigger(fields as FieldPath<AssessmentFormValues>[], { shouldFocus: true });
    
    if(isValid) {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            await form.handleSubmit(processForm)();
        }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="mb-4">
            <p className="text-sm text-primary">Step {steps[currentStep].id} of {steps.length.toString().padStart(2, '0')}</p>
            <CardTitle className="text-2xl">{steps[currentStep].name}</CardTitle>
            <CardDescription>Please fill in the details below.</CardDescription>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <CurrentStepComponent />
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Back
            </Button>
            <Button onClick={nextStep}>
              {currentStep === steps.length - 1 ? 'See Results' : 'Next'}
            </Button>
        </CardFooter>
      </Card>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Disclaimer: This assessment is not a diagnosis. Please consult a healthcare professional for clinical advice.
      </p>
    </div>
  );
}
