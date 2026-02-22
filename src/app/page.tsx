import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { TaskRow } from "@/components/ui/TaskRow";
import { WhatNowPanel } from "@/components/WhatNowPanel";
import { UniNextStepCard } from "@/components/UniNextStepCard";
import { prisma } from "@/lib/prisma";
import { suggestNextAction } from "@/lib/suggestNextAction";
import { getTodayState } from "@/lib/taskUtils";

export default async function HomePage() {
  const [tasks, checkIn, events, followUps, appState] = await Promise.all([
    prisma.task.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.checkIn.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.calendarEvent.findMany({ orderBy: { startAt: "asc" } }),
    prisma.followUp.count({ where: { status: { in: ["queued", "snoozed"] } } }),
    prisma.appState.findFirst(),
  ]);

  const todayState = await getTodayState(prisma);

  const topThree = tasks
    .filter((task) => task.pinnedToday && task.status !== "done")
    .slice(0, 3);
  const nextAppointment = events.find((event) => event.startAt > new Date());

  const minutesUntilNext = nextAppointment
    ? Math.round((nextAppointment.startAt.getTime() - Date.now()) / (1000 * 60))
    : null;

  const suggestion = suggestNextAction({
    minutesUntilNextEvent: minutesUntilNext,
    essentials: {
      eaten: checkIn?.eaten ?? false,
      water: checkIn?.water ?? false,
      moved: checkIn?.moved ?? false,
      lastCheckInAt: checkIn?.createdAt,
      capacity:
        (checkIn?.capacity as "low" | "med" | "high" | undefined) ?? null,
    },
    followUpsDue: followUps,
    hasUniNextStep: Boolean(appState?.uniNextStep),
    hasPinnedToday: topThree.length > 0,
    quickWinAvailable: tasks.some(
      (task) => task.estimateMinutes && task.estimateMinutes <= 10,
    ),
    deepFocusAvailable: tasks.some((task) => task.mode === "deep"),
    // Optionally pass todayState to suggestion engine or UI as needed
  });

  return (
    <div className="space-y-6">
      <WhatNowPanel suggestion={suggestion} />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Top 3 Today</h2>
          <Link href="/todo" className="text-sm font-medium text-calm-500">
            Edit
          </Link>
        </div>
        {topThree.length === 0 ? (
          <Card>
            <p className="text-sm text-ink-500">
              Keep it gentle. Pick just three tasks for today.
            </p>
            <Link
              href="/todo"
              className="mt-3 inline-block text-sm font-medium text-calm-500"
            >
              Pick my Top 3
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {topThree.map((task) => (
              <TaskRow key={task.id} task={task} showMeta={false} />
            ))}
          </div>
        )}
      </section>

      <Card title="Next appointment">
        {nextAppointment ? (
          <div className="space-y-1">
            <div className="text-base font-semibold text-ink-900">
              {nextAppointment.title}
            </div>
            <div className="text-sm text-ink-500">
              {nextAppointment.startAt.toLocaleString("en-AU", {
                weekday: "short",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-500">
            Connect Google Calendar to see your next event.
          </p>
        )}
      </Card>

      <Card
        title="Essentials status"
        rightAction={
          <Link href="/checkin" className="text-sm font-medium text-calm-500">
            Update
          </Link>
        }
      >
        <div className="flex flex-wrap gap-2">
          <StatusPill
            label="Eat"
            state={checkIn?.eaten ? "good" : "attention"}
          />
          <StatusPill
            label="Water"
            state={checkIn?.water ? "good" : "attention"}
          />
          <StatusPill
            label="Move"
            state={checkIn?.moved ? "good" : "neutral"}
          />
        </div>
      </Card>

      <UniNextStepCard />

      <Card
        title="Work: Follow-ups due"
        rightAction={
          <Link href="/work" className="text-sm font-medium text-calm-500">
            View
          </Link>
        }
      >
        <div className="text-sm text-ink-700">{followUps} queued this week</div>
      </Card>

      <Card title="Weather">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold">21°C · Partly cloudy</div>
            <div className="text-sm text-ink-500">
              {appState?.weatherLocation ?? "Sydney, NSW"}
            </div>
          </div>
          <div className="text-sm text-ink-500">Tomorrow 23°C</div>
        </div>
      </Card>
    </div>
  );
}
