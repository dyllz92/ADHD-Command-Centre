import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { templateSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = templateSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const template = await prisma.template.update({
    where: { id: params.id },
    data: parsed.data
  });

  return NextResponse.json(template);
}
