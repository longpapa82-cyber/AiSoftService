# AI Soft 랜딩 — 구글·네이버 검색 노출(SEO) 상세 계획

**목표**: `aisoft-iota.vercel.app`(또는 향후 커스텀 도메인)이 구글·네이버에서 "AI Soft", "myTravel", "myPet 앱", "내새끼 앱" 등으로 검색·노출되게 한다.

**현재 진단 (라이브 확인)**
| 항목 | 상태 |
|------|------|
| title / description / OG | ✅ 있음 (단, OG image가 파비콘이라 부적절) |
| robots.txt | ❌ 404 |
| sitemap.xml | ❌ 404 |
| canonical | ❌ 없음 |
| 구조화 데이터(JSON-LD) | ❌ 없음 |
| **봇이 보는 본문 텍스트** | ❌ **0** — SPA CSR, JS 실행 전 `<body>` 비어있음 |
| 검색엔진 등록 | ❌ 미등록 (구글 GSC·네이버 서치어드바이저) |

**핵심 난관**: React CSR이라 초기 HTML에 콘텐츠가 없다. 구글봇은 JS 렌더링하지만 **네이버봇(Yeti)은 JS 실행이 약해 본문을 거의 못 읽는다** → 네이버 노출의 최대 장애물.

---

## Phase 1 — 코드로 즉시 가능 (기술 SEO 기반) ⭐

내가 코드/파일로 처리. 1회 작업 후 재배포.

### 1.1 robots.txt (public/robots.txt)
- 모든 봇 허용 + sitemap 위치 명시. 네이버 Yeti·구글봇 명시 허용.

### 1.2 sitemap.xml (public/sitemap.xml)
- 단일 페이지(해시 앵커는 별도 URL 아님)라 메인 URL 1개 + lastmod. 향후 커스텀 도메인 시 갱신.

### 1.3 메타 보강 (index.html)
- `<link rel="canonical">` 추가 (중복 URL 정규화)
- `<meta name="robots" content="index,follow">`
- `<meta name="keywords">` (네이버는 일부 참고): AI Soft, myTravel, myPet, 내새끼, AI 앱, 여행 AI, 반려동물 앱, 셀럽 뉴스
- OG image를 **전용 1200×630 가로 이미지**로 교체 (현재 정사각 파비콘 → 잘림). + twitter:card summary_large_image
- `<meta name="author">`, og:url, og:site_name

### 1.4 구조화 데이터 JSON-LD (index.html `<script type="application/ld+json">`)
- **Organization** 스키마: AI Soft, 로고, 대표(founder 박훈재), 주소, 이메일, 서비스 3개를 sameAs/하위로
- **WebSite** 스키마: 사이트명·URL
- 검색결과에 회사 정보·로고 리치 결과 노출 유도

### 1.5 ★SPA 본문 문제 완화 — 정적 콘텐츠 주입
네이버봇이 읽을 수 있도록 초기 HTML에 핵심 텍스트를 심는다. 옵션(택1, Phase 결정에서):
- **(A) noscript 폴백**: `<noscript>`에 회사 소개·서비스 3개 핵심 카피·링크를 HTML로. 가장 가볍고 안전. JS 꺼진 봇이 최소 정보 획득.
- **(B) 정적 프리렌더**: vite 빌드 시 `index.html` `<div id="root">`에 핵심 섹션 HTML을 미리 박아넣기(빌드 스크립트 or vite-plugin-prerender). 봇이 완전한 본문을 봄. 작업 큼.
- **(C) SSR 전환**: Next.js 등으로 이전. 가장 확실하나 대규모 재작성 — 범위 밖 권장.

→ 권장: **A(noscript) 즉시 + 여유 시 B(프리렌더)**. C는 비추(과함).

---

## Phase 2 — 사용자가 직접 해야 함 (검색엔진 등록) 🔑

**이게 실제 검색 노출의 핵심**이고, 코드만으로는 안 된다. 계정·소유권 인증이 필요해 내가 대신 못 함. 단계별 안내 제공.

### 2.1 Google Search Console (구글)
1. https://search.google.com/search-console 접속 (구글 계정)
2. 속성 추가 → URL 접두어 → `https://aisoft-iota.vercel.app`
3. 소유권 인증: **HTML 메타태그 방식** 추천 → 받은 `<meta name="google-site-verification">`를 index.html에 추가(내가 코드로 넣어줌) → 재배포 → 확인
4. 사이트맵 제출: `sitemap.xml`
5. URL 검사 → 색인 요청

### 2.2 네이버 서치어드바이저 (네이버) — 네이버 노출 필수
1. https://searchadvisor.naver.com 접속 (네이버 계정)
2. 웹마스터 도구 → 사이트 등록 → `https://aisoft-iota.vercel.app`
3. 소유권 확인: **HTML 태그** 방식 → 받은 `<meta name="naver-site-verification">`를 index.html에 추가(내가 코드로) → 재배포 → 확인
4. 요청 → 사이트맵 제출 / RSS 없음
5. 수집 요청(URL) + "웹페이지 수집" 진단으로 본문 인식 확인

### 2.3 (선택) Bing Webmaster — 다음/Bing 일부 커버

---

## Phase 3 — 콘텐츠·신뢰도 (지속) 📈

검색 순위는 등록만으로 안 되고 콘텐츠·신뢰 신호가 쌓여야 함.

- 3.1 **본문 텍스트 풍부화**: 현재 카피가 짧음. 회사 소개·각 서비스 설명을 검색 키워드 포함해 보강(과장 금지 — 기존 표시광고 정책 유지).
- 3.2 **외부 링크(백링크)**: 각 앱스토어·서비스 사이트에서 이 랜딩으로 역링크. 보도자료·블로그.
- 3.3 **커스텀 도메인**: `aisoft-iota.vercel.app`보다 `aisoft.co.kr` 류가 신뢰·기억·검색에 유리. (vercel domains add + DNS)
- 3.4 **페이지 속도(Core Web Vitals)**: 이미 가벼움(JS 63KB gzip). LCP 양호. 유지.
- 3.5 **정기 색인 점검**: GSC·서치어드바이저에서 색인 상태·검색어·클릭 모니터링.

---

## 작업 분담 요약

| 누가 | 무엇 |
|------|------|
| **나(코드)** | Phase 1 전부(robots/sitemap/메타/JSON-LD/noscript) + Phase 2의 인증 메타태그 삽입 + 재배포 |
| **사용자(직접)** | Phase 2 검색엔진 등록(구글·네이버 계정 로그인, 소유권 인증 클릭, 사이트맵 제출) — 내가 단계별 안내 |
| **선택/지속** | Phase 3 콘텐츠·백링크·커스텀 도메인 |

## 현실적 기대치
- 등록 후 구글 **수일~2주**, 네이버 **2~4주+** 색인 시작(네이버가 느리고 까다로움).
- "AI Soft"처럼 고유명은 비교적 빨리, 일반 키워드("AI 여행 앱")는 경쟁이라 오래 걸림.
- noscript만으로 네이버 본문 인식이 부족하면 Phase 1.5(B) 프리렌더로 강화.

## 범위 밖
- SSR 전면 전환(Next.js) — 과함, 별도 결정 시.
- 유료 광고(검색광고/파워링크) — SEO 아닌 SEM, 별도.
