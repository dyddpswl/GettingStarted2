# 교육대학원생을 위한 웹 앱 개발 입문

Vite + React + TypeScript로 만든 프론트엔드 학습용 웹 앱입니다. 웹 앱의 기본 개념, React 컴포넌트, TypeScript 타입, GitHub 업로드, Vercel 배포 흐름을 카드와 체크리스트로 익힐 수 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버가 열리면 터미널에 표시되는 주소로 접속합니다. 보통 `http://localhost:5173`에서 확인할 수 있습니다.

## 빌드 확인

```bash
npm run build
```

빌드가 성공하면 `dist` 폴더에 배포용 파일이 생성됩니다.

## 주요 파일

- `src/App.tsx`: 학습 카드, 단계별 개발 흐름, 체크리스트 UI
- `src/App.css`: 반응형 화면과 카드형 UI 스타일
- `src/index.css`: 전체 색상, 폰트, 기본 스타일

## GitHub에서 Vercel로 배포하기

1. GitHub에서 새 저장소를 만듭니다.
2. 로컬 프로젝트에서 변경 내용을 커밋합니다.

```bash
git add .
git commit -m "Create learning web app"
git branch -M main
git remote add origin https://github.com/사용자이름/저장소이름.git
git push -u origin main
```

3. Vercel에 로그인한 뒤 **Add New Project**를 선택합니다.
4. GitHub 저장소를 가져오고 Framework Preset이 **Vite**인지 확인합니다.
5. 기본 설정 그대로 **Deploy**를 누르면 배포가 시작됩니다.
6. 이후 GitHub에 다시 푸시하면 Vercel이 자동으로 새 버전을 배포합니다.

## 학습 포인트

- React는 화면을 컴포넌트 단위로 나누어 관리합니다.
- TypeScript는 데이터 구조를 타입으로 정해 실수를 줄입니다.
- 체크리스트 기능은 `useState`로 상태가 화면에 반영되는 과정을 보여줍니다.
- Vite는 빠른 개발 서버와 간단한 빌드 흐름을 제공합니다.
