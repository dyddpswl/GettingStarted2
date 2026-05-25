import { createFallbackLesson } from "@/lib/fallback-lesson";
import {
  defaultLessonInput,
  fieldLabels,
  lessonOptions,
  type GenerateLessonResponse,
  type LessonInput,
  type LessonPlan,
} from "@/lib/lesson-types";
import { LESSON_DESIGN_SYSTEM_PROMPT, LESSON_DESIGN_USER_PROMPT_GUIDE } from "@/lib/system-prompt";

type OpenAIGenerationResult =
  | { ok: true; plan: LessonPlan }
  | { ok: false; reason: string };

const OPENAI_TIMEOUT_MS = 25000;

function isLessonInput(value: unknown): value is LessonInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (Object.keys(lessonOptions) as Array<keyof LessonInput>).every((key) => {
    const option = candidate[key];
    return typeof option === "string" && (lessonOptions[key] as readonly string[]).includes(option);
  });
}

function isLessonPlan(value: unknown): value is LessonPlan {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<LessonPlan>;
  return (
    typeof candidate.title === "string" &&
    typeof candidate.subtitle === "string" &&
    typeof candidate.summary === "string" &&
    Array.isArray(candidate.sections) &&
    candidate.sections.every(
      (section) =>
        section &&
        typeof section.id === "string" &&
        typeof section.title === "string" &&
        Array.isArray(section.content) &&
        section.content.every((item) => typeof item === "string"),
    )
  );
}

function buildPrompt(input: LessonInput) {
  const conditions = (Object.keys(fieldLabels) as Array<keyof LessonInput>)
    .map((key) => `- ${fieldLabels[key]}: ${input[key]}`)
    .join("\n");

  return `한국 공교육 교사가 바로 수업에 활용할 수 있는 사례 기반 AI 수업설계안을 작성해 주세요.

입력 조건:
${conditions}

${LESSON_DESIGN_USER_PROMPT_GUIDE}

JSON 스키마:
{
  "title": "string",
  "subtitle": "string",
  "summary": "string",
  "sections": [
    { "id": "overview", "title": "수업 개요", "content": ["string"] },
    { "id": "objectives", "title": "학습 목표", "content": ["string"] },
    { "id": "flow", "title": "차시별 수업 흐름", "content": ["string"] },
    { "id": "caseActivities", "title": "실제 사례 기반 활동", "content": ["string"] },
    { "id": "project", "title": "프로젝트 활동", "content": ["string"] },
    { "id": "worksheet", "title": "학생 활동지 초안", "content": ["string"] },
    { "id": "teacherNotes", "title": "교사용 지도 포인트", "content": ["string"] },
    { "id": "assessment", "title": "평가 방법", "content": ["string"] },
    { "id": "rubric", "title": "수행평가 루브릭", "content": ["string"] },
    { "id": "reflection", "title": "수업 후 성찰 질문", "content": ["string"] }
  ]
}`;
}

async function generateWithOpenAI(input: LessonInput): Promise<OpenAIGenerationResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: "OPENAI_API_KEY가 서버 환경변수에 없습니다." };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: LESSON_DESIGN_SYSTEM_PROMPT },
          { role: "user", content: buildPrompt(input) },
        ],
        temperature: 0.65,
        max_tokens: 3000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, reason: `OpenAI 응답 오류: HTTP ${response.status}` };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return { ok: false, reason: "OpenAI 응답에 생성 내용이 없습니다." };
    }

    try {
      const parsed = JSON.parse(content) as unknown;
      return isLessonPlan(parsed)
        ? { ok: true, plan: parsed }
        : { ok: false, reason: "OpenAI 응답 형식이 수업설계안 타입과 맞지 않습니다." };
    } catch {
      return { ok: false, reason: "OpenAI 응답을 JSON으로 해석하지 못했습니다." };
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, reason: "OpenAI 응답 시간이 초과되었습니다." };
    }
    return { ok: false, reason: "OpenAI API 호출 중 예외가 발생했습니다." };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function createLessonPlanResponse(inputValue: unknown): Promise<GenerateLessonResponse> {
  const input = isLessonInput(inputValue) ? inputValue : defaultLessonInput;
  const result = await generateWithOpenAI(input);

  if (result.ok) {
    return { plan: result.plan, source: "openai" };
  }

  return {
    plan: createFallbackLesson(input),
    source: "fallback",
    message: `${result.reason} 더미 결과를 표시했습니다.`,
  };
}
