# SEED React 모바일 개선형

확인일: 2026-10-17. 이전 CSS 재현 구현을 제거하고 공식 React 컴포넌트로 교체했습니다. 교안과 최초형은 바닐라 구조를 유지하며 개선형만 React/esbuild로 빌드합니다.

## 실제 컴포넌트

| 역할 | 공식 컴포넌트 |
|---|---|
| 배치·텍스트 | Box, VStack, HStack, Text |
| 행동 | ActionButton |
| 입력 | TextField, TextFieldInput, TextFieldTextarea |
| 날짜·공유 범위·후보 선택 | RadioSelectBoxRoot, RadioSelectBoxItem, RadioSelectBoxRadiomark |
| 상태·안내 | Badge, Callout |
| 참여자 상태·조건 요약 | List, ListItem, ListDivider, ListHeader |
| 완료 결과 | ResultSection, Icon |
| 영역 구분·내비게이션 아이콘 | Divider, Icon, PrefixIcon |

공식 CLI가 `seed-design.json` 경로에 설치한 스니펫을 사용합니다. SEED React 3.0.0과 CSS 3.0.2는 공식 `compat` 검사를 통과했습니다. 직접 작성한 레시피 클래스나 입력창·버튼 CSS는 없습니다. `global.css`는 문서 여백·폰트·box-sizing과 프로그램적으로 이동한 제목 포커스만 처리합니다.

## 파운데이션 적용

- 화면 좌우 여백: 공개 `spacingX.globalGutter`, 제목 위 간격: `spacingY.navToTitle`.
- 제목·본문: `screenTitle`, `t5Regular`, 보조 문구: `t4Regular` 등 공개 텍스트 스타일.
- 배경·상태·아이콘: `bg.layerDefault`, `bg.neutralWeak`, `fg.neutralSubtle`, `fg.positive` 등 역할 토큰.
- 간격·반경·아이콘 크기: `x1`~`x12`, `r3` 등 SEED 스케일.
- 웹폰트: Pretendard Variable. 문서 초기화 외의 서비스 컴포넌트 CSS 덮어쓰기는 사용하지 않습니다.
- 공통 실습 조작부는 교안 도구이며 제품 UI 밖의 바닐라 컴포넌트·별도 스타일로 관리합니다.

## 흐름과 규칙

시작 → 날짜 → 예산 → 필수 조건 → 공유 범위 → 내 조건 확인 → 후보 선택 → 참여자별 동의 → 확정 완료.

이전 이동 시 초안을 유지합니다. 예산은 0 초과 1,000 이하, 소수점 한 자리까지 허용하고 필수 조건의 빈 입력을 차단합니다. 변경된 조건 저장 시 이전 동의와 확정을 해제합니다. 미응답·충돌·비공개 조건이 있으면 동의를 차단하고 전원이 동의한 경우 방장 지수만 확정합니다. 참여자 변경과 예시 상황 선택은 서비스 바깥의 공통 실습 조작부입니다. 교안의 비교 뷰·단일 데모와 새 창에서 동일하게 제공하며 01·02의 하단 상황 버튼과 03의 하단 실습 설정은 제거했습니다. 저장한 조건과 동의는 참여자 전환 시 유지하고, 상황 선택·버전 전환은 선택한 예시로 초기화합니다. 새 창 링크는 선택한 상황과 참여자 시점을 전달하며 실행 중인 입력 전체를 복제하지 않습니다.

공유 모델 `src/demo/model.js`는 합성 후보의 예산·날짜·장거리 조건을 비교합니다. 자유롭게 입력한 모든 조건을 AI가 해석하는 기능은 없습니다. 실제 AI·계정·서버·예약·결제는 연결하지 않았습니다.

## Figma

이번 데모 변경은 코드에만 적용했습니다. 아래 Figma 재현은 이전 코드 상태이며, 최종 데모 확인 이후 별도로 갱신합니다.


현재 파일에 연결 가능한 공식 SEED published 라이브러리는 조회되지 않았습니다. 기존 `12:79` 프레임은 CSS 값을 옮긴 로컬 시안으로 보관했습니다. 이후 `19:28` 프레임에 코드 기반 모바일 흐름 9개와 미응답·충돌·전원 동의·조건 변경 상태 4개를 편집 가능한 텍스트·오토 레이아웃으로 추가했습니다. 공식 published 라이브러리 인스턴스 연결과 코드 화면의 편집용 재현을 구분합니다.

## 검증·배포

`pnpm install --frozen-lockfile` → `pnpm run build` → `pnpm run preview`.

개선형은 `dist/demo-seed/app.js`와 `app.css`로 번들링하고 문서 셸·강의 JSON·최초형·자산은 별도 유지합니다. SEED LICENSE·NOTICE와 번들 의존성 라이선스를 배포에 포함합니다.

`pnpm run check`는 배포 결과의 강의·가이드·샘플·도식·실행 자산과 내부 링크, Pages 하위 경로에 맞는 상대 경로를 검사합니다. 개발 중 별도의 브라우저 검사로 입력 검증·값 유지·동의·확정·재확인과 3단계 비교 전환을 확인했습니다.

## 공식 출처

- https://seed-design.io/react/llms.txt
- https://seed-design.io/llms/react/getting-started/cli/configuration.txt
- https://seed-design.io/llms/react/components/select-box.txt
- https://seed-design.io/llms/react/components/text-field-input.txt
- https://github.com/daangn/seed-design

- https://seed-design.io/llms/react/components/list.txt
- https://seed-design.io/llms/react/components/result-section.txt
- https://seed-design.io/llms/foundations/spacing.txt
- https://seed-design.io/llms/foundations/typography.txt
