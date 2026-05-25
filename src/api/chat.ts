import type { GenerateLessonResponse, LessonInput } from "@/lib/lesson-types";

const CLIENT_TIMEOUT_MS = 35000;

export async function requestLessonPlan(input: LessonInput): Promise<GenerateLessonResponse> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
      signal: controller.signal,
    });

    const data = (await response.json()) as GenerateLessonResponse | { error?: string };

    if (!response.ok || !("plan" in data)) {
      throw new Error("수업설계안 생성 요청에 실패했습니다.");
    }

    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
