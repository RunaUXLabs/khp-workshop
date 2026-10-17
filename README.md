# AI 서비스 기획 디자인 · KHP 특강

33개 강연 항목, 5개 심화 가이드, 상세 페르소나 배경과 대화 샘플, 세 단계 서비스 UI 비교 및 Mermaid 흐름도를 포함한 GitHub Pages용 정적 프로젝트입니다.

## 실행

### 문구·스타일을 수정하며 확인하기

`pnpm dev`를 실행합니다. JSON·CSS·강의 JavaScript는 원본을 직접 읽으므로 저장 후 브라우저를 새로고침하면 반영됩니다. 서비스 개선형 React 코드도 감시해 다시 빌드합니다. 자동 새로고침 기능은 없습니다.

기존 `pnpm run preview`가 실행 중이면 해당 터미널에서 Ctrl+C로 종료한 뒤 `pnpm dev`를 실행하세요. 두 명령은 기본 포트 4173을 함께 사용합니다.

왼쪽 상단 제목은 `src/data/lecture.json`의 `title`, 그 아래 브랜드명은 `subtitle`입니다. `dist`는 빌드 결과이므로 직접 수정하지 않습니다. `preview`와 Pages 배포는 `pnpm run build`를 실행해야 원본 변경이 반영됩니다.

### 표지의 Slido 주소 바꾸기

처음 접속하면 `#cover`에서 Slido 프레젠테이션이 표시됩니다. 왼쪽 상단 로고를 누르면 표지로 돌아오고, ‘수업 시작’으로 기존 첫 강의 항목을 엽니다. 기존 강의 번호와 직접 연결 주소는 유지합니다.

다음 특강에서는 `src/data/lecture.json`의 **`cover.slidoUrl`**을 출력용 Slido Present 모드 주소로, **`cover.slidoParticipationUrl`**을 학생용 참여 주소로 각각 바꾸세요. 표지 제목은 `cover.title`에서 수정합니다. 로그인·비밀번호·행사 활성 상태는 Slido에서 관리합니다. ‘slido 새 창에서 참여하기’는 학생용 참여 화면을 엽니다. 배포 사이트에 반영하려면 변경을 커밋하고 `main`에 push합니다.

`wall.sli.do` 주소에 `integration=slido-admin`이 포함돼 있으면 관리자 창을 찾으려 하므로 표시 전에 이 파라미터를 제거합니다. 행사 ID와 `section`은 유지합니다.

Node.js 20.19 이상과 pnpm을 사용합니다. SEED 공식 React·CSS 패키지를 사용하므로 최초 실행·의존성 변경 시 설치가 필요합니다. 전역 npm 설치는 필요하지 않습니다.

```sh
pnpm install --frozen-lockfile
pnpm run build
pnpm run check
pnpm run preview
```

http://127.0.0.1:4173 에서 강연, /demo/ 에서 최초형, /demo-css/ 에서 CSS 일부 적용형, /demo-seed/ 에서 공식 SEED React 개선형을 봅니다. ES 모듈·JSON을 불러오므로 파일 더블클릭 대신 HTTP 서버로 실행하세요.

## 파일 구성

- `index.html`: 앱 진입용 HTML 셸
- `src/components/`: Sidebar, LectureContent, GuidePanel, LectureController, DiagramViewer
- `src/data/`: 강연 콘텐츠와 심화 가이드 JSON
- `src/demo/`: 조건 확인·후보 비교 컴포넌트와 상태 모델
- `src/demo-seed/`: 공식 SEED React 컴포넌트로 구성한 모바일 9단계 흐름
- `src/demo-seed/seed-design/ui/`: 공식 CLI로 설치한 SEED 스니펫
- `src/components/DemoComparison.js`: 최초형 → CSS 일부 적용 → 공식 컴포넌트·모바일 흐름의 3단계 전환 뷰
- `src/styles/`: 강연·서비스·도식 스타일
- `public/`: 로컬 Markdown 파서, SVG·Mermaid 코드, 다운로드 양식
- `scripts/`: 정적 빌드·로컬 미리보기
- `.github/workflows/pages.yml`: GitHub Pages 배포

콘텐츠는 `src/data/lecture.json`, 심화 자료는 `src/data/guides.json`에서 수정합니다. `title`은 본문 제목, 선택 항목 `tocTitle`은 사이드바 전용 제목입니다. 상세 배경과 대화 샘플 원문은 `public/examples/*.md`에서 수정하며 가이드의 `source`가 이 파일을 가리킵니다. `LECTURE.md`는 참고용 자료이며 웹페이지의 원본은 JSON입니다. 스타일과 동작은 HTML 본문에 합치지 않습니다.

## GitHub Pages 배포

이 프로젝트 폴더의 내용만 새 저장소의 루트에 올립니다. 상위 폴더의 원본 강의·백업·개인 파일을 함께 올리지 마세요. GitHub 저장소 Settings → Pages → Source에서 **GitHub Actions**를 선택하고 main 브랜치에 push하면 workflow가 dist를 배포합니다. 저장소 이름 아래의 경로에서도 동작하도록 자산은 상대 경로를 사용합니다.

배포 대상 저장소는 `RunaUXLabs/khp-workshop`입니다. Pages의 Source는 **GitHub Actions**로 설정합니다. `main`에 push하면 Node.js 24·pnpm 11.25.0으로 잠금파일 설치 → 빌드 → `pnpm run check` → 아티팩트 업로드 → Pages 배포를 진행합니다. Actions 화면에서 성공 여부와 실제 배포 주소를 확인할 수 있습니다. `dist/`와 `node_modules/`는 커밋하지 않습니다.

예상 사이트 주소: https://runauxlabs.github.io/khp-workshop/ (최초 배포 성공 후 이용 가능)

## 서비스 데모 범위

수업용 합성자료로 작동하는 브라우저 시제품입니다. 실제 AI 호출·계정·서버 저장·외부 공유·예약·결제는 없습니다. 미응답 차단, 조건 충돌, 개인 동의, 지수의 최종 확정, 조건 변경 후 동의·확정 해제를 직접 조작할 수 있습니다. 데이터는 새로고침하면 초기화됩니다. 비공개 사유는 수집하지 않습니다.

Figma 결과: https://www.figma.com/design/2LiYcXpP3w0eX7yjnXouzU/?node-id=4-130

편집 가능한 텍스트 103개, 프레임 23개, 라이브러리 버튼 인스턴스 7개로 구성했습니다. 화면 전체를 이미지로 붙인 구조가 아닙니다. `public/images/figma-service-overview.png`는 강연에서 보여주는 결과 참고 이미지입니다.

GitHub Pages 배포 방식 참고: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

`public/vendor/marked.min.js`는 Marked 12.0.2 (MIT)입니다. 같은 폴더의 LICENSE를 확인하세요. 강의 글꼴은 CDN으로 불러오는 Pretendard Variable 웹폰트입니다. 본문은 16px, 보조 설명은 최소 14px입니다. 서비스 개선형은 Noto Sans KR·시스템 글꼴을 사용합니다.

## SEED 개선형과 비교

첫 강의 항목에서는 최초형만 보여줍니다. 시작 카테고리의 여섯 번째 항목 `#design-comparison`과 Figma 실습 항목에서는 세 버전을 전환하며 비교합니다. 단계 전환 시 선택한 상황으로 초기화되며, 입력값은 다른 버전으로 전달하지 않습니다. 서비스 기능·스타일은 유지하고, 상황 선택과 참여자 전환은 세 버전 공통으로 서비스 바깥의 ‘실습 조작’에 모았습니다. 새 창에도 같은 조작부가 표시됩니다.

- 공식 패키지: `@seed-design/css@3.0.2`, pnpm-lock.yaml로 고정
- CSS 일부 적용형: 최초형의 네이티브 UI·동작을 유지하고 공개 SEED CSS 토큰을 일부 적용한 학습용 중간 예시입니다.
- 공식 컴포넌트 개선형: `@seed-design/react@3.0.0`, 공식 CLI의 ActionButton·TextField·RadioSelectBox·Badge·Callout·List·ListHeader·ResultSection 및 Divider·Icon·Box·VStack·HStack·Text를 사용합니다.
- 흐름: 시작 → 날짜 → 예산 → 필수 조건 → 공유 범위 → 내 조건 확인 → 후보 선택 → 참여자별 동의 → 확정 완료. 이전 이동 시 입력을 유지합니다.
- 교안·최초형은 바닐라 ES 모듈이며 개선형만 React/esbuild로 별도 빌드합니다. CSS·JS·콘텐츠는 별도 파일로 배포합니다.
- 도메인 모델: `src/demo/model.js`를 두 버전이 공유합니다.
- 이전 Figma CSS 매핑 시안: https://www.figma.com/design/2LiYcXpP3w0eX7yjnXouzU/?node-id=12-79 (현재 React 모바일 흐름과 다릅니다.)
- Figma 공식 SEED 라이브러리 인스턴스는 연결되지 않았습니다. CSS 설치본과 일치하는 로컬 변수 26개, 텍스트 스타일 12개, 버튼·배지 로컬 컴포넌트로 구성했습니다.
- 코드 기반 Figma UI 13개 화면: https://www.figma.com/design/2LiYcXpP3w0eX7yjnXouzU/?node-id=19-28 . 이전 작업 옆에 편집 가능한 텍스트·오토 레이아웃으로 재현했습니다. 공식 published 컴포넌트 인스턴스를 뜻하지 않습니다.
- `skills/seed-design/`에는 사용자가 지정한 공식 스킬과 관련 규칙을 프로젝트 안에 보관했습니다. 사용자 전역 스킬·npm은 설치하지 않았습니다.
- 배포 시 CSS 원본과 Apache-2.0 LICENSE·NOTICE를 `dist/vendor/seed/`에 포함합니다. 당근 로고·서비스 브랜드 자산은 사용하지 않았습니다.

이번에 적용한 규칙과 출처는 [SEED 적용 기록](docs/seed-implementation.md)에 있습니다.
