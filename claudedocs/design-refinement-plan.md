# AI Soft 랜딩 — 디자인 정교화 & 게이미피케이션 강화 계획

**확정된 방향** (사용자 선택)
- 게임화 깊이: **가벼운 인터랙션** — 스크롤로 XP가 차고, 서비스 카드를 "수집"하며, 배지가 "언락"되는 *실제 상호작용*. 단, localStorage 상태 저장은 하지 않음.
- 비주얼 톤: **현재 '밝은 하이테크 + 골드' 외피 유지 + 정교화**. 신규 색조 추가 없이 기존 토큰(`--ais-*`) 정제·확장.
- 우선 요청: **앱스토어 / 구글플레이 / 웹 버튼(StoreBadges)을 더 잘 보이고 강조되게** → Phase 1로 최우선 처리.

원칙: 모션은 `transform`/`opacity`/`clip-path`만(컴포지터 친화). 모든 효과는 `prefers-reduced-motion`에서 정지. 신규 의존성 0 (GSAP 등 미도입, IntersectionObserver/rAF만 사용).

---

## Phase 1 — StoreBadges "획득 버튼" 재설계 ⭐ (최우선 / 사용자 요청)

현재 문제: Apple 공식 배지를 흉내낸 차분한 회색 카드 → 강조도 약함, 게임 톤과 단절.
목표: 다운로드를 **"보상 획득(LOOT) 액션"**처럼 보이게 — 눈에 확 띄고, 누르고 싶게.

- **1.1 시각 강조**: primary 배지(주 플랫폼)는 골드 그라디언트 채움 + 골드 글로우(`--ais-neon-gold`), 보조 배지는 아웃라인 글래스로 위계 분리. 현재는 3개가 평평하게 동급 → 위계 부여.
- **1.2 게임 라벨**: kicker를 `Download on the` → `▶ INSTALL` / `GET — FREE` 같은 게임 CTA 톤으로. "FREE" 핀 배지(작은 골드 칩) 부착.
- **1.3 호버 모션**: 현재 `translateY(-2px)` → 젤리 바운스(`--ais-ease-bounce`) + 로고 아이콘 살짝 회전/팝(`ais-pop-in`). 호버 시 "+10 XP" 플로팅 마이크로 피드백(장식, aria-hidden).
- **1.4 광택 스윕**: 배지 위로 1회 지나가는 sheen(`clip-path`/`translateX` 그라디언트) — 뷰포트 진입 시 1회.
- **1.5 다크/라이트 대비 유지**: 기존 `tone='dark'` (myTravel·내새끼) 가독성 회귀 없게 양 톤 모두 검증.

**파일**: `StoreBadges.tsx`(primary 플래그·라벨 분기), `StoreBadges.module.css`(전면 개편), `tokens.css`(필요 시 글로우 토큰 1~2개 추가).

---

## Phase 2 — Hero "라이브 HUD" 생동감

현재: XP 게이지가 `9,999`로 고정, 레벨 칩 스탯바도 정적. "살아있는 게임 화면" 느낌 부족.

- **2.1 XP 카운트업**: 진입 시 0→9,999 숫자 롤업(rAF, ~1.2s, ease-out). XP 바도 0→현재치 채워짐.
- **2.2 레벨 칩 호버 = "카드 뽑기"**: 서비스 칩 호버 시 살짝 들리고 기울며(틸트) 광택. 레어도 테두리 그라디언트가 흐르는 애니메이션.
- **2.3 ONLINE 상태 도트**: 맥박 펄스(`scale`+`opacity`) — 실시간 느낌.
- **2.4 배경 그리드 패럴랙스 강화**: 기존 `usePointerParallax`에 깊이 레이어 1개 추가(blob/grid 속도 차등).

**파일**: `Hero.tsx`(카운트업 훅), `Hero.module.css`, 신규 `hooks/useCountUp.ts`.

---

## Phase 3 — 스크롤 연동 XP 진척 (페이지 전역 게임화 핵심)

"가벼운 인터랙션" 선택의 핵심 — 페이지를 **플레이하듯 내려가는** 경험.

- **3.1 전역 XP 진행바**: 헤더 하단 1~2px 골드 라인이 스크롤 진척에 따라 차오름(스크롤 = 진척). `useScrollProgress` 훅(rAF 스로틀).
- **3.2 섹션 = 퀘스트 클리어**: 각 PromoSection이 뷰포트 진입해 끝까지 보이면 헤더에 "✓ {서비스} UNLOCKED" 토스트 1회(2.5s 후 사라짐). 누적 "3/3 SERVICES COLLECTED" 표시.
- **3.3 진입 stagger 정교화**: 기존 `useReveal`에 방향성 부여(좌/우 교차 슬라이드 + 스케일), 카드별 delay 리듬.

**파일**: 신규 `hooks/useScrollProgress.ts`, `Header.tsx`(진행바+카운터), `App.tsx`(퀘스트 상태 컨텍스트), `PromoSection.tsx`(클리어 감지).

---

## Phase 4 — Technology "스탯 보드" 진짜 게임화

현재: 모든 게이지가 100% 고정 → 게임 보드인데 긴장감 0(만점이라 밋밋).

- **4.1 게이지 카운트업**: 진입 시 0→목표치 애니메이션(링·바 동시). 100%는 "MAX" 폭죽 마이크로 이펙트.
- **4.2 레어도 시각 차등 강화**: legend/epic/rare/gold 카드 테두리에 흐르는 그라디언트(conic) + 등급별 광량 차이. 현재는 색만 다름 → "희귀할수록 빛난다".
- **4.3 카드 호버 = 3D 틸트**: 포인터 위치 기반 미세 틸트(`rotateX/Y`, 최대 6deg) + 광택 하이라이트 따라다님.
- **4.4 STAT_BOARD 카운터**: "QUESTS UNLOCKED" 숫자도 카운트업.

**파일**: `Technology.tsx`, `Technology.module.css`, `useCountUp.ts`(재사용), 신규 `hooks/useTilt.ts`.

---

## Phase 5 — 마이크로 디테일 & 마감 (전역 정교화)

- **5.1 버튼 정교화**: `Button` primary에 sheen 스윕 + 누를 때 젤리 압축. "PRESS START" 모노 라벨 깜빡임(blink) 절제 적용.
- **5.2 커서 친화 디테일**: 인터랙티브 요소 호버 시 일관된 골드 포커스 링·글로우 언어 통일.
- **5.3 섹션 전환 리듬**: 다크(myTravel/내새끼) ↔ 라이트 섹션 경계에 부드러운 그라디언트 페더링.
- **5.4 폰트 로딩**: 게임 톤 디스플레이 가중치 확인(Outfit 700/800), `font-display: swap` 점검.
- **5.5 접근성 회귀 검증**: 모든 신규 모션 reduced-motion OFF 확인, 포커스 순서·aria 라이브영역(토스트) 점검.

---

## 검증 게이트 (각 Phase 후)

1. `npm run build` 통과 (tsc + vite)
2. reduced-motion 시 모든 신규 애니메이션 정지 확인
3. 폰 실기기(`192.168.45.46:5173`) 320/375px 오버플로 없음
4. 다크/라이트 PromoSection 가독성 회귀 없음
5. 변경 후 스크린샷 비교 (전/후)

## 구현 순서 제안

**Phase 1 (StoreBadges)** 를 먼저 완성·확인 → 사용자 피드백 → Phase 2~5 진행.
Phase 2·3은 Hero/스크롤로 연결되어 함께, Phase 4는 독립적, Phase 5는 마지막 마감.

## 범위 밖 (YAGNI)

- localStorage 상태 저장(본격 게임화) — 이번엔 제외(사용자 선택).
- 신규 라이브러리(GSAP/Framer/Lottie) — 도입 안 함.
- 사운드/햅틱 — 범위 밖.
- 신규 색 팔레트·다크모드 토글 — 톤 유지 결정에 따라 제외.
