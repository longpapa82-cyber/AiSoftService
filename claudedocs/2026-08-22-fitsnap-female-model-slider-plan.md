# FitSnap 소개 영역 — 여성 모델 + 좌우 드래그 슬라이더 반영 계획

**작성일:** 2026-08-22
**대상:** `AiSoftService/` 통합 랜딩 — FitSnap 프로모 섹션 (`#promo-fitsnap`)
**출처(홍보웹):** `fitsnap/web/` (Vite+React, GitHub Pages) — 커밋 `b2ced63`(새 여성 데님 모델 + 좌우 드래그 슬라이더), `ef0f01d`(진입 시 자동 스윕)
**연관 홍보웹 계획서:** `fitsnap/docs/20-promo-web-model-slider-plan.md`

---

## 0. 목표 & 배경

사용자 요청: **"FitSnap 소개 영역의 여자 모델과 좌우 이동 UI/UX를, fitsnap 홍보웹에 적용된 내용을 조사해서 반영."**

홍보웹은 최근(2026-08-22, 라이브 확인 완료) 히어로/Features 비주얼을 아래로 교체했다:
- **남성 모델(옷장 스와이프 썸네일 카세트) → 여성 데님 모델(before/after 좌우 드래그 슬라이더)**
- 여성 모델 = 스카이블루/코랄 반팔티 + 데님 스커트 + 웨이브 제스처(라이트 럭셔리 크림 배경)
- 좌우 이동 UX = **before/after 경계선을 좌우로 드래그**하면 상의가 바뀌는 슬라이더 (자동 스윕 1회 시연 후 수동)

현재 통합 랜딩의 FitSnap 섹션은 **구(舊) 홍보웹 시그니처**인 `OutfitSwapVisual`(남성, 옷 썸네일 5종 클릭·자동순환 크로스페이드)를 이식해 둔 상태다. 이번 작업은 이를 홍보웹 최신본과 정합(무드 일치)시키는 것.

### 왜 지금 슬라이더가 가능한가 (핵심 근거)
과거 VTON 결과는 AI가 매번 전체 재생성 → before/after 픽셀이 어긋나 하드 경계(clip) 슬라이더 불가 → 크로스페이드였다.
현재 앱 inpaint 파이프라인은 **상의 밴드만 교체하고 밴드 밖은 원본 픽셀 강제 복원**(밴드밖 diff≈0)해서 before/after가 픽셀 정렬됨. → 경계선을 어디에 두어도 인물 윤곽이 맞물려 슬라이더가 성립.

---

## 1. 현황 조사 결과

### 1.1 홍보웹 측 (원본, `fitsnap/web/`)
| 파일 | 역할 |
|---|---|
| `src/components/ui/CompareSlider.tsx` | **핵심.** before/after 좌우 드래그 슬라이더. props `beforeSrc/afterSrc/beforeAlt/afterAlt/initial=50`. |
| `src/components/ui/compare-slider.css` | `.cs-stage`(aspect 4/5, `touch-action:none`)·`.cs-clip`(clip-path로 before 왼쪽만 노출)·`.cs-handle`(코랄 세로선+원형 그립 ‹›)·`.cs-label` |
| `src/sections/Hero.tsx` | 거울 프레임(`.hero-mirror`) 안에 `<CompareSlider before=hero-before.webp after=hero-after.webp/>` |
| `public/assets/demo/hero-before.webp` | **여성 데님 모델 — 스카이블루 티** (896×1120, 4:5) |
| `public/assets/demo/hero-after.webp` | **여성 데님 모델 — 코랄 티** (동일 프레임, 픽셀 정렬본) |

**`CompareSlider`의 UX 요약 (이식 대상):**
- **경계 위치 = CSS 변수 `--pos`** — 드래그 중 React 리렌더 없이 `stageRef.style.setProperty('--pos', ...)` 직접 조작(컴포지터만 갱신).
- **포인터**(마우스+터치 공용): `onPointerDown`→`setPointerCapture`, `onPointerMove`로 `clientX→%` 계산.
- **키보드**: 핸들 `role="slider"` + `tabIndex=0` + `aria-valuemin/max/now`, ←/→ ±2%, Home/End 0/100.
- **진입 자동 스윕**: `IntersectionObserver`(threshold 0.35)로 뷰포트 진입 시 `initial→22%→82%→initial`(~3.4s, easeInOutQuad) 1회 왕복 시연. **사용자가 한 번이라도 조작하면 영구 중단**(수동 모드).
- **reduced-motion**: 자동 스윕 생략, 초기 50% 정적. (슬라이더 자체는 원래 사용자 조작이라 정적이 자연스러움.)
- 정렬 안전장치: 두 img 모두 `object-fit:cover; object-position:center; 동일 크기` → clip으로 잘라도 같은 좌표계라 경계 맞물림.

### 1.2 통합 랜딩 측 (수정 대상, `AiSoftService/`)
| 위치 | 현황 |
|---|---|
| `src/data/services.ts` L198~201 | `outfitSwap?: { items: {src,label}[] }` 타입 (FitSnap 전용) |
| `src/data/services.ts` L985~993 | FitSnap `promo.outfitSwap.items` = base/knit/coat/shirt/jacket **남성 5종** |
| `src/data/services.ts` L35~39 | `fitsnapBase/Knit/Coat/Shirt/Jacket` import (`src/assets/promo/fitsnap/outfits/*.webp`) |
| `src/sections/PromoSection.tsx` L310~312 | `promo.outfitSwap ?` 분기 → `<OutfitSwapVisual/>` (다른 분기보다 우선) |
| `src/sections/PromoSection.tsx` L621~684 | `OutfitSwapVisual` 인라인 컴포넌트(썸네일 카세트+크로스페이드+자동순환) |
| `src/sections/PromoSection.module.css` L2180~2284 | `.osWrap/.osStage/.osImg/.osImgOn/.osSheen/.osBadge/.osThumbs/.osThumb*` |

> **아키텍처 차이:** 홍보웹은 `CompareSlider`를 **별도 컴포넌트 파일**로 두지만, 통합 랜딩은 `PromoSection.tsx` **내부 인라인 함수**(`OutfitSwapVisual`)로 시그니처 비주얼을 렌더한다. 이 관례(인라인 + CSS Module)를 유지한다.

---

## 2. 결과물 정의

FitSnap 프로모 섹션 우측 비주얼을:
- 남성 옷장 스와이프(썸네일 5종) → **여성 데님 모델 before/after 좌우 드래그 슬라이더**로 교체
- 거울 프레임/코랄 액센트/배지 톤은 기존 FitSnap 무드 유지(회귀 방지)
- 접근성: 마우스·터치 드래그 / 키보드 ←→·Home·End / `role="slider"`+aria / reduced-motion 정적
- 진입 자동 스윕 1회 시연(사용자 조작 시 중단)
- **다른 7개 서비스 회귀 0** — FitSnap 데이터만 교체하고, 컴포넌트는 `beforeAfter` 신규 분기로 추가(기존 `outfitSwap` 경로는 제거하되 타입/CSS는 정리)

---

## 3. 작업 계획

### Phase A — 에셋 이식 (홍보웹 → 통합 랜딩)
정렬 검증 통과본을 그대로 복사(재생성/재압축 불필요, 홍보웹 라이브와 동일 픽셀 유지).
```
mkdir -p src/assets/promo/fitsnap/model
cp ~/projects/fitsnap/web/public/assets/demo/hero-before.webp \
   src/assets/promo/fitsnap/model/before.webp        # 여성 스카이블루 티
cp ~/projects/fitsnap/web/public/assets/demo/hero-after.webp  \
   src/assets/promo/fitsnap/model/after.webp         # 여성 코랄 티(동일 프레임)
```
- 각 ~22KB webp, 896×1120(4:5) → 번들 예산 영향 미미(기존 outfits 5종 5×~70KB 제거로 오히려 감소).
- **주의(초상권):** 홍보웹과 동일하게 "AI 가상 인물(실존 인물 아님)" 표기 원칙 유지 — 기존 services.ts 주석(L34) 계승.

### Phase B — 데이터 스키마 교체 (`src/data/services.ts`)
1. **타입 추가** (L198 근처, `outfitSwap` 자리 대체 또는 병존):
   ```ts
   /**
    * FitSnap 전용: before/after 좌우 드래그 슬라이더(홍보웹 CompareSlider 이식).
    * 같은 여성 모델의 픽셀 정렬 쌍 — 경계선을 좌우로 밀면 상의가 바뀐다.
    * 있으면 outfitSwap/analysisCard/shot/mascot/steps보다 우선 렌더.
    */
   beforeAfter?: {
     before: string; after: string;
     beforeLabel?: string; afterLabel?: string;
   };
   ```
2. **import 교체** (L35~39): outfits 5종 → `fitsnapBefore/fitsnapAfter` 2종.
3. **FitSnap promo 블록** (L985~993): `outfitSwap` → `beforeAfter`.
   ```ts
   beforeAfter: {
     before: fitsnapBefore, after: fitsnapAfter,
     beforeLabel: '기본 코디', afterLabel: 'AI 추천 코디',
   },
   ```
   - 라벨은 통합 랜딩 톤(구매 판단 참고)에 맞춤 — 홍보웹 "원본/AI 가상 착용"과 유사하되 FitSnap subcopy와 정합. (라벨 문구는 §결정 필요 참조.)
4. **`outfitSwap` 타입/필드 제거**: FitSnap이 유일 사용처이므로 안전. (타입 def L198~201 삭제, 관련 주석 정리.)

### Phase C — 컴포넌트 교체 (`src/sections/PromoSection.tsx`)
1. **분기 추가** (L310): `promo.beforeAfter ?` 를 최우선 분기로.
   ```tsx
   {promo.beforeAfter ? (
     <CompareSliderVisual data={promo.beforeAfter} serviceName={service.name} />
   ) : promo.outfitSwap ? ( ... )  // outfitSwap 제거 시 이 분기도 삭제
   ```
2. **`CompareSliderVisual` 인라인 컴포넌트 신규** (기존 `OutfitSwapVisual` L621 자리 대체):
   - 홍보웹 `CompareSlider.tsx`의 로직을 CSS Module(`styles.cs*`)로 포팅.
   - `asset()` 래퍼는 불필요(통합 랜딩은 Vite import URL을 직접 사용).
   - `useReducedMotion` 훅이 없으면 홍보웹처럼 `window.matchMedia` 인라인 체크(기존 `OutfitSwapVisual`이 이미 이 방식 사용 — L633).
   - 핸들 그립 ‹› SVG, before/after 라벨, `--pos` CSS 변수, IntersectionObserver 자동 스윕, 포인터/키보드 핸들러 모두 이식.
3. **`OutfitSwapVisual` 제거** (L621~684).

### Phase D — 스타일 교체 (`src/sections/PromoSection.module.css`)
- `.os*` 클래스(L2180~2284) → `.cs*` 신규:
  - `.csWrap`(max-width 380 유지, 거울 프레임 톤 계승)
  - `.csStage{aspect-ratio:4/5; touch-action:none; position:relative; overflow:hidden;}` — 기존 `.osStage` 골드+코랄 프레임/그림자 재사용
  - `.csImg{position:absolute; inset; object-fit:cover; object-position:center;}` (before/after 공통)
  - `.csClip{position:absolute; inset:0; clip-path:inset(0 calc(100% - var(--pos)) 0 0);}`
  - `.csHandle{left:var(--pos); coral 세로선 + 원형 그립 44px(터치 타깃); cursor:ew-resize;}`
  - `.csGrip`(‹› 아이콘), `.csLabel--before/--after`(기존 `.osBadge` 코랄 배지 톤 재사용)
  - `.csSheen`(기존 `.osSheen` 계승)
  - 첫 방문 nudge/포커스 링, `@media (prefers-reduced-motion: reduce)` 정적 처리
- **모바일 정합:** 최근 세션(76f 이후)에서 FitSnap 모바일 배경/COMING SOON 배치를 반복 조정한 이력 있음 → 슬라이더 스테이지가 모바일에서 오버플로우/겹침 없는지 `.section{overflow:hidden}` 클립 및 375px 실측 재확인. 드래그 중 세로 스크롤 튐 방지 위해 `touch-action:none` 필수.

### Phase E — 검증
1. `npm run typecheck` (또는 `tsc --noEmit`) + `npm run build` 그린. `outfitSwap` 잔여 참조 0 확인.
2. **회귀 0:** 나머지 7개 서비스(mytravel/mypet/mybaby/mytoday/aimusic/lawpic/voicebuddy) 렌더 경로 무변경 — `beforeAfter`는 FitSnap만 세팅.
3. **실렌더(Playwright/브라우저):** 데스크톱 1440 + 모바일 375/390에서
   - 여성 모델 표시, 경계선 0~100% 드래그 시 인물 윤곽 어긋남 없음
   - 진입 자동 스윕 1회 → 조작 시 중단
   - 키보드 ←→·Home·End, 터치 드래그
   - 모바일 오버플로우/겹침 0 (COMING SOON·배경 데코와 충돌 없음)
4. **배포:** `vercel deploy --prod --yes` → 라이브 aisoft-iota 실렌더 + 로컬 dist md5 == 라이브 md5 대조(기존 검증 관례).

---

## 4. 사용자 결정 (확정 — 2026-08-22 AskUserQuestion)

1. **적용 범위** — 통합 랜딩 FitSnap 우측 비주얼 **1곳** 슬라이더로 충분(추가 위치 없음).
2. **before/after 라벨** = ✅ **"원본 / AI 가상 착용"** (홍보웹과 동일 표기, 통일성 우선).
   → services.ts `beforeAfter.beforeLabel:'원본'`, `afterLabel:'AI 가상 착용'`.
3. **구 `outfitSwap` 처리** = ✅ **완전 제거** (FitSnap 유일 사용처).
   → 삭제 대상: `outfitSwap` 타입 def(L198~201) · `OutfitSwapVisual`(PromoSection.tsx L621~684) · `.os*` CSS(module.css L2180~2284) · 남성 outfits 5종 import(L35~39).
4. **남성 outfits 에셋** = 완전 제거의 일부로 **삭제** — `src/assets/promo/fitsnap/outfits/*.webp` 5종 제거(번들 정리). grep으로 잔여 참조 0 확인 후 삭제.

---

## 5. 리스크 & 대응
| 리스크 | 대응 |
|---|---|
| 슬라이더 드래그 중 모바일 세로 스크롤 튐 | `.csStage{touch-action:none}` + pointer capture (홍보웹 검증됨) |
| before/after 픽셀 미정렬로 경계 어긋남 | 홍보웹 정렬 검증 통과본 그대로 복사(재압축 금지) |
| SSR/prerender 없음(통합 랜딩은 CSR) → window 접근 크래시 | 통합 랜딩은 Vite CSR이라 무관. 단 effect/handler 내부에서만 window 접근(기존 관례). |
| `outfitSwap` 제거 시 타입 오류 | 유일 사용처(FitSnap)라 grep 0 확인 후 삭제 |
| FitSnap 모바일 레이아웃(최근 다수 조정) 재회귀 | 375px 실측 + COMING SOON/배경 데코 겹침 재확인 |

## 6. 범위 밖 (YAGNI)
- 홍보웹 Features 타일 슬라이더(별건, 통합 랜딩엔 해당 위치 없음)
- 남성/추가 모델 다양화
- OutfitSwap 옷 5종 카세트 복원(교체가 목적이므로 불필요)
