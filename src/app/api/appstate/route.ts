import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appStateSchema } from "@/lib/validators";

const ensureAppState = async () => {
  const existing = await prisma.appState.findFirst();
  if (existing) return existing;
  return prisma.appState.create({ data: {} });
};

export async function GET() {
  const state = await ensureAppState();
  return NextResponse.json(state);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = appStateSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await ensureAppState();
  const updated = await prisma.appState.update({
    where: { id: existing.id },
    data: parsed.data
  });

  return NextResponse.json(updated);
}
