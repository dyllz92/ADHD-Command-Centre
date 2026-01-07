import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const now = new Date();
  const weekAhead = new Date();
  weekAhead.setDate(now.getDate() + 7);

  if (session?.accessToken) {
    const oauth2 = new google.auth.OAuth2();
    oauth2.setCredentials({ access_token: session.accessToken });
    const calendar = google.calendar({ version: "v3", auth: oauth2 });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: weekAhead.toISOString(),
      singleEvents: true,
      orderBy: "startTime"
    });

    const items = response.data.items ?? [];

    await Promise.all(
      items
        .filter((event) => event.id && event.start?.dateTime && event.end?.dateTime)
        .map((event) =>
          prisma.calendarEvent.upsert({
            where: { eventId: event.id ?? "" },
            update: {
              title: event.summary ?? "Untitled",
              startAt: new Date(event.start?.dateTime ?? now),
              endAt: new Date(event.end?.dateTime ?? now),
              location: event.location ?? null
            },
            create: {
              eventId: event.id ?? crypto.randomUUID(),
              title: event.summary ?? "Untitled",
              startAt: new Date(event.start?.dateTime ?? now),
              endAt: new Date(event.end?.dateTime ?? now),
              location: event.location ?? null
            }
          })
        )
    );
  }

  const events = await prisma.calendarEvent.findMany({
    where: {
      startAt: { gte: now }
    },
    orderBy: { startAt: "asc" }
  });

  return NextResponse.json(events);
}
