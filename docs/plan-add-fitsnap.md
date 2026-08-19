# AiSoft 홍보 사이트에 FitSnap 추가 — 상세 계획

> 작성 2026-08-19. 대상: `AiSoftService/` (Vite + React 18 + TS, Vercel 배포).
> 목표: 8번째 서비스로 **FitSnap**(AI 가상 착용)을 서비스 카탈로그에 추가 →
> 카드·Features·Hero 통계·미니 홍보 섹션까지 데이터 기반으로 자동 전시.

---

## 0. 현황 파악 (조사 완료)

이 사이트는 **데이터 기반 확장 구조**다. `src/data/services.ts`의 `SERVICES[]` 배열에
항목 하나를 추가하면 아래가 **자동 반영**된다:
- `App.tsx`: `promo`가 있는 서비스만 `PromoSection`으로 미니 홍보 렌더(지그재그).
- `Hero.tsx`: 서비스 수/플랫폼 수 통계 자동 집계(실링크 있는 것만).
- `Technology.tsx`: `SERVICE_COUNT` 등 파생 수치.
- 카드·Features 쇼케이스.

**현재 7개 서비스**: mytravel · mypet · mybaby · mytoday · aimusic · lawpic · voicebuddy.
**FitSnap은 없음.** AiSoft 쪽에 fitsnap 아이콘·promo 에셋도 아직 없음.

**스키마**: `AppService`(id/name/tagline/description/status/links/theme/features/promo/order)
+ 선택적 `ServicePromo`(kicker/headline/subcopy/palette/fontDisplay/motif/highlights/
heroImage/shot/mascot/steps/disclaimer 등 — 서비스별 "미니 홍보 사이트" 풀 테마).

---

## 1. 작업 범위 (무엇을 추가하나)

### A. 데이터 (핵심 — 필수)
`src/data/services.ts`에 **FitSnap 항목**을 추가:
- **기본 필드**: id `fitsnap`, name `FitSnap`, tagline, description, status, moodLabel, emoji, iconUrl, links(web/ios/android), theme, features(3), stats, order `8`.
- **promo 블록**(미니 홍보 섹션): kicker, headline+headlineAccent, subcopy, palette(FitSnap 시그니처 = 크림 #FBF9F6 + 코랄 #FF6B4A), fontDisplay(Plus Jakarta Sans), radius, motif, highlights(3), heroImage/shot, steps(3), disclaimer.

### B. 에셋 (필수)
- `src/assets/services/fitsnap-icon.png` — 앱 아이콘 256px.
- `src/assets/promo/fitsnap/` — 미니 홍보용 비주얼:
  - `hero-*.webp` (히어로 배경, 선택) 또는 `shot-*.webp` (앱 홈/결과 스크린샷, 폰 목업용).
  - **FitSnap 홍보웹(`fitsnap/web/public/assets`)의 기존 초상권-프리 이미지 재사용** 권장
    (before/after·옷장 스와이프 정렬쌍 등, 이미 검증됨).

### C. 드리프트 동기화 (필수 — 놓치면 SEO 깨짐)
- **`index.html` noscript 블록**: 서비스 name/tagline/description이 SEO 폴백으로 **수동 복제**되어 있음
  (services.ts:257 경고). FitSnap도 여기에 추가.
- `Header.tsx`·`Footer.tsx`: "서비스" 네비는 `#promo-mytravel` 앵커 고정이라 개별 추가 불필요(자동 목록).

### D. 검증 (필수)
- `tsc` 타입 통과, `vite build` 성공.
- 로컬 프리뷰로 8번째 섹션 렌더·지그재그 리듬·테마 전환 확인.
- Hero 통계(서비스 8·플랫폼 수) 자동 증가 확인.
- 접근성·대비(라이트 코랄 테마), reduced-motion.

---

## 2. FitSnap 데이터 초안 (실제 사실 기반)

> ⚠️ 정직성: FitSnap은 **Android 비공개 테스트 단계**(프로덕션 미출시). 스토어 링크·상태를
> 실제와 맞춰야 함(허위 출시 표기 금지 — 다른 서비스도 androidPending 등으로 정직 표기).

| 필드 | 값(초안) | 근거/확인필요 |
|------|---------|--------------|
| id | `fitsnap` | |
| name | `FitSnap` | |
| tagline | `입어보지 않고, 입어본다` | fitsnap 컨셉 |
| description | AI 가상 착용 — 내 사진과 옷 사진으로 실제 입은 모습 확인 | CLAUDE.md 목표 |
| status | `coming_soon` 또는 `beta` | ⚠️미출시 → coming_soon이 정직 |
| links.web | fitsnap 홍보웹 URL | `longpapa82-cyber.github.io/fitsnap-web/` |
| links.android | (없음) + `androidPending: true` | ⚠️비공개 테스트 중 → pending |
| links.ios | (없음) | iOS 후속 |
| theme/palette | 크림 #FBF9F6 + 코랄 #FF6B4A | fitsnap tokens.ts(확정) |
| font | Plus Jakarta Sans | fitsnap 확정 폰트 |
| features(3) | ①AI 가상착용 ②체형정보 정밀도 ③옷장/컬렉션 | fitsnap 핵심서비스 |
| highlights(3) | 예: "사진 한 장"·"AI 착용"·"체형 반영" | 실제 기능 |
| steps(3) | ①내 사진 ②옷 선택 ③AI가 입혀줌 | fitsnap studio 흐름 |
| motif | `none`(또는 신규 'cloth' 검토) | 기존 union: paw/sky/feed/leaf/law/none |
| disclaimer | AI 생성 결과는 참고용, 실제 착용과 다를 수 있음 | fitsnap 카피 정직성(감사 반영) |

**결정 필요**: status를 `coming_soon`(정직) vs `beta`(테스트 중 강조) 중 무엇으로?
Android가 비공개 테스트라 스토어 공개 링크가 없으므로 `androidPending: true`가 맞음.

---

## 3. 구현 순서 (Phase)

| # | 작업 | 산출물 |
|---|------|--------|
| **P1** | 에셋 반입 | fitsnap-icon.png + promo/fitsnap/*.webp (fitsnap 프로젝트에서 복사·최적화) |
| **P2** | services.ts에 FitSnap 항목 추가 | AppService + ServicePromo 완성 |
| **P3** | index.html noscript 동기화 | SEO 폴백 정합 |
| **P4** | tsc + vite build + 로컬 프리뷰 검증 | 8섹션 렌더·통계·테마 확인 |
| **P5** | (선택) motif 'cloth' 등 시그니처 장식 추가 | PromoSection.module.css 스코프 추가 |

**권장**: P1~P4가 핵심(FitSnap이 사이트에 뜸). P5는 다른 서비스처럼 시그니처 비주얼을
강화하고 싶을 때(로픽 analysisCard·voicebuddy soundRings 같은 전용 연출).

---

## 4. 리스크·주의

- **정직성(표시광고법)**: 미출시인데 "지금 다운로드"처럼 오도 금지. `coming_soon`/`androidPending`으로
  정직 표기. disclaimer로 "AI 결과 참고용" 근접 표시(다른 서비스와 동일 원칙).
- **초상권**: promo 이미지는 반드시 fitsnap의 **AI 100% 가상인물**(이미 검증된 것) 재사용. 실존 인물 금지.
- **회귀 0**: 데이터 추가만으로 기존 7서비스에 영향 없음(구조가 배열 기반). 단 index.html noscript
  동기화 누락 시 SEO 폴백 드리프트.
- **테마 대비**: FitSnap은 라이트(크림) 테마 → `dark` 미설정. primary 코랄(#FF6B4A) 위 흰 텍스트
  대비 확인(WCAG). 다른 라이트 서비스(mypet/lawpic) 패턴 참고.
- **모노레포 아님**: fitsnap과 AiSoftService는 별개 repo. 에셋은 복사(심링크 X).

---

## 5. 착수 전 결정 사항

1. **status**: `coming_soon`(정직·미출시) vs `beta`(테스트 강조) — 어느 쪽?
2. **비주얼 방식**: 폰 목업(shot=앱 스크린샷) vs 히어로 배경(heroImage=before/after) vs 둘 다?
3. **범위**: P1~P4(기본 전시)만 vs P5(전용 시그니처 연출)까지?
4. **에셋 출처**: fitsnap 홍보웹 기존 이미지 재사용 vs 신규 스크린샷 촬영?

---

관련: AiSoftService `src/data/services.ts`(카탈로그 SoT)·`App.tsx`·`PromoSection.tsx`.
FitSnap 원본: `~/projects/fitsnap`(디자인 토큰·홍보웹 에셋). 이 계획 `docs/plan-add-fitsnap.md`.
