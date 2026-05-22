export const lessonOptions = {
  schoolLevel: ["초등학교", "중학교", "고등학교", "직업계고", "특수학교", "기타"],
  grade: ["초1", "초2", "초3", "초4", "초5", "초6", "중1", "중2", "중3", "고1", "고2", "고3", "교사 연수", "기타"],
  subject: ["정보", "인공지능", "기술·가정", "진로", "창의적 체험활동", "융합 수업", "기타"],
  topic: ["생성형 AI 이해", "AI 윤리", "데이터 분석", "이미지 인식", "텍스트 분류", "머신러닝 기초", "AI와 진로", "AI 프로젝트", "기타"],
  sessions: ["1차시", "2차시", "4차시", "6차시", "8차시", "10차시 이상"],
  studentLevel: ["AI 경험 없음", "기초 수준", "보통 수준", "심화 수준"],
  tool: ["생성형 AI", "AI 코디니", "AIDU", "Orange3", "Python", "엔트리", "스크래치", "도구 미정"],
  method: ["강의 중심", "실습 중심", "토론 중심", "프로젝트 중심", "PBL", "모둠 활동 중심"],
  caseField: ["생활 속 AI", "학교생활", "진로·직업", "산업 현장", "공공·사회 문제", "환경·안전", "의료·복지", "미디어·콘텐츠", "기타"],
  caseUse: ["도입 사례", "실습 데이터 사례", "토론 사례", "프로젝트 주제", "평가 과제"],
} as const;

export type LessonInput = {
  [K in keyof typeof lessonOptions]: (typeof lessonOptions)[K][number];
};

export type LessonSection = {
  id: string;
  title: string;
  content: string[];
};

export type LessonPlan = {
  title: string;
  subtitle: string;
  summary: string;
  sections: LessonSection[];
};

export type GenerateLessonResponse = {
  plan: LessonPlan;
  source: "openai" | "fallback";
  message?: string;
};

export const fieldLabels: Record<keyof LessonInput, string> = {
  schoolLevel: "학교급",
  grade: "학년",
  subject: "교과",
  topic: "수업 주제",
  sessions: "총 차시",
  studentLevel: "학생 수준",
  tool: "활용 도구",
  method: "수업 방식",
  caseField: "사례 분야",
  caseUse: "사례 적용 방식",
};

export const defaultLessonInput: LessonInput = {
  schoolLevel: "중학교",
  grade: "중1",
  subject: "인공지능",
  topic: "생성형 AI 이해",
  sessions: "4차시",
  studentLevel: "기초 수준",
  tool: "생성형 AI",
  method: "PBL",
  caseField: "학교생활",
  caseUse: "프로젝트 주제",
};
