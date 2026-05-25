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

    const responseText = await response.text();
    let data: GenerateLessonResponse | { error?: string };

    try {
      data = JSON.parse(responseText) as GenerateLessonResponse | { error?: string };
    } catch {
      throw new Error("API returned a non-JSON response. Please redeploy and check the /api/chat route.");
    }

    if (!response.ok || !("plan" in data)) {
      throw new Error("Lesson generation request failed.");
    }

    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The request timed out. Please try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
