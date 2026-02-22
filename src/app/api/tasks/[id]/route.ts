import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = taskSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const tags = parsed.data.tags ? JSON.stringify(parsed.data.tags) : undefined;
  const data: Record<string, unknown> = {
    title: parsed.data.title,
    status: parsed.data.status,
    energy: parsed.data.energy,
    mode: parsed.data.mode,
    tags,
    pinnedToday: parsed.data.pinnedToday,
    parentId: parsed.data.parentId ?? undefined
  };

  if (parsed.data.dueAt !== undefined) {
    data.dueAt = parsed.data.dueAt ? new Date(parsed.data.dueAt) : null;
  }

  if (parsed.data.estimateMinutes !== undefined) {
    data.estimateMinutes = parsed.data.estimateMinutes ?? null;
  }

  const task = await prisma.task.update({
    where: { id: params.id },
    data
  });

  return NextResponse.json(task);
}
