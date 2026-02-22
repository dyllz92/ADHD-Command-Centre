import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkInSchema } from "@/lib/validators";

export async function GET() {
  const checkIns = await prisma.checkIn.findMany({
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return NextResponse.json(checkIns);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const checkIn = await prisma.checkIn.create({
    data: parsed.data
  });

  return NextResponse.json(checkIn, { status: 201 });
}
