# 홈 "상단·푸터·서비스 영역 모션/효과 강화 v15 — Polish & Fill Gaps" 상세 계획

> 작성일: 2026-11-14 · 브랜치: feat/integrated-landing
> 기준점(baseline): **커밋 7ddb332** (HEAD, 빌드 그린 확인 · JS 84.82kB gzip · CSS 26.84kB gzip)
> 사용자 요청: "상단과 푸터, 각 서비스 영역에 더 멋진 효과·모션 적용"

---

## 0. 현황 진단 — "모션은 이미 포화, 공백은 특정 지점"

코드 선독(Explore 2건) 결과, 이 랜딩은 **이미 매우 모션-리치**하다. v14(2026-11-08)에서 ServiceRail·히어로 틸트/글레어/스포트라이트·마그네틱 훅·로고 이스터에그·룸 클릭 인터랙션이 전부 구현됨. 서비스 룸 12곳은 전부 ⭐⭐⭐⭐ 이상.

→ **과거 교훈(#103): "계획 다수 항목이 이미 구현됨" → 코드 선독으로 중복 회피.** 이 계획은 "모션을 더 쌓는" 방향이 아니라, **실존하는 3개 공백 + 횡단 폴리시**에 집중한다.

### 실측된 상태 (grep 검증 완료)

| 영역 | 현재 상태 | 공백 판정 |
|---|---|---|
| **Hero** | parallax·tilt(4°)·spotlight·panelGlare 전부 와이어드 | ✅ 거의 완성 (미세 폴리시만) |
| **Header** | scroll progress bar(scaleX)·로고 5클릭 궤도·nav 밑줄·다크 적응 IO | ✅ 거의 완성 |
| **Footer** | useReveal·ParticleField·logoPulse hover **만**. 포인터 인터랙션 0 | 🔴 **최대 공백** |
| **About** | useReveal·useCountUp **만**. 포인터 인터랙션 0 (틸트·parallax·spotlight 없음) | 🔴 **공백** |
| **Technology** | useTilt·usePointerParallax·useCountUp 와이어드. 단 메트릭 hover 재생(v14 C-6) 미구현 | 🟡 부분 공백 |
| **Button `magnetic`** | prop·useMagnetic·CSS 전부 존재하나 **어떤 컴포넌트도 전달 안 함 = 死코드** | 🔴 **와이어링 누락** |
| **서비스 룸 12곳** | 전부 ⭐⭐⭐⭐+ (motif·countup·reveal·클릭 인터랙션) | ⚠️ 금역 (추가 금지) |

---

## 1. 불변 제약 (🔴 위반 시 #99~#103 원복 사이클 재발)

1. **서비스 브랜드 룸(12곳) = 시각 요소 추가 금역.** 새 장식·텍스처·모티프·그림자·파티클 금지. 실제 앱 디자인 재현이 원칙.
2. 룸 내 허용 = **"정착 후 모습이 원본과 동일"한 순수 모션/인터랙션만** (#100 기준). 기존 요소의 입력 반응만 허용.
3. **공통 효과를 12룸에 일괄 적용 금지** (다크 룸 그레인 = "동일한 얼룩"으로 인지된 #102 사례).
4. **룸을 건드리는 작업은 구현 전 AskUserQuestion 항목별 확인** 필수.
5. 모든 모션 compositor-friendly(transform/opacity/clip-path)만. `prefers-reduced-motion` + `(hover: hover)` 가드 필수. reduce-motion 회귀는 baseline(7ddb332) 비교로 **요소 식별**로 증명(수치만으로 판정 금지 — #103 교훈).
6. 셸(Hero·Header·Technology·About·Footer)은 자유 구역 — 단 **v10/v11 럭셔리 광원 언어**(샴페인 골드 `--ais-gold-champagne`·네이비 `--ais-navy`)와 일관성 유지.
7. **신규 라이브러리 0.** 보유 훅(useTilt/useMagnetic/usePointerParallax/useScrollProgress/useReveal/useCountUp) 재사용만. 번들 증가 목표 JS gzip +2kb 이내.

---

## 2. 트랙별 상세 설계

### Track A — Footer 인터랙티브화 (🔴 최대 공백 · **1순위 · 셸 자유구역**)

Footer는 "System Online" 테크 배지·뉴럴 ParticleField·골드 데이터 스트림으로 무대는 멋지나, **포인터에 전혀 반응하지 않는다.** 히어로의 광원 언어를 푸터에도 이어 "마무리 섹션"의 완성도를 높인다.

**A-1. 커서 스포트라이트 (다크 무대)**
- 히어로 B-2 패턴 재사용: 푸터 배경에 포인터 추적 radial-gradient(`--ais-gold-champagne` 2~3% 알파) 레이어. `transform: translate()` 로 이동(컴포지터 전용), lerp 0.08 지연.
- `usePointerParallax`의 `--px/--py` 재사용 가능 — 신규 훅 0.
- `(hover: hover)` + reduce-motion 가드.

**A-2. ParticleField 밀도 부스트 (로고 hover)**
- v14 C-5에서 "ParticleField prop 확인 후 택1"로 보류됐던 항목. ParticleField.tsx의 prop(speed/node 수) 확인 후, 푸터 로고 또는 섹션 hover 시 파티클 속도 일시 부스트(기존 `logoPulse`와 병행). prop 미지원 시 로고 글로우 확산으로 대체.

**A-3. 서비스 링크 아이콘 마이크로 반응**
- 기존 translateX(4px) 슬라이드에 더해, hover 시 해당 서비스 **브랜드 컬러** 글로우 1회(services.ts palette.primary 재사용) + 아이콘 미세 pop(`ais-pop-in` 재사용).

**A-4. "스크롤 완주" 신호 (옵션)**
- Footer 진입(useReveal) 시 "System Online" 배지 점등 강화 or 골드 스트림 1회 가속 — 완주 보상감. confetti 금지, CSS만.

### Track B — `magnetic` CTA 와이어링 (🔴 死코드 활성화 · **2순위 · 즉시 가능**)

`Button`에 `magnetic` prop·`useMagnetic` 훅·`.magnetic` CSS가 **전부 구현돼 있으나 아무도 사용 안 함.** 이미 만든 기능을 켜기만 하면 됨.

**B-1. 주 CTA에 `magnetic` 전달**
- Hero 주 CTA(골드 "둘러보기")·Header "둘러보기"·About/Footer CTA(있다면)에 `magnetic` prop 추가.
- 과용 방지: **주 골드 CTA에 한정**(전 버튼 금지 — 산만). 강도 기본 6px 유지.
- 터치/reduce-motion 자동 비활성(훅 내장).

### Track C — About 섹션 광원 통일 (🟡 공백 · **3순위 · 셸 자유구역**)

About는 countup·reveal만 있고 포인터 무반응. Technology(다크)와 대비되는 크림 라이트 톤이지만, 대표 사진·가치 그리드가 정적이다.

**C-1. 대표 사진/가치 카드 미세 틸트**
- `useTilt`(보유, ±3° — About는 라이트톤이라 히어로 4°보다 보수적으로) 를 대표 사진 또는 가치 그리드 패널에 연결.
- 라이트 배경이라 글레어 대신 **미세 그림자 리프트**로 깊이감(transform만).

**C-2. 신뢰 지표 countup hover 재생 (옵션)**
- Technology C-3와 동일 메커니즘 공유(아래).

### Track D — Technology 메트릭 hover 점화 (🟡 v14 C-6 미구현 완성)

v14에서 계획됐으나 grep상 미구현. useCountUp에 re-trigger 옵션이 없다면 추가.

**D-1. 메트릭 카드 hover 시 카운트업 재생**
- useCountUp에 재생 트리거 추가(기존 IntersectionObserver 1회 → hover 재트리거 opt-in). 또는 CSS-only 점화(hover 시 숫자 글로우 1회 — 더 가벼움, 우선).
- reduce-motion 시 정적.

### Track E — 서비스 룸 횡단 폴리시 (🔴 금역 인접 — **구현 전 AskUserQuestion 필수**)

"정착 후 모습 = 원본과 동일" 기준 만족 항목만. 시각 요소 신규 추가 0. **12룸 일괄 금지 — 적용 룸 사용자 선택.**

| 항목 | 내용 | 금역 판정 |
|---|---|---|
| E-1 폰 목업 hover 틸트 | 기존 `.phone`에 `useTilt`(±3°), 이탈 시 원위치 (v14 D-2 — 적용 룸 미확정) | ✅ 정착 모습 동일 |
| E-2 하이라이트 칩 hover 리프트 | 기존 칩 hover 시 -2px + 그림자(브랜드 컬러) | ✅ 순수 인터랙션 |
| E-3 StoreBadges | 이미 완성(translateY -3px·active scale .99) | ⛔ 불필요 |
| E-4 compare 슬라이더 핸들 | hover 시 핸들 글로우 강화(기존 요소 강조만) | ✅ 기존 요소 반응 |

- E 트랙 전체를 **AskUserQuestion 승인제 + 룸별 opt-in.** 미승인 시 A~D만 진행.

---

## 3. 실행 순서 (Phase)

| Phase | 내용 | 규모 | 의존성 |
|---|---|---|---|
| 1 | Track B (magnetic 와이어링) | Button 호출부 3~4곳 | 없음 — 가장 빠른 win |
| 2 | Track A (Footer 인터랙티브 4종) | Footer.tsx/css | 없음 (B와 병렬 가능) |
| 3 | Track C + D (About 틸트 · Tech 점화) | About·Technology 소폭 | 없음 |
| 4 | Track E (룸 폴리시) | **AskUserQuestion 선행** | 사용자 승인 |
| 5 | 검증·커밋·배포 | §4 | Phase 1~4 |

각 Phase **단독 커밋**(🔴 `&&` 체인 금지 — pre-commit 훅 오탐 이력 #96) + 빌드 그린 확인.

---

## 4. 검증 계획 (각 Phase 공통)

1. **reduce-motion 회귀**: worktree로 baseline(7ddb332) 빌드 → stuck-invisible **요소 식별** 비교. 신규 인터랙션은 전부 `(prefers-reduced-motion: no-preference)` 또는 `(hover: hover)` 가드 → reduce-motion 시 신규 0 추가 증명(#103 교훈: 수치가 아니라 요소명으로 판정).
2. **오버플로 0**: Playwright(`.mjs` 파일 — zsh 대괄호 글로빙 이력 #97) 320/375/768/1024/1440/1920 6뷰포트.
3. **성능**: 포인터 핸들러 rAF 쓰로틀(훅 내장)·passive listener. 번들 증가 측정(목표 JS gzip +2kb 이내, 현 84.82kB → 150kb 예산 내). 신규 의존성 0. `will-change` 상시 지정 금지.
4. **접근성**: 인터랙션 요소 포커스 링 유지, 대비 AA 유지(Footer 다크 골드 텍스트), magnetic 버튼 키보드 포커스 정상.
5. **배포 검증**: `vercel deploy --prod --yes` 후 **라이브 JS 번들 해시 == 로컬 빌드**(md5) + 콘텐츠 출현 대조(#87 교훈: raw HTML md5 아닌 번들 해시 일치가 신뢰 신호).

---

## 5. 리스크

| 리스크 | 완화 |
|---|---|
| 룸 폴리시가 "브랜드 왜곡"으로 인지 | Track E 전체 AskUserQuestion 승인제 + 룸별 opt-in. 미승인 시 스킵 |
| 마그네틱/틸트 과용 → 멀미·산만 | 주 CTA만 magnetic·About 틸트 ±3°·"미묘함이 럭셔리"(#97) |
| Footer 스포트라이트가 다크 가독성 저해 | 알파 ≤3%·텍스트 레이어 위에 배치 안 함(배경 레이어 한정) |
| 포인터 추적 jank | transform 전용·rAF 1회/프레임·will-change 금지 |
| ParticleField prop 미지원 | A-2는 prop 확인 후 글로우 대체안 준비 |
| 모바일 체감 (hover 중심) | Footer 진입 신호(A-4)·룸 폰 틸트는 탭 대응 고려, hover 전용 트랙은 데스크톱 한정 명시 |

---

## 5-R. 실행 결과 (2026-11-14 구현 완료)

계획 수립 후 **코드 선독으로 전제 교정**: `magnetic`은 死코드가 아니라 Hero 주 CTA가 이미 사용 중이었음(Track B 불필요). 실제 공백은 Footer·About 포인터 반응뿐이었다.

| Track | 커밋 | 실제 구현 | 판정 |
|---|---|---|---|
| A (Footer) | 5084302 | 커서 스포트라이트(usePointerParallax externalRef 주입)·서비스 링크 브랜드 글로우 | ✅ 최대 공백 해소 |
| B (magnetic) | — | Hero CTA 이미 사용 중, Header navCta는 `<Button>` 아닌 전용 `<a>` → **무변경**(리팩터 리스크 회피) | ✅ 정직한 skip |
| C (About) | 297aa5a | 가치 카드 useTilt(±3°)·리프트 그림자 합성 | ✅ 공백 해소 |
| D (Technology) | — | 이미 틸트+글로우+메트릭 밑줄 완비 → **무변경**(카운트 재생=산만) | ✅ 정직한 no-op |
| E (룸 폴리시) | 55a3188 | **AskUserQuestion 3종 전원 승인**: 폰 틸트·칩 리프트·슬라이더 그립 강조 | ✅ 순수 인터랙션만 |

**핵심 교훈**:
1. **계획 전제도 코드로 검증**(#103 재확인): "magnetic 死코드"는 grep 착시, 실제론 Hero가 사용 중.
2. **훅 ref 공유 패턴 확립**: useReveal·usePointerParallax에 `externalRef` 옵션 추가(반환은 항상 내부 ref라 직접부착 호출부 100% 호환). 콜백 ref 합성은 훅 mount 이펙트가 null 캡처해 실패.
3. **룸 금역 증명법**: reduce-motion stuck-invisible 아이덴티티 비교(CSS-module 해시 정규화) — 26==26로 resting 바이트 동일 입증. 모든 폴리시가 `:hover`/`--tilt:0` 게이트라 정착 상태 불변.
4. **Playwright 좌표 함정**: `boundingBox()`는 문서 좌표 → 뷰포트 밖 측정. `scrollTo` 즉시스크롤 후 `getBoundingClientRect()` 뷰포트 좌표로 hover해야 pointermove 도달.

**검증 종합**: 빌드 그린(JS 84.94kB gzip·CSS 27.14kB, baseline 84.82/26.84 대비 +0.1/+0.3kB)·6뷰포트 오버플로 0·reduce-motion 회귀 0·Hero parallax·reve(28) 불변.

**잔여**: `vercel deploy --prod --yes` + 라이브 번들 해시 검증(외부 액션 — 사용자 확인 후).

## 6. 요약 — 이 계획의 정직한 가치

이 랜딩은 **"모션 부족"이 아니라 "특정 지점만 비어 있는" 상태**다. 가장 멋진 개선은:
1. **Footer를 히어로급 광원 섹션으로** (최대 공백 · Track A)
2. **이미 만들어둔 magnetic을 켜기** (死코드 활성화 · Track B)
3. **About/Technology 포인터 반응 통일** (일관성 · Track C/D)

서비스 룸은 금역 원칙을 지켜 **승인된 순수 인터랙션만** 추가한다. "더 많은 애니메이션"이 아니라 **"완성도와 일관성"**이 핵심.
