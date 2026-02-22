import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1),
  status: z.enum(["inbox", "todo", "doing", "done"]).optional(),
  dueAt: z.string().datetime().optional().nullable(),
  estimateMinutes: z.number().int().positive().optional().nullable(),
  energy: z.enum(["low", "med", "high"]).optional(),
  mode: z.enum(["calls", "admin", "out", "deep"]).optional(),
  tags: z.array(z.string()).optional(),
  pinnedToday: z.boolean().optional(),
  parentId: z.string().optional().nullable()
});

export const checkInSchema = z.object({
  eaten: z.boolean(),
  water: z.boolean(),
  moved: z.boolean(),
  brainState: z.enum(["foggy", "ok", "sharp"]),
  capacity: z.enum(["low", "med", "high"]),
  mood: z.enum(["low", "ok", "good"])
});

export const appStateSchema = z.object({
  uniNextStep: z.string().min(1),
  weatherLocation: z.string().min(1),
  appointmentKeywords: z.string().min(1),
  quietHoursStart: z.string().min(1),
  quietHoursEnd: z.string().min(1)
});

export const templateSchema = z.object({
  name: z.string().min(1),
  channel: z.enum(["sms", "email"]),
  body: z.string().min(1)
});
