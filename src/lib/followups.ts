import type { CalendarEvent } from "@prisma/client";

export const isAppointmentEvent = (event: CalendarEvent, keywords: string[]) => {
  const lowerTitle = event.title.toLowerCase();
  return keywords.some((keyword) => lowerTitle.includes(keyword.trim().toLowerCase()));
};

export const buildFollowUpTitle = (event: CalendarEvent) => {
  const date = event.startAt.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
  return `${event.title} (${date})`;
};
