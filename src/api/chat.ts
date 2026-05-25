import type { GenerateLessonResponse, LessonInput } from "@/lib/lesson-types";

export async function requestLessonPlan(input: LessonInput): Promise<GenerateLessonResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  const data = (await response.json()) as GenerateLessonResponse | { error?: string };

  if (!response.ok || !("plan" in data)) {
    throw new Error("수업설계안 생성 요청에 실패했습니다.");
  }

  return data;
}
