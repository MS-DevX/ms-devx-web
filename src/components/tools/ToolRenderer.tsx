"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const toolModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  // Existing
  "ai-resume-builder": () => import("@/components/tools/tool-uis/ResumeBuilder"),
  "ai-cover-letter": () => import("@/components/tools/tool-uis/CoverLetterWriter"),
  "pdf-toolkit": () => import("@/components/tools/tool-uis/PdfToolkit"),
  "prayer-times": () => import("@/components/tools/tool-uis/PrayerTimes"),
  "hifz-tracker": () => import("@/components/tools/tool-uis/HifzTracker"),
  "business-name-generator": () => import("@/components/tools/tool-uis/BusinessNameGenerator"),
  "homework-helper": () => import("@/components/tools/tool-uis/HomeworkHelper"),
  "unit-converter": () => import("@/components/tools/tool-uis/UnitConverter"),
  "expense-tracker": () => import("@/components/tools/tool-uis/ExpenseTracker"),
  "calorie-scanner": () => import("@/components/tools/tool-uis/CalorieScanner"),
  // Date & Time
  "age-calculator": () => import("@/components/tools/tool-uis/AgeCalculator"),
  "how-old-am-i-in-seconds": () => import("@/components/tools/tool-uis/AgeInSeconds"),
  "what-day-was-i-born": () => import("@/components/tools/tool-uis/WhatDayWasI"),
  "life-age-fun-units": () => import("@/components/tools/tool-uis/LifeAgeFunUnits"),
  "date-calculator": () => import("@/components/tools/tool-uis/DateCalculator"),
  "time-calculator": () => import("@/components/tools/tool-uis/TimeCalculator"),
  "work-hours-calculator": () => import("@/components/tools/tool-uis/WorkHoursCalculator"),
  "time-zone-converter": () => import("@/components/tools/tool-uis/TimeZoneConverter"),
  "countdown-timer": () => import("@/components/tools/tool-uis/CountdownTimer"),
  "date-difference": () => import("@/components/tools/tool-uis/DateDifferenceCalculator"),
  // Finance
  "emi-calculator": () => import("@/components/tools/tool-uis/EMICalculator"),
  "tip-calculator": () => import("@/components/tools/tool-uis/TipCalculator"),
  "savings-goal-tracker": () => import("@/components/tools/tool-uis/SavingsGoalTracker"),
  "loan-comparison-calculator": () => import("@/components/tools/tool-uis/LoanComparisonCalculator"),
  "budget-percentage-calculator": () => import("@/components/tools/tool-uis/BudgetPercentageCalculator"),
  // Math
  "percentage-calculator": () => import("@/components/tools/tool-uis/PercentageCalculator"),
  "random-decision-maker": () => import("@/components/tools/tool-uis/RandomDecisionMaker"),
  "name-compatibility-calculator": () => import("@/components/tools/tool-uis/NameCompatibilityCalculator"),
  // Health
  "sleep-calculator": () => import("@/components/tools/tool-uis/SleepCalculator"),
  "water-intake-calculator": () => import("@/components/tools/tool-uis/WaterIntakeCalculator"),
  "tdee-calculator": () => import("@/components/tools/tool-uis/TdeeCalculator"),
  "body-fat-calculator": () => import("@/components/tools/tool-uis/BodyFatCalculator"),
  "ideal-weight-calculator": () => import("@/components/tools/tool-uis/IdealWeightCalculator"),
  "protein-intake-calculator": () => import("@/components/tools/tool-uis/ProteinIntakeCalculator"),
  "steps-to-calories-calculator": () => import("@/components/tools/tool-uis/StepsToCaloriesCalculator"),
  "calories-burned-calculator": () => import("@/components/tools/tool-uis/CaloriesBurnedCalculator"),
  "heart-rate-zone-calculator": () => import("@/components/tools/tool-uis/HeartRateZoneCalculator"),
  "bmr-calculator": () => import("@/components/tools/tool-uis/BmrCalculator"),
  "macro-calculator": () => import("@/components/tools/tool-uis/MacroCalculator"),
  "intermittent-fasting-timer": () => import("@/components/tools/tool-uis/IntermittentFastingTimer"),
  "running-pace-calculator": () => import("@/components/tools/tool-uis/RunningPaceCalculator"),
  "caffeine-calculator": () => import("@/components/tools/tool-uis/CaffeineCalculator"),
  "one-rep-max-calculator": () => import("@/components/tools/tool-uis/OneRepMaxCalculator"),
  "vo2-max-estimator": () => import("@/components/tools/tool-uis/Vo2MaxEstimator"),
  "push-up-calorie-calculator": () => import("@/components/tools/tool-uis/PushUpCalorieCalculator"),
  "pregnancy-due-date-calculator": () => import("@/components/tools/tool-uis/PregnancyDueDateCalculator"),
  "sugar-intake-calculator": () => import("@/components/tools/tool-uis/SugarIntakeCalculator"),
  "breathing-exercise-tool": () => import("@/components/tools/tool-uis/BreathingExerciseTool"),
  "meditation-timer": () => import("@/components/tools/tool-uis/MeditationTimer"),
  // Text
  "word-counter": () => import("@/components/tools/tool-uis/WordCounter"),
  "capitalize": () => import("@/components/tools/tool-uis/CapitalizeText"),
  "edit-counter": () => import("@/components/tools/tool-uis/EditCounter"),
  "lorem-ipsum-generator": () => import("@/components/tools/tool-uis/LoremIpsumGenerator"),
  "case-converter": () => import("@/components/tools/tool-uis/CaseConverter"),
  "reading-time-estimator": () => import("@/components/tools/tool-uis/ReadingTimeEstimator"),
  "text-diff-checker": () => import("@/components/tools/tool-uis/TextDiffChecker"),
  "json-formatter": () => import("@/components/tools/tool-uis/JsonFormatter"),
  "character-counter": () => import("@/components/tools/tool-uis/CharacterCounter"),
  // Security
  "password-strength-checker": () => import("@/components/tools/tool-uis/PasswordStrengthChecker"),
  "password-generator": () => import("@/components/tools/tool-uis/PasswordGenerator"),
  // Utilities
  "image-to-pdf": () => import("@/components/tools/tool-uis/ImageToPdf"),
  "merge-pdf": () => import("@/components/tools/tool-uis/MergePdf"),
  "split-pdf": () => import("@/components/tools/tool-uis/SplitPdf"),
  "pdf-to-images": () => import("@/components/tools/tool-uis/PdfToImages"),
  "pdf-to-text": () => import("@/components/tools/tool-uis/PdfToText"),
  "image-compressor": () => import("@/components/tools/tool-uis/ImageCompressor"),
  "pdf-compressor": () => import("@/components/tools/tool-uis/PdfCompressor"),
  "qr-code-generator": () => import("@/components/tools/tool-uis/QrCodeGenerator"),
  "typing-speed-test": () => import("@/components/tools/tool-uis/TypingSpeedTest"),
  "exam-countdown-timer": () => import("@/components/tools/tool-uis/ExamCountdownTimer"),
  "study-timer": () => import("@/components/tools/tool-uis/StudyTimer"),
  "pomodoro-timer": () => import("@/components/tools/tool-uis/PomodoroTimer"),
  "screen-time-break-reminder": () => import("@/components/tools/tool-uis/ScreenTimeBreakReminder"),
  // Academic
  "cgpa-to-percentage": () => import("@/components/tools/tool-uis/CgpaToPercentage"),
  "gpa-calculator": () => import("@/components/tools/tool-uis/GpaCalculator"),
};

const loading = () => (
  <div className="flex items-center justify-center py-16">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const toolComponents: Record<string, ComponentType> = {};
for (const [slug, importFn] of Object.entries(toolModules)) {
  toolComponents[slug] = dynamic(importFn, { ssr: false, loading });
}

interface ToolRendererProps {
  slug: string;
}

export default function ToolRenderer({ slug }: ToolRendererProps) {
  const Component = toolComponents[slug];
  if (!Component) return null;
  return <Component />;
}
