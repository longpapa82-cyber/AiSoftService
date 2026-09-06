# [Plan] doran-promo-redesign — 도란 섹션 홍보웹 신규 디자인 정합

- **작성일**: 2026-09-06
- **PDCA Phase**: Plan
- **Feature**: doran-promo-redesign
- **브랜치**: feat/integrated-landing
- **트리거**: 도란 홍보웹(doran-web)에 디자인/폰트/효과가 새로 정비됨 → AiSoftService 도란 섹션에 반영
- **참조 구현**: `/Users/hoonjaepark/projects/doran/promo-web` (라이브 = 최신 SoT), 이전 세션 #81(도란 신규 추가)

---

## 1. 배경 & 문제 정의

도란 홍보웹이 **디자인 시스템 문서(app `designTokens.ts`) 기반으로 정비**됐다(promo.css 주석 "designTokens 1:1 이식"). 우리 도란 섹션(#81에서 추가)은 그 이전 버전을 기준으로 만들어져 시각 언어가 뒤처졌다.

라이브 대조로 확인된 SoT(2026-09-06):
- 홍보웹 라이브 `https://longpapa82-cyber.github.io/doran-web/` = Jua 폰트 + designTokens 반영 완료(curl 검증)

## 2. 목표 (Goal)

우리 도란 미니 홍보 섹션의 **시각 언어를 도란 홍보웹과 정합**시킨다. 단, 우리는 **9서비스 공유 카드형 미니 홍보 섹션**이고 홍보웹은 **풀 랜딩**이므로, 전부 이식이 아니라 **시그니처 토큰·폰트·마스코트·핵심 효과**를 선별 반영한다.

### 사용자 확정 결정 (AskUserQuestion)
| 항목 | 결정 |
|------|------|
| 반영 범위 | **마스코트 SVG 엔진까지 이식** (정적 WebP → dorani.js 포팅, 표정/부유 살림) + 디자인 토큰 + 핵심 효과 |
| Jua 폰트 | **도란 fontDisplay만 Jua**로 (다른 서비스 무영향) |

## 3. 현재 상태 vs 목표 (Gap 요약)

| 항목 | 홍보웹(새 SoT) | 우리 섹션(현재) | 반영 계획 |
|------|------|------|------|
| 제목/로고 폰트 | **Jua** | Pretendard | ✅ fontDisplay→Jua |
| 본문 폰트 | Pretendard | Pretendard(Noto 폴백) | 유지 |
| 그림자 | **SoftShadow** rgba(126,154,160,.16/.22) | primary 믹스 | ✅ 도란 스코프 SoftShadow |
| accent 강조 | 코랄 형광펜 `::after` 밑줄 | 없음 | ✅ headlineAccent 밑줄(도란 스코프) |
| 히어로 그라디언트 | `--grad-hero` #B8ECE6→#FCE6DA | heroGradient(유사) | 미세 정합 |
| 마스코트 | **런타임 SVG**(age×gender×expression 3축, 앱과 픽셀 동일) | 정적 WebP(smile 고정) | ✅ **dorani.js 포팅** |
| 마스코트 부유 | doraniFloat(±14px, rotate ±1.5deg, 5.5s) | promo-mascot-bob(±9px, 4s) | 정합(부유값 근사) |
| 히어로 장식 | halo펄스·dashed ring회전·blob드리프트·float궤도·spark | mascotGlow·soundRing·bob | 부분 강화(선택) |

## 4. 범위 (Scope)

### In Scope (반영)
1. **폰트**: 도란 `theme.font` + `promo.fontDisplay`를 `'Jua'` 선두로 (헤드라인·번호·카드 제목에 Jua)
2. **마스코트 SVG 엔진 이식**: `dorani.js`(276줄, 외부 의존 0, 순수 함수)를 **JSX를 반환하는 React 컴포넌트(`DoraniMascot.tsx`)로 재작성**. 정적 `mascot.webp` 대체. 앱과 픽셀 동일한 벡터 도란이(smile 표정, peer/neutral 기본).
   - **⚠️ 보안 결정**: `dangerouslySetInnerHTML` **미사용**. dorani.js의 좌표(AGES/EXPRESSIONS의 하드코딩 path)를 `<path>/<circle>/<ellipse>` JSX 엘리먼트로 직접 렌더 → XSS 표면 0, 타입 안전, React 재조정 친화적. (SVG 데이터가 사용자 입력이 아니라 고정 좌표라도, JSX가 문자열 주입보다 안전·명확.)
3. **SoftShadow 토큰**: 도란 스코프 그림자를 홍보웹 저채도 민트 그림자로 정합.
4. **accent 밑줄**: headlineAccent("네 이야기를 들어줄게")에 코랄 형광펜 밑줄(홍보웹 `.accent::after`).
5. **팔레트 미세 정합**: heroGradient를 `--grad-hero`(#B8ECE6→#FCE6DA) 톤으로.

### Out of Scope (반영 안 함 — 근거)
- **풀 랜딩 섹션**(scrolly chat, why, maker, gallery, night, plans, safety-band): 카드형 미니 섹션 구조와 상충. 미반영.
- **JS 인터랙션**(magnetic 버튼, 3D 틸트, 눈 추적 parallax, 스크롤 표정 전환): 미니 섹션엔 과함. 마스코트는 정적 smile + 기존 bob 부유만.
- **effects.js 스크롤 오케스트레이션**(data-orch 순차 등장, scroll progress bar): 우리 섹션 진입 애니메이션은 기존 유지.

> ⚠️ 접근성 유지: 밝은 민트 #14BBC2는 대비 미달(2.36:1)이므로 **primary #00808A(4.71:1) 유지**. Jua/SoftShadow/밑줄은 색이 아니라 형태·질감이라 대비 무관.

## 5. 리스크 & 완화

| 리스크 | 수준 | 완화 |
|------|------|------|
| dorani.js React 포팅 시 SVG 렌더 깨짐 | **중** | 순수 함수(의존0) 확인됨 → **JSX 컴포넌트로 재작성**(dangerouslySetInnerHTML 미사용, XSS 표면 0). 좌표를 `<path>` 등 JSX로 직접 렌더. 로컬 렌더 육안 대조(앱 픽셀 동일 목표) |
| 마스코트 교체로 mascotStage 레이아웃 변동 | 중 | 기존 `.mascotImg` 대신 SVG인라인 → 크기/aspect 동일하게 래핑, mascotStage 무변경 |
| Jua가 다른 서비스에 누출 | 낮음 | `promo.fontDisplay`/`theme.font`는 서비스별 데이터 → 도란만 변경, CSS는 `var(--p-font-display)` 데이터 주도 |
| SoftShadow/밑줄이 타 서비스 회귀 | 낮음 | 전부 `:global(#promo-doran)` 스코프 |
| 번들 크기 증가(SVG 인라인) | 낮음 | dorani.js ~11KB, WebP 12KB 제거 → 순증 미미 |

## 6. 성공 기준 (Definition of Done)

- [ ] 도란 섹션 헤드라인/번호/카드 제목이 Jua로 렌더
- [ ] 마스코트가 벡터 도란이(SVG)로, 앱/홍보웹과 시각 동일(smile, 민트 얼굴 + 코랄 볼 + 안테나)
- [ ] SoftShadow·accent 밑줄 반영
- [ ] tsc 0, 빌드 그린
- [ ] 타 8서비스 시각 회귀 0 (스코프 격리)
- [ ] 데스크톱/모바일(320/768/1440) 오버플로 0
- [ ] 라이브 배포 + 고정 도메인 CSS 번들 대조 검증

## 7. 다음 단계 (PDCA)

→ `design`: 마스코트 SVG 포팅 방식(컴포넌트 구조), CSS 스코프별 규칙, 데이터 변경 지점을 설계 문서로 구체화
→ `do`: 구현 (dorani 포팅 → services.ts → CSS → 검증)
→ `analyze`: gap-detector로 설계-구현 정합 검증
→ `report`: 완료 보고

## 8. 참조 자료 (분석 완료)

- 홍보웹 디자인 토큰/효과/폰트/마스코트 전수 분석: 본 세션 병렬 조사 결과(§3 표 근거)
- dorani.js: `/Users/hoonjaepark/projects/doran/promo-web/scripts/dorani.js` (276줄, `doraniSVG({age,gender,expression})` 순수 함수, `window.*` 전역 노출 → ES export로 포팅)
- 우리 도란 baseline: services.ts `id:'doran'`(라인 ~1037), PromoSection.module.css `:global(#promo-doran)`(라인 ~1812), 마스코트 `src/assets/promo/doran/mascot.webp`
