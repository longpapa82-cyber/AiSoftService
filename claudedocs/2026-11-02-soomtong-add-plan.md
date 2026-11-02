# 숨통(SoomTong) 랜딩 추가 상세 계획

> 작성일: 2026-11-02 · 대상 저장소: AiSoftService (통합 랜딩) · 브랜치: `feat/integrated-landing`
> 목표: 숨통을 **12번째 서비스**로 통합 랜딩에 등록 (기존 11서비스 추가 패턴 재사용)
> 조사 출처: `/Users/hoonjaepark/projects/soomTong` (app.json·src/theme/tokens.ts·docs/claude.md·web/)

---

## 0. 요약 (TL;DR)

숨통은 **금연(禁煙) 라이프스타일 관리 AI 앱**으로, 현재 **pre-launch(앱·홍보웹 모두 미출시)** 상태다.
→ facePreview(#88 당시)·숏킷(#83 당시) 초기와 동일하게 **`status: 'coming_soon'`** 로 등록한다.

기존 서비스 추가 패턴(facePreview·숏킷·도란·FitSnap)은 **데이터 2~3파일·컴포넌트 0줄 수정**으로 끝난다.
이 계획도 동일: `services.ts` 엔트리 1개 + 아이콘 에셋 1개 + `index.html` SEO 동기 2곳.
컴포넌트(PromoSection/StoreBadges/Hero/About/Technology)는 **데이터 주도(SoT)** 라 자동 반영된다.

> **facePreview와 결정적 차이 2가지 (반드시 반영):**
> 1. **비주얼**: 숨통은 before/after 슬라이더가 없다. 핵심 비주얼은 **마스코트 "숨숨이"**. → `promo.beforeAfter`(facePreview) 대신 **`promo.mascot`(정적 이미지) 또는 도란도란식 `mascotComponent` 벡터 패턴** 중 택1 (§3·§5).
> 2. **톤**: facePreview는 다크 Clinical Luxe. 숨통은 **밝은 민트 헬스케어 톤**(light UI). → `promo.dark` 미사용, `motif: 'none'`.

**핵심 선결 과제(사용자 입력 필요): 마스코트 자산, 홍보웹 배포 URL, 민감 카피 고지** — §5 참조.

---

## 1. 등록 대상 데이터 (숨통 조사 결과 — 교차 검증 완료)

| 필드 | 값 | 근거 |
|------|-----|------|
| 제품명 | **숨통** (영문 서브타이틀 **SoomTong**) | app.json:3, docs/claude.md:7 |
| 슬로건 | **막혔던 일상에 맑은 숨을 틔우다** | docs/claude.md:8 |
| 핵심 가치 | 압박감 없는 직관적 기록 · 즉각적 보상 체감(건강·비용·시간) · 재흡연에 대한 유연한 회복 | docs/claude.md:9 |
| 한줄 설명 | 실시간 금연 타이머와 건강·절약 지표로 성과를 체감하고, 긴급 호흡 가이드로 충동을 넘기는 금연 관리 앱 | docs/claude.md:2 |
| 상태 | **coming_soon** (앱 v1.0.0 스토어 미제출 · 홍보웹 미배포) | app.json, web/StoreBadges.tsx(`href="#download"`, "곧 만나요") |
| 출시 전략 | **Android 먼저 출시 목표** | docs/claude.md:45 |
| 번들/패키지 | iOS·Android 동일 `com.soomtong.app` | app.json:17,25 |
| Apple Team ID | VC5L9S5QPX | app.json:18 |
| Primary (민트) | `#00C2A0` (mint500) | tokens.ts:6 |
| Secondary (골드/보상) | `#FFB21E` (gold500) | tokens.ts:11 |
| Accent (코랄/SOS) | `#FF7A8A` (coral500) | tokens.ts:15 |
| 잉크(텍스트) | `#191F28` (ink900) / 보조 `#4E5968`(ink700) | tokens.ts:18,19 |
| 배경 / 표면 | `#F0F6FF` (연한 블루화이트) / `#FFFFFF` | tokens.ts:25,26 |
| 히어로 그라디언트 | `linear-gradient(160deg, #5EDFC6, #00C2A0)` | tokens.ts:31 |
| 폰트 | 디스플레이 **Jua**(둥근 한글 디스플레이) / 본문 **Pretendard** | tokens.ts:59 |
| 모티프 | 밝은 민트 헬스케어 + 마스코트 "숨숨이" + 모션 풍부 | docs, web/ |
| 마스코트 | **숨숨이(Soom-Soom)** — 표정 다양·bob/jump 애니(react-native-svg) | src/components/mascot/SoomIllust.tsx·AnimatedMascot.tsx |
| 아이콘 소스 | `assets/icon.png` (+adaptive foreground/bg #00C2A0) | app.json:8,28-29 |
| 홍보웹 | Next.js 15 (web/), `.vercel` 연결됨, SITE_URL=`https://soomtong.app`(플레이스홀더, **미배포**) | web/README.md, web/.vercel/project.json |

**Top 3 기능** (web/components/sections 근거):
1. **실시간 보상 추적** — 금연 타이머(초 단위), 절약 금액(KRW)·참은 개비·되찾은 시간 자동 계산.
2. **SOS 긴급 호흡** — 4-7-8 호흡 가이드(9사이클≈171초) + 햅틱 + 충동 트리거 태깅/분석.
3. **의학 회복 타임라인** — WHO/미 심장협회 기준 8단계 신체 회복(20분→1년) + 마일스톤 뱃지.

> ⚠️ **판단 분기**: 앱·웹 모두 미출시이므로 `coming_soon`.
> → StoreBadges가 App Store·Google Play를 "준비 중" 배지로 렌더.
> → Android 먼저 출시 전략이므로, 추후 Play 먼저 라이브 시 `links.android` + `links.ios`는 `androidPending` 유지 패턴 적용 가능.
> → **홍보웹 미배포 상태에서는 활성 CTA가 없다** → §5-1에서 반드시 해소(배포 or "출시 예정" 표기).

---

## 2. 랜딩 저장소 등록 메커니즘 (검증 완료)

SoT = `src/data/services.ts` (1372줄). 모든 지표는 여기서 파생 → **상수 수동 수정 불필요**.

| 검증 항목 | 위치 | 비고 |
|-----------|------|------|
| 아이콘 import 블록 | `services.ts:6–16` (`facepreviewIcon`까지 11개) | L16 다음에 `soomtongIcon` 추가 |
| (마스코트 자산 import) | `services.ts:26–49` 영역 | 정적 마스코트 선택 시 `soomtong/mascot.webp` 추가 |
| 서비스 배열 닫힘 | `services.ts:1368` (`order: 11`) → `1370` (`]`) | L1369(`},`) 뒤에 엔트리 삽입 |
| `AppService`/`ServicePromo` 인터페이스 | `services.ts:53–` | id·name·tagline·description·status·moodLabel·emoji·iconUrl·links·theme·features·promo?·order |
| `links.androidPending`/`webIsLegal` | 옵션 필드 | coming_soon·웹 미배포 시 조합 결정(§5) |
| SERVICE_COUNT | `Hero.tsx:16`(`SERVICES_SORTED.length`), `Technology.tsx:29`(`SERVICES.length`) | **자동 +1 → 12** |
| PLATFORM_COUNT | `Hero.tsx:17` (실 링크 Set) | web 미배포+스토어 미출시면 **불변**(정직 지표 유지) |
| JSON-LD `sameAs` | `index.html:97–118` | 서비스 실 링크 배열. **링크 있을 때만** L117 뒤 추가 |
| noscript 폴백 | `index.html:140–302` | 서비스별 `<section>`. L295(facePreview 섹션 끝) 뒤 추가 |
| meta description/keywords/OG | `index.html:9,13,47,61` | 서비스 나열 문구에 "숨통" 추가(동기화) |
| 빌드/타입체크 | `package.json` → `build: "tsc -b && vite build"` | 타입체크는 `tsc -b` |

**지표 중립성**: `coming_soon` + (웹 미배포) → SERVICE_COUNT는 +1(12), PLATFORM_COUNT는 불변 가능성 높음 → 정직 지표 유지(숏킷 #87·facePreview #88 교훈과 동일).

---

## 3. 렌더링 경로 (컴포넌트 0줄 수정 확인)

PromoSection(`src/sections/PromoSection.tsx`)은 `promo` 필드 조합으로 우측 비주얼을 분기(우선순위 순):

1. `promo.beforeAfter` → CompareSliderVisual (facePreview·FitSnap) — **숨통 해당 없음**
2. `promo.analysisCard` → 로픽 글래스 카드 — 해당 없음
3. `promo.mascotComponent==='dorani'` → DoraniMascot 벡터 — **패턴 참고 대상**
4. `promo.mascot` → `<img>` 정적 마스코트 (myToday 새싹·로픽 부엉이·Voice Buddy 버디) — **1순위 권장**
5. `promo.shot` → 폰 목업 프레임
6. 그 외 → 기능 카드 그리드(폴백)

**숨통 권장 비주얼 (2안 중 택1 — §5-2)**:
- **(A) 정적 마스코트 `promo.mascot`** ← **MVP 권장**. 숨숨이 PNG(투명배경)를 `src/assets/promo/soomtong/mascot.webp`로 반입. myToday·로픽·Voice Buddy와 **완전 동일 경로** → 추가 컴포넌트 0, 최소 리스크.
- **(B) 벡터 컴포넌트** ← 도란도란 `mascotComponent:'dorani'` 패턴(#82). 숨숨이 SoomIllust.tsx(react-native-svg)를 `SoomMascot.tsx`(JSX `<svg>`)로 이식 + PromoSection 분기 1줄 추가 + `mascotComponent` 타입 유니온에 `'soom'` 추가. **컴포넌트 수정 발생(회귀 리스크↑), 공수↑**. 홍보웹 web/components/Mascot.tsx에 이미 웹 포팅본이 있어 재사용 가능.

> 권장: **(A) 정적 마스코트**로 MVP 등록 → 사용자 만족 시 (B)로 고도화. facePreview #88 교훈("앱 충실 재현이 사용자 기대")을 감안하되, 벡터 이식은 별도 반복으로 분리해 회귀를 통제한다.

통합 카드 테마(`theme`)는 톤다운, `promo.palette`는 앱 시그니처 색(민트/골드/코랄) 그대로.

---

## 4. 작업 단계 (Phase)

### Phase 1 — 에셋 준비 (선결, 사용자 자료 필요)
1. **아이콘**: `src/assets/services/soomtong-icon.png` — **이미 존재**(256×256 PNG, 2026-11-02 생성, git 미추적).
   → 소스 `/Users/hoonjaepark/projects/soomTong/assets/icon.png`에서 추출된 것으로 보임. **육안 확인 후 재사용** 또는 재추출.
2. **마스코트**(안 A 선택 시): `src/assets/promo/soomtong/mascot.webp` (투명배경, 숨숨이).
   → 소스: SoomIllust.tsx 렌더 캡처 or web/public 자산. **현재 web/public 비어 있음** → 앱에서 직접 추출 필요.

### Phase 2 — 데이터 등록 (`services.ts`)
3. import 추가 (L16 뒤): `soomtongIcon`, (안 A 시) `soomtongMascot`.
4. 서비스 엔트리 추가 (L1369 뒤, `order: 12`):
   - status `coming_soon`, links(§5-1 결정: web URL or 없음 + `androidPending`),
   - theme(민트 `#00C2A0`/골드 `#FFB21E`/코랄 `#FF7A8A`, 밝은 배경, font Jua/Pretendard),
   - features 3개(실시간 보상·SOS 호흡·의학 회복 — §1 Top3),
   - promo: `dark` 미사용, `motif:'none'`, palette(민트 그라디언트), mascot(안 A).
   - **고지(disclaimer)**: 금연 성과 수치·의학 회복 타임라인은 **의학적 보장 아님** 표시광고법 고지 근접 배치(§5-3).

### Phase 3 — SEO 동기 (`index.html`)
5. meta description/keywords/OG 서비스 나열에 "숨통"(+"SoomTong, 금연, 금연 앱, 금연 타이머") 추가 (L9·13·47·61).
6. JSON-LD `sameAs`: **홍보웹 배포 시에만** URL 추가 (L117 뒤). 미배포면 생략(정직 지표).
7. noscript에 `<section>` 추가 (L295 뒤) — name·tagline·description·(링크 있으면).

### Phase 4 — 검증
8. `npm run build` (tsc -b 그린 확인).
9. `npm run dev` → Hero 그리드에 12번째 카드 + "준비 중" 배지, `#promo-soomtong` 섹션(민트 톤·마스코트) 확인.
10. (권장) Playwright/webapp-testing 다중 뷰포트(320/768/1024/1440) — 민트 톤·마스코트·카드 레이아웃 육안 검증. (메모리 교훈: #88 육안 생략이 버그 유발 → 실측 필수.)
11. SERVICE_COUNT=12 반영, PLATFORM_COUNT 변동 없음(정직 지표) 확인.

### Phase 5 — 배포 (사용자 승인 후)
12. 커밋 (`feat(services): 숨통(SoomTong) 금연 앱 12번째 서비스 추가`).
13. `vercel deploy --prod --yes` (GitHub 자동배포 미연동 — 수동 필수).
14. 라이브 검증: noscript 문구 출현 + JS 번들 해시 일치 (raw md5 아님 — 숏킷 #87 교훈).

---

## 5. 선결 결정 사항 (사용자 입력 필요)

아래 3가지는 코드가 아닌 **사용자 판단/자료**가 필요하다:

1. **홍보웹 배포 여부/URL**: 숨통 web/(Next.js)이 아직 미배포다.
   - coming_soon 서비스의 활성 CTA는 web뿐 → **미배포 시 CTA 없는 "출시 예정" 카드**가 된다.
   - 선택지: (a) 숨통 web을 먼저 Vercel 배포해 URL 확보 후 링크 연결, (b) web 없이 "출시 예정"만 표기(추후 링크 추가).
   - ⚠️ web/README 체크리스트상 SITE_URL·스토어 링크·OG·법적 페이지가 아직 플레이스홀더 → (a) 선택 시 선결 보완 필요.
2. **비주얼 방식**: (A) 정적 마스코트 PNG(MVP 권장, 컴포넌트 0줄) vs (B) 벡터 숨숨이 컴포넌트 이식(고도화, 공수·회귀↑). §3 참조.
   - 어느 쪽이든 **숨숨이 자산 추출**(앱 SoomIllust.tsx 렌더 or web Mascot.tsx)이 선결.
3. **민감 카피 고지**: 금연 성과 지표(수명 연장·건강 회복)와 의학 타임라인은 **개인차·비의학적 추정**임을 고지 필요.
   - 표시광고법(중요정보 동일 화면·근접 표시)에 따라 `promo.disclaimer`로 "개인차가 있으며 의학적 효과를 보장하지 않습니다" 등 근접 배치. (로픽 비진단성·facePreview 엔터테인먼트 고지 패턴 재사용.)

---

## 6. 리스크 & 비범위

- **리스크**: coming_soon + web 미배포 → CTA 없는 카드(UX 약화). §5-1에서 해소.
- **리스크**: 금연/건강 효과 과장 오인 → 의학 고지. §5-3.
- **리스크**: (안 B 선택 시) 벡터 마스코트 이식 → 컴포넌트 수정으로 기존 11서비스 회귀 가능 → 별도 반복 분리 권장.
- **비범위**: 숨통 앱 자체 개발/홍보웹 배포(별도 저장소 `soomTong`), 통합 랜딩 풀 리디자인.
- **회귀 0 근거(안 A)**: 데이터 주도 추가, 컴포넌트 미수정, 기존 11서비스 렌더 경로 불변.

---

## 7. 예상 변경 파일

| 파일 | 변경 | 줄 수(예상) |
|------|------|------------|
| `src/data/services.ts` | import + 엔트리 1개 | +60~100 |
| `src/assets/services/soomtong-icon.png` | **이미 존재**(커밋만) | (바이너리) |
| `src/assets/promo/soomtong/mascot.webp` | 신규(안 A 시) | (바이너리) |
| `index.html` | meta·sameAs(조건부)·noscript | +8~14 |
| `src/components/SoomMascot.tsx` + PromoSection 분기 | **안 B 선택 시에만** | +80~150 / +3 |

**컴포넌트 수정: 0줄 (안 A)** — SoT 데이터 주도 (facePreview·숏킷·도란·FitSnap 추가와 동일).
**안 B 선택 시: 컴포넌트 신규 1 + 분기 수정** — 도란도란 #82 패턴, 회귀 통제 위해 별도 반복 권장.

---

## 8. 메모리 패턴 일치 (교훈 반영)

- **서비스 추가 공식**(#83·#87·#88): 플랜 → services.ts 엔트리 → index.html SEO 5곳 동기 → build → 라이브 검증.
- **정직 지표**(#87): SERVICE_COUNT는 status 무관 +1, PLATFORM_COUNT는 실 링크 Set 기반 → 과장 없음.
- **라이브 검증 신뢰신호**(#87): raw md5 아님. noscript 콘텐츠 출현 + JS 번들 content-hash 일치.
- **수동 배포 필수**(deployment 메모리): GitHub origin 자동배포 미연동 → `vercel deploy --prod --yes`.
- **육안 검증 필수**(#88): Playwright 다중 뷰포트 실측(미설치 시 `npm i -D playwright --no-save` + chromium).
- **앱 충실 재현 > 랜딩 타협**(#88): 폰트(Jua/Pretendard)·시그니처 색(민트)·마스코트를 앱 그대로.
