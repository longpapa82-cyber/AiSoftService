# myToday 4번째 서비스 추가 — 구현 계획

> 작성: 2026-07-05 · 브랜치: feat/integrated-landing
> 목표: AiSoftService 통합 랜딩에 myToday를 4번째 서비스로 추가 (미출시 '출시 예정' 배지, order 4)

## 0. 사용자 확정 결정
- **출시 상태**: `status: 'coming_soon'` + 카드에 'COMING SOON / 출시 예정' 배지. 스토어 실링크 없음(미출시).
- **배치 순서**: `order: 4` — 기존 myTravel(1)·myPet(2)·내새끼(3) 뒤, 마지막.

## 1. myToday 서비스 팩트 (소스 근거 확보 완료)

| 항목 | 값 | 근거 |
|---|---|---|
| 정체성 | **마음 습관 다이어리** — 기분 기록 + 할 일을 "새싹처럼" 키우는 성장 다이어리 | legal-site/index.html:6-9 |
| 캐치프레이즈 | "오늘도 새싹처럼 한 뼘씩 자라나요" | legal-site:364 |
| 상세 카피 | "매일의 기분을 기록하고 오늘 하고 싶은 일을 새싹처럼 키우는 마음 습관 다이어리. 기분 체크·할 일·성장 정원·친구 공유를 한 곳에서." | legal-site:7 |
| 핵심 기능 | ①오늘의 기분 체크(5단계) ②오늘의 할 일(9카테고리) ③성장하는 정원(스트릭·레벨·도감7종) ④친구와 함께 ⑤기분 체크 알림 | legal-site:403-437 |
| 주 컬러 | `#37811c` (잎 그린) | src/constants/colors.ts:22 |
| 배경 | `#f4faec` (연두 화이트) | colors.ts:60, app.json:37 |
| 포인트 | `#ffd166` (햇살 노랑), `#7cc242` (새싹), `#c77f3a`(앰버) | colors.ts:95,86,44 |
| 폰트 | 제목 `Jua`(주아), 본문 `GowunDodum`(고운돋움) | typography.ts:23-25 |
| 무드 | 밝은 라이트 · 귀여움(몽글·통통) · 자연톤 · 게임화 | colors.ts:5-7 |
| 앱 아이콘 | myToday 프로젝트 `assets/icon.png` (+ icon-ios.png) | app.json:11,18 |
| 스토어 링크 | **없음(미출시)**. 예정: play.google.com/…?id=com.joyfulday.mytoday | docs/01-plan/phase5-launch-guide.md:270 |
| 웹/법적 사이트 | https://longpapa82-cyber.github.io/mytoday-legal/ | legal-site:12 |
| 실제 수치 | 기분 5단계 · 할 일 9카테고리 · 도감 7종 · 정원 7일마다 레벨업 | legal-site:449,465,479 |

## 2. 자동 반영 vs 수동 작업 (설계 원칙)

`services.ts`는 "배열에 항목만 추가하면 자동 반영" 설계다. 실제 소비처를 grep으로 확인한 결과:

**✅ 데이터 추가만으로 자동 반영 (코드 수정 불필요)**
- `Hero.tsx` — 서비스 칩·카운트(SERVICES_SORTED.length), 첫 프로모 앵커
- `App.tsx` — `promoServices = SERVICES_SORTED.filter(s => s.promo)` → PromoSection 자동 생성 + flip 지그재그
- `Footer.tsx` — 서비스 바로가기 아이콘 목록
- `Technology.tsx` — `SERVICE_COUNT`, "N SERVICES" 배지

**🔧 수동 작업 필요**
1. **앱 아이콘 자산** — `src/assets/services/mytoday-icon.png` 추출·256px 최적화 (기존 3개와 동일 규격, PIL)
2. **`status` 배지 렌더링** — ⚠️ 현재 `status` 필드는 타입만 있고 **UI에서 전혀 안 그려짐**. `coming_soon` 배지를 PromoSection에 새로 구현해야 함(신규 소량 코드).
3. **StoreBadges 미출시 처리** — 링크 전부 없으면 `badges.length===0 → null`로 버튼 영역이 사라짐. web(legal-site) 링크 1개를 넣어 "자세히 보기" 버튼으로 노출.
4. **`index.html` SEO 하드코딩** — JSON-LD `sameAs`, meta description/keywords, noscript 폴백에 myToday 수동 추가(네이버봇 대응, 로그 26번).
5. **sitemap/robots** — 단일 URL이라 변경 불필요(확인).

## 3. 작업 Phase

### Phase 1 — 앱 아이콘 자산 확보
- myToday `assets/icon.png`(또는 icon-ios.png) → PIL로 정사각·256px 최적화 → `src/assets/services/mytoday-icon.png` 저장.
- 기존 3개(mytravel/mypet/mybaby-icon.png 71~80KB)와 동일 규격 맞춤.
- **검증**: 파일 크기·해상도 확인, import 경로 정상.

### Phase 2 — services.ts 데이터 추가
- `import mytodayIcon from '../assets/services/mytoday-icon.png'`
- SERVICES 배열에 myToday 객체 추가 (`order: 4`, `status: 'coming_soon'`):
  - `theme`(통합 카드용 톤다운): surface `#fcfdf8`, ink `#1a1c15`, primary `#37811c`, accent `#ffd166`, gradient 연두, font Jua/GowunDodum.
  - `links`: **web만** = `https://longpapa82-cyber.github.io/mytoday-legal/` (ios/android 없음).
  - `features` 3개: 기분 체크 / 할 일·성장 정원 / 친구와 함께 (실제 카피).
  - `stats`: 기분 5단계 / 도감 7종 등.
  - `promo`: 밝은 자연톤 풀 테마
    - palette: bg `#f4faec`, heroGradient 연두→민트, primary `#37811c`, accent `#ffd166`, ink `#1a1c15`.
    - motif: `'none'` (또는 새싹 모티프 신설은 백로그로).
    - kicker "마음 습관 다이어리", headline "오늘도 새싹처럼\n한 뼘씩 ", headlineAccent "자라나요".
    - subcopy(실제 카피), highlights(5단계·9카테고리·7종), fontDisplay Jua.
    - **disclaimer 검토**: 기분·감정 기록 앱이므로 "의료·심리 상담 대체 아님" 성격 고지 필요 여부 판단(myPet·내새끼 선례). 안전하게 추가 권장.
    - 우측 비주얼: 미출시라 앱 스크린샷 확보 어려우면 아이콘 카드(appCard) 또는 steps(기분→할일→정원 3단계)로.
- **검증**: `tsc --noEmit` PASS.

### Phase 3 — coming_soon 배지 UI 구현 (신규 소량 코드)
- `PromoSection.tsx`: `service.status === 'coming_soon'`일 때 미니헤더 kicker 옆(또는 headline 위)에 'COMING SOON / 출시 예정' 배지 렌더.
- `PromoSection.module.css`: `.comingSoon` 배지 스타일(테마 accent 기반, 라이트/다크 대비).
- **StoreBadges**: web 링크만 있으므로 자동으로 "웹사이트"(▶OPEN) 버튼 1개 = 골드 primary로 노출됨(2026-07-05 로직). '자세히 보기' 톤으로 충분. 라벨 문구만 검토.
- **선택**: Footer 바로가기에서도 coming_soon 시각 구분(작은 점/투명도) — 백로그.
- **검증**: 배지가 myToday에만, 기존 3개(live)엔 안 뜨는지 확인.

### Phase 4 — index.html SEO 수동 갱신
- meta description·keywords에 myToday(마음 습관 다이어리) 추가.
- JSON-LD `sameAs` 배열에 myToday web URL 추가.
- noscript 폴백에 `<section>myToday — 마음 습관 다이어리</section>` + 링크 추가.
- OG description 4개 서비스로 갱신 검토(현재 3개 나열).
- **검증**: JSON 유효성, noscript 렌더 확인.

### Phase 5 — 빌드·검수·배포
- `npm run build` PASS + 번들 예산 확인(현 JS 62.8KB gzip, 아이콘 1개·소량 코드라 +2~3KB 예상).
- 반응형(320~1440)·모바일 오버플로·reduced-motion 확인.
- 배지·버튼·카드가 밝은 자연톤으로 기존 3개와 톤 구분되며 어울리는지 시각 검수.
- `vercel deploy --prod --yes` → aisoft-iota.vercel.app 검증.
- 커밋: `feat(promo): myToday를 4번째 서비스로 추가 (마음 습관 다이어리, 출시 예정)`.

## 4. 열린 결정 포인트 (구현 착수 시 확인)
1. **우측 비주얼**: 앱 스크린샷 없이 무엇으로? → 아이콘 카드 vs 3단계 스텝(기분→할일→정원 성장) vs 새싹 모티프 신설. **추천: steps 3단계**(성장 서사와 맞음).
2. **disclaimer**: 감정 기록 앱 특성상 의료/심리 비대체 고지 넣을지. **추천: 넣음**(선례 일관).
3. **web 링크 대상**: legal-site(github.io) vs 별도 랜딩. 현재는 legal-site만 존재 → 그걸로.
4. **coming_soon 시 web 버튼 문구**: "웹사이트" vs "미리 보기" vs "자세히 보기".

## 5. 리스크 / 주의
- ⚠️ **미출시 = 스토어 실링크 없음**. 나중에 출시되면 `status: 'live'` + ios/android 링크 추가만 하면 되는 구조로 설계(확장성 유지).
- ⚠️ **회사명 표기**: legal-site는 "에이아이소프트/박훈재/longpapa82@gmail.com" 사용 — 기존 랜딩 회사정보와 일치(확인됨).
- ⚠️ `status` 배지는 지금 없는 UI → 이번에 만들면 향후 beta 등에도 재사용 가능(투자 가치 있음).
- 실제 디자인은 소스 근거로 확인 완료(로그 13·15번 교훈 준수). 추가 스크린샷 있으면 우측 비주얼 정교화 가능.
