import { createLessonPlanResponse } from "@/server/chat-handler";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => undefined)) as { input?: unknown } | undefined;
  const payload = await createLessonPlanResponse(body?.input);

  return Response.json(payload);
}

export function GET() {
  return Response.json({ error: "Method Not Allowed" }, { status: 405, headers: { Allow: "POST" } });
}
