import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { templateSchema } from "@/lib/validators";

const ensureDefaults = async () => {
  const count = await prisma.template.count();
  if (count > 0) return;

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
};

export async function GET() {
  await ensureDefaults();
  const templates = await prisma.template.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = templateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const template = await prisma.template.create({ data: parsed.data });
  return NextResponse.json(template, { status: 201 });
}
