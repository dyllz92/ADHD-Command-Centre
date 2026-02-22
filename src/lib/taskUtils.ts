export const parseTags = (task: { tags: string }) => {
  if (!task.tags) return [] as string[];
  try {
    const parsed = JSON.parse(task.tags) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return task.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
};

export const formatTags = (tags: string[]) => JSON.stringify(tags);

// Derive TodayState from latest CheckIn, AppState, and calendar events
import { PrismaClient } from "@prisma/client";
import type {
  TodayState,
  EnergyLevel,
  StressLevel,
  SleepQuality,
  Mood,
  Essentials,
} from "@/types/TodayState.d.ts";
import type { CalendarEvent } from "@prisma/client";

export async function getTodayState(
  prisma: PrismaClient,
): Promise<TodayState | null> {
  const [checkIn, appState, events] = await Promise.all([
    prisma.checkIn.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.appState.findFirst(),
    prisma.calendarEvent.findMany({ orderBy: { startAt: "asc" } }),
  ]);

  if (!checkIn) return null;

  // Derive essentials
  const essentials: Essentials = {
    ate: checkIn.eaten ?? false,
    water: checkIn.water ?? false,
    move: checkIn.moved ?? false,
  };

  // Derive timeBudgetMins from next event
  const now = new Date();
  const nextEvent = events.find((event: CalendarEvent) => event.startAt > now);
  const timeBudgetMins = nextEvent
    ? Math.round((nextEvent.startAt.getTime() - now.getTime()) / (1000 * 60))
    : 60;

  // Derive quietHours from appState (not used directly here, but available)
  // Derive TodayState fields
  const todayState: TodayState = {
    energyLevel: (checkIn.capacity as EnergyLevel) ?? "med",
    stressLevel: (checkIn.brainState as StressLevel) ?? "med",
    sleepQuality: (checkIn.mood as SleepQuality) ?? "ok",
    essentials,
    mood: (checkIn.mood as Mood) ?? "ok",
    timeBudgetMins,
    lastCheckInAt: checkIn.createdAt,
  };

  return todayState;
}
