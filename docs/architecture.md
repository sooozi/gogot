# GOGOT 웹 MVP 설계

작성: 2026-10-26. 이 문서의 미구현 항목은 제안이며 확정·완료를 뜻하지 않는다.

## 목표와 범위

모바일 우선 웹에서 링크 입력 → 장소 후보 확인·수정 → 저장 → 목록·지도 검색을 제공한다.
입력 최소화가 우선이며 자동 추출 실패 시 수동 등록을 제공한다.
현재 구현은 링크 형식 판별과 홈 화면뿐이다. 실제 분석·저장·인증·지도는 미구현이다.

## 구조와 모바일 확장

- `src/app`: Next 페이지, 레이아웃, 로딩·오류 상태. 향후 `/api/v1` HTTP 진입점.
- `src/features`: 기능별 웹 UI와 상호작용.
- `src/core`: React·Next·브라우저 저장소에 의존하지 않는 타입, 검증, 규칙.
- `src/server` (추후): 인증, 서비스, DB 접근, 외부 제공자 연동. 서버 전용 모듈로 보호.
- `src/components/ui` (필요 시): 실제로 반복되는 UI.
- `supabase/migrations` (추후): 스키마·RLS 변경 이력.
- `docs`: 기술 결정과 개발 기록.

단일 저장소로 시작하고 Expo 개발 시 core와 API 계약을 공유 패키지로 이동한다.
웹·앱은 같은 API·DB를 사용한다. Server Component는 서비스를 직접 호출할 수 있다.
지도 렌더링, OAuth 콜백, 토큰 저장, 위치·알림·공유는 플랫폼별 구현이다.
웹 SSR 쿠키와 앱 보안 저장소 기반 토큰을 서버에서 검증한 뒤 동일한 사용자 ID로 처리한다.

## 기술 결정

Next App Router + React + strict TypeScript + Tailwind를 사용한다.
Zod는 입력 및 향후 API·AI 응답의 런타임 검증에 사용한다.
Node 24를 로컬·CI 기준으로 한다. Node 22.12에서는 일부 린트 도구가 지원되지 않는다.
ESLint와 빌드는 별도 검사한다. 순수 로직은 Vitest로 검증한다.
Next 설정의 React·접근성·import 플러그인이 ESLint 10 peer 범위를 선언하지 않아
ESLint 9.39.5를 고정했다. 이 버전은 지원 종료 경고가 있으므로 개발 도구의 알려진
제약으로 기록하고 플러그인 호환 릴리스가 나오면 10으로 올린다.
상태 라이브러리는 보류한다. 검색·필터는 URL, 폼은 React 상태로 시작한다.
상호작용 테스트 필요 시 RTL, 주요 서비스 흐름 완성 시 Playwright를 추가한다.

DB·인증은 관계형 데이터와 RLS가 있는 Supabase를 우선 검토한다.
Firestore는 문서 모델 대안이며 별도 PostgreSQL+인증은 운영 부담을 비교한다.
지도는 국내 MVP를 가정해 카카오 Local과 Maps를 먼저 검증하고 네이버와 비교한다.
Google은 해외 확장 필요와 데이터 저장 제한을 함께 검토한다.
AI는 근거 텍스트 정리·분류에만 사용하며 모델은 한국어 샘플 정확도·수정률·비용 평가 후 확정한다.

## 링크 처리와 보안

현재 판별기는 제한된 공유 URL 형식만 허용하며 네트워크에 접속하지 않는다.
recognized는 URL 패턴 일치이며 장소 존재·게시물 접근·자동 추출 성공을 의미하지 않는다.
naver.me는 일반 네이버 단축 URL이므로 목적지를 보기 전 지도 링크라고 확정할 수 없다.
원본 쿼리는 유지하고 fragment만 제거한다. 외부 접속 전 별도 보안 검증이 필요하다.

후속 처리: URL 판별 → 허용된 자료 확보 → 장소 검색 → 필요 시 AI 정리 → 사용자 확인 → 저장.
단축 링크는 매 리다이렉트의 HTTPS·호스트·DNS·내부 IP를 검사하고 횟수·크기·시간을 제한한다.
임의 URL 크롤링이나 로그인 우회를 구현하지 않는다.
Meta 권한·약관·정보 제공 범위는 확인되지 않았다. 인스타그램 자동 추출을 보장하지 않는다.
지도 API 결과의 영구 저장·재표시·AI 전달 허용 범위를 제공자별로 확인한다.
사용자 소유권 검사와 RLS를 함께 적용하고 두 계정으로 교차 접근을 검증한다.
개인 데이터 공유 캐시 금지, 비밀 키 서버 보관, 분석 호출 한도와 비용 제한을 적용한다.

## 데이터와 UX 초안

saved_places: id, user_id, name, address, latitude, longitude, category, region,
memo, source_url, normalized_url, platform, provider_place_id, confirmed_at, created_at, updated_at.
주소·좌표 미확정 저장은 허용하는 안을 검토한다. 좌표가 없으면 목록에만 표시한다.
AI 제안은 저장 전 초안이며 사용자의 확인을 거쳐 확정한다.
중복 장소는 경고 후 선택, 다중 장소 게시물은 MVP에서 한 곳 선택을 제안한다.
지도 외 목록을 제공하고 폼 라벨·키보드·포커스·결과 알림을 지원한다.
오류 시 입력을 유지한다. 지도는 지연 로딩하고 데이터가 늘면 클러스터링을 검토한다.

## 개발 순서와 검토 사항

1. 환경·홈·링크 판별·테스트.
2. 플랫폼별 실제 링크 샘플과 공식 API·약관 기술 검증.
3. 인증·DB·수동 CRUD·소유권 테스트.
4. 장소 검색·후보 선택·실패 전환.
5. AI 평가·분석·확인·호출 제한.
6. 검색·필터·지도.
7. 접근성·성능·보안·탈퇴·데이터 정책·운영 검증.

국내 우선 여부, 로그인 제공자, 월 예산, 좌표 없는 장소, 카테고리,
배포 제공자와 DB 지역은 사용자 검토가 필요하다. 위치 알림·동선·추천·공유는 후속 범위다.
feature/* → dev → main PR 흐름을 사용하고 보호 규칙은 별도 확인한다.

## 근거

- https://nextjs.org/docs/app/getting-started/installation
- https://nodejs.org/en/about/previous-releases
- https://zod.dev/
- https://supabase.com/docs/guides/auth/server-side
- https://developers.kakao.com/docs/en/local/dev-guide
- https://developers.naver.com/docs/serviceapi/search/local/local.md
- https://developers.google.com/maps/documentation/places/web-service/policies
- https://developers.openai.com/api/docs/models/gpt-5.4-mini
- https://docs.expo.dev/guides/authentication/
