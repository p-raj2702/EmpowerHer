'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BarChart, Calendar, FilePlus2, HeartPulse, LineChart, Target } from "lucide-react";
import Link from 'next/link';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart as RechartsLineChart } from "recharts";

const riskHistoryData = [
  { month: "Jan", risk: 0.3 },
  { month: "Feb", risk: 0.4 },
  { month: "Mar", risk: 0.35 },
  { month: "Apr", risk: 0.5 },
  { month: "May", risk: 0.45 },
  { month: "Jun", risk: 0.6 },
];

const weightHistoryData = [
  { month: "Jan", weight: 72 },
  { month: "Feb", weight: 71 },
  { month: "Mar", weight: 71.5 },
  { month: "Apr", weight: 70 },
  { month: "May", weight: 69 },
  { month: "Jun", weight: 68.5 },
];

const chartConfig: ChartConfig = {
  risk: {
    label: "PCOS Risk",
    color: "hsl(var(--primary))",
  },
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--accent))",
  },
};

export default function DashboardPage() {
  return (
    <div className="grid gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Jane! Here's your health summary.</p>
        </div>
        <Button asChild>
          <Link href="/assessment"><FilePlus2 className="mr-2"/> New Assessment</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary-foreground/90">
                <Target /> Current PCOS Risk
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">Based on your last assessment on June 15, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">High Risk</p>
            <p className="text-lg">85% Probability</p>
          </CardContent>
           <CardFooter>
            <p className="text-sm text-primary-foreground/80">Consult a doctor for a formal diagnosis.</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HeartPulse/> Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="flex-col h-24">
              <Calendar className="mb-2"/>
              Log Cycle
            </Button>
            <Button variant="outline" className="flex-col h-24">
              <Link href="/recommendations" className="flex flex-col items-center justify-center">
                <HeartPulse className="mb-2"/>
                My Plan
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart/> Key Risk Factors</CardTitle>
             <CardDescription>From your latest assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>BMI</span> <span className="font-semibold">High</span></li>
                <li className="flex justify-between"><span>Cycle Regularity</span> <span className="font-semibold">Irregular</span></li>
                <li className="flex justify-between"><span>Exercise Frequency</span> <span className="font-semibold">Low</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LineChart/> Risk Trend</CardTitle>
            <CardDescription>Your PCOS risk probability over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer>
                <RechartsLineChart data={riskHistoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 1]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="risk" stroke="var(--color-risk)" strokeWidth={2} dot={{r: 4, fill: "var(--color-risk)"}} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart/> Weight Journey</CardTitle>
             <CardDescription>Your weight changes over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer>
                <RechartsBarChart data={weightHistoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="weight" fill="var(--color-weight)" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
