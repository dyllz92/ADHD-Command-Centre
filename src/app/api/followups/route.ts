import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAppointmentEvent } from "@/lib/followups";

const ensureDefaults = async () => {
  const templateCount = await prisma.template.count();
  if (templateCount === 0) {
    await prisma.template.createMany({
      data: [
        {
          name: "Quick check-in",
          channel: "sms",
          body: "Hey! Just checking in after today. Let me know if you'd like another booking."
        },
        {
          name: "Rebook nudge",
          channel: "sms",
          body: "Hi! Want me to lock in another session? Happy to set up a time that suits you."
        }
      ]
    });
  }
};

const generateFollowUps = async () => {
  await ensureDefaults();
  const state = await prisma.appState.findFirst();
  const keywords = state?.appointmentKeywords.split(",") ?? ["massage", "session"];

  const since = new Date();
  since.setHours(since.getHours() - 24);

  const recentEvents = await prisma.calendarEvent.findMany({
    where: {
      startAt: { gte: since, lte: new Date() }
    }
  });

  const template = await prisma.template.findFirst({ orderBy: { name: "asc" } });

  await Promise.all(
    recentEvents
      .filter((event) => isAppointmentEvent(event, keywords))
      .map(async (event) => {
        const existing = await prisma.followUp.findFirst({
          where: { eventId: event.eventId }
        });
        if (existing) return existing;

        return prisma.followUp.create({
          data: {
            eventId: event.eventId,
            scheduledAt: new Date(),
            templateId: template?.id
          }
        });
      })
  );
};

export async function GET() {
  await generateFollowUps();
  const followUps = await prisma.followUp.findMany({
    where: {
      status: { in: ["queued", "snoozed"] }
    },
    include: {
      template: true
    },
    orderBy: { scheduledAt: "asc" }
  });

  return NextResponse.json(followUps);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, status, scheduledAt, templateId } = body as {
    id: string;
    status: "queued" | "sent" | "snoozed" | "skipped";
    scheduledAt?: string;
    templateId?: string;
  };

  const followUp = await prisma.followUp.update({
    where: { id },
    data: {
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      templateId
    },
    include: { template: true }
  });

  return NextResponse.json(followUp);
}
