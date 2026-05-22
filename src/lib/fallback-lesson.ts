import type { LessonInput, LessonPlan } from "./lesson-types";

const sessionCountMap: Record<string, number> = {
  "1차시": 1,
  "2차시": 2,
  "4차시": 4,
  "6차시": 6,
  "8차시": 8,
  "10차시 이상": 10,
};

function getSessionCount(value: string) {
  return sessionCountMap[value] ?? 4;
}

export function createFallbackLesson(input: LessonInput): LessonPlan {
  const count = getSessionCount(input.sessions);
  const flow = Array.from({ length: count }, (_, index) => {
    const session = index + 1;
    return `${session}차시: ${input.caseField}의 실제 문제를 한 가지 제시하고, 학생들이 문제 상황을 관찰한 뒤 ${input.tool}로 해결 아이디어를 실험한다. 활동 말미에는 모둠별 근거, 한계, 개선점을 3문장으로 정리한다.`;
  });

  return {
    title: `${input.grade} ${input.subject} 사례 기반 ${input.topic} 수업설계안`,
    subtitle: `${input.schoolLevel} · ${input.sessions} · ${input.method} · ${input.studentLevel}`,
    summary: `${input.caseField} 사례를 중심으로 학생이 문제를 발견하고, AI 도구를 활용해 해결안을 만들어 공유하는 참여형 PBL 수업입니다.`,
    sections: [
      {
        id: "overview",
        title: "수업 개요",
        content: [
          `대상은 ${input.schoolLevel} ${input.grade}이며, ${input.subject} 교과에서 ${input.topic}을 다룹니다.`,
          `수업은 ${input.sessions} 동안 ${input.method}으로 운영하고, 모든 차시에 ${input.caseField}의 현실 문제 상황을 포함합니다.`,
          `학생 수준은 ${input.studentLevel}으로 가정하여 용어 설명, 예시, 실습 단계를 작게 나누어 제공합니다.`,
        ],
      },
      {
        id: "objectives",
        title: "학습 목표",
        content: [
          `${input.topic}의 핵심 개념을 실제 사례와 연결해 설명할 수 있다.`,
          `${input.tool}를 활용해 사례 문제를 탐색하고 해결 아이디어를 시각화하거나 글로 표현할 수 있다.`,
          `AI 활용 결과의 장점, 한계, 윤리적 고려사항을 근거와 함께 말할 수 있다.`,
        ],
      },
      {
        id: "flow",
        title: "차시별 수업 흐름",
        content: flow,
      },
      {
        id: "caseActivities",
        title: "실제 사례 기반 활동",
        content: [
          `도입: ${input.caseField}에서 학생이 겪을 법한 구체적 장면을 제시하고, AI가 도움을 줄 수 있는 지점을 표시하게 합니다.`,
          `탐구: 모둠별로 사례 속 이해관계자, 필요한 데이터, 예상되는 위험을 분류합니다.`,
          `공유: 해결안 발표 후 다른 모둠이 “현실성, 공정성, 안전성” 관점에서 피드백합니다.`,
        ],
      },
      {
        id: "project",
        title: "프로젝트 활동",
        content: [
          `프로젝트 과제: ${input.caseField} 문제를 해결하는 AI 활용 수업 산출물을 제작합니다.`,
          `산출물 예시: 문제 정의서, AI 활용 절차, 결과물 화면, 한계와 보완 계획, 발표 자료.`,
          `교사는 문제 범위를 좁혀 주고, 학생은 모둠 역할을 정해 자료 조사, 도구 실습, 검토, 발표를 나눠 수행합니다.`,
        ],
      },
      {
        id: "worksheet",
        title: "학생 활동지 초안",
        content: [
          "1. 오늘의 사례에서 가장 불편하거나 해결이 필요한 장면은 무엇인가요?",
          "2. AI가 이 문제를 도울 수 있다면 어떤 입력 자료가 필요할까요?",
          "3. 모둠이 만든 해결안의 좋은 점과 걱정되는 점을 각각 한 가지씩 쓰세요.",
          "4. 실제 학교나 지역사회에 적용하려면 무엇을 더 확인해야 할까요?",
        ],
      },
      {
        id: "teacherNotes",
        title: "교사용 지도 포인트",
        content: [
          `학생이 ${input.tool} 사용법에 머무르지 않고 문제 정의와 근거 설명까지 하도록 질문을 제공합니다.`,
          "AI 결과를 정답처럼 받아들이지 않도록 출처 확인, 편향 가능성, 개인정보 보호를 반복 점검합니다.",
          `${input.studentLevel} 학생에게는 예시 프롬프트와 부분 완성 활동지를 제공하고, 심화 학생에게는 개선 실험을 추가합니다.`,
        ],
      },
      {
        id: "assessment",
        title: "평가 방법",
        content: [
          "과정 평가: 문제 분석 기록, 모둠 토의 참여, AI 도구 활용 과정 관찰.",
          "결과 평가: 사례 적합성, 해결안의 구체성, 윤리·안전 고려, 발표 설득력.",
          "자기 평가: 내가 기여한 역할, 새로 이해한 AI 개념, 다음 개선 계획을 성찰문으로 제출.",
        ],
      },
      {
        id: "rubric",
        title: "수행평가 루브릭",
        content: [
          "우수: 실제 사례의 문제를 명확히 정의하고, AI 활용 과정과 한계를 근거 있게 설명한다.",
          "보통: 사례와 AI 활용 방법을 연결해 설명하며, 기본적인 개선 의견을 제시한다.",
          "노력 필요: 사례 이해나 AI 활용 설명이 부분적이므로 교사의 예시와 추가 질문이 필요하다.",
        ],
      },
      {
        id: "reflection",
        title: "수업 후 성찰 질문",
        content: [
          "AI가 문제 해결에 도움이 된 순간과 그렇지 않은 순간은 언제였나요?",
          "우리 모둠의 해결안을 실제로 적용할 때 가장 먼저 확인해야 할 위험은 무엇인가요?",
          "다음 수업에서 더 깊이 탐구하고 싶은 AI 사례는 무엇인가요?",
        ],
      },
    ],
  };
}
