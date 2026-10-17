# SEED React 모바일 개선형

확인일: 2026-10-16. 이전 CSS 재현 구현을 제거하고 공식 React 컴포넌트로 교체했습니다. 교안과 최초형은 바닐라 구조를 유지하며 개선형만 React/esbuild로 빌드합니다.

## 실제 컴포넌트

| 역할 | 공식 컴포넌트 |
|---|---|
| 배치·텍스트 | Box, VStack, HStack, Text |
| 행동 | ActionButton |
| 입력 | TextField, TextFieldInput, TextFieldTextarea |
| 날짜·공유 범위·후보 선택 | RadioSelectBoxRoot, RadioSelectBoxItem, RadioSelectBoxRadiomark |
| 상태·안내 | Badge, Callout |

공식 CLI가 `seed-design.json` 경로에 설치한 스니펫을 사용합니다. SEED React 3.0.0과 CSS 3.0.2는 공식 `compat` 검사를 통과했습니다. 직접 작성한 레시피 클래스나 입력창·버튼 CSS는 없습니다. `global.css`는 문서 여백·폰트·box-sizing과 프로그램적으로 이동한 제목 포커스만 처리합니다.

## 흐름과 규칙

시작 → 날짜 → 예산 → 필수 조건 → 공유 범위 → 내 조건 확인 → 후보 선택 → 참여자별 동의 → 확정 완료.

이전 이동 시 초안을 유지합니다. 예산은 0 초과 1,000 이하, 소수점 한 자리까지 허용하고 필수 조건의 빈 입력을 차단합니다. 변경된 조건 저장 시 이전 동의와 확정을 해제합니다. 미응답·충돌·비공개 조건이 있으면 동의를 차단하고 전원이 동의한 경우 방장 지수만 확정합니다. 참여자 변경은 별도의 수업용 설정입니다.

공유 모델 `src/demo/model.js`는 합성 후보의 예산·날짜·장거리 조건을 비교합니다. 자유롭게 입력한 모든 조건을 AI가 해석하는 기능은 없습니다. 실제 AI·계정·서버·예약·결제는 연결하지 않았습니다.

## Figma

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
