# shortKit 랜딩 추가 — PDCA Plan

- **Feature ID**: `shortkit-add`
- **작성일**: 2026-09-27
- **작성자**: 박훈재 / AI Soft
- **PDCA 단계**: Plan
- **관련 서비스 프로젝트**: `/Users/hoonjaepark/projects/shortKit`
- **랜딩 프로젝트**: `/Users/hoonjaepark/projects/AiSoftService` (Vite + React, `feat/integrated-landing`)

---

## 1. 목표 (Goal)

에이아이소프트 통합 랜딩(`aisoft-iota.vercel.app`)에 **10번째 서비스 "숏킷(shortKit)"**을
데이터 중심 방식으로 추가한다. 기존 9개 서비스(myTravel·myPet·내새끼·myToday·AI Music
Studio·로픽·Voice Buddy·FitSnap·도란도란)와 동일한 쇼케이스 카드 + 미니 홍보 섹션 패턴을
재사용하되, shortKit의 시그니처 브랜드(밝은 시원한 블루 `#3182F6`)와 핵심 가치(영상 URL →
AI 핵심 요약)를 정확히 표현한다.

### 핵심 성공 기준
1. `SERVICES` 배열에 `shortkit` 항목 1개 추가만으로 쇼케이스/Features/Technology 카운트에 자동 반영
2. 미니 홍보 섹션(`#promo-shortkit`)이 다른 서비스와 시각적으로 동급 품질로 렌더
3. 알려진 3대 드리프트 포인트(noscript / 카운트 / JSON-LD)를 정직하게 동기화
4. 회귀 0 — 기존 9개 서비스 섹션·스타일 무변경

---

## 2. 배경 & 서비스 정체성 (Context)

`shortKit/claude.md` 및 `app.json`에서 확인한 사실:

| 항목 | 값 |
|------|-----|
| 서비스명 | 숏킷 / shortKit |
| 한 줄 정의(실제 tagline) | **"긴 영상, 핵심만 30초"** — 유튜브 링크만 붙여넣으면 AI가 핵심만 30초로 요약 |
| 차별점 | 자막 없어도 **음성 인식**으로 요약 · 영상 **유형별**(레시피·운동·리뷰·지식) 핵심 정리 |
| 부가 기능 | 원본 영상·전체 전사 함께 제공 · 이미 요약한 영상은 즉시 재열람(검색/유형 필터) |
| 플랫폼 | iOS·Android (Android 우선 출시 목표) |
| 스택 | Expo / React Native, Supabase, OTA 배포 |
| 번들 ID | `com.shortkit.app` (iOS·Android 공통) |
| 시그니처 컬러(실측) | primary `#3182F6`(토스블루) · accent(green) `#12b76a` · point(yellow) `#ffc800` |
| 폰트(실측) | **Pretendard** (앱·홍보웹 공통) — Jua 아님 |
| 요금(실측, business-model.plan.md) | 월 ₩3,900 · 연 ₩29,000 · 3일 무료 · 무료 하루 3회 |
| 수익 모델 | In-App 결제(구독) + AdMob 광고 |

> 카피·색·요금 출처(SoT): `shortKit/web/src/constants/site.ts`, `web/src/styles/tokens.css`,
> `web/src/sections/Hero.tsx`·`Features.tsx` — 실제 코드에서 추출(추측 카피 아님).

### ⚠️ 출시 상태 (매우 중요 — 사실 정정)
- `shortKit` 앱: git 커밋 1개("초기 커밋"), **스토어 링크 없음 → 앱 미출시**
- `site.ts`에 `IS_LAUNCHED = false` + 스토어 URL placeholder 명시 ("출시 후 주입")
- **정정①: 홍보웹은 이미 배포됨 (라이브 확인)** — `https://longpapa82-cyber.github.io/shortkit-web/`
  curl 200 + `<title>숏킷 shortKit — 유튜브 영상, 핵심만 30초 요약</title>` 확인
  (로픽·FitSnap·도란과 동일한 GitHub Pages 홍보웹 패턴)
- **결론: `status: 'coming_soon'` 진입 + `web` 링크는 실배포 URL 채움 + `webIsLegal: true`**
  (앱 미출시라 스토어 배지는 "준비 중", 웹만 실링크. 로픽 web 승격 패턴 재사용)

---

## 3. 범위 (Scope)

### In Scope (이번 작업)
- `src/data/services.ts`: `shortkit` `AppService` 항목 추가 (order 10)
- `src/assets/services/shortkit-icon.png`: 앱 아이콘 반입(shortKit `assets/icon.png` 256px 최적화)
- 미니 홍보 섹션용 데이터(`promo`) 작성 — 기존 필드만 사용, 신규 컴포넌트 0
- `index.html` 드리프트 3종 동기화 (noscript / meta keywords·description / JSON-LD sameAs)
- coming_soon 오버레이 자동 적용 확인 (PromoSection 기존 분기 재사용)

### Out of Scope (이번에 하지 않음)
- shortKit 앱 자체 개발/수정
- 신규 마스코트 SVG 컴포넌트 이식 (도란이 `DoraniMascot`류) — coming_soon 단계엔 불필요, 출시 후 별도 iterate
- 홍보웹 배포 및 실링크 연결 — 미출시라 링크 없음. 출시 시 후속 `shortkit-launch` 계획으로 분리
- 새 CSS 모듈/컴포넌트 파일 생성 (기존 `PromoSection` 필드로 충분한지 설계 단계에서 확정)

---

## 4. 재사용 전략 (Reuse — 신규 코드 최소화)

기존 랜딩은 **데이터만 추가하면 되는 구조**로 설계돼 있다. 검증된 재사용 경로:

| 재사용 대상 | 근거 (참조 서비스) |
|-------------|-------------------|
| `AppService` 스키마 전체 | 9개 서비스 공통 |
| coming_soon 오버레이 | 도란도란 #81 (`status: 'coming_soon'` → PromoSection 자동 오버레이) |
| iOS/Android 미출시 처리 | coming_soon이면 스토어 배지 전체 "준비 중"; `androidPending`은 iOS만 출시된 혼합용이라 여기선 불필요 |
| 우측 비주얼 = `steps` (3단계) | myTravel·myToday·AI Music·로픽 — 영상 요약 3단계(URL 입력 → AI 요약 → 핵심 확인)에 최적 |
| `highlights` 통계 칩 | 전 서비스 공통 |
| 라이트 밝은 무드 (`dark` 미설정) | 로픽(스카이블루 라이트 럭셔리)이 가장 근접한 톤 레퍼런스 |

**신규 코드 판단**: shortKit은 밝은 블루 + steps 흐름이라 로픽/myTravel 패턴에 그대로 매핑
가능 → **컴포넌트 신규 작성 불필요, 데이터만 추가** (도란도란처럼 벡터 마스코트가 꼭
필요한 경우가 아님).

---

## 5. 상세 작업 항목 (Task Breakdown)

### T1. 앱 아이콘 반입
- `shortKit/assets/icon.png` → 256px WebP/PNG 최적화 → `src/assets/services/shortkit-icon.png`
- `services.ts` 상단 `import shortkitIcon from '../assets/services/shortkit-icon.png'`
- **의존**: 없음 (병렬 가능)

### T2. `SERVICES` 항목 추가 (핵심)
`services.ts` 배열 끝에 `order: 10` 항목 추가. 초안 스펙:

```
id: 'shortkit'
name: '숏킷'            // 앱 expo.name과 일치 (한글 브랜드)
tagline: '영상, 핵심만 빠르게'
description: '유튜브 영상 주소만 붙여넣으면 숏킷 AI가 영상이 말하려는 핵심을
  텍스트로 정리해 드려요. 레시피·운동·제품 정보까지 요점만 빠르게, 원본 영상도 함께.'
status: 'coming_soon'
moodLabel: 'Bright Cool Blue'
emoji: '⚡' (또는 ▶ 계열 — 설계 단계 확정)
theme: { primary: '#3182F6', accent: '#5AB9F2' 계열, 밝은 블루 그라디언트, 라이트 }
links: {               // 앱 미출시 → 스토어 링크 없음, 홍보웹만 실링크
  web: 'https://longpapa82-cyber.github.io/shortkit-web/',
  webIsLegal: true,    // 앱 미출시라 웹을 주 CTA로 (로픽 승격 패턴)
}
features: [ 영상 요약 / 핵심 정리 / 원본 함께 보기 3종 ]
promo: {
  dark 미설정 (라이트),
  palette: 시원한 블루 (bg 옅은 하늘 #EAF6FF, heroGradient #3182F6 계열),
  motif: 'none',
  steps: [ 1 URL 입력 → 2 AI 핵심 요약 → 3 요점·원본 확인 ],
  highlights: [ 실제 수치 확정 필요 — 지원 영상/언어/속도 ],
  disclaimer: 'AI 요약은 참고용이며 원본 영상의 내용과 다를 수 있습니다.' (표시광고법 근접 표시)
}
```
- **의존**: T1(아이콘 import)
- **결정 필요**: 정확한 카피/highlights 수치/emoji/accent — Design 단계에서 확정

### T3. index.html 드리프트 동기화 (3종)
`services.ts` 주석이 경고하는 수동 복제 지점:
1. **meta description(line 9)·keywords(line 13)·og/twitter(47·61)·JSON-LD description(94)**: 서비스 목록에 "숏킷(AI 영상 요약)" 추가
2. **noscript 블록(line 136~)**: FitSnap/도란도란처럼 `<h2>숏킷 — …</h2>` + 설명 + (미출시라 스토어 링크 대신 "준비 중" 문구 or 생략) 블록 추가
3. **JSON-LD sameAs(line 97~113)**: 홍보웹이 라이브라 **`https://longpapa82-cyber.github.io/shortkit-web/` 추가** (도란 `doran-web`과 동일 방식). 스토어 URL은 출시 후 후속.
- **의존**: T2(카피 확정 후)

### T4. 카운트 영향 검증
- `Hero.tsx` `SERVICE_COUNT` = `SERVICES.length` → 9 → **10 자동 증가** ✓
- `PLATFORM_COUNT` / `PLATFORMS` = `links.ios`/`links.android` 실링크 Set → shortKit은 스토어 링크 없음(web만) → **플랫폼 수 불변** (정직 지표 유지 — 허위 출시 방지) ✓
- `Technology.tsx` 동일 로직 → 서비스 수만 10으로, 플랫폼 수 불변 ✓
- **의존**: T2

### T5. 빌드·시각 검증
- `npm run build` (타입·번들 통과)
- 로컬 프리뷰에서 `#promo-shortkit` 섹션 렌더 + coming_soon 오버레이 육안 확인
- 브레이크포인트 320/768/1024/1440 오버플로 확인 (web/testing 규칙)
- **의존**: T1~T4 완료 후

### 병렬화 분석
- **병렬 가능**: T1(아이콘) ∥ T3 카피 초안 작성
- **순차 필수**: T2 → T4(카운트는 데이터 확정 후) → T5(검증은 최종)

---

## 6. 리스크 & 완화 (Risks)

| 리스크 | 영향 | 완화 |
|--------|------|------|
| highlights 수치 미확정(미출시라 실측 없음) | 허위/과장 카피 위험 | 정성 표현("빠른 요약", "핵심만") 우선, 정량 수치는 출시 후 실측 반영 |
| 미출시 상태 오인 | 사용자 기대 오류 | `status: 'coming_soon'` + COMING SOON 오버레이로 명확화 (도란 #81 검증됨) |
| index.html 수동 동기화 누락 | SEO 폴백 드리프트 | T3 체크리스트로 4개 지점 명시 |
| 밝은 블루가 로픽(스카이블루)과 유사 | 브랜드 혼동 | shortKit은 채도 높은 토스블루 #3182F6 vs 로픽 sky-600 #0284c7 — motif·steps 구성으로 차별화 |
| 홍보웹 URL 미확정 | web 링크 공백 | coming_soon이라 web 링크 없이 정상 동작 — 출시 시 후속 |

---

## 7. 검증 계획 (Validation)

1. **타입/빌드**: `npm run build` green
2. **자동 반영**: 쇼케이스 카드 10개, Hero 카운트 10, 플랫폼 수 불변 확인
3. **미니 홍보**: `#promo-shortkit` 섹션 생성 + coming_soon 오버레이
4. **회귀 0**: 기존 9개 섹션 diff 없음 (스타일 스코프가 `#promo-shortkit`에 한정되는지 확인)
5. **반응형**: 320/768/1024/1440 오버플로 없음
6. **Gap 분석**: `/pdca analyze shortkit-add` (Design 대비 구현 일치율 ≥ 90% 목표)

---

## 8. 다음 단계 (Next)

1. **본 Plan 확정** → 사용자 리뷰
2. **`/pdca design shortkit-add`**: 정확한 카피·팔레트·steps·highlights·emoji·아이콘 최적화 스펙 확정 (Design 문서)
3. **`/pdca do shortkit-add`**: 데이터 추가 + index.html 동기화 구현
4. **`/pdca analyze` → `iterate` → `report`**
5. **후속 계획 `shortkit-launch`**: 앱 출시 후 실 스토어 링크·홍보웹 URL·sameAs·플랫폼 카운트 반영

---

## 부록: 확정 필요 항목 (Design 단계 입력)
- [ ] 정확한 headline / headlineAccent 카피
- [ ] palette 세부 컬러값 (primary/accent/gradient/ink)
- [ ] fontDisplay / fontBody (Jua 등 앱 폰트 정합 여부)
- [ ] highlights 3종 (정성 표현 우선)
- [ ] emoji 및 moodLabel
- [ ] 우측 비주얼: steps(3단계) 확정 vs shot(앱 스크린샷) 반입 여부
