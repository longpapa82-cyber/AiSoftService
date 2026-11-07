# 홈 페이지 "Deep Tech" 디자인·모션 고도화 상세 계획

> 작성일: 2026-11-07 · 브랜치: feat/integrated-landing
> 사용자 결정(2026-11-07): **히어로·셸을 다크 Deep Tech로 전환** (AskUserQuestion 확정).
> 서비스 미니 섹션들은 각자 브랜드 테마 유지 — "다크 무대 → 밝은 브랜드 룸" 전환이 극적 효과.
> ※ CLAUDE.md 원 스펙 "밝은 톤"과 상충하나 사용자 명시 요청("미래지향·최신 기술")으로 오버라이드.

---

## 0. 벤치마킹 요약 (2026-11-07 웹서치)

| 트렌드 | 내용 | 본 계획 반영 |
|---|---|---|
| **Linear/Vercel 스타일** | 니어블랙 다크 + 일렉트릭 액센트, 셰이더풍 애니 배경, 벤토 카드, "제품이 곧 데모" | 히어로 다크 전환 + 벤토 서비스 그리드. 각 서비스 섹션이 이미 "제품이 곧 데모"(실제 앱 재현) — 유지 |
| **스크롤 드리븐 애니메이션** | CSS 네이티브 `animation-timeline` 성숙, 스크롤리텔링 | 히어로 패럴랙스·섹션 전환에 progressive enhancement로 도입(IO 폴백) |
| **키네틱 타이포그래피** | 2026 모션 양대 축 | 히어로 헤드라인 clip-path 라이즈 + AI 그라데이션 shimmer |
| **Aurora UI** | 다크 배경 위 대형 블러 블롭 글로우 | 히어로/푸터 오로라 레이어(로픽 lawAurora 패턴 재사용) |
| **글래스모피즘** | backdrop-filter 스티키 헤더가 가장 내구성 있는 활용 | 글래스 헤더 전환 |
| **WebGL은 양념** | 수상작은 WebGL-first지만 절제 사용이 2026 정답 | three.js 미도입 — 보유 Canvas `ParticleField`로 충분 |

출처: moburst/vistaprint/reallygooddesigns/index.dev/motionkit/theplusaddons/figma 트렌드 리포트, toimi.pro·hedrick.io SaaS 벤치마크 (본문 하단 Sources).

---

## 1. 현황 진단 (Evidence)

### 보유 모션 인프라 (재사용 — 신규 라이브러리 불필요)
| 자산 | 위치 | 역할 |
|---|---|---|
| `useReveal` | src/hooks/useReveal.ts | IO 진입 리빌(`.reveal` → `.is-visible`) |
| `useCountUp` | src/hooks/useCountUp.ts | 뷰포트 진입 카운트업(reduce-motion 스냅) |
| `useTilt` / `usePointerParallax` | src/hooks/ | 포인터 틸트·패럴랙스 |
| `useScrollProgress` | src/hooks/ | 스크롤 진행률(현재 거의 미활용) |
| `ParticleField` | components/visual/ | 신경망 파티클(dark prop 보유) |
| keyframes 45종 | 각 모듈 CSS | heroDrift, promo-law-aurora, promo-cosmos-*, breath-478 등 |

### 모션 밀도 불균형 (서비스 섹션 핵심 문제)
| 서비스 | motif | 우측 비주얼 | 밀도 |
|---|---|---|---|
| 로픽 | law | analysisCard | ★★★ (오로라4겹+도트+그레인+입자8) |
| 숏킷 | cosmos | phone shot | ★★★ (궤도링+트윙클) |
| 숨통 | breath | breathCard | ★★★ (카운트업+4-7-8링+회복바) |
| FitSnap | cloth | 드래그 슬라이더 | ★★★ (의류 float+자동 스윕) |
| myToday | leaf | mascot+moods | ★★ |
| Voice Buddy | none | mascot+rings+chips | ★★ |
| 도란 | none | dorani 벡터+chips | ★★ |
| myPet | paw | phone shot | ★☆ (paw 모티프 정적) |
| **myTravel** | **none** | steps | **★ (reveal만)** |
| **내새끼** | **none** | stars 그리드 | **★ (reveal만)** |
| **AI Music** | **none** | phone shot | **★ (reveal만)** |
| **facePreview** | **none** | sideBySide | **★ (reveal만)** |

### 공통 구조 이슈
1. PromoSection 진입이 통짜 reveal — 자식 stagger 없음(Hero는 단어별 stagger라 대비 큼)
2. highlight 수치 정적(카운트업 미적용)
3. headlineAccent 정적(밑줄 드로우 여지)
4. 스크롤 위치 내비게이션 부재(12섹션)
5. Hero `--card-i` 변수 주입돼 있으나 CSS 미사용(stagger 미완)

---

## 2. 디자인 방향

**"Deep Tech Stage, Living Brand Rooms"**

- **무대(셸)**: 헤더·히어로·Technology·푸터 = 딥 네이비/니어블랙 + 골드 일렉트릭 + 오로라 + 회로/파티클 — 미래 기술 무대. 스크롤 색 리듬: **다크(히어로) → 라이트 브랜드 룸들 → 다크(Technology) → 라이트(About) → 다크(푸터)**.
- **룸(서비스 섹션)**: 각 서비스 브랜드 테마 유지 + 서비스 본질을 은유하는 시그니처 모션(장식 금지).
- 원칙: ① compositor-only(transform/opacity/clip-path) ② reduce-motion 완전 대응(stuck-invisible 금지) ③ `#promo-{id}`/motif 스코프 격리 ④ 의존성 0 추가(번들 150KB 예산) ⑤ 무한 루프는 배경 모티프만, 콘텐츠 모션은 1회성.

---

## 3. Phase 구성 (우선순위순)

### Phase S — Deep Tech 셸 전환 ★신규·최우선 `~1일`

**S-1. 다크 토큰 체계** `src/styles/tokens.css`
- `--color-deep-bg`(니어블랙 네이비 ~#0A0E1A), `--color-deep-surface`, `--gold-electric`(채도 올린 골드), 글래스 토큰(`--glass-bg`, `--glass-line`). Technology 섹션의 기존 다크 네이비와 통일 — 셸 전체가 한 시각 언어.

**S-2. 히어로 다크 전환** `Hero.module.css` (레이아웃 불변, 팔레트·배경 교체)
- 배경: 딥 네이비 베이스 + 오로라 블롭 2~3개(lawAurora 패턴 이식, 골드·딥블루 톤) + `ParticleField dark` + 기존 회로 트레이스(발광 강화 — 골드 글로우 필터 아님, 스트로크 투명도/duplicate path로).
- 카피: 잉크 → 웜화이트. "AI" 골드 그라데이션 클립은 다크 위에서 더 발광. serif accent("일상") 유지 — 다크 럭셔리 대비.
- **키네틱 타이포 업그레이드**: 단어별 `clip-path: inset(0 0 100% 0)` 라이즈 + 기존 stagger 유지, "AI"에 느린 shimmer 루프(aiShimmer 재사용).
- **HUD 신뢰지표**: 카운터를 모노스페이스 톤 + 양끝 틱 마크(`▰` 류 아님, hairline). 숫자 카운트업 유지.
- 버튼: primary에 골드 글로우 호버 + sheen 스윕(bdg-sheen 재사용).

**S-3. 글래스 스티키 헤더** `Header.tsx/.css`
- `backdrop-filter: blur(14px)` + 반투명 패널 + 하단 hairline. 스크롤 0에선 완전 투명.
- 톤 적응: 다크 섹션(히어로/Technology/푸터) 위에선 라이트 텍스트, 라이트 룸 위에선 잉크 텍스트 — IO로 다크 섹션 감지해 `.onDark` 토글(mix-blend-mode는 가독성 리스크로 배제).

**S-4. 벤토 서비스 그리드** `Hero.tsx/.css` — 우측 프리뷰 패널 개편
- 균일 그리드 → 벤토: 최신작(숨통)·대표작 1개는 2×1 큰 셀(마스코트/모티프 미리보기), 나머지 작은 셀. 글래스 카드(blur+hairline) on dark.
- `--card-i` stagger 등장(변수 이미 주입됨 — CSS만 추가), hover 시 셀 lift + 액센트 글로우.

**S-5. 스크롤 드리븐 전환(progressive enhancement)**
- `@supports (animation-timeline: view())`: 히어로 카피 미세 패럴랙스 + 다크→라이트 첫 룸 경계 페이드. 미지원 브라우저는 기존 IO reveal 폴백(기능 손실 없음).
- Technology·푸터 진입에도 동일 패턴.

### Phase A — 공통 모션 인프라 `~0.5일`
- **A-1 Stagger Reveal**: `.reveal-stagger` — 자식 `transition-delay: calc(var(--stagger-i)*70ms)` (global.css + JSX index 주입).
- **A-2 StatValue** `components/ui/StatValue.tsx`(신규 ~40줄): "17개"·"30초" 등 숫자부만 `useCountUp`, 비수치 정적 폴백.
- **A-3 accent 밑줄 드로우**: headlineAccent `::after` scaleX(0→1), reduce-motion 고정.
- **A-4 서비스 진행 레일**(선택, 데스크톱): 우측 고정 12도트 + 활성 하이라이트. 독립 커밋(롤백 용이).

### Phase B — PromoSection 공통 모션 (12서비스 일괄) `~0.5일`
- B-1 copy 자식 stagger(miniHeader→headline→subcopy→highlights→badges, 70ms).
- B-2 highlight 수치 StatValue 카운트업.
- B-3 accent 밑줄 드로우.
- B-4 visual 진입: copy보다 120ms 늦게 `translateY(24px)+scale(0.97)→기본`.
- B-5 motif decor 120ms 지연 페이드인(배경이 '켜지는' 인상).
- B-6 폰 목업 hover lift(데스크톱).

### Phase C — 서비스별 시그니처 모션 `~2일`
> 전부 해당 서비스의 앱 경험 은유. `#promo-{id}` 스코프. motif 타입 4종 신설: `route`·`wave`·`sparkle`·`scanline`.

- **C-1 myTravel → motif `route`** ★: 점선 비행 경로 SVG `stroke-dasharray` 드로우 + 종이비행기 1회 비행. steps 1→2→3 경로 동기 pop + 연결선 scaleY 드로우.
- **C-2 AI Music → motif `wave`** ★: 이퀄라이저 바 12~16개 scaleY 루프(bar별 delay 분산) + 음표 float 2~3개 + phone 뒤 스피커 펄스 링(soundRing 재사용).
- **C-3 내새끼 → motif `sparkle`**: stars 칩 stagger + 아바타 hover 바운스, 파스텔 트윙클 4~5개(cosmosTwinkle 재사용) + 칩별 느린 bob.
- **C-4 facePreview → motif `scanline`**: after 이미지 위 골드 스캔 라인 1회 스윕(IO 진입) 후 "AI 예상 결과" 태그 등장. 골드 그레인 + 모서리 헤어라인 글로우(Clinical Luxe 유지).
- **C-5 myPet paw 강화**: 발자국 4~5개 '걸어가듯' 순차 페이드(400ms 간격 1회).
- **C-6 도란**: DoraniMascot 눈 깜빡임(scaleY, 4~6s 주기) + 미세 bob(CSS만). chatChips '대화 순서' 교차 등장.
- **C-7 Voice Buddy**: langSwap `⇄` 4s 주기 플립 + chips 교차 타이밍(C-6과 공통 클래스).
- **C-8 리치 모티프 미세 보강**: 로픽 clause 순차 reveal+안심도 카운트업 / 숏킷 shotBadge 스탬프 인(scale 1.4+rotate→정착) / FitSnap 힌트 2회 깜빡 / 숨통 유지.

### Phase D — Technology·About·Footer 보강 `~0.5일`
- D-1 Technology: S-1 토큰으로 히어로와 시각 언어 통일 + metric 글로우 펄스 1회(기존 tilt 유지).
- D-2 About: 핵심 문단 stagger(A-1). 라이트 유지(브랜드 룸들과 호흡).
- D-3 Footer: 오로라 미세 레이어 + 로고 hover 골드 스윕.

### Phase E — 검증 & 배포 `~0.5일`
1. `npx tsc --noEmit` + `npm run build` 그린.
2. Playwright 다중 뷰포트(320/768/1024/1440) 스크린샷 — 데코 침범/오버플로 0, **다크 히어로 텍스트 대비(WCAG AA) 확인**.
3. reduce-motion 회귀 증명: git stash baseline vs 신규 빌드 stuck-invisible 수 비교(숨통 #94 검증 기법).
4. Lighthouse: CLS < 0.1, 번들 증가 +4KB 이내(대부분 CSS).
5. `vercel deploy --prod --yes` + 라이브 번들 해시 일치 검증.

---

## 4. 파일 변경 맵
| 파일 | Phase | 변경 |
|---|---|---|
| src/styles/tokens.css | S-1 | 다크/글래스 토큰 |
| src/sections/Hero.module.css | S-2·4 | 다크 팔레트·오로라·키네틱·벤토 |
| src/sections/Hero.tsx | S-4·5 | 벤토 셀 분기, scroll-driven 클래스 |
| src/sections/Header.tsx/.css | S-3 | 글래스 + onDark 토글 |
| src/styles/global.css | A-1·S-5 | reveal-stagger, @supports 블록 |
| src/components/ui/StatValue.tsx | A-2 | 신규 |
| src/components/ui/ServiceRail.tsx(+css) | A-4 | 신규(선택) |
| src/sections/PromoSection.tsx/.css | B·C | stagger·StatValue·motif 4종 분기+keyframes ~12종 |
| src/data/services.ts | C | motif 타입 확장 + 4서비스 motif 값 변경 |
| src/components/DoraniMascot.tsx | C-6 | 깜빡임 클래스 |
| src/sections/Technology/About/Footer | D | 토큰 통일·소폭 |

## 5. 리스크 & 가드레일
| 리스크 | 대응 |
|---|---|
| 다크 전환 가독성/대비 | WCAG AA 대비 검증(E-2), 웜화이트 잉크 + 골드는 대형 타이포에만 |
| CLAUDE.md "밝은 톤" 스펙 상충 | 사용자 결정으로 오버라이드 기록(본 문서 헤더). 서비스 룸·About은 밝게 유지해 절충 |
| 모션 과잉 | 무한 루프는 배경 모티프만(섹션당 ≤2), 콘텐츠 모션 1회성 |
| 절대배치 데코 오버플로 | 전 데코 overflow:hidden 부모 확인 + 다중 뷰포트 Playwright, 안 맞으면 모바일 숨김 |
| reduce-motion 누락 | E-3 기계 증명 |
| 글래스 헤더 성능 | backdrop-filter 1개 요소 한정, will-change 미사용 |
| 타 서비스 회귀 | motif/`#promo-{id}` 스코프 + Phase별 커밋 분리 |

## 6. 커밋 계획
1. `feat(shell): Deep Tech 다크 토큰 + 히어로 다크 전환 + 키네틱 타이포` (S-1·2)
2. `feat(shell): 글래스 헤더 + 벤토 서비스 그리드 + 스크롤 드리븐` (S-3~5)
3. `feat(motion): stagger reveal + StatValue 인프라` (A)
4. `feat(promo): 12서비스 공통 진입 모션` (B)
5. `feat(promo): myTravel route·AI Music wave 모티프` (C-1·2)
6. `feat(promo): 내새끼 sparkle·facePreview scanline 모티프` (C-3·4)
7. `feat(promo): myPet·도란·Voice Buddy·리치모티프 보강` (C-5~8)
8. `feat(sections): Technology/About/Footer 통일` (D)
9. (선택) `feat(nav): 서비스 진행 레일` (A-4)

## Sources (벤치마킹)
- https://www.moburst.com/blog/landing-page-design-trends-2026/
- https://www.index.dev/blog/web-design-trends
- https://motionkit.io/blog/web-animation-trends-2026
- https://theplusaddons.com/blog/web-design-trends-2026/
- https://www.figma.com/resource-library/web-design-trends/
- https://toimi.pro/blog/best-saas-website-designs/
- https://hedrick.io/post/startup-landing-page-examples
- https://reallygooddesigns.com/web-design-trends-2026/
