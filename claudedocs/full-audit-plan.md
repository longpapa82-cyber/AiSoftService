# AI Soft 랜딩 — 전체 검수 계획 (기능·보안·사실·법규)

**목표**: 기능 동작, 보안 취약성, 사실 정확성, 법규 위배 여부를 전 영역 검수하고, **발견된 오류/수정사항이 0이 될 때까지 발견→수정→재검증 루프를 반복**한다.

**대상**: React + Vite 정적 랜딩 (백엔드·인증·DB·사용자입력 없음). 소스 21파일, 외부 링크 11개.

**종료 조건**: 한 라운드 전체를 돌았을 때 신규 발견 0건 + 빌드/타입체크 통과.

---

## 검수 영역 (5개 트랙)

### 트랙 1 — 기능 동작 (Functional)
- 1.1 빌드/타입체크 통과 (`tsc --noEmit`, `vite build`)
- 1.2 외부 링크 11개 전수 생존 확인 (App Store·Play·웹·Unsplash) — 200 + 실제 콘텐츠 일치
- 1.3 핵심 인터랙션: XP 카운트업, 스크롤 진행바, 섹션 수집 카운터(N/3), UNLOCKED 토스트, 호버/틸트
- 1.4 네비게이션: 헤더 앵커(#promo-*, #technology, #about), 스킵 링크, 모바일 메뉴 토글
- 1.5 이메일 복사(clipboard) + mailto 폴백
- 1.6 반응형: 320/375/768/1024/1440 오버플로 없음, 레이아웃 정상
- 1.7 접근성: 키보드 포커스 순서, aria-label/role, reduced-motion 전수 정지, 색 대비

### 트랙 2 — 보안 취약성 (Security)
- 2.1 시크릿/키/토큰 하드코딩 (정적 스캔)
- 2.2 XSS: dangerouslySetInnerHTML / innerHTML / 미살균 삽입
- 2.3 외부 링크 `target="_blank"` → `rel="noopener noreferrer"` 누락 (tabnabbing)
- 2.4 의존성 취약점 (`npm audit`)
- 2.5 외부 이미지/리소스 출처 신뢰성 (Unsplash 원격 URL)
- 2.6 클립보드/스토리지 등 브라우저 API 오용
- 2.7 (배포 시) CSP·보안 헤더 권고 — 정적 호스팅 기준 점검

### 트랙 3 — 사실 정확성 (Factual)
- 3.1 회사 정보: 대표(박훈재)·이메일(longpapa82@gmail.com)·주소 — 메모리 기록과 일치
- 3.2 수치 주장: "3만+ 시설"(myPet), "37개국 10,000명+ 셀럽"(내새끼), "17개 언어/20+ 여행지"(myTravel) — 이전 사용자 확인 "모두 실제와 일치" 재확인
- 3.3 도출 수치: "3 SERVICES / 3 PLATFORMS"(Hero), Technology 카드 수치 — 데이터(services.ts)와 코드 도출 일치
- 3.4 서비스 설명·기능 카피가 실제 앱과 부합
- 3.5 앱 링크가 올바른 앱/국가코드 가리킴

### 트랙 4 — 법규 위배 (Legal)
- 4.1 표시광고법: 근거 없는 수치·과장("100% 보장" 류) 부재 — 데이터 도출만 사용 확인
- 4.2 셀럽 표기(BTS·아이유·손흥민 등): "공개 소식"만 명시 + 초상권 회피(원형 아바타) 유지
- 4.3 개인정보: 폼·수집·쿠키 없음 확인 (mailto만) → 개인정보처리방침 의무 약함(이전 결정: 미추가)
- 4.4 저작권: 외부 이미지(Unsplash) 라이선스, 폰트 라이선스, © 표기
- 4.5 깨진/오해 소지 법적 링크 부재 (이전 footer 정리 유지 확인)

### 트랙 5 — 코드 품질 (Quality, 회귀 방지)
- 5.1 console.log/debugger/TODO/FIXME 부재
- 5.2 `any` 사용·불안전 캐스팅
- 5.3 effect cleanup(타이머·observer·리스너·rAF) 누수
- 5.4 파일/함수 크기, 중복

---

## 실행 루프 (오류 0까지 반복)

```
ROUND N:
  1) 5개 트랙 전수 점검 (자동 스캔 + 코드 정독 + 브라우저 검증)
  2) 발견 사항을 심각도(CRITICAL/HIGH/MEDIUM/LOW)로 분류·기록
  3) CRITICAL/HIGH/MEDIUM 전부 수정 (LOW는 가치 판단)
  4) 수정 후 빌드/타입체크 재실행
  5) 신규 발견 0 && 빌드 통과 → 종료
     아니면 → ROUND N+1
```

각 라운드 결과는 본 문서 하단 "라운드 로그"에 누적 기록한다.

---

## 검증 도구
- 정적: grep 스캔, `tsc --noEmit`, `vite build`, `npm audit`
- 동적: Playshot(headless Chromium) — 링크 생존, 인터랙션, 반응형, reduced-motion, 키보드
- 수동 대조: 회사정보 메모리, 이전 사용자 확인(수치 "실제와 일치") 기록

## 범위 밖
- 백엔드/서버/DB (존재하지 않음)
- 실제 앱(myTravel 등) 내부 — 링크 생존만 확인, 앱 내용 검수는 별도 프로젝트
- 부하/성능 벤치마크 (별도 요청 시)

---

## 라운드 로그

### ROUND 1 — 발견 0건 ✅ (종료 조건 충족)

**기능**: 빌드·tsc PASS / 외부링크 11개 전부 200+앱일치 / XP 9,999·수집 3/3·토스트 정상 / 앵커 누락0·콘솔에러0 / 반응형 320~1440 오버플로0 / reduced-motion 무한애니 잔존0·img alt 누락0·h1 단일

**보안**: 시크릿 없음 / XSS(innerHTML·eval) 없음 / target=_blank 3곳 전부 rel=noopener noreferrer / npm audit 0 vulnerabilities

**사실**: 회사정보(박훈재/longpapa82@gmail.com/안양 주소) 메모리 일치 / 수치주장 사용자확인 "실제 일치" / Hero 도출수치 services.ts .length 자동도출

**법규**: 표시광고-근거수치만 / 셀럽 "공개소식"+아바타 초상권회피 / 개인정보 수집표면0(폼·쿠키·스토리지 없음, mailto+자기이메일 clipboard만) / 저작권 ©2026, 폰트 SIL OFL, 이미지 Unsplash License — 전부 상업적 무료

**결론**: 신규 발견 0 + 빌드 통과 → 종료 조건 충족. ROUND 2 불필요.
직전 /code-review에서 setTimeout 누수 1건 수정 완료(커밋 반영)되어 진입 시점에 이미 클린 상태였음.
