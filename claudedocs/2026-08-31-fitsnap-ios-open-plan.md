# FitSnap iOS 오픈 처리 — 상세 계획

- **작성일**: 2026-08-31
- **브랜치**: feat/integrated-landing
- **트리거**: FitSnap iOS 앱 App Store 심사 통과 → 사이트에 iOS 출시(오픈) 반영
- **참조 구현(패턴 동일)**: Voice Buddy (`voicebuddy`) — "iOS 출시 + Android 준비 중" 혼합 상태의 검증된 선례

---

## 0. 확정된 결정사항 (사용자 승인)

| 항목 | 결정 | 근거 |
|------|------|------|
| iOS 링크 | **실링크 확정·검증 완료** | 심사 통과 = 실제 스토어 등재 |
| Android 상태 | **계속 "준비 중"** (`androidPending: true` 유지) | 비공개 테스트 단계 유지, 허위 출시 금지 |
| 주 CTA(골드) | **App Store 우선** (`webIsLegal: true`) | 설치 우선 — AI Music·Voice Buddy와 동일 정책 |

### ✅ iOS 실링크 확정 (BLOCKER 해제됨)
App Store Connect 확인값 — 번들 ID `com.longpapa82.fitsnap`, Apple ID `6801993872`, 상태 "1.0 배포 준비됨".

```
https://apps.apple.com/kr/app/id6801993872
```
라이브 검증 완료: **HTTP 200 + 타이틀 "FitSnap - AI 가상 피팅 앱"** (2026-08-31, Voice Buddy와 동일한 curl 대조 관례 충족).

---

## 1. 현재 상태 (AS-IS)

`src/data/services.ts` — `fitsnap` 항목 (라인 935~1024):

```ts
status: 'coming_soon',              // ← 전체 미출시: 두 스토어 모두 "준비 중"
links: {
  web: 'https://longpapa82-cyber.github.io/fitsnap-web/',
  androidPending: true,
  webIsLegal: false,                // ← 웹사이트가 주 CTA(골드)
},
```

렌더 결과(현재):
- **PromoSection**: 헤더에 `COMING SOON` 배지 표시 (PromoSection.tsx:216)
- **StoreBadges**: `comingSoon=true` → App Store "준비 중" + Google Play "준비 중" + 웹사이트(골드 주 CTA)
- **Hero PLATFORM_COUNT / Technology PLATFORMS / About PLATFORM_COUNT**: `links.ios`·`links.android` 실링크만 Set 집계 → FitSnap은 **플랫폼 수에 미집계** (정직 지표)
- **index.html noscript**: "(출시 준비 중)" 문구 + 웹사이트 링크만
- **index.html JSON-LD `sameAs`**: FitSnap 스토어 URL 없음

---

## 2. 목표 상태 (TO-BE)

`src/data/services.ts` — `fitsnap` 항목:

```ts
status: 'live',                     // coming_soon → live
links: {
  ios: 'https://apps.apple.com/kr/app/id6801993872',       // ← 신규 실링크
  web: 'https://longpapa82-cyber.github.io/fitsnap-web/',
  androidPending: true,             // 유지 (Android 비공개 테스트)
  webIsLegal: true,                 // false → true (App Store를 주 CTA 골드로 승격)
},
```

렌더 결과(변경 후):
- **PromoSection**: `COMING SOON` 배지 **제거** (status가 live로 바뀌어 조건 미충족)
- **StoreBadges**: `comingSoon=false` → App Store(실링크, **골드 주 CTA**) + Google Play "준비 중" + 웹사이트(보조)
  - `primaryStore=true`(=webIsLegal) → `primaryLabel = ios ? 'App Store' : ...` → **App Store가 골드**
- **Hero/Technology/About 플랫폼 카운터**: `links.ios` 신규 추가로 iOS 집계
  - 단, **iOS는 이미 6개 앱(myTravel/myPet/내새끼/myToday/AI Music/로픽/Voice Buddy)이 집계** → Set 기반이라 **총 플랫폼 수(iOS·Android=2) 불변**. 표기 수치 변화 없음 → 회귀 없음
- **index.html noscript**: "(출시 준비 중)" 제거, App Store 링크 추가
- **index.html JSON-LD `sameAs`**: FitSnap iOS URL 추가

---

## 3. 변경 파일 & 세부 편집

### 3.1 `src/data/services.ts` (핵심)
FitSnap 항목의 상단 주석 + `status` + `links` 수정.

**(a) 경고 주석 갱신** (라인 940~942 부근) — 기존:
```ts
// ⚠️ Android 비공개 테스트 단계(스토어 미공개). iOS 후속. 허위 출시 표기 금지:
// status='coming_soon' + androidPending로 "준비 중"을 정직하게 표기(다른 서비스와 동일 원칙).
status: 'coming_soon',
```
→ 변경:
```ts
// iOS 출시 완료(App Store id6801993872, 2026-08-31 라이브 검증). Android는 비공개 테스트 단계 →
// androidPending:true 유지(Google Play "준비 중" 비활성 배지). Voice Buddy(id6799329142)·myToday와
// 동일한 "iOS 출시 + Android 준비 중" 혼합 상태. webIsLegal:true로 App Store를 주 CTA(골드)로 승격(설치 우선).
// PLATFORM_COUNT(Hero)·PLATFORMS(Technology)·About는 links.ios/android 실링크만 Set 집계 →
// iOS 이미 타 앱 집계로 총 플랫폼 수 불변, androidPending은 별개 플래그라 미집계 = 허위 출시 방지(정직 지표).
// ⚠️ Android 출시 시 app.json 패키지명이 SoT — 출시되면 links.android 실링크 추가.
status: 'live',
```

**(b) `links` 블록** (라인 946~950):
```ts
links: {
  ios: 'https://apps.apple.com/kr/app/id6801993872',
  web: 'https://longpapa82-cyber.github.io/fitsnap-web/',
  androidPending: true,
  webIsLegal: true,
},
```

> `promo`, `theme`, `features`, `beforeAfter`(드래그 슬라이더), `motif: 'cloth'` 등 **비주얼/카피는 전부 그대로 유지**. 이번 작업은 출시 상태·링크만 바꾼다.

### 3.2 `index.html` — noscript SEO 폴백 (라인 232~242)
- "(출시 준비 중)" 문구 제거
- App Store `<li>` 추가 (다른 앱 형식과 동일):
```html
<section>
  <h2>FitSnap — 입어보지 않고, 입어본다</h2>
  <p>내 사진과 옷 사진만 있으면 AI가 실제로 입은 모습을 보여줍니다. 온라인 쇼핑에서 사기 전에 나에게 어울리는지 미리 확인하세요. 키·몸무게·체형을 반영해 더 자연스러운 착용 모습을 만듭니다.</p>
  <ul>
    <li><a href="https://apps.apple.com/kr/app/id6801993872">App Store</a></li>
    <li><a href="https://longpapa82-cyber.github.io/fitsnap-web/">FitSnap 웹사이트</a></li>
  </ul>
</section>
```

### 3.3 `index.html` — JSON-LD `sameAs` 배열 (라인 94~105 부근)
Voice Buddy iOS URL(id6799329142) 다음에 FitSnap iOS URL 한 줄 추가:
```json
"https://apps.apple.com/kr/app/id6799329142",
"https://apps.apple.com/kr/app/id6801993872",
```

> **드리프트 주의**: services.ts의 name/tagline/description은 index.html noscript에 수동 복제되어 있다(services.ts:280 주석). description 카피는 변경하지 않으므로 noscript 텍스트는 링크·"준비 중" 문구만 손대면 됨.

---

## 4. 변경하지 않는 것 (명시)
- FitSnap 비주얼: `beforeAfter` 드래그 슬라이더, `motif: 'cloth'`(떠다니는 의류 아이콘), 팔레트/폰트/highlights/steps/disclaimer — 전부 유지
- 모바일 배경 아이콘 배치 로직(fitsnap-mobile-layout 메모리) — 무관, 손대지 않음
- StoreBadges.tsx / PromoSection.tsx / Hero·Technology·About.tsx 컴포넌트 로직 — **코드 수정 불필요**. 전부 데이터 기반으로 자동 반영됨 (신규 서비스 확장성 설계의 이점)

---

## 5. 검증 계획

### 5.1 실링크 검증 (실행 전, BLOCKER 해제)
```bash
curl -sSL -o /dev/null -w "%{http_code}" "https://apps.apple.com/kr/app/id6801993872"   # 200 기대
curl -sSL "https://apps.apple.com/kr/app/id6801993872" | grep -o "<title>[^<]*</title>" # FitSnap 앱명 대조
```
(Voice Buddy가 쓴 "라이브 curl 200+title 대조" 관례와 동일)

### 5.2 타입/빌드
```bash
npx tsc --noEmit          # 타입 회귀 0
npm run build             # 프로덕션 빌드 성공
```

### 5.3 시각 회귀 (Chrome/Playwright)
로컬 `npm run dev` 또는 빌드 프리뷰에서 FitSnap 섹션 확인:
- [ ] `COMING SOON` 배지 사라짐
- [ ] App Store 배지가 **골드(주 CTA)** + 실제 링크(새 탭)로 열림
- [ ] Google Play 배지는 "준비 중" 비활성 유지
- [ ] 웹사이트 배지는 보조(글래스 아웃라인)로 존재
- [ ] Hero/Technology/About 플랫폼 수 표기 불변(2개 플랫폼)
- 브레이크포인트: 320 / 768 / 1024 / 1440 (특히 모바일에서 배지 3개 레이아웃 오버플로 없음)

### 5.4 SEO 폴백
- [ ] noscript FitSnap 블록에 App Store 링크 노출, "준비 중" 문구 없음
- [ ] JSON-LD `sameAs`에 FitSnap iOS URL 포함, JSON 파싱 유효

---

## 6. 실행 순서 (요약)

1. **[BLOCKER]** iOS URL 확정 → `curl` 200 + title 대조 검증
2. `src/data/services.ts` — 주석·`status`·`links` 편집
3. `index.html` — noscript 블록 + JSON-LD `sameAs` 편집
4. `tsc --noEmit` + `npm run build`
5. 로컬 시각 회귀(위 체크리스트)
6. 커밋: `feat(fitsnap): iOS 앱 출시 반영 — App Store 실링크 + 주 CTA 승격, Android는 준비 중 유지`
7. 배포: `vercel deploy --prod --yes` (고정 도메인 aisoft-iota.vercel.app)
8. 라이브 재검증 + 메모리 진행 로그 업데이트(#80)

---

## 7. 리스크 & 완화

| 리스크 | 수준 | 완화 |
|--------|------|------|
| iOS URL 오타/미검증 링크 | 높음 | 실행 전 `curl` 200 + title 대조 (BLOCKER) |
| noscript 카피 드리프트 | 낮음 | description 미변경, 링크/"준비 중"만 수정 |
| 플랫폼 카운터 의도치 않은 증가 | 낮음 | Set 집계 + iOS 기존 집계 → 수치 불변 확인(시각 회귀에 포함) |
| Android 허위 출시 표기 | 없음 | `androidPending` 유지, `links.android` 미추가 |

---

## 8. 컴포넌트 로직 무변경 근거 (설계 검증)

이번 변경이 **데이터 1곳(+SEO)** 만으로 완결되는 이유:
- `StoreBadges`는 `comingSoon`/`androidPending`/`primaryStore` 3개 플래그로 모든 조합을 이미 처리 (Voice Buddy에서 검증된 경로)
- `Hero`/`Technology`/`About`의 플랫폼 카운터는 `SERVICES`를 순회해 `links.ios/android`를 Set에 집계 → 데이터만 바뀌면 자동 반영
- CLAUDE.md 설계 원칙("신규 서비스가 추가될 수 있는 형태") = 상태 전환도 데이터 주도. → 컴포넌트 회귀 표면 없음
