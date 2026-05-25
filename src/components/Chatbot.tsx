"use client";

import { useMemo, useState } from "react";
import { requestLessonPlan } from "@/api/chat";
import {
  defaultLessonInput,
  fieldLabels,
  lessonOptions,
  type LessonInput,
  type LessonPlan,
  type LessonSection,
} from "@/lib/lesson-types";

type Screen = "home" | "form" | "result";

const steps = ["조건 선택", "AI 설계", "결과 활용"];

function sectionText(section: LessonSection) {
  return `${section.title}\n${section.content.map((item) => `- ${item}`).join("\n")}`;
}

function planText(plan: LessonPlan) {
  return [plan.title, plan.subtitle, plan.summary, "", ...plan.sections.map((section) => sectionText(section))].join("\n\n");
}

export default function Chatbot() {
  const [screen, setScreen] = useState<Screen>("home");
  const [input, setInput] = useState<LessonInput>(defaultLessonInput);
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedSummary = useMemo(
    () =>
      (Object.keys(fieldLabels) as Array<keyof LessonInput>).map((key) => ({
        label: fieldLabels[key],
        value: input[key],
      })),
    [input],
  );

  function updateInput(key: keyof LessonInput, value: string) {
    setInput((current) => ({ ...current, [key]: value } as LessonInput));
  }

  async function generateLesson() {
    setLoading(true);
    setNotice(null);

    try {
      const data = await requestLessonPlan(input);
      setPlan(data.plan);
      setNotice(data.source === "fallback" ? data.message ?? "더미 결과를 표시했습니다." : "OpenAI API 결과를 생성했습니다.");
      setScreen("result");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "API 요청을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
      setNotice("복사 권한을 사용할 수 없습니다. 텍스트를 직접 선택해 복사해 주세요.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7f3] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">AI Lesson Studio</p>
            <h1 className="mt-1 text-2xl font-bold tracking-normal sm:text-3xl">사례 기반 AI 수업설계 생성기</h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {steps.map((step, index) => (
              <span key={step} className="rounded-md border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 shadow-sm">
                {index + 1}. {step}
              </span>
            ))}
          </nav>
        </header>

        {screen === "home" && (
          <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <p className="text-base font-semibold text-emerald-700">공교육 교사용 PBL 수업설계 도구</p>
              <h2 className="mt-4 text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
                실제 사례에서 출발하는 AI 수업을 빠르게 설계하세요.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
                학교급, 주제, 학생 수준, 활용 도구를 선택하면 수업 개요부터 활동지, 루브릭, 성찰 질문까지 한 번에 구성합니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  className="rounded-md bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                  onClick={() => setScreen("form")}
                >
                  수업 조건 선택하기
                </button>
                <button
                  className="rounded-md border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={generateLesson}
                  disabled={loading}
                >
                  {loading ? "설계 중..." : "기본 예시 바로 생성"}
                </button>
              </div>
              {notice && <p className="mt-4 text-sm font-medium text-amber-700">{notice}</p>}
            </div>
            <div className="grid gap-4">
              {[
                ["사례 중심", "생활·학교·사회 문제를 모든 차시에 연결"],
                ["참여형 흐름", "토론, 실습, 프로젝트 산출물까지 포함"],
                ["교사용 결과", "지도 포인트, 평가 방법, 루브릭 제공"],
              ].map(([title, body]) => (
                <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{body}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {screen === "form" && (
          <section className="grid gap-6 py-8 lg:grid-cols-[1fr_340px]">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">선택형 입력</p>
                  <h2 className="mt-1 text-2xl font-bold">수업 조건 설정</h2>
                </div>
                <button
                  className="rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  onClick={generateLesson}
                  disabled={loading}
                >
                  {loading ? "설계 중..." : "수업설계안 생성"}
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {(Object.keys(lessonOptions) as Array<keyof LessonInput>).map((key) => (
                  <label key={key} className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">{fieldLabels[key]}</span>
                    <select
                      className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                      value={input[key]}
                      onChange={(event) => updateInput(key, event.target.value)}
                    >
                      {lessonOptions[key].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              {notice && <p className="mt-4 text-sm font-medium text-amber-700">{notice}</p>}
            </div>
            <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:self-start">
              <h3 className="text-lg font-bold">현재 선택값</h3>
              <dl className="mt-4 grid gap-3">
                {selectedSummary.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2">
                    <dt className="text-sm text-slate-600">{item.label}</dt>
                    <dd className="text-right text-sm font-semibold text-slate-900">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </section>
        )}

        {screen === "result" && plan && (
          <section className="py-8">
            <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">{plan.subtitle}</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-normal">{plan.title}</h2>
                  <p className="mt-3 max-w-4xl leading-7 text-slate-700">{plan.summary}</p>
                  {notice && <p className="mt-3 text-sm font-medium text-amber-700">{notice}</p>}
                </div>
                <div className="flex flex-wrap gap-2 print:hidden">
                  <button className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold" onClick={() => copyText("all", planText(plan))}>
                    {copiedId === "all" ? "복사됨" : "전체 복사"}
                  </button>
                  <button className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold" onClick={() => window.print()}>
                    PDF 다운로드
                  </button>
                  <button className="rounded-md bg-emerald-700 px-4 py-2 font-semibold text-white" onClick={generateLesson} disabled={loading}>
                    {loading ? "설계 중..." : "다시 생성하기"}
                  </button>
                  <button className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold" onClick={() => setScreen("form")}>
                    조건 수정
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {plan.sections.map((section) => (
                <article key={section.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm break-inside-avoid">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-bold">{section.title}</h3>
                    <button
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 print:hidden"
                      onClick={() => copyText(section.id, sectionText(section))}
                    >
                      {copiedId === section.id ? "복사됨" : "복사"}
                    </button>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, index) => (
                      <li key={`${section.id}-${index}`} className="rounded-md bg-slate-50 p-4 leading-7 text-slate-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
