# facePreview 랜딩 추가 상세 계획

> 작성일: 2026-10-18 · 대상 저장소: AiSoftService (통합 랜딩) · 브랜치: `feat/integrated-landing`
> 목표: facePreview를 **11번째 서비스**로 통합 랜딩에 등록 (기존 10서비스 추가 패턴 재사용)

---

## 0. 요약 (TL;DR)

facePreview는 **얼굴 성형 시뮬레이션 AI 앱**으로, 현재 **pre-launch(앱 미출시)** 상태다.
따라서 숏킷(#83 신규추가 당시) / 로픽 초기와 동일하게 **`status: 'coming_soon'`** 로 등록한다.

기존 서비스 추가 패턴(숏킷·도란·FitSnap)은 **데이터 2~3파일·컴포넌트 0줄 수정**으로 끝난다.
이 계획도 동일: `services.ts` 엔트리 1개 + 아이콘 에셋 1개 + `index.html` SEO 동기 2곳.
컴포넌트(PromoSection/StoreBadges/Hero/About/Technology)는 **데이터 주도(SoT)** 라 자동 반영된다.

**핵심 선결 과제(사용자 입력 필요): 아이콘 PNG, 프로모 웹 URL, 홍보 문구 확정** — §5 참조.

---

## 1. 등록 대상 데이터 (facePreview 조사 결과)

조사 출처: `/Users/hoonjaepark/facePreview` (docs, tokens.ts, app.json)

| 필드 | 값 | 근거 |
|------|-----|------|
| 제품명 | **facePreview** (별도 한글명 없음) | app.json, 디자인 문서 |
| 한줄 설명 | AI 얼굴 성형 시뮬레이션 — 수술 전 사진으로 예상 결과를 미리 | plan.md §1.1 |
| 태그라인 후보 | "수술 없이, 미리 만나는 변화" | promo-site.design.md §5.1 |
| 상태 | **coming_soon** (iOS 개발 중 ~62%, 스토어 미등록) | analysis.md, app.json |
| 번들/패키지 | `com.facepreview.app` (iOS·Android 동일) | app.json |
| Primary | `#CBA968` (샴페인 골드) | tokens.ts |
| Accent | `#6FD6C9` (뮤트 틸) | tokens.ts |
| 배경/잉크 | 다크 `#0C0D11` / 텍스트 `#F3F1EC` | tokens.ts |
| 폰트 | Paperlogy(디스플레이) / Pretendard(본문) | tokens.ts |
| 모티프 | "Clinical Luxe" — 다크·럭셔리·글래스 | ui.design.md |
| 데모 이미지 | `app/assets/images/editorial/ba-before.jpg`, `ba-after.jpg` | 실제 before/after 쌍 |

> ⚠️ **중요한 판단 분기**: 스토어 미출시이므로 `coming_soon`.
> → StoreBadges가 App Store·Google Play를 "준비 중" 배지로, web(프로모 사이트)만 활성 링크로 렌더.
> → PromoSection의 coming_soon 오버레이 자동 적용.

---

## 2. 랜딩 저장소 등록 메커니즘 (검증 완료)

SoT = `src/data/services.ts` (1252줄). 모든 지표는 여기서 파생 → **상수 수동 수정 불필요**.

| 검증 항목 | 위치 | 비고 |
|-----------|------|------|
| 아이콘 import 블록 | `services.ts:6–15` | `{id}-icon.png` 10개. L15 다음에 추가 |
| 서비스 배열 닫힘 | `services.ts:1250` (`order: 10`) → `1252` (`]`) | L1250 뒤에 엔트리 삽입 |
| `AppService` 인터페이스 | `services.ts` 상단 | id·name·tagline·description·status·moodLabel·emoji·iconUrl·links·theme·features·promo?·order |
| `links.androidPending` / `webIsLegal` | 옵션 필드 | coming_soon 시 미사용 |
| SERVICE_COUNT / PLATFORM_COUNT | `Hero.tsx:16`, `Technology.tsx:29`, `About.tsx:55` | `SERVICES.length` + 실 링크 Set → **자동 재계산** |
| JSON-LD `sameAs` | `index.html:97–116` | 서비스 실 링크 배열. L116 뒤 추가 |
| noscript 폴백 | `index.html:140–288` | 서비스별 `<section>`. L279 뒤 추가 |
| 빌드/타입체크 | `package.json` → `build: "tsc -b && vite build"` | 타입체크는 `tsc -b` |

**지표 중립성**: `coming_soon` + web만 있으면 SERVICE_COUNT는 +1(11), PLATFORM_COUNT는 Web이 이미 집계돼 불변 가능성 높음 → 정직 지표 유지(숏킷 #87 교훈과 동일).

---

## 3. 렌더링 경로 (컴포넌트 0줄 수정 확인)

PromoSection(`src/sections/PromoSection.tsx`)은 `promo` 필드 조합으로 분기:

- `promo.beforeAfter` → **CompareSliderVisual** (드래그 before/after) ← FitSnap 패턴
- `promo.mascotComponent==='dorani'` → DoraniMascot (해당 없음)
- `promo.mascot` → `<img>` 정적 마스코트
- `promo.shot` → 폰 목업 프레임
- 그 외 → 기능 카드 그리드(폴백)

**facePreview 권장 비주얼**: `promo.beforeAfter` 재사용(FitSnap과 동일 컴포넌트).
before/after 이미지가 제품의 핵심 가치("수술 전후 미리보기")와 정확히 일치 → 추가 컴포넌트 0.
`promo.dark: true` + `motif: 'none'`(또는 기존 모티프 중 택1)으로 Clinical Luxe 톤 반영.

---

## 4. 작업 단계 (Phase)

### Phase 1 — 에셋 준비 (선결, 사용자 자료 필요)
1. **아이콘**: `src/assets/services/facepreview-icon.png` (256px PNG)
   - 소스: `/Users/hoonjaepark/facePreview/app/assets/icon.png` 변환 가능
2. **프로모 before/after** (promo 포함 시): `src/assets/promo/facepreview/before.webp`, `after.webp`
   - 소스: `editorial/ba-before.jpg`, `ba-after.jpg` → webp 변환(cwebp)
   - ⚠️ 민감: 실제 얼굴 성형 전후 이미지. 공개 랜딩 게시 **동의/권리 확인 필요** (§5)

### Phase 2 — 데이터 등록 (`services.ts`)
3. import 추가 (L15 뒤): `facepreviewIcon`, (promo 시) before/after
4. 서비스 엔트리 추가 (L1250 뒤, `order: 11`):
   - status `coming_soon`, links.web(프로모 URL), theme(골드/틸/다크), features 3개
   - promo: `dark:true`, `beforeAfter`, Clinical Luxe palette

### Phase 3 — SEO 동기 (`index.html`)
5. JSON-LD `sameAs`에 프로모 web URL 추가 (L116 뒤)
6. noscript에 `<section>` 블록 추가 (L279 뒤) — name·tagline·description·web 링크

### Phase 4 — 검증
7. `npm run build` (tsc -b 그린 확인)
8. `npm run dev` → Hero 그리드에 11번째 카드 + "준비 중" 배지, `#promo-facepreview` 섹션 확인
9. (가능 시) Playwright/webapp-testing 다중 뷰포트 — before/after 슬라이더·다크 톤 육안 검증
10. SERVICE_COUNT=11 반영, PLATFORM_COUNT 변동 없음(정직 지표) 확인

### Phase 5 — 배포 (사용자 승인 후)
11. 커밋 (`feat(services): facePreview coming_soon 11번째 서비스 추가`)
12. `vercel deploy --prod --yes` (GitHub 자동배포 미연동 — 수동 필수)
13. 라이브 검증: noscript 문구 출현 + JS 번들 해시 일치 (raw md5 아님 — 숏킷 #87 교훈)

---

## 5. 선결 결정 사항 (사용자 입력 필요)

아래 3가지는 코드가 아닌 **사용자 판단/자료**가 필요하다:

1. **프로모 웹 URL**: facePreview `web/` 사이트가 Vercel 배포됐는가?
   - coming_soon 서비스는 활성 CTA가 web뿐 → 미배포 시 CTA 없는 카드가 됨.
   - 선택지: (a) 먼저 배포 후 URL 확보, (b) web 없이 "출시 예정"만 표기.
2. **아이콘/프로모 이미지 제공 방식**: facePreview 저장소 에셋을 복사·변환해도 되는가?
3. **before/after 이미지 공개 가부**: 실제 얼굴 전후 이미지의 공개 랜딩 게시 권리·동의.
   - 미확보 시: promo를 `beforeAfter` 대신 **기능 카드 폴백** 또는 **합성/샘플 이미지**로.

---

## 6. 리스크 & 비범위

- **리스크**: coming_soon + web 미배포 → CTA 없는 카드(UX 약화). §5-1에서 해소.
- **리스크**: 성형 전후 이미지 민감성 → 권리/동의. §5-3.
- **비범위**: facePreview 앱 자체 개발(별도 worktree `feat/facepreview-mvp`), 풀 랜딩 리디자인.
- **회귀 0 근거**: 데이터 주도 추가, 컴포넌트 미수정, 기존 10서비스 렌더 경로 불변.

---

## 7. 예상 변경 파일

| 파일 | 변경 | 줄 수(예상) |
|------|------|------------|
| `src/data/services.ts` | import + 엔트리 1개 | +60~100 |
| `src/assets/services/facepreview-icon.png` | 신규 | (바이너리) |
| `src/assets/promo/facepreview/*.webp` | 신규(promo 시) | (바이너리) |
| `index.html` | sameAs + noscript | +8~12 |

**컴포넌트 수정: 0줄** (SoT 데이터 주도 — 숏킷·도란·FitSnap 추가와 동일)
