# 로픽(LawPic) 에이아이소프트 홍보 페이지 추가 — 상세 계획

> 작성: 2026-07-19 · 브랜치 `feat/integrated-landing` · 6번째 서비스 추가
> 패턴: AI Music Studio(40번)·myToday(32번) 신규 서비스 추가와 동일 "데이터 주도" 방식

---

## 1. 배경 — 로픽은 어떤 앱인가 (검증된 사실)

| 항목 | 값 | 근거 |
|------|-----|------|
| 앱 이름 | **로픽 (LawPic)** | `lawPic/app.json` name="로픽", slug="lawpic" |
| 정체 | 계약서·협약서를 **사진 촬영 → AI가 어려운 법률 내용을 쉽게 설명 + 놓치기 쉬운 조항·꼭 확인할 부분 알림** + AI 법률 챗봇 | `lawPic/claude.md` 핵심 서비스 1)·2) |
| 번들 ID | `com.joyfulday.lawpic` | `app.json` ios/android |
| 스택 | Expo(React Native) + Supabase, Quicksand+Jua 폰트 | package.json |
| 출시 상태 | ⚠️ **iOS/Android 모두 스토어 미출시** (Android 우선, 비공개 테스트 단계, 정식 출시 전 변호사 법무검토 예정) | docs/14, docs/10 |
| 홍보 랜딩 | **https://lawpic-promo.vercel.app/ — 라이브(HTTP 200)** | 2026-07-19 curl 검증, `<title>로픽 — 계약서, 사진 한 장이면 됩니다` 대조 확인 |
| 수익모델 | In-App 구독(3일 무료체험) | docs/20 |

### 브랜드 아이덴티티 (lawPic/src/constants/colors.ts에서 추출)
- **컨셉**: 밝고 부드러운 ethereal(글래스모피즘) · 신뢰감 있는 법률 무드 · 친근한 **부엉이 마스코트**
- **팔레트**: 스카이 블루 primary `#0284c7`(WCAG AA 충족, 목업 원색 #38bdf8은 대비 미달이라 진한 버전 사용)
  - primaryContainer `#e0f2fe`, 밝은 하늘 틴트 `#38bdf8`
  - accentGreen(검증/안전) 계열, accentAmber(주의/경고), error `#dc2626`(위험 조항)
  - 배경: 밝은 슬레이트 화이트 `#f8fafc` (라이트 톤 — 다크 아님)
- **폰트**: Quicksand(본문) + Jua(디스플레이/헤드라인)
- **라운드**: 큰 라운드(2rem 기본, 글래스모피즘)

---

## 2. 사용자 결정 사항 (AskUserQuestion 2026-07-19)

| 질문 | 결정 | 반영 |
|------|------|------|
| 출시 상태 | **준비 중 (coming_soon)** | `status: 'coming_soon'` |
| 웹 링크 | 배포 후 URL 확정되면 연결 → **배포 완료 확인됨** | `web: 'https://lawpic-promo.vercel.app/'` (라이브 검증됨) |
| 우측 비주얼 | **부엉이 마스코트 + 3단계 스텝** | `promo.mascot` + `promo.steps` (myToday 패턴) |

> ⚠️ **웹 링크 재확정**: 질문 시점엔 404였으나, 사용자가 "배포됨" 통보 → curl 200 + title 대조로
> 라이브 확인. 따라서 web 링크를 **연결**한다. `webIsLegal`은 설정하지 않음(스토어 미출시라
> 설치 우선순위가 없음 → web '자세히 보기'가 자연스러운 주 CTA. AI Music 최초 추가 40번과 동일 상태).

---

## 3. 정직성·법적 리스크 게이트 (🔴 CRITICAL)

로픽은 **법률 도메인**이라 표시광고법·변호사법 리스크가 가장 크다. 41번 작업(사실성 감사)의 원칙을 준수한다.

1. **스토어 미출시 정직 반영**: `status='coming_soon'` → 두 스토어 모두 "준비 중" 배지.
   `links.ios/android` 미설정 → `PLATFORM_COUNT`(Hero)·`PLATFORMS`(Technology) 집계에서 제외.
   즉 로픽 추가로 "출시 플랫폼 수"가 허위로 부풀지 않는다. web만 집계에 반영(라이브 사실).
2. **변호사법 고지(필수)**: `promo.disclaimer`에 "AI 설명·분석은 일반 정보 제공/참고용이며,
   변호사의 법률 자문이나 법률 행위를 대체하지 않습니다"를 주장 카피와 근접 배치.
   (myPet "수의학적 진단 비대체" 선례와 동일 원칙. promo-web도 "허위/법위배 카피 수정" 커밋 이력 있음)
3. **과장 금지**: "정확한 법률 판단", "완벽한 계약 검토" 등 단정 표현 배제.
   "쉽게 설명", "놓치기 쉬운 조항을 짚어줌" 등 promo-web 실제 카피 톤 준수.
4. **무료체험 수치**: highlights에 "3일 무료체험"은 실증(스토어 콘솔 Introductory Offer 3일 정합)이라 표기 가능.

---

## 4. 구현 — 수정 파일 (컴포넌트 코드 0줄 목표)

### 4-1. 신규 자산 반입 (2종)
| 대상 | 원본 | 변환 | 목적지 |
|------|------|------|--------|
| 앱 아이콘 | `lawPic/assets/icon-ios.png` (1024px) 또는 `icon&Banners/01. icon/ico_lawPic2_tight.png` | `cwebp`/png 256px 최적화 | `src/assets/services/lawpic-icon.png` |
| 부엉이 마스코트 | `lawPic/promo-web/public/mascot.png` (1024px 투명 RGBA) | WebP 변환(투명 유지, ~640px) | `src/assets/promo/lawpic/mascot.webp` |

> myToday 마스코트(투명 배경)와 동일 취급 — `promo.mascot`이 우측 상단 원형 프레임에 배치됨.
> cwebp 위치: `/opt/homebrew/bin/cwebp` (magick/convert 없음). 투명 PNG는 `cwebp -q 82 -resize 640 0`.

### 4-2. `src/data/services.ts` — SERVICES[]에 6번째 항목 추가 (핵심)
```ts
// import 추가
import lawpicIcon from '../assets/services/lawpic-icon.png';
import lawpicMascot from '../assets/promo/lawpic/mascot.webp';

// SERVICES[] 배열 끝에 추가 (order: 6)
{
  id: 'lawpic',
  name: '로픽',
  tagline: '계약서, 사진 한 장이면 됩니다',
  description:
    '계약서·협약서를 사진으로 찍으면 로픽 AI가 어려운 법률 내용을 쉽게 풀어주고, ' +
    '놓치기 쉬운 조항과 꼭 확인해야 할 부분을 짚어드립니다. 궁금한 점은 AI 법률 챗봇에게 바로 물어보세요.',
  status: 'coming_soon',          // ⚠️ 스토어 미출시 — 정직 반영
  moodLabel: 'Ethereal Sky Trust',
  emoji: '⚖️',
  iconUrl: lawpicIcon,
  links: {
    web: 'https://lawpic-promo.vercel.app/',   // 라이브 검증됨(200)
    // ios/android 미설정 → coming_soon 배지, 플랫폼 집계 제외
  },
  theme: {
    surface: '#ffffff',
    ink: '#0f172a',
    inkSoft: '#475569',
    primary: '#0284c7',           // sky-600 (AA 충족)
    accent: '#38bdf8',            // ethereal 하늘 틴트
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 55%, #f8fafc 100%)',
    font: "'Quicksand', 'Noto Sans KR', system-ui, sans-serif",
    onPrimary: '#ffffff',
  },
  features: [
    { icon: 'photo_camera', title: '사진으로 계약서 분석', desc: '계약서·협약서를 찍으면 AI가 쉬운 말로 풀어 설명' },
    { icon: 'gavel',        title: '핵심 조항 체크',       desc: '놓치기 쉬운 조항과 꼭 확인할 부분을 짚어줌' },
    { icon: 'forum',        title: 'AI 법률 챗봇',         desc: '궁금한 법률 질문을 실시간으로 물어보기' },
  ],
  promo: {
    kicker: 'AI 법률 도우미',
    headline: '어려운 계약서,\n',
    headlineAccent: '사진 한 장이면 됩니다',
    subcopy:
      '계약서·협약서를 사진으로 찍기만 하면, 로픽 AI가 어려운 법률 내용을 쉽게 풀어주고 ' +
      '놓치기 쉬운 조항을 짚어드려요. 궁금한 점은 AI 법률 챗봇에게 바로 물어보세요.',
    // ethereal 스카이 블루 (라이트 럭셔리 — dark 미설정)
    palette: {
      bg: '#f0f9ff',
      heroGradient: 'linear-gradient(150deg, #7dd3fc 0%, #38bdf8 45%, #0284c7 100%)',
      surface: '#ffffff',
      primary: '#0284c7',
      accent: '#38bdf8',
      ink: '#0f172a',
      inkSoft: '#475569',
      onPrimary: '#ffffff',
    },
    fontDisplay: "'Jua', 'Quicksand', 'Noto Sans KR', system-ui, sans-serif",
    fontBody: "'Quicksand', 'Noto Sans KR', system-ui, sans-serif",
    radius: 28,
    motif: 'none',
    mascot: lawpicMascot,          // 부엉이 마스코트 — 우측 상단 원형 프레임
    highlights: [
      { value: '사진 한 장', label: '계약서 분석' },
      { value: 'AI 챗봇', label: '법률 질문' },
      { value: '3일', label: '무료 체험' },
    ],
    steps: [                        // 부엉이 아래 3단계 (myToday 패턴)
      { no: '1', title: '계약서 촬영', desc: '계약서나 협약서를 사진으로 찍어 올려주세요. 여러 장도 한 번에 가능해요.' },
      { no: '2', title: 'AI 분석',    desc: '로픽 AI가 어려운 법률 내용을 쉬운 말로 풀어주고, 꼭 확인할 조항을 짚어줘요.' },
      { no: '3', title: '궁금증 해결', desc: '추가로 궁금한 점은 AI 법률 챗봇에게 실시간으로 물어보세요.' },
    ],
    disclaimer:
      '로픽의 AI 설명·분석은 일반적인 정보 제공과 참고를 위한 것으로, 변호사의 법률 자문이나 ' +
      '법률 판단을 대체하지 않습니다. 중요한 법적 결정은 반드시 전문가와 상담하세요.',
  },
  order: 6,
},
```

### 4-3. `src/lib/icons.ts` — 신규 Material Symbols 아이콘 3종 이모지 매핑
```ts
photo_camera: '📷',
gavel: '⚖️',
forum: '💬',
```

### 4-4. `index.html` — SEO 이중 반영 (드리프트 주의 6곳)
services.ts의 name/tagline/description은 index.html noscript에 수동 복제됨(주석 경고 있음).
1. `<meta name="description">` — 서비스 나열에 "로픽(AI 법률 계약서 분석)" 추가
2. `<meta name="keywords">` — "로픽, LawPic, AI 법률, 계약서 분석, 법률 챗봇" 추가
3. og:description / twitter:description — "myTravel, myPet, 내새끼, myToday, AI Music Studio, 로픽" 6개로
4. JSON-LD `description` — 6개 서비스로 갱신
5. JSON-LD `sameAs[]` — `https://lawpic-promo.vercel.app/` 추가
6. `<noscript>` — 로픽 `<h2>` + 설명 + 웹사이트 `<li>` 블록 추가

---

## 5. 자동 반영(수정 불필요) 컴포넌트 — 검증만

| 컴포넌트 | 자동 반영 내용 | 검증 포인트 |
|----------|---------------|------------|
| `Hero.tsx` | SERVICE_COUNT 5→6, PLATFORM_COUNT 불변(로픽 ios/android 없음, web은 이미 집계됨) | 서비스 수 6, 플랫폼 수 변화 없음 |
| `Technology.tsx` | SERVICE_COUNT 5→6 | "6개 서비스" 문구 |
| `PromoSection.tsx` | coming_soon 배지 분기(160행) + mascot 렌더(220행) + steps(252/270행) 이미 존재 | 부엉이+3스텝+"준비 중" 배지 |
| `StoreBadges.tsx` | comingSoon=true → [준비 중][준비 중][웹사이트] | web CTA만 활성 |
| `Footer.tsx` | 서비스 목록에 로픽 자동 추가 | 링크 목록 |

---

## 6. 검증 계획 (빌드 → 정적 → 실렌더)

1. **빌드 그린**: `npm run build` — TS 에러 0, 번들 예산 유지(랜딩 JS<150KB gzip 등)
2. **정적 HTML(index.html)**: `dist/index.html`에 로픽 6곳 반영 확인.
   ⚠️ Technology 배너·subcopy·PromoSection은 React 렌더라 정적 curl에 안 잡힘 →
   JS 번들 grep(한글은 `LC_ALL=en_US.UTF-8`), 육안은 Playwright 실렌더로.
3. **실렌더(Playwright)**: 로컬 preview(4173) + 프로덕션(aisoft-iota.vercel.app) 둘 다.
   - 데스크톱 1440 / 모바일 390 스크린샷
   - 로픽 카드·부엉이 마스코트·3스텝·"준비 중" 배지·스카이 블루 테마 육안 확인
   - web '자세히 보기' href = lawpic-promo.vercel.app 정확 대조
   - 기존 5서비스 회귀 0 확인
   - Playwright는 로컬 미설치 → npx 캐시 require .cjs 사용
     (`/Users/hoonjaepark/.npm/_npx/e41f203b7505f1fb/node_modules/playwright`)
4. **로픽 web 링크 라이브**: curl 200 + title "로픽 — 계약서…" 재확인

---

## 7. 배포·커밋

1. `vercel deploy --prod --yes` (고정 도메인 aisoft-iota.vercel.app)
2. 프로덕션 실사이트에서 로픽 노출 재검증(로컬반영≠프로덕션 — 42번 교훈)
3. 커밋: 소스 파일만(services.ts, icons.ts, index.html, 신규 자산). docs/.bkit·.pdca 제외.
   메시지: `feat(lawpic): 로픽 6번째 서비스 추가 — AI 법률 계약서 분석·부엉이 마스코트·출시 준비중`

---

## 8. 코드 밖 잔여(사용자 몫)
- 로픽 스토어 출시 시 → services.ts `status: 'coming_soon'→'live'` + `links.ios/android` 추가
  (또는 혼합 출시면 `androidPending` 플래그 — myToday/AI Music 패턴)
- "3일 무료체험" 수치 실증자료 사내 보관(표시광고법 제5조)
- 로픽 실제 앱 스크린샷 확보 시 → `promo.shot`으로 폰목업 추가 가능(현재는 마스코트+스텝)

---

## 부록: 리스크·완화

| 리스크 | 완화 |
|--------|------|
| 법률 도메인 과장 카피(변호사법) | disclaimer 근접 배치 + 단정 표현 배제 + promo-web 실제 톤 준수 |
| 스토어 미출시인데 출시된 것처럼 오인 | coming_soon + ios/android 링크 미설정으로 플랫폼 집계 제외 |
| web 링크 죽은 상태 노출 | curl 200 + title 대조로 라이브 선검증 완료 |
| 부엉이 마스코트 투명 배경 깨짐 | WebP 변환 시 투명(RGBA) 유지, 원형 프레임 배경과 대비 확인 |
| index.html ↔ services.ts 드리프트 | 두 곳 동시 수정(주석 경고 준수), 정적+실렌더 이중 검증 |
