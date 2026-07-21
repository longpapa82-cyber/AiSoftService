# 진행 계획 — ① myToday 안드로이드 오픈 처리 ② 로픽 홍보 영역 전체 리디자인

작성일: 2026-07-21 · 브랜치: `feat/integrated-landing`

---

## 검증으로 확정한 사실 (Evidence)

| 항목 | 근거 | 값 |
|------|------|-----|
| myToday Android 패키지 | `myToday/app.json` `android.package` | `com.joyfulday.mytoday` (⚠️ `com.longpapa82.*` 아님) |
| myToday Play 실출시 | `play.google.com/.../id=com.joyfulday.mytoday` HTTP 200 + `<title>myToday - 마음 습관 다이어리 - Google Play 앱` | **라이브 확정** |
| 로픽 홍보 사이트 | `lawpic-promo.vercel.app` HTTP 200 | 라이브(Next.js) |
| 로픽 최신 팔레트 | 사이트 CSS 토큰 | primary `#0284c7` / accent-sky `#38bdf8` / **green `#10b981`(안전)** / **amber `#eab308`(주의)** / tertiary `#2563eb` / bg `#f8fafc` |
| 로픽 글래스 토큰 | 사이트 CSS | `--glass-bg:hsla(0,0%,100%,.7)` / `--glass-blur:blur(12px)` / `--glass-border:1px solid hsla(0,0%,100%,.5)` / `--shadow-puffy:0 26px 60px -16px rgba(56,189,248,.28)` |
| 로픽 폰트 | 사이트 CSS | brand=Jua / body=Gowun Dodum / en=Quicksand (현 AiSoft 로픽과 동일 계열 — 로드 불필요) |
| 로픽 이미지 자산 | 사이트 HTML | `mascot.png`, `icon.png`만 존재. **폰 목업/분석카드는 DOM+CSS 합성**(이미지 아님) → 스크린샷 파일로 못 가져옴, 재현 필요 |

### 로픽 사이트 최신 핵심 카피 (실제 문구, 리디자인에 반영)
- 히어로: "계약서, 사진 한 장이면 됩니다" / "어려운 법률 용어는 부엉이 로픽이 대신 읽고 쉽게 풀어드려요"
- 분석 카드 목업: `근로계약서.pdf · 3장 · 조항 12개 검토 완료 · 안심도 78` / 🟡주의 `제8조 경업금지 24개월…` / 🟢안전 `제5조 급여 지급 명확`
- 가격: **3일 무료체험** → 월 8,900원 / 연 79,000원
- 고지: "로픽의 분석은 AI 기반 참고 정보이며 법률 자문을 대체하지 않습니다"
- 스토어: GET IT ON Google Play **곧 출시** / App Store **곧 출시** (⚠️ 사이트도 미출시 상태 유지 → AiSoft도 `coming_soon` 유지)

---

## Task 1 — myToday 안드로이드 앱 오픈 처리

**현재 상태**: `services.ts` myToday `links = { ios, web, androidPending:true, webIsLegal:true }`
→ Android가 "준비 중" 비활성 배지로 표기됨.

**변경**: Android 실출시 반영 → `androidPending` 제거 + `android` 실링크 추가.
`services.ts` 주석(432~433행)이 이미 이 전환을 예고: *"Android 출시 시 androidPending 제거하고 android 링크만 추가하면 자동 반영"*.

### 수정 파일 (2개)
1. **`src/data/services.ts`** — myToday `links`:
   ```diff
     links: {
       ios: 'https://apps.apple.com/kr/app/id6785864596',
       web: 'https://my-today.net/',
   -   androidPending: true,
   +   android: 'https://play.google.com/store/apps/details?id=com.joyfulday.mytoday',
       webIsLegal: true,
     },
   ```
   주석도 "iOS+Android 출시 완료"로 갱신.

2. **`index.html`** — noscript myToday `<section>`에 Google Play `<li>` 추가:
   ```diff
     <li><a href="https://apps.apple.com/kr/app/id6785864596">App Store</a></li>
     <li><a href="https://my-today.net/">myToday 웹사이트</a></li>
   + <li><a href="https://play.google.com/store/apps/details?id=com.joyfulday.mytoday">Google Play</a></li>
   ```

### 자동 반영 (코드 0줄)
- **StoreBadges**: `androidPending` 없어지고 `android` 존재 → "▶ SOON Google Play 준비 중" 비활성 배지가 **"▶ INSTALL Google Play" 활성 링크**로 자동 전환(기존 else 분기).
- **정직 지표 (Hero `PLATFORM_COUNT` / Technology `PLATFORMS`)**: 이 집계는 `svc.links.android`(실링크)로 카운트 → 이제 myToday Android가 **정당하게** 집계 포함. 허위 아님(실제 출시했으므로).
  - ⚠️ 확인 필요: PLATFORM_COUNT 로직이 "고유 플랫폼 존재 여부"인지 "링크 수"인지 → Android는 이미 myTravel/myPet 등으로 집계됐을 수 있어 **총 플랫폼 수(iOS/Android/Web)는 불변**일 가능성 높음. 구현 전 `Hero.tsx`/`Technology.tsx` 집계 로직 grep 확인.

**리스크**: 낮음. 데이터 1줄 교체 + noscript 1줄. 로직 변경 없음.

---

## Task 2 — 로픽 홍보 영역 전체 리디자인 (사용자 선택: 전체 리디자인)

**목표**: AiSoft 로픽 미니 홍보 영역을 `lawpic-promo.vercel.app` 최신 버전과 최대한 동일하게.
현재(스카이블루 단색 + 부엉이 마스코트 + 3스텝) → **멀티 액센트(스카이+초록+노랑) + 글래스 '분석 결과 카드' 목업 + 3일 무료 강조**.

### 설계 원칙 (공유 컴포넌트 안전)
`PromoSection.tsx`는 6개 서비스가 공유. 로픽 전용 시각을 넣되 **다른 5개 서비스 회귀 0**이 최우선.
→ 새 `promo` 필드는 **선택(optional)** 으로 추가, 렌더는 **조건부**. 기존 필드(`steps`/`mascot`/`shot`)는 건드리지 않음.

### 2-A. 데이터 확장 (`services.ts` — ServicePromo 인터페이스 + 로픽 promo)

신규 optional 필드 제안:
```ts
/** 로픽 전용: 조항 분석 결과 글래스 카드 목업(사이트 시그니처 비주얼). */
analysisCard?: {
  docLabel: string;        // "근로계약서.pdf · 3장 · 조항 12개 검토 완료"
  safetyScore: number;     // 78 (안심도)
  clauses: {
    kind: 'caution' | 'safe';   // 노랑/초록
    tag: string;                // "제8조 · 경업 금지"
    text: string;               // "퇴사 후 24개월…"
  }[];
};
/** 멀티 액센트(안전=초록/주의=노랑) — 있으면 분석카드·하이라이트에 사용. */
accentSafe?: string;   // '#10b981'
accentCaution?: string;// '#eab308'
/** 무료체험 강조 배지. */
trialBadge?: string;   // "3일 무료체험"
```

로픽 `promo`에 채울 값(사이트 실측):
- `analysisCard`: docLabel `"근로계약서.pdf · 조항 12개 검토 완료"`, safetyScore `78`,
  clauses: 🟡`{caution, "제8조 · 경업 금지", "퇴사 후 24개월 — 통상보다 길어요"}`, 🟢`{safe, "제5조 · 급여 지급", "지급일·산정 방식이 명확해요"}`
- `accentSafe:'#10b981'`, `accentCaution:'#eab308'`, `trialBadge:'3일 무료체험'`
- highlights 갱신: `사진 한 장|계약서 분석` / `여러 장|한 번에 분석` / `3일|무료체험`
- palette는 이미 사이트와 동일(sky #0284c7). bg를 `#f8fafc`(사이트 --color-bg)로 미세 조정 검토.
- **status는 `coming_soon` 유지** (사이트도 "곧 출시" — 허위 출시 방지). ios/android 링크 미설정 유지.

### 2-B. 렌더 확장 (`PromoSection.tsx`)
우측 비주얼 우선순위에 `analysisCard`를 최상위로 추가:
```
promo.analysisCard ? <AnalysisCard/> : promo.shot ? … : promo.mascot ? … : promo.steps ? …
```
- `AnalysisCard`: 글래스 표면(blur 12px, 흰 70%, 라운드 28) + 상단 문서 라벨 + 안심도 링/바 + 조항 리스트(🟡주의/🟢안전 좌측 컬러바). 부엉이 마스코트는 카드 상단 or 코너 배지로 병치.
- 3스텝(찍고→분석→확인)은 좌측 내러티브 하단 or 카드 아래 유지(사이트 "How it works" 반영).
- `trialBadge`는 히어로 kicker 근처 또는 CTA 위 pill로.

### 2-C. 스타일 (`PromoSection.module.css`)
- 신규 클래스: `.analysisCard`, `.analysisHead`, `.safetyMeter`, `.clauseItem`, `.clauseCaution`, `.clauseSafe`, `.trialBadge`.
- 글래스 토큰 사이트값 이식: `backdrop-filter: blur(12px)`, `background: hsla(0,0%,100%,.7)`, `border: 1px solid hsla(0,0%,100%,.5)`, `box-shadow: 0 26px 60px -16px rgba(56,189,248,.28)`.
- 컬러: caution=`#eab308`+soft `#fef9c3`, safe=`#10b981`+soft `#d1fae5`.
- ⚠️ 애니메이션은 compositor 친화(transform/opacity)만. 레이아웃 속성 애니메이션 금지(전역 웹 룰).
- ⚠️ 모바일(≤768/375/320) 오버플로우 점검 — 분석카드가 좁은 화면에서 넘치지 않게.

### 2-D. SEO/noscript
- `index.html` 로픽 noscript는 **미출시 상태 유지**(웹사이트 <li>만). status 불변이므로 스토어 <li> 추가 안 함.
- description/keywords에 "3일 무료체험" 등 추가 검토(선택, 소폭).

**리스크**: 중간. 공유 컴포넌트에 신규 조건부 렌더 추가 → 다른 5서비스 경로가 기존 분기 그대로인지 검증 필수.

---

## 검증 계획 (공통)

1. **빌드**: `npm run build` 그린 + JS/CSS 번들 예산 확인(랜딩 JS <150KB gzip 목표).
2. **정적 grep**: `services.ts`에 Play 링크·`analysisCard` 반영, `index.html` noscript myToday Google Play `<li>` 반영. (한글 grep `LC_ALL=en_US.UTF-8`)
3. **Playwright 실렌더 육안** (로컬 preview 4173 + 프로덕션):
   - 데스크톱 1440 / 모바일 390 스크린샷.
   - myToday 배지 = [App Store 설치][**Google Play 설치(활성)**][웹사이트] — "준비 중" 문구 0.
   - 로픽 = 글래스 분석카드(🟡주의/🟢안전 조항, 안심도) + 3일무료 배지 + 부엉이 + [App Store 준비중][Play 준비중][웹사이트 활성].
   - **5개 서비스 회귀 0** (myTravel/myPet/내새끼/AI Music/myToday 각 정상).
   - 모바일 오버플로우 없음.
   - ⚠️ 마스코트 `loading=lazy` — 뷰포트 밖 검증 시 `complete:false`로 뜨면 **스크롤 후 재확인**(정상, 버그 아님).
4. **PLATFORM_COUNT 정합**: Hero/Technology 플랫폼 수 육안 — myToday Android 추가로 허위 집계 없는지.
5. **배포**: 커밋(소스 2~4파일만, docs/.bkit·.pdca 제외) → `vercel deploy --prod --yes` → 프로덕션 번들 md5/해시 로컬 동일 대조 → 프로덕션 실렌더 재확인.

---

## 실행 순서 (의존성)

```
[병렬 가능]
 ├─ Task1: services.ts myToday links + index.html noscript   (독립, 저위험)
 └─ Task2-A: ServicePromo 인터페이스 + 로픽 promo 데이터       (독립)
[순차]
 Task2-A → Task2-B(PromoSection 렌더) → Task2-C(CSS)          (렌더는 데이터 타입 의존)
[통합]
 → 빌드 → 로컬 Playwright 검증 → 커밋 → 배포 → 프로덕션 검증
```

Task1과 Task2-A는 같은 파일(`services.ts`)을 수정하므로 **한 편집 세션에서 순차** 처리(충돌 회피).

---

## 미결/확인 필요 (구현 착수 시)
- [ ] `Hero.tsx`/`Technology.tsx`의 PLATFORM 집계 로직 grep — Android 추가 영향 확인.
- [ ] `PromoSection.tsx` 우측 비주얼 분기 정확한 위치(209~320행대) 확인 후 `analysisCard` 분기 삽입점 결정.
- [ ] 사이트 bg `#f8fafc` vs 현재 로픽 `#f0f9ff` — 어느 쪽 유지할지(미세). 기본: 사이트값으로 통일.
