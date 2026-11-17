# 숏킷(shortKit) Android 출시 홈페이지 반영 — 상세 계획

> 작성일: 2026-11-17 · 브랜치: feat/integrated-landing
> 기준점: HEAD `68cd387` (v16 그리드 수정 완료 상태)
> 패턴: #84 FitSnap · #106 도란·Voice Buddy Android 출시 반영의 **완전 재사용**

---

## 0. 요약

숏킷(shortKit, AI 영상 요약) Android 앱이 Google Play에 출시됨. 홈페이지에서 현재 "준비 중"(androidPending) 배지로 표시되는 것을 **실제 Google Play 링크**로 전환한다.

- **패키지명**: `com.shortkit.app` (소스 `shortKit/app.json` SoT = iOS 번들과 동일, 사용자 확인 완료)
- **수정 파일**: 2개 (services.ts + index.html) — **컴포넌트 0줄**
- **메커니즘**: StoreBadges는 이미 ios/android/androidPending 3분기 완비 → `links.android` 추가 + `androidPending` 제거만으로 자동 렌더

---

## 1. 현황 (grep 실측)

| 항목 | 현재 상태 |
|---|---|
| 숏킷 status | `live` (iOS 출시 완료 #87) |
| `links.ios` | `apps.apple.com/kr/app/id6816935944` (번들 com.shortkit.app) |
| `links.web` | `longpapa82-cyber.github.io/shortkit-web/` |
| `links.android` | **없음** (현재 `androidPending: true` = Google Play "준비 중" 비활성 배지) |
| index.html sameAs | App Store + 웹사이트만 (117·118줄) |
| index.html noscript | App Store + 웹사이트 li만 (284·285줄) |

## 2. 패키지명 확정 (★추측 금지 — #84 교훈)

- 소스 `/Users/hoonjaepark/projects/shortKit/app.json` → `android.package: "com.shortkit.app"` (3개 소스 디렉토리 전부 일치)
- iOS 번들(`com.shortkit.app`)과 **동일** — 단 #84 FitSnap(app.fitsnap≠com.fitsnap) 선례가 있어 소스 확인 필수였음
- ⚠️ 현재 Play 리스팅 curl = **404**(출시 직후 인덱싱 지연). 사용자 확인으로 패키지 확정.
- Google Play URL: `https://play.google.com/store/apps/details?id=com.shortkit.app`

## 3. 수정 상세 (데이터 + SEO 2파일)

### 3-1. `src/data/services.ts` (숏킷 블록, 1221~1227줄)

**변경 전:**
```ts
links: {
  ios: 'https://apps.apple.com/kr/app/id6816935944',
  // Android는 아직 스토어 미출시(준비 중) → androidPending:true...
  androidPending: true,
  web: 'https://longpapa82-cyber.github.io/shortkit-web/',
},
```

**변경 후:**
```ts
links: {
  ios: 'https://apps.apple.com/kr/app/id6816935944',
  android: 'https://play.google.com/store/apps/details?id=com.shortkit.app',
  web: 'https://longpapa82-cyber.github.io/shortkit-web/',
},
```

- `androidPending: true` **제거** + `android` 실링크 **추가**
- 상단 주석도 "Android 미출시(pending)" → "Android 출시 완료"로 갱신(1213~1216·1223~1225줄)

### 3-2. `index.html` SEO 동기 (2곳)

**A. JSON-LD sameAs (118줄 근처)** — App Store 다음 줄에 Google Play URL 삽입:
```html
"https://apps.apple.com/kr/app/id6816935944",
"https://play.google.com/store/apps/details?id=com.shortkit.app",
"https://longpapa82-cyber.github.io/shortkit-web/",
```

**B. noscript 숏킷 섹션 (284줄 근처)** — App Store li 다음에 Google Play li 추가:
```html
<li><a href="https://apps.apple.com/kr/app/id6816935944">App Store</a></li>
<li><a href="https://play.google.com/store/apps/details?id=com.shortkit.app">Google Play</a></li>
<li><a href="https://longpapa82-cyber.github.io/shortkit-web/">숏킷 웹사이트</a></li>
```

## 4. 메트릭 영향 (정직 지표 유지)

- **SERVICE_COUNT**: 불변 (12, status 무관 항상 집계)
- **PLATFORM_COUNT** (Hero·Technology·About 3곳): Android는 이미 기존 7앱이 집계 → 숏킷 1개 추가해도 **Set size 불변** = 허위 출시 방지(정직 지표). 단 숏킷이 Android 미집계 상태였다면 +1 가능 — 확인 필요(§6 검증).
- **StoreBadges 렌더**: `if(android)` 분기가 실링크 자동 렌더, `androidPending` 제거로 "준비 중" 배지 자동 소거 (StoreBadges.tsx 수정 불필요)

## 5. 실행 순서

| 단계 | 내용 |
|---|---|
| 1 | services.ts 숏킷 블록 수정 (androidPending 제거 + android 링크 + 주석 갱신) |
| 2 | index.html 2곳 동기 (sameAs + noscript) |
| 3 | 빌드 그린 확인 (tsc -b) |
| 4 | 검증 (§6) |
| 5 | 단독 커밋 → 배포 → push |

## 6. 검증 계획

1. **빌드 그린**: `npm run build` (tsc + vite)
2. **회귀 증명 3중** (#106 패턴):
   - (a) 소스 `androidPending: true` 카운트 **before→after -1** (숏킷만 제거, 잔존 pending은 그대로)
   - (b) dist 번들 minify `androidPending:!0` 동일 델타
   - (c) **라이브 JS 번들 해시 = 로컬 빌드 바이트일치** (최신 커밋 서빙 확정) + 번들에 `com.shortkit.app` 출현
3. **PLATFORM_COUNT 확인**: 수정 전후 Hero/Technology/About 플랫폼 수 측정 — Android 기집계면 불변(정직), 숏킷이 유일 Android였다면 변화(실제 반영)
4. **배포 검증**: `vercel deploy --prod --yes` 후 라이브 번들 해시 일치 + noscript/sameAs에 Google Play URL 출현
5. **Google Play 링크 상태**: curl 404여도 "인덱싱 지연"으로 정상 처리(사용자 확인 완료). 추후 인덱싱되면 재확인.

## 7. 리스크

| 리스크 | 완화 |
|---|---|
| 패키지명 오류 | 소스 app.json SoT + 사용자 확인 = `com.shortkit.app` 확정 |
| Play 404로 "잘못된 링크" 오해 | 출시 직후 인덱싱 지연(정상). 사용자 확인됨. URL 자체는 정규 형식 |
| androidPending 제거 누락 | before/after grep 델타로 검증 |
| 메트릭 허위 변동 | PLATFORM_COUNT Set 기반이라 Android 기집계면 불변 — 측정으로 확인 |

## 8. 마일스톤 참고

#87에서 "숏킷이 유일 coming_soon이던 마지막 서비스→전 서비스 live" 달성.
이번 반영으로 숏킷 Android까지 추가되면 Android 실링크 보유 서비스가 늘어남.
잔존 androidPending: myToday·AI Music 등(§6에서 정확히 확인).
