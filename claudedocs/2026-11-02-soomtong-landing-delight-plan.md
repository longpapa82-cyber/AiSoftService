# AiSoftService 숨통 미니 섹션 — 디자인·모션·내용 강화 상세 계획

> 작성일: 2026-11-02 · 대상 저장소: **AiSoftService**(통합 랜딩) · 브랜치 `feat/integrated-landing`
> 목표: `#promo-soomtong` 미니 섹션에서 **숨통(금연 앱)의 내용이 제대로 전달 + 재미있게** 보이도록 디자인·모션·내용 전면 강화
> 범위: 이전 "최소 정합" 계획([[2026-11-02-soomtong-landing-promo-sync-plan]])을 넘어선 **야심 고도화**. 숨통 전용 시그니처 비주얼 신설.

---

## 0. 요약 (TL;DR)

**현재 문제**: 미니 섹션이 "마스코트 1개 + 비숫자 하이라이트 3개"뿐 → **전달 약함**(금연 앱 특유의 "절약이 쌓이는" 서사 없음) + **재미 약함**(정적).

**해결 전략**: 숨통을 FitSnap(`beforeAfter` 슬라이더)·로픽(`analysisCard` 글래스카드)과 **동급의 "시그니처 전용 비주얼"** 로 승격. 금연 앱의 핵심 가치 3개(①실시간 보상 ②4-7-8 호흡 ③회복 타임라인)를 **하나의 살아있는 대시보드 비주얼**로 구현.

**회귀 통제 핵심**: 공유 `PromoSection.tsx`는 **"새 옵션 필드 + else-if 분기 추가"** 패턴으로만 수정. FitSnap·로픽이 이미 검증한 방식 — **필드 미설정인 다른 11서비스는 기존 분기로 떨어져 완전 불변**. `:global(#promo-soomtong)` CSS 격리.

---

## 1. 전달력 강화 — "숨통이 뭐 하는 앱인지" 한눈에 (내용)

### 1.1 현재 전달 공백
- 하이라이트가 "초 단위 / 4-7-8 / WHO 기준" — **추상적**. 금연 앱의 핵심(돈이 쌓이고·충동을 넘기고·몸이 회복)이 **구체적 수치·서사로 안 보임**.
- 마스코트만 크게 떠 있어 "귀여운 캐릭터 앱"으로 오인될 여지.

### 1.2 강화안: 3가치 서사를 비주얼에 내장
숨통 전용 비주얼(`promo.breathCard` 신설)에 금연 앱 서사를 압축:
1. **실시간 보상** — "지금까지 아낀 돈 128,500원"이 **카운트업**(useCountUp). 아래 "안 피운 담배 460개비 · 되찾은 38시간" 보조 수치.
2. **4-7-8 호흡** — 중앙에 **숨 쉬는 링**(4초 확장→7초 유지→8초 수축 루프). "충동이 올 땐 함께 숨 고르기".
3. **회복 타임라인** — "20분→1년" 미니 진행 바 몇 단계 + 마일스톤 체크. 숨숨이가 끝에서 응원.

→ 한 비주얼로 **"금연하면 돈이 쌓이고(보상), 충동은 호흡으로 넘기고(SOS), 몸이 회복된다(의학)"** 가 즉시 전달.

---

## 2. 재미·연출 강화 (디자인·모션)

### 2.1 숨통 전용 'breath' 모티프 (신규)
현재 `motif: 'none'` → **`motif: 'breath'`** 신설. `:global(#promo-soomtong)`로 격리된 분위기 연출:
- **호흡하는 배경 링**: 민트 동심원이 느리게 확장·페이드(4-7-8 리듬, `@keyframes promo-breath-ring`). 숏킷 cosmos 궤도링·로픽 오로라와 동급의 시그니처 대기감.
- **민트 글로우 드리프트**: 배경 민트 광원이 숨처럼 천천히 밝아졌다 어두워짐(scale/opacity, compositor-only).
- reduce-motion 시 정적(첫 프레임 은은히).

### 2.2 살아있는 수치 (카운트업)
- `useCountUp` 훅(이미 존재, Hero/About/Technology서 사용) → 숨통 보상 수치(절약액·개비·시간)에 적용.
- 뷰포트 진입 시 0→목표, ease-out, reduce-motion 즉시 스냅(훅 내장).
- 숫자 폰트 `tabular-nums`로 자릿수 흔들림 방지.

### 2.3 숨 쉬는 링 인터랙션 (4-7-8)
- CSS 애니메이션 루프(자동, 장식) + **"같이 숨 고르기" 호버/탭 시 단계 라벨**("들이쉬기 4"·"멈추기 7"·"내쉬기 8") 표시.
- 홍보웹 BreathCircle 감성 이식하되, 미니 섹션이라 **경량 CSS 위주**(상태머신은 과함 → 자동 루프 + 라벨). 완전 인터랙티브 호흡은 홍보웹(Phase C)에 양보.

### 2.4 마스코트 활용 강화
- 현재: 큰 마스코트 1개(bob 애니 `promo-mascot-bob` 적용 중).
- 강화: 보상 카드 달성 순간 **숨숨이 점프**(마일스톤 체크 시 jump), 호흡 링 중앙 작은 숨숨이 동반(선택).

### 2.5 카피 재미 강화 (내용)
- kicker/headline 유지(앱 정합). subcopy를 **대화형**으로: "담배 한 갑 참으면 ○○를 살 수 있어요" 같은 체감 문구.
- 하이라이트 라벨을 수치 체감형으로("실시간 타이머"→"하루 ₩4,500 절약" 등, disclaimer로 예시 명시).

---

## 3. 구현 설계 (회귀 통제)

### 3.1 데이터: `ServicePromo.breathCard` 신설 (옵션 필드)
```ts
breathCard?: {
  savings: number;        // 절약액(원) — 카운트업
  cigarettes: number;     // 안 피운 개비 — 카운트업
  hoursReclaimed: number; // 되찾은 시간 — 카운트업
  recovery: { when: string; label: string; tone: number }[]; // 회복 미니 타임라인
  breathLabel?: string;   // 호흡 링 중앙 문구(기본 "4·7·8")
};
```
- **기존 11서비스 미설정 → undefined → 신규 분기 미진입 = 완전 불변.**

### 3.2 컴포넌트: PromoSection에 `BreathDashboardVisual` 신규 분기
- else-if 체인 **최상단 근처**(beforeAfter·analysisCard와 동급 우선순위)에 `promo.breathCard ?` 분기 삽입.
- `CompareSliderVisual`·`AnalysisCard`와 동일하게 **자급자족 하위 컴포넌트**(useCountUp·useRef, 자체 CSS 클래스).
- 숨통은 `breathCard` 설정 → 이 분기. mascot은 비주얼 내부에서 함께 렌더(또는 steps 병행).

### 3.3 CSS: `:global(#promo-soomtong)` + `.motif_breath` 격리
- 신규 클래스(`.breathCard`·`.breathRing`·`.savingsCounter`·`.recoveryMini`)는 숨통 비주얼에서만 사용.
- `@keyframes promo-breath-ring`·`promo-breath-glow` 신규. motif_breath는 `#promo-soomtong`에만.
- **다른 서비스 CSS 무변경**(새 클래스·새 키프레임 추가만, 기존 셀렉터 미수정).

### 3.4 회귀 안전 메커니즘 (검증된 패턴)
| 메커니즘 | 보장 |
|---|---|
| 옵션 필드 `breathCard?` | 미설정 서비스 undefined → 분기 미진입 |
| else-if 순서 | breathCard 있을 때만 신규 분기, 없으면 기존(mascot 등)으로 낙하 |
| `:global(#promo-soomtong)` 스코프 | 신규 CSS가 숨통 섹션에만 적용 |
| 신규 클래스/키프레임만 추가 | 기존 셀렉터 미수정 = 기존 서비스 렌더 불변 |

---

## 4. 작업 단계 (Phase)

### Phase 1 — 타입·데이터
1. `ServicePromo`에 `breathCard?` 필드 + 타입 추가(services.ts).
2. 숨통 엔트리: `motif: 'none'→'breath'`, `breathCard` 데이터(절약액 128500·개비 460·시간 38·회복 4~5단계), subcopy/하이라이트 카피 강화, disclaimer "예시 수치" 보강.

### Phase 2 — 컴포넌트(BreathDashboardVisual)
3. PromoSection에 `BreathDashboardVisual` 하위 컴포넌트 작성(useCountUp 수치·호흡 링·회복 미니바·숨숨이).
4. else-if 체인에 `promo.breathCard ?` 분기 삽입(우선순위·기존 분기 보존).

### Phase 3 — CSS(격리)
5. `.motif_breath`·`.breathCard`·`.breathRing`·`.savingsCounter`·`.recoveryMini` 신규 클래스.
6. `@keyframes promo-breath-ring`·`promo-breath-glow`. 전부 `:global(#promo-soomtong)` 격리. reduce-motion 가드.

### Phase 4 — 검증 (회귀 0 증명)
7. `npm run build`(tsc -b 그린).
8. Playwright 다중뷰포트(1440/768/390): `#promo-soomtong` 호흡 링·카운트업·회복바 육안.
9. **★ 전 서비스 회귀 스냅샷 비교**: 11서비스 promo 섹션 before/after 스크린샷 동일성(숨통만 변화) — #87 "델타가 최강 신호".
10. reduce-motion(링 정적·카운트업 스냅), 모바일 오버플로 0, 아이콘 `◆` 폴백 없음.
11. SERVICE_COUNT=12·PLATFORM_COUNT 불변.

### Phase 5 — 배포
12. 커밋(`feat(services): 숨통 미니 섹션 시그니처 비주얼 — 호흡 링·보상 카운트업·회복 타임라인`).
13. `vercel deploy --prod` → aisoft-iota.vercel.app 라이브 검증(noscript 콘텐츠+JS 번들 해시 일치).

---

## 5. 리스크 & 비범위

- **리스크(최대)**: 공유 `PromoSection` 수정 → 12서비스 회귀. **통제**: 옵션 필드+else-if+:global 격리(FitSnap·로픽 검증 패턴). Phase 4 전 서비스 스냅샷 비교 필수.
- **리스크**: 모션 과함 → 산만. **원칙**: compositor 속성(transform/opacity)만, reduce-motion 전면 가드, 미니 섹션이라 절제(홍보웹보다 가볍게).
- **리스크**: 금연 수치 오인(실제 통계) → disclaimer "예시" 명시.
- **비범위**:
  - 완전 인터랙티브 호흡 상태머신(홍보웹 Phase C 영역 — 미니 섹션은 경량 CSS 루프).
  - 홍보웹 FAQ/Pricing 연출(미니 섹션에 해당 UI 없음).
  - 숨통 홍보웹 자체([[soomtong-web-delight]]).
- **회귀 0 근거**: 신규 옵션 필드·신규 분기·신규 CSS 클래스만, 기존 경로 미수정.

---

## 6. 예상 변경 파일

| 파일 | 변경 | 줄 수(예상) |
|------|------|------------|
| `src/data/services.ts` | breathCard 타입 + 숨통 데이터·카피·motif | +40~60 |
| `src/sections/PromoSection.tsx` | BreathDashboardVisual 컴포넌트 + 분기 | +90~140 |
| `src/sections/PromoSection.module.css` | breath 모티프·호흡링·카운터·회복바 클래스 | +80~120 |
| (아이콘) `src/lib/icons.ts` | 필요 시 신규 아이콘 매핑 | +0~5 |

**신규 의존성: 0**(useCountUp·useReveal 기존). 공유 컴포넌트 수정 있으나 **격리·옵션 패턴으로 회귀 통제**.

---

## 7. 대안 비교 (왜 전용 비주얼인가)

| 안 | 재미·전달 | 회귀 위험 | 공수 |
|---|---|---|---|
| A. 데이터만(steps 추가) | 낮음(정적 흐름) | 0 | 저 |
| B. 카운트업 옵션만 | 중 | 저(옵션 필드) | 중 |
| **C. 전용 breathCard 비주얼** ★ | **높음**(금연 서사 체감+호흡 모션) | 중(격리로 통제) | 중~고 |

→ 사용자 요청("제대로 전달 + 재미")엔 **C**가 부합. FitSnap·로픽이 이미 "서비스당 전용 비주얼"로 각자의 가치를 전달 — 숨통도 동급 승격이 일관적.

---

## 8. 선결 결정 사항 (사용자)

1. **깊이**: 전용 비주얼(안 C, 권장·강력) vs 카운트업+steps만(안 B, 안전)?
2. **호흡 링**: 자동 CSS 루프(경량·권장) vs 탭 인터랙티브(공수↑, 홍보웹 Phase C와 중복)?
3. **수치 표기**: 데모 수치 카운트업 노출(예시 고지) vs 비숫자 유지?

---

## 9. 메모리 패턴 (교훈)

- **서비스 전용 비주얼 = 옵션 필드+else-if+:global 격리**(FitSnap beforeAfter·로픽 analysisCard 검증 패턴).
- **공유 컴포넌트 수정 시 전 서비스 스냅샷 비교**로 회귀 증명([[aisoft-progress-log]] #87).
- **데이터 주도 우선, 불가피하면 격리**: 신규 클래스·키프레임만, 기존 셀렉터 미수정.
- **두 저장소 구분**: 이 작업=AiSoftService 미니 섹션. 홍보웹 자체=[[soomtong-web-delight]].
- 라이브 검증=noscript+JS번들 해시(#87), 수동 `vercel deploy --prod`, Playwright 실측(#88).
