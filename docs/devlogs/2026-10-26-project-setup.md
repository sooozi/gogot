# 2026-10-26 — 첫 웹 개발 환경과 링크 판별

## 목적·요구사항

기존 README를 보존하고 기능 브랜치에서 웹 MVP의 첫 작업을 수행한다.
모바일 우선 홈, URL 형식 판별, 오류·빈 상태, 공통 검증, 검증 가능한 개발 환경을 만든다.

## 구현·변경 파일

- package.json / package-lock.json: Next·React·TypeScript·Tailwind·Zod·Vitest 의존성 및 스크립트.
- tsconfig.json / next-env.d.ts / postcss.config.mjs / eslint.config.mjs: strict 타입·스타일·린트.
- .gitignore / .env.example / .nvmrc: 생성물·비밀 값 제외와 Node 기준.
- src/app: 한국어 메타데이터, 모바일 홈, 디자인 토큰, 빈·로딩·오류 화면.
- src/features/imports/link-form.tsx: 링크 입력, 결과 안내, 입력 보존, 접근성 속성.
- src/core/imports/classify-link.ts 및 테스트: 플랫폼·형식 판별, 유사 도메인·비정상 입력 거부.
- .github/workflows/ci.yml: PR 및 dev/main의 설치·린트·타입·테스트·빌드.
- docs/architecture.md / README.md: 설계·실행 방법. 기존 README 내용은 보존하고 추가했다.

## 기술 선택과 동작

Next 단일 프로젝트로 시작하고 core에 UI 독립 규칙을 배치한다.
폼은 제출 시 순수 판별 함수를 호출하며 결과는 React 상태에 저장한다.
판별은 네트워크에 접속하지 않는다. URL 패턴 일치와 장소 존재·분석 성공은 다르다.
단축 링크는 실제 목적지를 확인하지 않았다고 표시한다.
실제 DB·로그인·지도·AI·장소 저장은 미구현이며 화면에 이를 명시했다.

## 오류·원인·해결과 대안

- PowerShell npm.ps1 제한: npm.cmd 사용, 실행 정책 변경 없음.
- 로컬 Node 22.12와 도구 하위 의존성 조건 불일치: 프로젝트·CI Node 24 기준.
  시스템 Node는 바꾸지 않고 npm exec의 임시 Node 24.22.1로 검사했다.
- ESLint 10과 Next의 일부 린트 플러그인 peer 범위 불일치: 9.39.5로 고정.
  지원 종료 경고가 남는 개발 도구 제약이며 호환 업데이트 시 교체 필요.
- 내부 홈 이동의 HTML a 태그: Next Link로 수정.
- 기본 export 린트 경고: 명명된 설정 객체로 수정.

## 실행한 검증

- TypeScript strict 검사: 통과.
- Vitest: 1개 파일, 24개 테스트 통과.
- ESLint: 최종 9.39.5에서 오류·경고 없이 통과.
- Next 프로덕션 빌드: 통과, 홈 정적 생성 확인.
- 프로덕션 서버 HTTP: 200, 한국어 lang·본문·입력 폼 마크업 확인.
- npm 의존성 감사: 취약점 0건 보고. 이것이 서비스 보안 보장을 뜻하지 않는다.
- 브라우저 시각·키보드·스크린리더 검증: 도구 부재로 미실행.
- GitHub Actions: 설정만 추가, 원격 실행은 미확인.

## Git과 사용자 검토

- 브랜치: feature/project-setup (기준 dev eafbb5c).
- 이번 신규 커밋·PR: 아직 없음.
- 사용자 승인: 앞서 제안한 첫 개발 범위 진행.
- 구현 코드·디자인·기술 세부 선택의 사용자 직접 검토는 아직 받지 않음.

## 남은 작업

Node 24 환경에서 사용자가 직접 화면·키보드 흐름을 확인한다.
플랫폼별 실제 링크 샘플과 약관·API 범위를 검증한 뒤 인증·DB·수동 등록을 진행한다.
현재 URL 패턴은 지원 목록의 시작점이며 모든 공유 형식을 지원한다고 가정하지 않는다.
지도 제공자·인증 제공자·예산·좌표 없는 장소 정책은 설계 문서 기준으로 검토한다.
