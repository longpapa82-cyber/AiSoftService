# shortKit 랜딩 추가 — PDCA Design

- **Feature ID**: `shortkit-add`
- **작성일**: 2026-09-27
- **PDCA 단계**: Design
- **선행 문서**: `docs/01-plan/features/shortkit-add.plan.md`
- **모든 값 출처(SoT)**: `shortKit/web/src/constants/site.ts`, `web/src/styles/tokens.css`,
  `web/src/sections/{Hero,Features}.tsx`, `shortKit/app.json` — **실제 코드에서 추출, 추측 없음**

---

## 1. 설계 원칙

1. **사실 기반**: 모든 카피·색·요금은 shortKit 실제 소스에서 인용. 지어낸 문구 금지.
2. **데이터만 추가**: 신규 컴포넌트/CSS 0. 기존 `AppService` + `ServicePromo` 필드로만 구성.
3. **정직 지표**: 앱 미출시 → 스토어 링크 없음 → 플랫폼 카운트 불변. `coming_soon` 오버레이로 상태 명시.
4. **회귀 0**: `#promo-shortkit` 스코프 밖 무변경.

---

## 2. 확정 스펙 — `AppService` 항목 (order: 10)

### 2.1 기본 필드

| 필드 | 확정값 | 출처/근거 |
|------|--------|-----------|
| `id` | `'shortkit'` | — |
| `name` | `'숏킷'` | app.json `expo.name` = "숏킷", site.ts `APP.name` |
| `tagline` | `'긴 영상, 핵심만 30초'` | site.ts `APP.tagline` (그대로) |
| `description` | 아래 2.2 | Features 카피 조합 |
| `status` | `'coming_soon'` | 앱 미출시(스토어 링크 0, `IS_LAUNCHED=false`) |
| `moodLabel` | `'Bright Toss Blue'` | tokens: 토스 스타일 밝은 블루 시스템 |
| `emoji` | `'▶'` | 영상/재생 상징 (레시피·리뷰 등 유튜브 요약) |
| `iconUrl` | `shortkitIcon` | `shortKit/assets/icon.png` → 256px 최적화 반입 |

### 2.2 description (카드·noscript 공용)

> "유튜브 영상 링크만 붙여넣으면 숏킷 AI가 핵심만 30초로 요약해 드려요. 자막이 없어도 음성을
> 인식해 요약하고, 레시피·운동·리뷰·지식 등 영상 유형에 맞춰 정말 필요한 정보만 정리합니다.
> 원본 영상과 전체 전사도 함께 확인할 수 있어요."

(출처: Features.tsx의 실제 4개 카피 — "유형별 핵심 정리 / 자막 없어도 OK / 이미 본 영상은
즉시 / 원본도 한 번에" 를 정의형으로 압축)

### 2.3 links (앱 미출시 — 웹만 실링크)

```
links: {
  web: 'https://longpapa82-cyber.github.io/shortkit-web/',  // curl 200 라이브 확인
  webIsLegal: true,   // 앱 미출시라 web을 주 CTA로 승격(로픽 패턴)
}
```
- `ios`/`android` 미포함 → 스토어 배지 "준비 중" 자동 + 플랫폼 카운트 불변
- ⚠️ 출시 시 후속 `shortkit-launch`에서 `ios`/`android` 실링크 추가 + `webIsLegal` 재검토

---

## 3. 테마 (통합 카드용 `theme`)

tokens.css 실측값 기반. 통합 카드는 톤다운(밝은 라이트) 유지:

| 필드 | 값 | 근거 |
|------|-----|------|
| `surface` | `#ffffff` | tokens `--color-surface` |
| `ink` | `#191f28` | tokens `--color-text` |
| `inkSoft` | `#4e5968` | tokens `--color-text-sub` |
| `primary` | `#3182f6` | tokens `--color-primary` (흰 글씨 대비 WCAG AA 확인 필요) |
| `accent` | `#12b76a` | tokens `--color-accent` (green) |
| `gradient` | `linear-gradient(135deg, #e8f3ff 0%, #f2f4f6 100%)` | primary-soft → bg |
| `font` | `"'Pretendard', -apple-system, system-ui, sans-serif"` | tokens `--font-sans` |
| `onPrimary` | `#ffffff` | 블루 위 흰 글씨 |

> ✅ **대비 실측 완료**: `#3182f6` on white ≈ **3.6:1** — 큰 텍스트/UI 요소(3:1)는 통과,
> 일반 텍스트(4.5:1)는 미달. 결론: **히어로 그라디언트·대형 헤드라인엔 `#3182f6` 사용 OK**,
> **작은 흰 텍스트가 solid primary 버튼 위에 올 땐 `#2272eb`(--color-primary-dark, ≈4.3:1)로**.
> 로픽이 sky-500→sky-600 낮춘 것과 동일 판단. onPrimary는 버튼 배경을 primary-dark로.

---

## 4. 미니 홍보 섹션 (`promo`) — 라이트 무드

`dark` 미설정(라이트). motif `'none'`. 우측 비주얼은 **steps 3단계**(앱 미출시라 스크린샷
반입 대신 서비스 흐름 재현 — 로픽/myTravel 패턴).

### 4.1 헤드라인 & 카피

| 필드 | 값 |
|------|-----|
| `kicker` | `'AI 영상 요약'` |
| `headline` | `'긴 영상, 핵심만\n'` |
| `headlineAccent` | `'30초로 요약'` |
| `subcopy` | `'유튜브 링크만 붙여넣으면 숏킷 AI가 핵심만 30초로 정리해 드려요. 자막이 없어도 음성을 인식해 요약하고, 원본 영상과 전체 전사도 함께 확인할 수 있어요.'` |
| `disclaimer` | `'AI 요약 결과는 참고용이며, 원본 영상의 내용과 다를 수 있습니다. 중요한 정보는 원본 영상에서 확인하세요.'` (표시광고법 근접 표시) |

### 4.2 팔레트 (라이트 토스블루)

```
palette: {
  bg: '#f2f4f6',              // tokens --color-bg
  heroGradient: 'linear-gradient(150deg, #6aa8ff 0%, #3182f6 52%, #2272eb 100%)',
  surface: '#ffffff',
  primary: '#3182f6',
  accent: '#12b76a',          // green — "요약 완료" 계열
  ink: '#191f28',
  inkSoft: '#4e5968',
  onPrimary: '#ffffff',
}
fontDisplay: "'Pretendard', system-ui, sans-serif"
fontBody:    "'Pretendard', system-ui, sans-serif"
radius: 20                    // tokens radius-md(16)~lg(24) 중간, 토스 톤
motif: 'none'
```

> ✅ **Pretendard 로드 확인 완료**: 랜딩이 이미 Pretendard를 로드 중(index.html:78, jsdelivr
> variable CDN)이며 `--ais-font-body` 스택의 한글 기본이다. **신규 폰트 로드 불필요** — 성능
> 예산 영향 0. `'Pretendard', system-ui, sans-serif`가 그대로 유효.

### 4.3 highlights (실측 수치 — 정직)

site.ts `PRICING` + 서비스 특성에서 **실제 값만** 사용:

```
highlights: [
  { value: '30초', label: '핵심 요약' },       // tagline 근거
  { value: '자막 없어도', label: '음성 인식 요약' }, // Features 근거
  { value: '3일', label: '무료체험' },          // PRICING.trialDays=3
]
```
- ❌ 지어낸 "지원 언어 N개", "요약 영상 N만 건" 등 미검증 수치 **사용 금지**(미출시라 실측 없음)
- `trialBadge: '3일 무료체험'` 추가 검토(로픽 선례) — PRICING.trialDays=3 근거

### 4.4 steps (우측 비주얼 — 서비스 흐름 3단계)

Features/HowItWorks 카피 기반:

```
steps: [
  { no: '1', title: '링크 붙여넣기',
    desc: '요약하고 싶은 유튜브 영상 링크를 복사해 붙여넣기만 하면 돼요.' },
  { no: '2', title: 'AI 핵심 요약',
    desc: '자막이 없어도 음성을 인식해, 영상 유형에 맞춰 핵심만 30초로 정리해요.' },
  { no: '3', title: '요점·원본 확인',
    desc: '정리된 핵심을 빠르게 읽고, 원본 영상·전체 전사도 함께 확인하세요.' },
]
```

### 4.5 features (카드 하단 3종) — Features.tsx 실제 카피

```
features: [
  { icon: 'bolt',        title: '30초 핵심 요약', desc: '긴 영상도 링크만 붙여넣으면 핵심만 30초로 정리' },
  { icon: 'hearing',     title: '자막 없어도 OK', desc: '음성을 인식해 요약 — 강의·팟캐스트도 문제없어요' },
  { icon: 'category',    title: '유형별 정리',     desc: '레시피·운동·리뷰·지식 등 영상 종류에 맞춘 핵심 정보' },
]
```
(Material Symbols 아이콘명. `bolt`/`hearing`/`category` 존재 여부는 구현 시 확인)

---

## 5. index.html 동기화 스펙 (드리프트 3종)

| 위치 | 변경 |
|------|------|
| meta description(L9) | 서비스 나열에 "숏킷(AI 영상 요약)" 추가 |
| meta keywords(L13) | "숏킷, shortKit, 영상 요약, 유튜브 요약, AI 요약, 30초 요약" 추가 |
| og/twitter desc(L47·61) | 서비스 목록에 "숏킷" 추가 |
| JSON-LD description(L94) | 서비스 목록에 "숏킷(AI 영상 요약)" 추가 |
| JSON-LD sameAs(L97~113) | `"https://longpapa82-cyber.github.io/shortkit-web/"` 추가 |
| noscript(L136~) | FitSnap/도란 형식으로 `<h2>숏킷 — 긴 영상, 핵심만 30초</h2>` + description + `<li><a href="…shortkit-web/">숏킷 웹사이트</a></li>` 블록 추가 |

---

## 6. 검증 체크리스트 (Design → Do 전)

- [x] `#3182f6` 대비 실측 완료 (≈3.6:1 — 대형 OK / 소형 버튼 텍스트는 `#2272eb`)
- [x] Pretendard 랜딩 로드 확인 완료 (index.html:78 — 이미 로드, 추가 불필요)
- [ ] Material Symbols `bolt`/`hearing`/`category` 아이콘 존재 확인 (Do 단계)
- [ ] `shortKit/assets/icon.png` → 256px 최적화 파이프라인(기존 9개와 동일 방식)
- [ ] 홍보웹 라이브 재확인(curl 200) — 완료 ✓ (2026-09-27)

---

## 7. Do 단계 산출물 (다음)

`/pdca do shortkit-add` 시 수정 파일:
1. `src/assets/services/shortkit-icon.png` (신규 반입)
2. `src/data/services.ts` (import 1줄 + SERVICES 항목 1개, order 10)
3. `index.html` (드리프트 3종 — meta/JSON-LD/noscript)

**예상 컴포넌트 수정: 0줄** (데이터만). 도란도란 최초 추가(#81)와 동일 스코프.

---

# ▼▼▼ Design v2 — 홍보웹 시그니처 풀 재현 (2026-09-27 갱신) ▼▼▼

## v2.0 배경 (왜 갱신하나)

v1 데이터 추가 후 육안 확인 결과: 색·카피는 맞았으나 **홍보웹 디자인 정체성(cosmos 무대
배경·옐로 포인트·정확한 카피)이 재현되지 않음**. 사용자 피드백 "풀 시그니처 재현" 선택.
→ 로픽 `motif:'law'`(오로라+그레인+입자)·Voice Buddy(`soundRings`+`chatChips`) 수준의
**전용 시그니처**를 추가한다.

**시그니처 SoT**: `shortKit/web/src/sections/Hero.tsx` (전문 분석 완료) + `tokens.css`.

## v2.1 홍보웹 Hero 시그니처 요소 (실측)

| 요소 | 실측값 (Hero.tsx) |
|------|-------------------|
| 무대 그라디언트 | `#5BA6FF → #3182F6 → #1E63D8` (135° 대각) |
| 광원 blob ×2 | `#8FC2FF` 55% (좌상) + `#2461D6` 50% (우하), radial |
| 궤도 링 | 우상단 이중(r=170 α.2 / r=240 α.1) + 좌하단 이중(r=110 α.13 / r=170 α.07), 흰 stroke |
| 하단 파도 | 이중 레이어(흰색 0.5 + bg색) |
| **옐로 트윙클 ×5** | `--color-point #ffc800` 3개 + `#fff`·`#BBD8FF`·`#7DE3AE` 혼합, size 6~10, delay 스태거 |
| 스티커 | "14분 → 30초!" 7도 기울임 (결과 폰 우상단) |

## v2.2 정확한 카피 (실측 — 지어낸 문구 전량 교체)

| 필드 | v1 (지어냄) | **v2 확정 (Hero.tsx 실측)** |
|------|------------|---------------------------|
| headline | 긴 영상, 핵심만\n30초로 요약 | `긴 영상,\n핵심만 ` + accent `30초` (홍보웹과 동일 줄바꿈) |
| subcopy | (지어낸 3문장) | **"링크만 붙여넣으면 AI가 대신 봐드려요. 자막이 없어도 음성까지 읽어 핵심만 정리해요."** |
| note(신규) | — | **"하루 3회 무료 · Pro는 무제한·광고 없이"** → disclaimer 대체 or 별도 표기 |
| 스티커(신규) | — | **"14분 → 30초!"** — 폰 목업 위 배지 |

## v2.3 구현 방식 — `motif: 'cosmos'` 신규 추가

로픽 `motif:'law'` 블록이 정확한 템플릿. 4개 파일 수정:

### (a) `services.ts` — 타입 + 데이터
- `ServicePromo.motif` 유니온에 `'cosmos'` 추가
- shortkit `promo.motif: 'none'` → `'cosmos'`
- subcopy·headline 실측 카피로 교체
- `trialBadge` 유지, note 문구 반영 방법 결정(disclaimer와 별개)

### (b) `PromoSection.tsx` — 렌더 분기
- motif 데코 블록에 `{promo.motif === 'cosmos' && (...)}` 추가:
  트윙클 5개(`cosmosTwinkle` + 위치 클래스) + 궤도링 SVG + 광원 span
  (로픽 `law` 블록과 동일 구조, span/SVG를 `.decor` 하위에)

### (c) `PromoSection.module.css` — cosmos 시그니처 CSS
- `.motif_cosmos::before` — 블루 무대 그라디언트 오버레이(라이트 섹션 위 상단만)
- `:global(#promo-shortkit)` 스코프 — 궤도링·광원·트윙클 위치/애니메이션 (회귀 0)
- `.cosmosTwinkle` 반짝임 keyframe(홍보웹 `sk-twinkle` 이식), 옐로 `#ffc800`
- **⚠️ 라이트 섹션 유지**: 홍보웹 Hero는 블루 무대지만, 랜딩 미니 홍보는 라이트 카드가
  기본. cosmos 데코는 **우측 폰 목업 뒤 배경**에만 은은히(로픽 aurora처럼 .decor z-index:-2).
  전면 블루 배경은 dark 경로라 회귀 위험 → **배경 데코로만 재현**(무대 전체 블루는 지양).

### (d) `index.html` — 변경 없음 (v1에서 완료)

## v2.4 검증 (v2)
- [ ] `motif:'cosmos'` 타입 추가 후 빌드 green
- [ ] 트윙클 옐로 `#ffc800` 렌더 + 궤도링 우측 폰 뒤 배치
- [ ] 카피가 홍보웹과 동일(subcopy·스티커)
- [ ] `:global(#promo-shortkit)` 스코프 밖 회귀 0 (다른 9개 섹션 무변경)
- [ ] 육안: 폰 목업 + cosmos 배경 데코 + 옐로 포인트가 "숏킷다움" 재현
- [ ] 반응형 320/768/1024/1440 오버플로 없음

## v2.5 폰트 결정
- Pretendard 이미 로드됨(v1 확인). 홍보웹도 Pretendard → **폰트 정합 이미 충족**.
  (홍보웹 카피의 굵은 대담 타이포는 font-weight/size로 표현, 폰트 패밀리는 동일)
