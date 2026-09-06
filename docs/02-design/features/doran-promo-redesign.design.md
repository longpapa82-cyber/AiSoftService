# [Design] doran-promo-redesign — 설계 문서

- **작성일**: 2026-09-06
- **PDCA Phase**: Design
- **Plan 문서**: `docs/01-plan/features/doran-promo-redesign.plan.md`
- **원칙**: 데이터 주도 + 스코프 격리(`:global(#promo-doran)`) → 타 8서비스 회귀 0

---

## 1. 설계 개요

4개 변경 축을 **최소 침습·스코프 격리**로 반영한다:
1. 마스코트: 정적 WebP → **JSX SVG 컴포넌트**(신규 파일 1개)
2. 폰트: 도란 데이터의 `theme.font`/`promo.fontDisplay`를 Jua 선두로(데이터 1곳)
3. SoftShadow + accent 밑줄: 도란 스코프 CSS(신규 규칙)
4. 팔레트 미세 정합: heroGradient 톤 조정(데이터 1곳)

---

## 2. 컴포넌트 설계 — `DoraniMascot.tsx` (신규)

### 2.1 위치·형태
- **경로**: `src/components/DoraniMascot.tsx` (또는 `src/sections/` 인접)
- **형태**: props 없는(또는 기본값만) 순수 함수 컴포넌트. `<svg>` JSX 반환.
- **⚠️ 보안**: `dangerouslySetInnerHTML` **미사용**. dorani.js의 좌표를 `<path>/<circle>/<ellipse>` JSX로 직접 렌더 → XSS 표면 0.

### 2.2 렌더 대상: peer × neutral × smile (정적 1종)
미니 홍보 섹션은 정적 도란이만 필요 → dorani.js의 `doraniSVG({age:'peer',gender:'neutral',expression:'smile'})` 경로만 JSX로 변환. 표정 전환/눈추적/pulse/성별 소품은 **미이식**(YAGNI).

### 2.3 정확한 좌표·색상 (dorani.js AGES.peer + smile, 빌드타임 계산 완료)
```
viewBox: "0 -18 200 208"
── 색상 (peer, lightenHex/darkenHex 사전 계산) ──
fill(base):  #8FE3D8
lighter:     #a8e9e1   (lightenHex(fill,0.22))
darker:      #81ccc2   (darkenHex(fill,0.1))
line(stroke):#3FA6AE
ink:         #282E38
blush:       #F0A98C (opacity 0.62)
highlight:   radial #ffffff 0.55→0

── 그라디언트 defs (id 고정, 한 인스턴스라 충돌 없음) ──
<linearGradient id="dorani-body" x1=0 y1=0 x2=0 y2=1>
  stop 0    #a8e9e1
  stop 0.55 #8FE3D8
  stop 1    #81ccc2
<radialGradient id="dorani-hl" cx=0.4 cy=0.28 r=0.5>
  stop 0 #fff/0.55 → stop 1 #fff/0

── 요소 (그리는 순서: ant → body → highlight → face → blush) ──
antenna: <path d="M64 30 Q58 12 70 8 M136 30 Q142 12 130 8" fill=none stroke=#3FA6AE sw=3.5 linecap=round/>
body:    <path d="M100 22 C148 22 176 58 176 104 C176 152 146 178 100 178 C54 178 24 152 24 104 C24 58 52 22 100 22 Z" fill=url(#dorani-body) stroke=#3FA6AE sw=3.5 linecap=round/>
highlight: <ellipse cx=90.64 cy=62 rx=42 ry=26 fill=url(#dorani-hl)/>   // cx=100-(126-74)*0.18=90.64, cy=eyeY-34=62
── 눈 (eyeXs=[74,126], eyeY=96, eyeR=7, hiR=2.4) ──
왼눈: <circle cx=74 cy=96 r=7 fill=#282E38/> <circle cx=76.5 cy=93.5 r=2.4 fill=#fff/>
오눈: <circle cx=126 cy=96 r=7 fill=#282E38/> <circle cx=128.5 cy=93.5 r=2.4 fill=#fff/>
── 입 (smile, mouthY=118, mouthDip=12) ──
<path d="M88 118 Q100 130 112 118" fill=none stroke=#282E38 sw=4 linecap=round/>
── 볼 blush (2개) ──
<ellipse cx=58 cy=112 rx=11 ry=7 fill=#F0A98C opacity=0.62/>
<ellipse cx=142 cy=112 rx=11 ry=7 fill=#F0A98C opacity=0.62/>
```
> 위 좌표는 dorani.js를 근거로 산출. 구현 시 dorani.js 원본과 재대조.

### 2.4 컴포넌트 스켈레톤
```tsx
// src/components/DoraniMascot.tsx
interface DoraniMascotProps {
  className?: string;
}
export function DoraniMascot({ className }: DoraniMascotProps) {
  return (
    <svg className={className} viewBox="0 -18 200 208"
         xmlns="http://www.w3.org/2000/svg" role="img" aria-label="도란이 캐릭터">
      <defs>{/* linearGradient dorani-body + radialGradient dorani-hl */}</defs>
      <g>{/* ant, body, highlight, 눈2, 입, blush2 */}</g>
    </svg>
  );
}
```

---

## 3. 렌더 분기 설계 — `PromoSection.tsx`

### 3.1 데이터 신규 필드 (타입 확장, 최소 침습)
`ServicePromo`에 optional 필드 추가:
```ts
/** 마스코트를 정적 이미지 대신 벡터 컴포넌트로 렌더(현재 'dorani'만). 있으면 mascot(이미지)보다 우선. */
mascotComponent?: 'dorani';
```
> 기존 `mascot: string`(voicebuddy/mytoday/lawpic) 경로 무변경 → 회귀 0.

### 3.2 렌더 분기 (라인 ~455, mascot 경로)
현재:
```tsx
) : promo.mascot ? (
  ...
  <img className={styles.mascotImg} src={promo.mascot} .../>
```
변경(mascotComponent 우선 분기):
```tsx
) : (promo.mascot || promo.mascotComponent) ? (
  ...
  {promo.mascotComponent === 'dorani' ? (
    <DoraniMascot className={styles.mascotImg} />
  ) : (
    <img className={styles.mascotImg} src={promo.mascot} .../>
  )}
```
> `styles.mascotImg`를 그대로 재사용 → 크기(78%)·bob 애니메이션·drop-shadow 동일 적용. mascotStage 레이아웃 무변경.
> ⚠️ 라인 316(analysisCard 경로의 mascot)은 로픽 전용이라 무관 — 손대지 않음.

---

## 4. 데이터 변경 — `services.ts` (doran 항목)

| 필드 | 현재 | 변경 |
|------|------|------|
| `theme.font` | `'Pretendard Variable', 'Noto Sans KR', ...` | `'Jua', 'Pretendard Variable', 'Noto Sans KR', ...` |
| `promo.fontDisplay` | `'Pretendard Variable', ...` | `'Jua', 'Pretendard Variable', ...` |
| `promo.fontBody` | (유지) Pretendard | 유지 |
| `promo.mascot` | `doranMascot`(webp import) | **제거** 또는 유지(폴백) — `mascotComponent:'dorani'` 추가 |
| `promo.mascotComponent` | 없음 | `'dorani'` 신규 |
| `promo.heroGradient` | `#b8ece6 0%, #d6f4f2 45%, #fce6da 100%` | `#B8ECE6 0%, #FCE6DA 100%`(홍보웹 --grad-hero 정합) |

> **mascot import 처리**: `mascotComponent`로 렌더하면 `doranMascot`(webp)·mascot.webp 자산은 미사용. import·데이터·파일 제거 여부는 Do에서 결정(제거 시 번들 축소, 유지 시 폴백). **제거 권장**(YAGNI, 미사용 자산).

---

## 5. CSS 설계 — `PromoSection.module.css` (`:global(#promo-doran)` 스코프)

### 5.1 SoftShadow 정합 (신규)
홍보웹 `--shadow-card: 0 8px 24px rgba(126,154,160,.16)` / `--shadow-float: 0 18px 50px rgba(126,154,160,.22)` 톤을 도란 스코프에 반영:
```css
/* 도란 SoftShadow: 차가운 검정 대신 민트 계통 저채도(홍보웹 정합) */
:global(#promo-doran) .highlight { box-shadow: 0 8px 24px rgba(126,154,160,.16); }
:global(#promo-doran) .step { box-shadow: 0 8px 24px rgba(126,154,160,.16); }
:global(#promo-doran) .mascotStage { /* float 그림자 톤 정합 검토 */ }
```
> 적용 대상은 Do에서 실렌더 확인 후 확정(과도한 변경 지양, highlight/step 우선).

### 5.2 accent 형광펜 밑줄 (신규)
홍보웹 `.accent::after`(코랄 밑줄)를 도란 headlineAccent에 반영:
```css
:global(#promo-doran) .accent {
  position: relative;
}
:global(#promo-doran) .accent::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0.06em;
  height: 0.32em;
  background: color-mix(in srgb, #EFAC8D 62%, transparent); /* 코랄 형광펜 */
  z-index: -1;
  border-radius: 999px;
}
```
> ⚠️ 기존 `.accent`는 primary→accent 그라디언트 텍스트(background-clip). 밑줄 `::after`는 `z-index:-1`로 텍스트 뒤에 깔아 충돌 없음. 실렌더 확인 필수.

### 5.3 Jua 폰트는 CSS 무변경
`.headline`/`.brand`/`.stepTitle` 등은 이미 `var(--p-font-display)` 사용 → 데이터(fontDisplay)만 바꾸면 자동 적용. **CSS 손댈 것 없음**.

---

## 6. 구현 순서 (Do 단계 체크리스트)

1. `DoraniMascot.tsx` 생성 (peer/smile SVG JSX, dorani.js 좌표 재대조)
2. `services.ts`: `ServicePromo`에 `mascotComponent?: 'dorani'` 타입 추가
3. `services.ts` doran 항목: font→Jua, `mascotComponent:'dorani'`, heroGradient 정합, mascot/webp import 제거
4. `PromoSection.tsx`: DoraniMascot import + mascot 렌더 분기
5. `PromoSection.module.css`: `#promo-doran` SoftShadow + accent 밑줄
6. 미사용 자산 정리: `src/assets/promo/doran/mascot.webp` 제거(선택)
7. 검증: tsc 0 → build → 로컬 육안(도란이 SVG 렌더·Jua·밑줄·타 서비스 회귀0) → 배포 → 라이브 대조

---

## 7. 검증 설계 (Check 대비)

| 검증 항목 | 방법 |
|-----------|------|
| 도란이 SVG 렌더 | 로컬 dev 육안 — 앱/홍보웹과 시각 동일(민트 얼굴+코랄 볼+안테나+smile) |
| Jua 폰트 적용 | 헤드라인/번호/카드 제목 렌더 확인 (Jua 특유 둥근 형태) |
| accent 밑줄 | headlineAccent "네 이야기를 들어줄게"에 코랄 밑줄 |
| SoftShadow | highlight/step 그림자가 민트 저채도 톤 |
| 타 서비스 회귀 0 | voicebuddy/mytoday(mascot img 경로)·나머지 스팟체크 |
| 타입/빌드 | tsc --noEmit, npm run build |
| 반응형 | 320/768/1440 오버플로 0 |
| 라이브 | 배포 후 CSS/JS 번들 대조 |

---

## 8. 설계 리스크 재확인

- **SVG 좌표 오차**: dorani.js 원본 재대조로 방지. highlight cx 계산(90.64) 등 산출값은 구현 시 검산.
- **accent 밑줄 ↔ 그라디언트 텍스트 충돌**: `z-index:-1` + `::after`로 분리, 실렌더 확인.
- **Jua 글리프**: Jua는 한글 폰트라 "도란도란"·헤드라인 한글 정상. 라틴 폴백은 Pretendard. index.html에 Jua 이미 로드됨(확인 완료).
