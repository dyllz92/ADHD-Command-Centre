"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type CalendarItem = Omit<CalendarEvent, "startAt" | "endAt" | "createdAt"> & {
  startAt: string;
  endAt: string;
  createdAt: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarItem[]>([]);

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const grouped = useMemo(() => {
    return events.reduce<Record<string, CalendarItem[]>>((acc, event) => {
      const key = new Date(event.startAt).toDateString();
      acc[key] = acc[key] ? [...acc[key], event] : [event];
      return acc;
    }, {});
  }, [events]);

  return (
    <div className="space-y-6">
      <PrimaryButton
        label="What now?"
        sublabel="Back to the command dashboard"
        onClick={() => (window.location.href = "/?whatnow=1")}
      />
      <SectionHeader title="Calendar" />
      {Object.entries(grouped).length === 0 && (
        <Card>
          <p className="text-sm text-ink-500">No events loaded yet. Connect Google Calendar in Settings.</p>
        </Card>
      )}
      {Object.entries(grouped).map(([day, dayEvents]) => (
        <Card key={day} title={day}>
          <div className="space-y-2">
            {dayEvents.map((event) => (
              <div key={event.id} className="text-sm text-ink-700">
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-ink-500">
                  {new Date(event.startAt).toLocaleTimeString("en-AU", {
                    hour: "numeric",
                    minute: "2-digit"
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
