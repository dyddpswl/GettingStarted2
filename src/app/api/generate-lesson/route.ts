import { createFallbackLesson } from "@/lib/fallback-lesson";
import { defaultLessonInput, fieldLabels, lessonOptions, type GenerateLessonResponse, type LessonInput, type LessonPlan } from "@/lib/lesson-types";

export const runtime = "nodejs";

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

  return `공교육 교사를 위한 사례 기반 AI 수업설계안을 한국어로 작성해 주세요.

입력 조건:
${conditions}

반드시 지킬 조건:
- 모든 차시에 실제 사례 또는 현실 문제 상황을 포함합니다.
- 학생 수준에 맞게 쉬운 표현과 구체적인 교사 안내를 사용합니다.
- 단순 설명형이 아니라 사례 기반, 참여형, PBL 중심으로 설계합니다.
- 교사가 바로 활용할 수 있도록 활동, 평가, 루브릭을 구체적으로 작성합니다.
- 응답은 마크다운이 아니라 아래 JSON 스키마만 반환합니다.

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

async function generateWithOpenAI(input: LessonInput): Promise<LessonPlan | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

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
        {
          role: "system",
          content: "당신은 한국 공교육 AI·정보 교사를 돕는 수업설계 전문가입니다. 응답은 유효한 JSON만 반환합니다.",
        },
        {
          role: "user",
          content: buildPrompt(input),
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as unknown;
    return isLessonPlan(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let input = defaultLessonInput;

  try {
    const body = (await request.json()) as { input?: unknown };
    if (!isLessonInput(body.input)) {
      const payload: GenerateLessonResponse = {
        plan: createFallbackLesson(input),
        source: "fallback",
        message: "입력값이 올바르지 않아 기본 조건으로 더미 결과를 생성했습니다.",
      };
      return Response.json(payload, { status: 400 });
    }
    input = body.input;
  } catch {
    const payload: GenerateLessonResponse = {
      plan: createFallbackLesson(input),
      source: "fallback",
      message: "요청 본문을 읽지 못해 기본 더미 결과를 생성했습니다.",
    };
    return Response.json(payload, { status: 400 });
  }

  try {
    const openAiPlan = await generateWithOpenAI(input);
    if (openAiPlan) {
      const payload: GenerateLessonResponse = { plan: openAiPlan, source: "openai" };
      return Response.json(payload);
    }
  } catch {
    // Fall through to a deterministic plan so the classroom workflow remains usable.
  }

  const payload: GenerateLessonResponse = {
    plan: createFallbackLesson(input),
    source: "fallback",
    message: "OpenAI API를 사용할 수 없어 더미 결과를 표시했습니다.",
  };
  return Response.json(payload);
}
