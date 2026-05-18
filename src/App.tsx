import { useMemo, useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

type Lesson = {
  title: string
  tag: string
  description: string
  points: string[]
}

type FlowStep = {
  title: string
  detail: string
}

type ChecklistItem = {
  id: string
  label: string
}

const lessons: Lesson[] = [
  {
    title: '웹 앱의 큰 그림',
    tag: 'Web App',
    description:
      '브라우저, 주소, 화면, 사용자 상호작용이 어떻게 하나의 앱 경험으로 이어지는지 먼저 잡아봅니다.',
    points: ['HTML은 구조', 'CSS는 표현', 'TypeScript는 안전한 로직'],
  },
  {
    title: 'React로 화면 나누기',
    tag: 'React',
    description:
      '반복되는 UI를 컴포넌트로 나누고, 상태가 바뀌면 화면이 다시 그려지는 흐름을 익힙니다.',
    points: ['컴포넌트', 'props', 'useState'],
  },
  {
    title: 'TypeScript로 실수 줄이기',
    tag: 'TypeScript',
    description:
      '학습 카드, 단계, 체크리스트 같은 데이터의 모양을 타입으로 정해 더 읽기 쉬운 코드를 만듭니다.',
    points: ['type 정의', '배열 데이터', '자동완성'],
  },
  {
    title: 'GitHub와 Vercel 배포',
    tag: 'Deploy',
    description:
      '코드를 GitHub에 올리고 Vercel과 연결해 누구나 접속할 수 있는 학습 앱으로 배포합니다.',
    points: ['커밋', '푸시', '자동 배포'],
  },
]

const flowSteps: FlowStep[] = [
  {
    title: '1. 프로젝트 실행',
    detail: 'npm install 후 npm run dev로 로컬 개발 서버를 열고 화면을 확인합니다.',
  },
  {
    title: '2. 컴포넌트 수정',
    detail: 'src/App.tsx에서 카드, 단계, 체크리스트 데이터를 바꾸며 React 구조를 익힙니다.',
  },
  {
    title: '3. 타입 확인',
    detail: '데이터 모양이 달라질 때 TypeScript가 알려주는 오류를 읽고 수정합니다.',
  },
  {
    title: '4. GitHub 업로드',
    detail: '변경 내용을 커밋하고 GitHub 저장소에 푸시해 배포 준비를 마칩니다.',
  },
  {
    title: '5. Vercel 배포',
    detail: 'Vercel에서 GitHub 저장소를 선택하면 빌드와 배포가 자동으로 이어집니다.',
  },
]

const checklist: ChecklistItem[] = [
  { id: 'run-dev', label: 'npm run dev로 화면 열어보기' },
  { id: 'edit-title', label: '학습 카드 제목 하나 바꿔보기' },
  { id: 'state', label: '체크리스트 상태 변화 관찰하기' },
  { id: 'github', label: 'GitHub에 커밋과 푸시하기' },
  { id: 'vercel', label: 'Vercel에서 배포 주소 확인하기' },
]

function App() {
  const [checkedItems, setCheckedItems] = useState<string[]>(['run-dev'])

  const completedCount = checkedItems.length
  const progress = useMemo(
    () => Math.round((completedCount / checklist.length) * 100),
    [completedCount],
  )

  const toggleItem = (id: string) => {
    setCheckedItems((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">교육대학원생을 위한 웹 앱 개발 입문</p>
          <h1 id="page-title">처음 만드는 React 학습 웹 앱</h1>
          <p className="hero-text">
            웹 앱의 기본 개념부터 GitHub와 Vercel 배포까지, 수업에서 바로
            따라 할 수 있는 작은 학습 여정을 한 화면에 담았습니다.
          </p>
          <div className="hero-actions" aria-label="핵심 학습 주제">
            <span>Web App</span>
            <span>React</span>
            <span>TypeScript</span>
            <span>Vercel</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img src={heroImg} alt="" />
          <div className="lesson-preview">
            <strong>{progress}%</strong>
            <span>학습 준비도</span>
          </div>
        </div>
      </section>

      <section className="section-block" aria-labelledby="lesson-heading">
        <div className="section-heading">
          <p className="eyebrow">Learning Cards</p>
          <h2 id="lesson-heading">핵심 개념을 카드로 훑어보기</h2>
        </div>
        <div className="lesson-grid">
          {lessons.map((lesson) => (
            <article className="lesson-card" key={lesson.title}>
              <span className="tag">{lesson.tag}</span>
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              <ul>
                {lesson.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block flow-layout" aria-labelledby="flow-heading">
        <div className="section-heading">
          <p className="eyebrow">Development Flow</p>
          <h2 id="flow-heading">개발부터 배포까지의 흐름</h2>
        </div>
        <div className="flow-list">
          {flowSteps.map((step) => (
            <article className="flow-step" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block checklist-panel" aria-labelledby="check-heading">
        <div className="check-summary">
          <p className="eyebrow">Practice Checklist</p>
          <h2 id="check-heading">오늘의 실습 체크리스트</h2>
          <p>
            완료한 항목을 직접 눌러보며 React의 상태 관리가 UI에 반영되는
            과정을 확인해보세요.
          </p>
          <div className="progress-track" aria-label={`진행률 ${progress}%`}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <strong>
            {completedCount} / {checklist.length} 완료
          </strong>
        </div>
        <div className="checklist">
          {checklist.map((item) => {
            const isChecked = checkedItems.includes(item.id)

            return (
              <label className="check-item" key={item.id}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(item.id)}
                />
                <span>{item.label}</span>
              </label>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default App
