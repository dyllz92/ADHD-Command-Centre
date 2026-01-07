"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import type { AppState } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

type AppStateItem = Omit<AppState, "discoveryStart"> & { discoveryStart: string };

export default function SettingsPage() {
  const { data: session } = useSession();
  const [state, setState] = useState<AppStateItem | null>(null);
  const [status, setStatus] = useState("");
  const [insights, setInsights] = useState({
    checkIns: 0,
    tasksDone: 0,
    followUps: 0,
    studyMinutes: 0,
    busyDay: "No data yet"
  });

  useEffect(() => {
    fetch("/api/appstate")
      .then((res) => res.json())
      .then((data) => setState(data));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/checkins").then((res) => res.json()),
      fetch("/api/tasks").then((res) => res.json()),
      fetch("/api/followups").then((res) => res.json()),
      fetch("/api/calendar").then((res) => res.json())
    ]).then(([checkIns, tasks, followUps, events]) => {
      const busyMap = events.reduce<Record<string, number>>((acc, event: { startAt: string }) => {
        const day = new Date(event.startAt).toLocaleDateString("en-AU", { weekday: "long" });
        acc[day] = (acc[day] ?? 0) + 1;
        return acc;
      }, {});
      const busyDay = Object.entries(busyMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "No data yet";

      setInsights({
        checkIns: checkIns.length,
        tasksDone: tasks.filter((task: { status: string }) => task.status === "done").length,
        followUps: followUps.length,
        studyMinutes: 0,
        busyDay
      });
    });
  }, []);

  const discoveryDaysLeft = useMemo(() => {
    if (!state) return 14;
    const start = new Date(state.discoveryStart);
    const now = new Date();
    const diff = Math.ceil((14 * 24 * 60 * 60 * 1000 - (now.getTime() - start.getTime())) / (24 * 60 * 60 * 1000));
    return Math.max(0, diff);
  }, [state]);

  const handleSave = async () => {
    if (!state) return;
    const response = await fetch("/api/appstate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uniNextStep: state.uniNextStep,
        weatherLocation: state.weatherLocation,
        appointmentKeywords: state.appointmentKeywords,
        quietHoursStart: state.quietHoursStart,
        quietHoursEnd: state.quietHoursEnd
      })
    });
    if (response.ok) {
      setStatus("Saved");
      setTimeout(() => setStatus(""), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <PrimaryButton
        label="What now?"
        sublabel="Back to the command dashboard"
        onClick={() => (window.location.href = "/?whatnow=1")}
      />
      <SectionHeader title="Settings" />

      <Card title="Google Calendar">
        <p className="text-sm text-ink-500">Read-only access for upcoming events.</p>
        <div className="mt-3 flex gap-2">
          {session ? (
            <SecondaryButton label="Disconnect" onClick={() => signOut()} />
          ) : (
            <SecondaryButton label="Connect Google" onClick={() => signIn("google")} />
          )}
        </div>
      </Card>

      <Card title="Gmail + bills (coming soon)">
        <p className="text-sm text-ink-500">Placeholders only for now. No email bodies stored.</p>
      </Card>

      <Card title="Discovery mode">
        <p className="text-sm text-ink-500">Light prompts for your first 14 days.</p>
        <p className="mt-2 text-sm text-ink-700">Days left: {discoveryDaysLeft}</p>
      </Card>

      <Card title="Weekly insight">
        <div className="space-y-2 text-sm text-ink-700">
          <div>{insights.checkIns} check-ins</div>
          <div>{insights.tasksDone} tasks completed</div>
          <div>{insights.followUps} follow-ups queued</div>
          <div>{insights.studyMinutes} study minutes logged</div>
          <div>Common busy day: {insights.busyDay}</div>
        </div>
      </Card>

      {state && (
        <Card title="Preferences">
          <div className="space-y-3 text-sm">
            <label className="block">
              Uni next step
              <input
                value={state.uniNextStep}
                onChange={(event) => setState({ ...state, uniNextStep: event.target.value })}
                className="mt-1 w-full rounded-2xl border border-sand-200 px-3 py-2"
              />
            </label>
            <label className="block">
              Weather location
              <input
                value={state.weatherLocation}
                onChange={(event) => setState({ ...state, weatherLocation: event.target.value })}
                className="mt-1 w-full rounded-2xl border border-sand-200 px-3 py-2"
              />
            </label>
            <label className="block">
              Appointment keywords
              <input
                value={state.appointmentKeywords}
                onChange={(event) => setState({ ...state, appointmentKeywords: event.target.value })}
                className="mt-1 w-full rounded-2xl border border-sand-200 px-3 py-2"
              />
            </label>
            <div className="flex gap-2">
              <label className="block flex-1">
                Quiet hours start
                <input
                  value={state.quietHoursStart}
                  onChange={(event) => setState({ ...state, quietHoursStart: event.target.value })}
                  className="mt-1 w-full rounded-2xl border border-sand-200 px-3 py-2"
                />
              </label>
              <label className="block flex-1">
                Quiet hours end
                <input
                  value={state.quietHoursEnd}
                  onChange={(event) => setState({ ...state, quietHoursEnd: event.target.value })}
                  className="mt-1 w-full rounded-2xl border border-sand-200 px-3 py-2"
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <SecondaryButton label="Save preferences" onClick={handleSave} />
              {status && <span className="text-xs text-ink-500">{status}</span>}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
