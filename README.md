# 📍 고곳 (GOGOT)

> 가고 싶은 곳을 링크 하나로 저장하고,
> AI가 알아서 정리해 주는 나만의 장소 지도

## 프로젝트 소개

고곳은 인스타그램, 네이버 지도, 카카오맵 등
여러 서비스에 흩어져 있는 가고 싶은 장소를
한곳에 모아 관리하기 위한 개인 프로젝트입니다.

## 해결하고 싶은 문제

- SNS에서 본 장소를 다시 찾기 어렵습니다.
- 서비스마다 저장한 장소가 흩어져 있습니다.
- 장소명, 지역, 카테고리를 수동으로 정리하기 번거롭습니다.

## 주요 기능 (기획 중)

- 링크 입력 및 장소 정보 분석
- AI 기반 카테고리 자동 분류
- 장소 저장, 수정, 삭제
- 지도 기반 장소 조회
- 검색 및 필터
- 위치 기반 장소 알림 (후속 개발 검토)

## 기술 스택 (도입 예정)

- Next.js / React / TypeScript
- 지도 API 및 백엔드 기술은 검토 후 결정

## Git 브랜치 전략

- main: 검증된 안정 버전 및 배포 기준
- dev: 기능 통합 및 테스트
- feature/\*: 기능별 개발 브랜치

작업 흐름: feature/\* → dev → main

## 개발 상태

현재 기획 및 초기 개발 환경 구성 단계입니다.
기능 구현·배포 여부는 개발 진행에 맞춰 업데이트합니다.

## 프로젝트 관리

- GitHub: https://github.com/sooozi/gogot
- Notion: https://app.notion.com/p/40587d32b75881c1b1ecef3723115b02

## 개발 원칙

AI를 개발 보조 도구로 활용하되,
요구사항 정의와 생성 코드 검토,
테스트 결과 확인은 직접 수행합니다.

## 로컬 개발 시작

Node.js 24 LTS와 npm을 사용합니다. Windows PowerShell에서는 `npm.cmd`로 실행할 수 있습니다.

```sh
npm ci
npm run dev
```

브라우저에서 http://localhost:3000 에 접속합니다. 현재는 모바일 홈과 공유 링크의
형식 판별만 제공합니다. 외부 접속·장소 분석·저장·로그인·지도는 아직 연결하지 않았습니다.
실제 API 키 없이 실행할 수 있습니다.

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

- [웹 MVP 아키텍처와 단계별 계획](docs/architecture.md)
- [초기 환경 구축 개발 일지](docs/devlogs/2026-10-26-project-setup.md)
