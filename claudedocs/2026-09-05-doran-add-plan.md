# 도란도란(Doran) 홍보 영역 추가 — 상세 계획

- **작성일**: 2026-09-05
- **브랜치**: feat/integrated-landing
- **트리거**: 신규 앱 "도란도란"(AI 친구 채팅) 통합 랜딩에 홍보 영역 추가
- **참조 구현(패턴 동일)**: Voice Buddy (`voicebuddy`) — `mascot` + `chatChips`(+`soundRings`) 우측 비주얼의 검증된 선례
- **소스(SoT)**: `/Users/hoonjaepark/projects/doran` — `app/app.json`, `claude.md`, `promo-web/`(라이브 배포됨)

---

## 0. 확정된 결정사항 (사용자 승인)

| 항목 | 결정 | 근거 |
|------|------|------|
| 우측 시그니처 비주얼 | **도란이 마스코트 + float 채팅 버블** (`mascot` + `chatChips`) | 캐릭터 친구 정체성 강조. Voice Buddy 검증 경로 재사용 → 컴포넌트 0줄 |
| 출시 상태 | **`coming_soon`** (둘 다 "준비 중") | doran-web 히어로가 "Google Play·App Store 준비 중 / Android 먼저 출시"로 표기 → 정직 정합. 실제 스토어 미출시 |
| 주 CTA | **웹사이트(doran-web)** — `coming_soon`에선 web이 유일한 실링크 주 CTA | `coming_soon`이면 스토어는 둘 다 비활성. `webIsLegal` 무의미(미설정) |

### 확정된 브랜드 사실 (소스 대조 완료)

| 항목 | 값 | 출처 |
|------|-----|------|
| 앱 이름 | **도란도란** (영문 처리: Doran) | app.json `name`, claude.md |
| id | `doran` | 신규 (기존 8개와 충돌 없음) |
| 번들 ID | `com.systemplanners.dorandoran` (iOS·Android 공통) | app.json |
| 시그니처 컬러 | 민트 **#14BBC2** / 민트다크 #00A3B4 / 민트틴트 #CAF1F2 | promo.css `--mint`, app.json theme-color, splash `#8FE3D8` |
| 보조 컬러 | 코랄 **#EFAC8D** / 피치 #FEE5DB | promo.css `--coral`, `--peach` |
| 폰트 | Pretendard Variable | promo.css `font-family` |
| 홍보 웹 | `https://longpapa82-cyber.github.io/doran-web/` (**HTTP 200 확인**) | curl 검증 완료 |
| 마스코트 | "도란이" | promo-web `#hero-dorani`, claude.md |
| 태그라인 | 오랜 친구처럼, 네 이야기를 들어줄게 | promo-web `<title>`, h1 |

---

## 1. 현재 상태 (AS-IS)

- `src/data/services.ts` — `SERVICES[]`에 **8개** 서비스(myTravel~FitSnap), 도란도란 **없음**
- `src/assets/services/` — 8개 아이콘, **doran-icon 없음**
- `src/assets/promo/` — 7개 서비스 promo 자산 폴더, **doran 폴더 없음**
- `index.html` — noscript 8개 블록 / JSON-LD `sameAs` / meta keywords·description 모두 도란 미포함

렌더 결과(현재): 도란도란은 어디에도 노출되지 않음.

---

## 2. 목표 상태 (TO-BE)

`SERVICES[]`에 `doran` 항목 **1개 추가**(order: 9). 데이터 주도 설계로 아래가 **자동** 반영:
- **ServiceShowcase**: 9번째 카드 자동 생성
- **PromoSection**: 도란 미니 홍보 섹션 자동 생성 (마스코트+채팅칩 우측 비주얼)
- **Hero PLATFORM_COUNT / Technology PLATFORMS / About**: `coming_soon`이라 `links.ios/android` 실링크 없음 → **플랫폼 수 미집계**(정직 지표, 총 2개 불변)
- **StoreBadges**: `comingSoon=true` → App Store "준비 중" + Google Play "준비 중" + 웹사이트(주 CTA)
- **PromoSection 헤더**: `COMING SOON` 배지 표시 (PromoSection.tsx:216)

SEO 폴백(수동): noscript 블록 1개 + JSON-LD·meta 갱신.

---

## 3. 변경 파일 & 세부 편집

### 3.1 자산 반입 (신규 파일 — **선행 필수**)

| 대상 | 소스 | 목적지 | 처리 |
|------|------|--------|------|
| 앱 아이콘 | `doran/promo-web/assets/icon.png` (1024²) 또는 `doran/icon&banners/01. icon/도란도란-아이콘-1024.png` | `src/assets/services/doran-icon.png` | 256px 최적화(다른 아이콘과 동일 관례) |
| 마스코트 | 도란이 투명배경 PNG | `src/assets/promo/doran/mascot.webp` | **⚠️ 추출 필요** — promo-web은 도란이를 CSS/canvas(`#hero-dorani`)로 그림. 평면 투명 PNG가 없으면 아이콘/스크린샷에서 캐릭터 크롭 or 대체 |

> **마스코트 자산 리스크(중요)**: 투명배경 도란이 단독 이미지가 소스에 없을 수 있음. 세 가지 대안:
> 1. `doran/app/assets/` 내 캐릭터 원본(투명 PNG) 탐색 → 있으면 그대로 반입
> 2. 스크린샷/피처그래픽에서 도란이 크롭 후 배경 제거
> 3. **폴백**: 마스코트 없이 `shot`(폰 목업 + `shot1.png` 위로채팅 스크린샷)으로 우측 비주얼 구성 → 이 경우 render는 `shot` 분기로 자동 전환(컴포넌트 무변경). 결정한 마스코트 방향을 못 맞추면 이 폴백 사용.

Voice Buddy 선례: 홍보웹 래스터가 배경 불투명이라 투명 SVG(`buddy-onbrand.svg`)를 별도 반입했음 → 동일 판단 기준 적용.

### 3.2 `src/data/services.ts` (핵심)

**(a) import 추가** (라인 13 아이콘 import 뒤, 라인 32 마스코트 import 뒤):
```ts
import doranIcon from '../assets/services/doran-icon.png';
// 도란도란: 도란이 마스코트(투명 배경) — 우측 히어로 일러스트(Voice Buddy 버디와 동일 취급).
import doranMascot from '../assets/promo/doran/mascot.webp';
```

**(b) `SERVICES[]` 말미(FitSnap 뒤, 라인 1031 `];` 앞)에 항목 추가**:
```ts
  {
    id: 'doran',
    name: '도란도란',
    tagline: '오랜 친구처럼, 네 이야기를 들어줄게',
    description:
      '오랜 친구처럼 나의 고민과 비밀을 들어주고 위로해주는 AI 친구 채팅 앱. 성별·나이·말투를 골라 나만의 친구를 만들고, 판단받지 않고 편하게 마음을 나눠보세요.',
    // 스토어 미출시(Android 먼저 출시 목표, 둘 다 준비 중) → coming_soon.
    // doran-web 히어로가 "Google Play·App Store 준비 중"으로 표기 → 정직 정합.
    // 번들 com.systemplanners.dorandoran(iOS·Android 공통). 출시 시 status:'live' +
    // links.ios/android 실링크 추가(curl 200+title 대조 검증 후). 그 전까지 플랫폼 카운터 미집계.
    status: 'coming_soon',
    moodLabel: 'Warm Mint Companion',
    emoji: '🫶',
    iconUrl: doranIcon,
    links: {
      web: 'https://longpapa82-cyber.github.io/doran-web/',
    },
    theme: {
      surface: '#ffffff',
      ink: '#282e38',
      inkSoft: '#6e7581',
      primary: '#14bbc2',   // 민트 (흰 글씨 대비 확인 필요 — 아래 3.5 접근성 참조)
      accent: '#efac8d',    // 코랄
      gradient: 'linear-gradient(135deg, #caf1f2 0%, #e9f9f9 55%, #fee5db 100%)',
      font: "'Pretendard Variable', 'Noto Sans KR', system-ui, sans-serif",
      onPrimary: '#ffffff',
    },
    features: [
      { icon: 'favorite', title: '판단하지 않는 대화', desc: '“그럴 수 있지”, “많이 속상했겠다.” 해결을 강요하지 않고 먼저 마음을 들어줘요.' },
      { icon: 'group', title: '내가 고르는 친구', desc: '성별·나이·말투를 골라 나에게 꼭 맞는 친구를 만들어요. 반말도, 존댓말도 좋아요.' },
      { icon: 'nights_stay', title: '기억해주는 친구', desc: '지난 이야기를 기억하고 이어가요. 대화가 쌓일수록 더 가까운 친구가 돼요.' },
    ],
    promo: {
      kicker: '오랜 친구 같은 AI 친구',
      headline: '오랜 친구처럼,\n',
      headlineAccent: '네 이야기를 들어줄게',
      subcopy:
        '고민도, 비밀도 편하게 털어놔요. 도란도란이 판단하지 않고 곁에서 다 들어줄게요. 성별·나이·말투를 골라 나만의 친구를 만들 수 있어요.',
      // 도란도란 web: 민트(#14BBC2) + 코랄(#EFAC8D) 따뜻한 라이트 톤. dark 미설정(밝은 무드).
      palette: {
        bg: '#fcfaf1',
        heroGradient:
          'linear-gradient(135deg, #b8ece6 0%, #d6f4f2 45%, #fce6da 100%)',
        surface: '#fdfcf6',
        primary: '#14bbc2',
        accent: '#efac8d',
        ink: '#282e38',
        inkSoft: '#6e7581',
        onPrimary: '#ffffff',
      },
      fontDisplay: "'Pretendard Variable', 'Noto Sans KR', system-ui, sans-serif",
      fontBody: "'Pretendard Variable', 'Noto Sans KR', system-ui, sans-serif",
      radius: 24,
      motif: 'none',
      // 도란이 마스코트(투명 배경) — 우측 비주얼 상단 원형 프레임(Voice Buddy 버디와 동일 취급).
      mascot: doranMascot,
      // 홍보 웹 시그니처: 마스코트 주변을 감싸며 떠다니는 대화 데모 칩(Voice Buddy chatChips 재현).
      // 실제 promo-web 채팅 버블 카피에서 발췌 — 경청 → 공감 흐름을 칩 도트 색으로.
      chatChips: [
        { text: '오늘 하루 어땠어?', tone: 'cyan' },
        { text: '많이 속상했겠다', tone: 'brand' },
        { text: '내가 있잖아 🫶', tone: 'coral' },
        { text: '천천히 다 얘기해', tone: 'green' },
      ],
      // 음성이 아닌 "마음이 퍼지는" 무드 — 마스코트 뒤 확산 링(선택, 2겹).
      soundRings: 2,
      highlights: [
        { value: '판단 없이', label: '들어주는 대화' },
        { value: '내가 고르는', label: '나만의 친구' },
        { value: '기억하는', label: '이어지는 대화' },
      ],
      // 우측 비주얼은 mascot(+chatChips)이 우선. 좌측 내러티브용 3단계도 제공.
      steps: [
        { no: '1', title: '친구 만들기', desc: '성별·나이·말투를 골라 나에게 꼭 맞는 친구를 만들어요.' },
        { no: '2', title: '마음 털어놓기', desc: '고민도 비밀도 편하게. 판단받지 않으니까 부담 없어요.' },
        { no: '3', title: '이어지는 대화', desc: '지난 이야기를 기억하고 이어가요. 쌓일수록 더 가까워져요.' },
      ],
      disclaimer:
        '도란도란은 의료·심리 상담을 대체하지 않으며, 도란이의 응답은 전문가의 조언을 대신하지 않습니다. 마음이 많이 힘들 땐 자살예방 상담전화 109 또는 119에 도움을 요청해 주세요.',
    },
    order: 9,
  },
```

> **팔레트 톤다운 원칙**: `theme`(통합 카드용)와 `promo.palette`(미니 홍보용)를 분리하는 기존 관례 유지. 도란은 둘 다 밝은 민트 톤이라 큰 차이는 없으나, 통합 카드가 다른 카드와 병렬 배치되므로 gradient만 살짝 톤다운.

### 3.3 `index.html` — noscript SEO 폴백 (FitSnap 블록 뒤, 라인 235 `<section>` 형식 동일)
```html
<section>
  <h2>도란도란 — 오랜 친구처럼, 네 이야기를 들어줄게</h2>
  <p>오랜 친구처럼 나의 고민과 비밀을 들어주고 위로해주는 AI 친구 채팅 앱. 성별·나이·말투를 골라 나만의 친구를 만들고, 판단받지 않고 편하게 마음을 나눠보세요. (출시 준비 중)</p>
  <ul>
    <li><a href="https://longpapa82-cyber.github.io/doran-web/">도란도란 웹사이트</a></li>
  </ul>
</section>
```
> 스토어 미출시라 App Store/Play `<li>` 없음. "(출시 준비 중)" 명시 = 정직 표기(FitSnap이 준비 중일 때 쓴 관례와 동일).

### 3.4 `index.html` — meta·JSON-LD 갱신
- **JSON-LD `sameAs`**: 스토어 URL이 없으므로 도란 URL 추가 **안 함**(sameAs는 공식 스토어/SNS용). 웹사이트만 있는 상태는 미추가가 관례. *(출시 후 스토어 URL 추가)*
- **meta description**(라인 9): 서비스 나열에 "도란도란(AI 친구 채팅)" 추가
- **meta keywords**(라인 13): "도란도란, 도란, AI 친구, 친구 채팅, AI 상담, 마음 위로" 추가
- **OG/Twitter description**(라인 44·58), **JSON-LD description**(라인 91): 서비스 나열에 도란도란 추가
> ⚠️ 드리프트 주의: services.ts의 name/tagline/description은 index.html noscript에 수동 복제(services.ts:280 주석). 위 카피는 services.ts와 동일 문구 유지.

### 3.5 접근성 검증 (필수)
- **민트 #14BBC2 위 흰 글씨** 대비: 약 **2.6:1** → WCAG AA(4.5:1) **미달** 우려.
  - 로픽이 동일 문제를 겪음(밝은 원색은 accent로만, primary는 진한 sky #0284c7). 도란도란도 동일 처리 권장:
    - **primary(버튼/CTA 배경) = 민트다크 #00A3B4** (대비 ~3.1:1 — 큰 버튼엔 통과, 작은 텍스트엔 재확인)
    - 또는 더 진한 #0090A0 계열로 조정해 4.5:1 확보
  - `accent`(포인트/장식)로만 밝은 #14BBC2 사용.
  - **실행 시 실제 대비 계산 후 확정**(로픽 주석 패턴대로 근거 주석 남김).

---

## 4. 변경하지 않는 것 (명시)
- `PromoSection.tsx` / `StoreBadges.tsx` / `ServiceShowcase` / `Hero`·`Technology`·`About` — **코드 수정 불필요**. 전부 데이터 기반 자동 반영(신규 서비스 확장성 설계의 이점)
- 기존 8개 서비스 데이터·자산 — 무변경
- `ServicePromo` 인터페이스 — **필드 추가 불필요**. `mascot`/`chatChips`/`soundRings`/`steps`/`highlights` 전부 기존 필드(Voice Buddy가 이미 사용)

---

## 5. 검증 계획

### 5.1 사전 검증 (실행 전)
```bash
# 홍보 웹 라이브 확인 (완료: 200)
curl -sSL -o /dev/null -w "%{http_code}" "https://longpapa82-cyber.github.io/doran-web/"
# 스토어 미출시 재확인 (Play/App Store 검색 — 없으면 coming_soon 유지)
```

### 5.2 타입/빌드
```bash
npx tsc --noEmit          # 타입 회귀 0 (신규 항목이 AppService 타입 충족)
npm run build             # 프로덕션 빌드 성공 (신규 asset import 해석)
```

### 5.3 시각 회귀 (Chrome/Playwright) — 로컬 `npm run dev`
- [ ] ServiceShowcase에 도란도란 **9번째 카드** 노출(민트 톤)
- [ ] PromoSection 도란 섹션 생성 + 헤더 `COMING SOON` 배지
- [ ] 우측 비주얼: 도란이 마스코트 원형 프레임 + float 채팅 칩 + 확산 링
      (마스코트 자산 실패 시 → `shot` 폰 목업으로 폴백됐는지 확인)
- [ ] StoreBadges: App Store "준비 중" + Google Play "준비 중" + 웹사이트(주 CTA, 실링크 새 탭)
- [ ] Hero/Technology/About 플랫폼 수 **2개 불변**(도란 미집계 확인)
- [ ] **접근성**: 민트 primary 위 텍스트 대비 4.5:1 확인(미달 시 #00A3B4로 조정)
- [ ] 브레이크포인트 320 / 768 / 1024 / 1440 오버플로 0

### 5.4 SEO 폴백
- [ ] noscript 도란 블록 노출, "(출시 준비 중)" 문구 포함, 웹사이트 링크 유효
- [ ] meta/OG/JSON-LD description·keywords에 도란도란 포함, JSON 파싱 유효

---

## 6. 실행 순서 (요약)

1. **[선행]** 자산 반입: doran-icon.png(256 최적화) + 도란이 마스코트 투명 PNG 탐색/추출
   - 마스코트 확보 실패 시 → `shot`(shot1.png) 폴백 방향 확정
2. `src/data/services.ts` — import 2줄 + `doran` 항목(order 9) 추가
3. **접근성**: 민트 대비 계산 → primary 확정(#14BBC2 or #00A3B4), 근거 주석
4. `index.html` — noscript 블록 + meta/OG/JSON-LD description·keywords 갱신
5. `tsc --noEmit` + `npm run build`
6. 로컬 시각 회귀(위 체크리스트, 특히 마스코트 렌더 + 대비)
7. 커밋: `feat(doran): 도란도란 AI 친구 채팅 홍보 영역 추가 — coming_soon(준비 중), 마스코트+채팅칩 비주얼`
8. 배포: `vercel deploy --prod --yes` (고정 도메인 aisoft-iota.vercel.app)
9. 라이브 재검증 + 메모리 진행 로그 업데이트(#81)

---

## 7. 리스크 & 완화

| 리스크 | 수준 | 완화 |
|--------|------|------|
| 투명배경 도란이 마스코트 자산 부재 | **중** | app/assets 탐색 → 크롭·배경제거 → 실패 시 `shot` 폰 목업 폴백(render 자동 전환) |
| 민트 #14BBC2 위 흰 글씨 대비 미달(~2.6:1) | **중** | primary를 #00A3B4/#0090A0로 조정, 밝은 민트는 accent로만(로픽 선례) |
| noscript/meta 카피 드리프트 | 낮음 | services.ts와 동일 문구 복제, 실행 시 대조 |
| coming_soon인데 플랫폼 카운터 증가 | 없음 | `links.ios/android` 미추가 → Set 미집계, 총 2개 불변 |
| 스토어가 이미 출시됐는데 준비 중 표기(과소 표기) | 낮음 | 실행 전 스토어 검색 재확인, 출시됐으면 live로 상향 |

---

## 8. 컴포넌트 로직 무변경 근거 (설계 검증)

이번 추가가 **데이터 1곳(+자산 2개, +SEO)** 만으로 완결되는 이유:
- `PromoSection`의 우측 비주얼 render는 우선순위 캐스케이드(`beforeAfter`→`analysisCard`→`shot`→`mascot`+chatChips→`steps`→`stars`→`gallery`)로, 도란은 **`mascot`+`chatChips` 분기(Voice Buddy 검증 경로)** 를 그대로 탐 → 신규 코드 0
- `StoreBadges`는 `comingSoon` 플래그로 "둘 다 준비 중 + web 주 CTA" 조합을 이미 처리
- `Hero/Technology/About` 플랫폼 카운터는 `SERVICES` 순회 + `links.ios/android` Set 집계 → 데이터만 바뀌면 자동
- CLAUDE.md 설계 원칙("신규 서비스가 추가될 수 있는 형태") = 9번째 서비스도 데이터 주도. 컴포넌트 회귀 표면 없음

---

## 9. 출시 후 후속 작업 (참고 — 이번 범위 아님)

도란도란 스토어 출시 시(Android 먼저):
1. `status: 'coming_soon'` → `'live'`
2. `links.android` 실링크 추가(+ iOS 준비 중이면 `androidPending` 개념 역방향은 미지원 → iOS도 나올 때까지는 android만) — curl 200+title 검증
3. `webIsLegal: true`로 스토어를 주 CTA(골드) 승격 검토
4. noscript에 스토어 `<li>` + JSON-LD `sameAs`에 스토어 URL 추가
5. 플랫폼 카운터 자동 집계(Set) — 총수 변화 여부 확인
> FitSnap iOS 오픈(2026-08-31, #80)이 정확히 이 후속 경로를 밟았음 — `2026-08-31-fitsnap-ios-open-plan.md` 참조.
