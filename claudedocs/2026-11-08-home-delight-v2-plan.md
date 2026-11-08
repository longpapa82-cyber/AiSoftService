# 홈 페이지 "재미 요소·모션 강화 v14 — Playful Interaction" 상세 계획

> 작성일: 2026-11-08 · 브랜치: feat/integrated-landing
> 기준점(baseline): **커밋 6b34027** — 사용자 최종 승인("확인 완료" 2026-11-07).
> 전제: 셸 v10/v11 럭셔리 + 서비스 룸 v11 모션 풀(그레인 제외) 상태에서 출발.

---

## 0. 방향 정의 — 왜 "인터랙션"인가

현재 코드베이스에는 keyframe 애니메이션 40+종(히어로 키네틱 타이포, 12룸 motif, 오로라, 카운트업, stagger)이 이미 있다. **자동 재생 모션은 포화 상태**이며, 추가하면 "움직임이 많다"는 인상만 늘고 재미는 늘지 않는다.

반면 **사용자 입력(마우스·스크롤·클릭·터치)에 반응하는 요소는 거의 없다**:

| 입력 | 현재 반응 | 공백 |
|---|---|---|
| 스크롤 | reveal 진입, 헤더 다크 적응 | 진행감·위치 내비게이션 없음 (12섹션인데) |
| 마우스 이동 | 없음 | 히어로 벤토·폰 목업이 포인터에 무반응 |
| hover | 버튼 기본 hover만 | 로고·배지·카드에 designed hover 부재 |
| 클릭 | 링크 이동만 | 클릭 자체의 즐거움(마스코트 반응 등) 없음 |

→ **v14 = "보는 재미"에서 "만지는 재미"로.** 신규 라이브러리 0개 — 보유 훅(`useTilt`, `usePointerParallax`, `useScrollProgress`)이 이미 있으나 거의 미활용이므로 이를 활성화하는 것이 핵심.

---

## 1. 불변 제약 (🔴 위반 시 원복 사이클 재발 — #99~#102 사가 교훈)

1. **서비스 브랜드 룸(12곳) = 시각 요소 추가 금역.** 새 장식·텍스처·모티프·그림자 추가 금지. 실제 앱 디자인 재현이 원칙.
2. **룸 내 허용 범위 = "정착 후 모습이 원본과 동일"한 순수 모션/인터랙션만** (#100 기준). 예: 기존 마스코트가 클릭에 반응 → 허용. 룸에 새 파티클 추가 → 금지.
3. **공통 효과를 12룸에 일괄 적용 금지** — 다크 룸 그레인 사례처럼 "동일한 때(얼룩)"로 인지됨(#102). 룸별 처리는 개별 판단.
4. **룸을 건드리는 작업은 구현 전 AskUserQuestion으로 항목별 확인** 필수.
5. 모든 모션은 compositor-friendly(transform/opacity/clip-path)만, `prefers-reduced-motion` 가드 필수, reduce-motion 검증은 baseline(6b34027) 비교로 회귀 0 증명.
6. 셸(Hero·Header·Technology·About·Footer)은 자유 구역 — 단 v10/v11 럭셔리 광원 언어(샴페인 골드·네이비)와 일관성 유지.

---

## 2. 트랙별 상세 설계

### Track A — 스크롤 내비게이션·진행감 (셸 · 효과 대비 위험 최저 · **1순위**)

12개 서비스 룸 + 셸 섹션을 순회하는 페이지인데 "내가 어디 있는지"를 알 길이 없다. #96에서 보류된 **ServiceRail**이 바로 이 공백을 메운다.

**A-1. ServiceRail (신규 컴포넌트 `src/components/ServiceRail.tsx` + module.css)**
- 데스크톱(≥1024px) 우측 고정 세로 도트 레일. 모바일은 미표시(터치 스크롤과 충돌·공간 부족).
- 도트 = 각 서비스 **브랜드 primary 컬러**(`services.ts`의 기존 색 데이터 재사용) + 셸 섹션(히어로/기술/소개)은 샴페인 골드.
- IntersectionObserver로 활성 섹션 추적(기존 Header 다크 적응 IO 패턴 재사용) → 활성 도트 확대 + 글로우.
- hover 시 서비스명 툴팁(브랜드 컬러 칩과 함께) 슬라이드 인. 클릭 시 `scrollIntoView({behavior:'smooth'})` — reduce-motion 시 `auto`.
- 접근성: `<nav aria-label="섹션 바로가기">` + 키보드 포커스 링.
- 성능: IO 기반(스크롤 핸들러 0), 도트는 transform/opacity만.

**A-2. 헤더 스크롤 진행 바**
- `useScrollProgress`(보유·미활용) 활성화 → 헤더 하단 1.5px 진행 바. 샴페인 골드 그라데이션.
- `transform: scaleX(progress)` — 레이아웃 속성 미사용. rAF 쓰로틀은 훅 내부 확인 후 보강.

**A-3. (선택) 히어로 스크롤 큐 강화**
- 기존 scrollDrop 인디케이터에 "12개 서비스가 기다립니다" 마이크로 카피 + 첫 스크롤 시 fade-out.

### Track B — 인터랙티브 히어로 (셸 · 체감 효과 최대 · **2순위**)

**B-1. 벤토 카드 포인터 틸트 + 글레어**
- `useTilt`(보유) 를 벤토 서비스 카드에 연결 — 포인터 위치에 따라 `rotateX/rotateY` ±4° 미만(과하면 멀미). 카드 내 radial 글레어(`--glare-x/y` CSS 변수 주입, 기존 유리엣지 이중배경 위에 하이라이트).
- 터치 디바이스는 `(hover: hover)` 미디어 쿼리로 제외.

**B-2. 커서 스포트라이트 (다크 히어로 한정)**
- 히어로 배경에 포인터 추적 radial-gradient(샴페인 골드 2~3% 알파) — 다크 무대에서 "손전등" 느낌. `background` 대신 별도 absolute 레이어 `transform: translate()` 로 이동(컴포지터 전용).
- rAF 1회/프레임 쓰로틀 + lerp 지연(0.08)로 부드럽게 따라오게.

**B-3. 마그네틱 CTA 버튼**
- 주 CTA(골드 버튼)에 자석 효과: 포인터 접근 시 버튼이 커서 방향으로 ≤6px 끌림 + 이탈 시 스프링 복귀(CSS transition cubic-bezier). Button.tsx에 opt-in prop(`magnetic`)으로 추가 — 기존 전 버튼 불변.

**B-4. Hero `--card-i` stagger 완성**
- 변수는 이미 주입돼 있으나 CSS 미사용(11-07 진단 잔존) — `transition-delay: calc(var(--card-i) * 60ms)` 1줄로 벤토 진입 캐스케이드 완성.

### Track C — 마이크로 인터랙션 (셸 UI · 디테일 완성도)

| 항목 | 내용 | 파일 |
|---|---|---|
| C-1 로고 이스터에그 | 헤더 로고 hover 시 금색 점이 통통 튀는 bob(기존 `ais-bob` 재사용) + 클릭 5회 시 점이 한 바퀴 궤도 돌기(숨은 재미) | Header |
| C-2 nav 밑줄 드로우 | nav 링크 hover 시 좌→우 밑줄 드로우(`scaleX` origin 전환으로 이탈 시 우측으로 빠짐) | Header |
| C-3 StoreBadges 리프트 | hover 시 -2px 리프트 + 그림자 확산, active 시 눌림(scale .97) | StoreBadges |
| C-4 버튼 샤인 스윕 | 골드 버튼 hover 시 1회 광택 스윕(기존 AI 메탈릭 샴페인 언어와 일치) | Button |
| C-5 Footer 로고 | hover 시 ParticleField 밀도 순간 부스트 or 로고 글로우 — ParticleField prop 확인 후 택1 | Footer |
| C-6 Technology 메트릭 | 카드 hover 시 해당 카운트업 숫자 재생(이미 useCountUp 보유 — re-trigger 옵션 추가) | Technology |

### Track D — 룸 내 순수 인터랙션 (🔴 금역 인접 — **구현 전 AskUserQuestion 필수**)

"정착 후 모습 = 원본과 동일" 기준을 만족하는 것만. 시각 요소 신규 추가 0.

| 항목 | 내용 | 금역 판정 |
|---|---|---|
| D-1 도란이 클릭 반응 | 기존 DoraniMascot 벡터 클릭 시 윙크 1회 + 기존 soundRing 1펄스(기존 요소 재생만) | ✅ 순수 인터랙션 |
| D-2 폰 목업 hover 틸트 | 기존 .phone에 `useTilt` 미세(±3°) — hover 이탈 시 원위치 | ✅ 정착 모습 동일 |
| D-3 myToday 무드 아이콘 | 기존 MoodIcon hover 시 pop(기존 `ais-pop-in` 재사용) | ✅ 기존 요소 반응 |
| D-4 숨통 호흡 링 | 기존 4-7-8 링 클릭 시 1사이클 리셋 재생 | ✅ 기존 요소 재생 |

- 12룸 일괄 적용 금지 원칙에 따라 D-2도 "전 룸 폰 일괄"이 아니라 **사용자에게 적용 룸 선택**을 받는다.

### Track E — 재미 요소 (옵션 · 사용자 취향 확인 후)

| 항목 | 내용 | 비고 |
|---|---|---|
| E-1 시간대 인사 | Hero HUD에 시간대별 카피("좋은 아침이에요" 등) | 콘텐츠 변화 — 가벼움 |
| E-2 스크롤 완주 보상 | Footer 도달 시 1회 샴페인 골드 스파클 버스트(confetti 라이브러리 금지 — CSS 파티클 8개 자체 구현) | 과할 수 있어 옵션 |
| E-3 konami 이스터에그 | ↑↑↓↓←→←→BA 입력 시 전 서비스 마스코트 퍼레이드 | 구현비 대비 발견율 낮음 — 보류 권고 |

---

## 3. 실행 순서 (Phase)

| Phase | 내용 | 예상 규모 | 의존성 |
|---|---|---|---|
| 1 | Track A (ServiceRail + 진행 바) | 신규 2파일 + Header 소폭 | 없음 — 즉시 가능 |
| 2 | Track B (히어로 인터랙션 4종) | Hero.tsx/css, Button | Phase 1과 독립(병렬 가능) |
| 3 | Track C (마이크로 6종) | 각 셸 컴포넌트 소폭 | 없음 |
| 4 | Track D (룸 인터랙션) | **AskUserQuestion 선행** | 사용자 승인 |
| 5 | 검증·커밋·배포 | 아래 §4 | Phase 1~4 |

각 Phase 종료마다 단독 커밋(🔴 && 체인 금지 — 훅 오탐 이력) + 빌드 그린 확인.

## 4. 검증 계획 (각 Phase 공통)

1. **reduce-motion 회귀**: worktree로 baseline(6b34027) 빌드 → stuck-invisible 카운트 비교 == baseline (기존 10개 유지). 신규 인터랙션은 전부 `(prefers-reduced-motion: no-preference)` 또는 `(hover: hover)` 가드.
2. **오버플로 0**: Playwright(.mjs 파일 — zsh 글로빙 이력) 320/375/768/1024/1440/1920 6뷰포트.
3. **성능**: 포인터 핸들러는 rAF 쓰로틀 + passive listener. 번들 증가분 측정(목표: JS gzip +3kb 이내, 랜딩 150kb 예산 내). 신규 의존성 0.
4. **접근성**: ServiceRail 키보드 내비·aria, 인터랙션 요소 포커스 링, 대비 AA 유지.
5. **배포 검증**: `vercel deploy --prod --yes` 후 라이브 JS 번들 해시 == 로컬 빌드 (md5).

## 5. 리스크

| 리스크 | 완화 |
|---|---|
| 룸 인터랙션이 "브랜드 왜곡"으로 인지 | Track D 전체를 AskUserQuestion 승인제 + 항목별 opt-in |
| 틸트/스포트라이트 과용 → 멀미·산만 | 각도 ≤4°, 알파 ≤3%, lerp 지연 — "미묘함이 럭셔리"(#97 교훈) |
| 포인터 추적 jank | transform 전용 + rAF 1회/프레임, will-change 금지(상시 레이어 방지) |
| ServiceRail이 기존 우측 여백 콘텐츠와 충돌 | 6뷰포트 오버랩 검사, 충돌 시 1280px 미만 숨김 |
| 모바일 체감 0 (hover 중심 트랙) | Track A 진행 바·스크롤 큐는 모바일 포함, D-1/D-3/D-4는 탭으로 동작 |
