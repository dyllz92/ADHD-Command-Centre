// src/types/TodayState.d.ts

export type EnergyLevel = "low" | "med" | "high";
export type StressLevel = "low" | "med" | "high";
export type SleepQuality = "poor" | "ok" | "good";
export type Mood = "low" | "ok" | "good";

export type Essentials = {
  ate: boolean;
  water: boolean;
  move: boolean;
};

export type TodayState = {
  energyLevel: EnergyLevel;
  stressLevel: StressLevel;
  sleepQuality: SleepQuality;
  essentials: Essentials;
  mood: Mood;
  timeBudgetMins: number;
  lastCheckInAt: Date;
};
