import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validators";

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = taskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const tags = parsed.data.tags ? JSON.stringify(parsed.data.tags) : "";

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      status: parsed.data.status ?? "inbox",
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : undefined,
      estimateMinutes: parsed.data.estimateMinutes ?? undefined,
      energy: parsed.data.energy ?? "med",
      mode: parsed.data.mode ?? "admin",
      tags,
      pinnedToday: parsed.data.pinnedToday ?? false,
      parentId: parsed.data.parentId ?? undefined
    }
  });

  return NextResponse.json(task, { status: 201 });
}
