# Hero·Footer 하이테크 모션 고도화 계획

> 작성일: 2026-08-30 · 브랜치: feat/integrated-landing · 대상: 상단 Hero + 하단 Footer
> 목표: AI·과학·반도체 느낌의 "살아 움직이는 시스템" 인상. 밋밋한 정적 배경 →
> 격동적이지만 절제된(premium) 모션. 성능·접근성·브랜드 규율은 유지.

---

## 0. 현재 상태 진단 (근거)

| 영역 | 지금 | 한계 |
|------|------|------|
| Hero 배경 | 웜/화이트 + 골드 라디얼 blob 1개 (`heroDrift` 24s) + 정적 hairline | 움직임이 blob 하나뿐 → "정지된 그라데이션" 인상 |
| Hero 프리뷰 패널 | **정적** PCB 도트 (`radial-gradient` dots, opacity 0.06) | 반도체 질감은 있으나 **살아있지 않음** |
| Hero 진입 | 단어 stagger + 카드 stagger (transform/opacity) | 양호. 유지·확장 대상 |
| Footer | near-black + **정적** 도트 격자 + 상단 hairline | "시스템 패널" 컨셉인데 시스템이 **죽어있음** |
| 모션 엔진 | CSS 애니 + `usePointerParallax`(CSS var), 애니 라이브러리 **없음** | 신규 라이브러리 없이 canvas+CSS로 확장 가능 |
| 접근성 | 두 섹션 모두 `prefers-reduced-motion` 하드 컷 존재 | 신규 모션도 반드시 이 게이트 준수 |

**핵심 공백**: 데이터 흐름(data-flow), 신경망 노드, 신호 펄스, 파티클 필드 같은
**"연산이 일어나는 중"** 시각 언어가 전무. 도트 텍스처는 있으나 애니메이션이 없다.

### 설계 제약 (v4~v8 히스토리에서 도출한 가드레일)
- 팀은 게임 HUD·네온·바운스를 **의도적으로 제거**하고 Stripe/Linear 톤으로 정착했다.
  → 신규 모션은 "화려함"이 아니라 **"정밀한 시스템"** 방향이어야 회귀가 아니다.
- 장식 색은 전부 뉴트럴, 컬러 포인트는 **Signal Gold + `--ais-ai-grad`(AI 클립)** 에만 허용.
  → 새 글로우/빔은 `--ais-gold`, `--ais-glow`, `--ais-ai-grad` 토큰으로만.
- 모션 프로퍼티는 **transform/opacity/filter(절제)/clip-path**만. width/top/left 금지.

---

## 1. 컨셉 방향 (선정)

**"Living Silicon" — 살아있는 실리콘.**
반도체 웨이퍼 위를 신호가 흐르고, AI가 연산하는 순간을 배경 레이어로 표현한다.
전경 콘텐츠(카피·통계·로고)는 **절대 방해받지 않는다** — 모션은 전부 배경/장식 레이어(z-index 음수 또는 격리).

3개 시각 언어를 조합:
1. **Neural particle field** (canvas) — 노드 + 근접 연결선이 천천히 유영, 포인터 근처에서 반응.
2. **Data-flow beams** (CSS) — 회로 트레이스를 따라 흐르는 신호 광점(gradient sweep).
3. **Signal pulses / glow breathing** (CSS) — 골드 시그니처가 맥동(호흡).

---

## 2. Hero (상단) 고도화 상세

### 2-A. 신규: Neural Particle Canvas 배경 `<HeroFieldCanvas>`
가장 임팩트 큰 레이어. 애니 라이브러리 없이 `requestAnimationFrame`로 직접 구현.

- **컴포넌트**: `src/components/visual/HeroFieldCanvas.tsx` + `.module.css`
- **동작**:
  - 노드 N개(데스크톱 ~48, 모바일 ~22)를 느린 속도로 유영.
  - 두 노드 거리 < 임계값이면 연결선을 alpha 그라데이션으로 그림(신경망 인상).
  - 포인터 근처 노드는 살짝 끌려오고 밝아짐(연산 반응). 터치·reduced-motion에선 비활성.
  - 색: near-black 노드 + 골드 소수(`--ais-gold` 12~18%만 골드, 나머지 뉴트럴) → 브랜드 규율.
- **성능 가드**:
  - DPR 상한 2, `IntersectionObserver`로 **뷰포트 벗어나면 rAF 정지**(배터리·CPU 절약).
  - `document.hidden` 시 정지, 탭 복귀 시 재개.
  - `prefers-reduced-motion` → 캔버스 마운트 자체를 **스킵**하고 정적 SVG/도트 폴백.
  - 노드 수를 `matchMedia`로 화면폭 분기, 파티클 상한 하드코딩(런어웨이 방지).
- **레이어**: `.heroGradient` 내부, z-index -1, `pointer-events:none`.

### 2-B. 기존 `heroDrift` blob → 다층 오로라(2~3겹) 승격
- blob 1개 → 골드+뉴트럴 2겹으로 위상차 드리프트(서로 다른 duration/방향)로 깊이감.
- `mix-blend-mode: plus-lighter`(지원 시) 또는 은은한 opacity 중첩.
- 여전히 `filter: blur` + `transform`만 애니메이트(레이아웃 무영향).

### 2-C. 신규: 회로 트레이스 + 데이터 흐름 빔 (SVG/CSS)
- 프리뷰 패널 뒤(또는 Hero 하단 전환존)에 얇은 회로 라인 SVG 1장.
- 라인을 따라 광점이 흐르는 효과: `stroke-dasharray` + `stroke-dashoffset` 애니 또는
  `background: linear-gradient` sweep + `background-position` 이동(컴포지터 친화 우선).
- 골드 신호가 트레이스를 타고 흐르며 노드(프리뷰 카드 위치)에서 "도착" 펄스.

### 2-D. 프리뷰 패널: 정적 도트 → 살아있는 PCB
- `.previewPanel::before` 정적 도트에 **아주 느린 시프트/시머**(background-position 미세 이동, ≤0.5px 체감) 추가.
- 카드 hover 시 이미 있는 팝(scale/rotate) 유지 + **연결선 하이라이트**(hover 카드에서 패널 중앙으로 빔).

### 2-E. 헤드라인 "AI" 클립 강화
- 기존 `--ais-ai-grad` 텍스트 클립에 **background-position 흐름 애니**(그라데이션이 살아 흐름).
- 진입 stagger는 유지, 등장 후 "AI"만 은은한 shimmer 루프(reduced-motion에서 정지).

### 2-F. 스크롤 인디케이터
- 현 `scrollDrop` 유지 + 트랙에 골드 신호 잔상 1겹(과하지 않게).

---

## 3. Footer (하단) 고도화 상세

컨셉: **"System Panel Online" — 켜져 있는 시스템**. `System Online` 배지가 실제로 살아있게.

### 3-A. 정적 도트 격자 → 데이터 그리드 애니
- `.footer::before` 도트에 느린 대각 스캔(mask gradient가 천천히 훑고 지나가는 시머).
- 또는 도트 일부가 순차 점멸(신호가 격자를 타고 이동하는 인상) — CSS 다중 background + position 애니.

### 3-B. 상단 hairline → 데이터 스트림 라인
- 현 상단 1px hairline에 골드 광점이 좌→우로 주기적으로 흐르는 sweep(경계가 살아있음).
- `System Online` 배지 dot을 실제 맥동(breathing pulse)으로.

### 3-C. 로고/서비스 링크 마이크로 인터랙션 강화
- 로고 mark(골드 박스)에 hover 시 신호 확산 링(pulse-ring) 1회.
- 서비스 링크 hover의 `translateX(4px)` 유지 + 아이콘에 골드 엣지 글로우 스윕.

### 3-D. 신규: Footer 파티클(경량)
- Hero canvas의 **경량 변형**(노드 절반 이하, 하단에만) 또는 순수 CSS 부유 입자 6~8개.
- near-black 배경 위 골드/뉴트럴 미세 입자가 위로 천천히 상승(연산 잔열 인상).
- 성능 예산 초과 시 CSS-only로 대체(Hero canvas 재사용 여부는 구현 시 벤치).

---

## 4. 공유 인프라 (재사용)

### 4-A. 신규 훅 `useRafLoop` (또는 canvas 컴포넌트 내부화)
- IntersectionObserver + `document.visibilitychange` + reduced-motion 게이트를 한곳에.
- Hero/Footer canvas가 공유 → DRY, 성능 정책 일원화.

### 4-B. 신규 토큰 (tokens.css 추가 전용, 기존 변경 0)
```css
--ais-motion-signal: /* 데이터 흐름 빔 색(골드 저알파) */
--ais-dur-flow: 6s;   /* 신호 흐름 주기 */
--ais-dur-breathe: 3.2s; /* 맥동 호흡 주기 */
--ais-ease-flow: linear; /* 등속 흐름 */
```
- 기존 v8 토큰은 **삭제/변경 금지**(히스토리 규율). 추가만.

---

## 5. 성능 예산 & 가드 (web/performance.md 준수)

- **JS**: canvas 로직은 순수 TS, 라이브러리 0 → 랜딩 <150kb 예산 유지. 예상 증가 ~3–5kb gzip.
- **CSS**: <30kb 예산 내. 신규 키프레임/레이어 ~2–3kb.
- **런타임**:
  - rAF는 뷰포트·가시성 게이트로 idle 시 0 비용.
  - canvas DPR≤2, 파티클 상한, 연결선 O(n²)는 n 작게(≤48) 유지 or 공간 분할 생략(n 작아 불필요).
  - `will-change`는 진입/hover 순간만, 종료 후 제거.
- **CLS 0**: 모든 신규 레이어 absolute/pointer-events:none → 레이아웃 이동 없음.
- **애니 프로퍼티**: transform/opacity/background-position/filter만. layout 트리거 금지.

---

## 6. 접근성 (필수)

- `prefers-reduced-motion: reduce` →
  - canvas 마운트 스킵(정적 폴백), 모든 흐름/맥동/시머/오로라 정지.
  - 기존 두 섹션의 reduced-motion 블록 확장(신규 셀렉터 추가).
- 모션은 전부 **장식**(aria-hidden / 배경 레이어) → 스크린리더·키보드 흐름 불변.
- 색 대비: 전경 텍스트는 기존 AA 유지(배경 모션이 텍스트 위로 오지 않음).

---

## 7. 구현 순서 (Phase, 병렬성 표기)

> 각 Phase는 tsc + build 그린 확인 후 진행. 회귀 리스크는 배경 레이어라 낮음.

- **P1 · 공유 인프라** (선행 의존)
  - tokens.css 신규 토큰 추가 + `useRafLoop`/canvas 스캐폴드.
- **P2 · Hero** ‖ **P3 · Footer** (P1 후 병렬 가능)
  - P2: HeroFieldCanvas → 다층 오로라 → 회로 빔 → PCB 시머 → AI 클립 flow.
  - P3: 데이터 그리드 애니 → 스트림 라인 → 마이크로 인터랙션 → 경량 파티클.
- **P4 · 통합 검증** (P2·P3 후)
  - 로컬 실렌더(데스크톱 1440 / 모바일 390) 육안, reduced-motion 토글 검증.
  - Lighthouse/성능 스팟체크(rAF idle 확인), 번들 예산 재확인.
  - 기존 5~7서비스 프리뷰/링크 회귀 0 확인 → 커밋 → 배포(`vercel deploy --prod --yes`) → 라이브 md5 대조.

**병렬 이득**: P2·P3은 서로 다른 파일(Hero* vs Footer*) → 독립. 공유는 P1 토큰/훅뿐.

---

## 8. 리스크 & 완화

| 리스크 | 완화 |
|--------|------|
| "격동적" 요구 vs Stripe/Linear 절제 톤 충돌 | **[결정] 강조형 채택**(2026-08-30 사용자). 강도(파티클 밀도·흐름 속도·골드 알파)는 올리되 **시각 어휘는 '정밀 시스템'으로 잠금**(HUD·네온·바운스 금지). 강함 ≠ 유치함. |
| canvas가 저사양/모바일 발열 | 뷰포트·가시성 게이트, 파티클 상한, 모바일 노드 축소, reduced-motion 폴백 |
| 배경 모션이 카피 가독 저해 | 배경 레이어 opacity 상한, 텍스트 뒤 마스크 페더, 대비 실측 |
| 번들·CSS 예산 초과 | 라이브러리 0 원칙, 키프레임 최소화, 측정 후 필요시 CSS-only 강등 |
| 히스토리 회귀(게임 HUD 인상 부활) | "정밀 시스템" 언어만 사용(네온·바운스·HUD 금지), 색 토큰 규율 |

---

## 9. 완료 정의 (DoD)

- [ ] Hero·Footer가 정지 상태 없이 "연산 중인 시스템"으로 보임(실렌더 육안).
- [ ] transform/opacity/background-position/filter 외 애니 프로퍼티 0.
- [ ] reduced-motion에서 완전 정지 + 폴백 정상.
- [ ] rAF가 뷰포트 밖/탭 숨김 시 정지(devtools 확인).
- [ ] JS/CSS 예산 내, CLS 0.
- [ ] 기존 서비스 프리뷰·링크·통계 카운트업 회귀 0.
- [ ] 로컬 dist == 라이브 번들 md5 일치(배포 검증).
```
