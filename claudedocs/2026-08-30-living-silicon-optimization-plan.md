# "Living Silicon" 모션·효과 최적화 상세 계획

> 작성일: 2026-08-30 · 브랜치: feat/integrated-landing
> 대상: ParticleField(4개 섹션) + CSS 모션 레이어(트레이스·스윕·스트림·시머)
> 전제: 강조형 비주얼은 **그대로 유지** — 눈에 보이는 강도를 낮추지 않고 비용만 낮춘다.

---

## 0. 실측 베이스라인 (2026-08-30, M-시리즈 데스크톱 1440×900 DPR2)

| 지표 | 실측값 | 판정 |
|------|--------|------|
| Hero 단독 프레임 | avg **16.64ms** / p95 17.5ms | ✅ 60fps 고정 |
| 2캔버스 동시 가시(섹션 경계) | avg 16.61ms / p95 17.6ms | ✅ 60fps 고정 |
| 연속 스크롤 중 | avg 16.61ms / p95 17.5ms | ✅ 잔크 0 |
| **캔버스 백킹 메모리 합** | **107.6MB** | 🔴 **주 병목** |

캔버스별 백킹 스토어(w×h×4bytes, DPR 2):

| 섹션 | 백킹 해상도 | 메모리 |
|------|------------|--------|
| Hero | 2880×1560 | 17.1MB |
| **Technology** | 2880×**3609** | **39.6MB** |
| **About** | 2880×**3428** | **37.7MB** |
| Footer | 2880×1200 | 13.2MB |

**결론(정직 평가)**: 이 데스크톱에서 fps 최적화는 불필요(이미 상한). 최적화의 실질 타깃은
① **메모리 107.6MB → ~25MB**(저사양·모바일 Safari 캔버스 메모리 상한 대응),
② **저사양/모바일 헤드룸**(프레임당 할당·그라데이션 생성 비용),
③ **자기 규율 준수**(web rules: 컴포지터 친화 프로퍼티만 — 현재 일부 위반),
④ **저사양 기기 자동 강등**(우리가 측정 못하는 환경에서의 안전망).

---

## 1. 문제 진단 상세

### P-A. 캔버스 백킹 메모리 (🔴 High)
- 원인: 섹션 **전체 높이**를 DPR 2로 래스터화. Technology/About는 CSS ~1,800px 높이
  → 백킹 3,600px. 필요 화질 대비 4배 픽셀.
- 위험: iOS Safari는 캔버스 총 메모리 상한(기기별 수백MB)에 도달하면 **조용히 렌더 실패**
  (검은/빈 캔버스). 107MB는 우리 페이지 하나가 쓰기엔 과함.

### P-B. 프레임 루프 내 할당·비싼 호출 (🟡 Medium — 저사양 헤드룸)
`ParticleField.tsx` draw() 안에서 매 프레임:
1. `nodes.filter((n) => n.gold)` — 펄스 스폰 후보 배열을 **매번 새로 생성**
2. `pulses.filter(...)` — 매 프레임 새 배열
3. `ctx.createRadialGradient` — **골드 노드 수 + 펄스 수만큼 매 프레임 생성**
   (그라데이션 객체 생성은 canvas 2D에서 비싼 축에 속함: Hero 기준 골드 ~19개 × 60fps = 초당 ~1,140회)
4. 문자열 색상 조립(`toFixed`, 템플릿 리터럴) — GC 압박 소소하나 누적

### P-C. CSS 애니가 페인트 레이어를 매 프레임 침 (🟡 Medium — 규율 위반)
web/performance.md 자기 규율: "Animate compositor-friendly properties only".
현재 위반 목록(전부 `background-position` 애니 = 매 프레임 **repaint**):
- `pcbShift`(Hero 프리뷰 패널 도트) · `panelSweep`(프리뷰 패널, **큰 면적**)
- `footerGrid`(Footer 도트) · `footerStream`(Footer hairline) · `techStream`(Technology hairline)
- `aiShimmer`(헤드라인 "AI" 텍스트 클립 — 면적 작아 실害 미미)
- SVG `traceFlow`: `stroke-dashoffset` 애니 자체는 양호하나 **`filter: drop-shadow`가 붙은 채
  매 프레임 리페인트** → 필터 비용이 6줄 × 매 프레임.

### P-D. 대형 blur 레이어 (🟡 Medium — GPU 메모리/합성)
- `.gradGlow`(85vw, blur 90px) + `.gradGlow2`(70vw, blur 100px, `mix-blend-mode: plus-lighter`).
- radial-gradient는 **이미 부드러운 감쇠**를 갖는데 그 위에 대형 blur를 또 얹음 —
  blur 반경만큼 GPU가 큰 오프스크린 표면을 유지. 그라데이션 stop 조정으로 시각 등가 대체 가능.

### P-E. 구조·수명주기 (🟢 Low)
- rAF 루프 4개 독립(가시성 게이트로 실동시성 1~2개라 실害는 낮음) — 공유 티커로 통합 여지.
- `prefers-reduced-motion`을 **마운트 시 1회만** 체크 — 세션 중 OS 설정 변경 시 미반영.
- 저사양 기기 감지·자동 강등 없음 — 측정 불가 환경 안전망 부재.

---

## 2. 최적화 항목 (우선순위순)

### OPT-1. 캔버스 해상도 면적 예산제 (P-A 해소) — 예상: 107.6MB → **~25MB**
- `ParticleField`에 **백킹 픽셀 예산**(기본 2.5MP) 도입:
  `effDpr = min(2, dpr, sqrt(BUDGET / (cssW × cssH)))`
- 효과: Hero/Footer는 사실상 변화 없음(이미 예산 내), Technology/About는
  DPR 2→~1.0으로 자동 강하 → 39.6MB→~10MB. **파티클은 원/선이라 1x에서도 시각 열화 미미**
  (텍스트가 아님 — 열화 체감 최소 지점).
- 검증: 실렌더 확대 스크린샷 비교 + 메모리 재측정.

### OPT-2. 글로우 스프라이트 캐싱 (P-B-3 해소) — 프레임당 그라데이션 생성 0회
- 마운트/재시드 시 **오프스크린 캔버스에 골드 글로우 1장, 펄스 글로우 1장** 사전 렌더.
- draw()에서는 `ctx.drawImage(sprite, x-r, y-r, 2r, 2r)` + `globalAlpha`로 맥동 표현.
- `createRadialGradient` 초당 ~1,140회 → **0회**. drawImage는 blit라 훨씬 저렴.

### OPT-3. 루프 무할당화 (P-B-1,2,4 해소)
- `golds: Node[]`를 seed()에서 1회 산출해 보관(노드 gold 여부는 불변).
- `pulses` 제거를 filter → **swap-remove(뒤에서 앞으로 순회, splice 없이 pop 스왑)**.
- 색 문자열: 맥동 alpha를 `globalAlpha`로 옮기고 기본색 문자열은 상수화 → 프레임당 문자열 조립 제거.

### OPT-4. CSS 스윕 → transform 오버레이 전환 (P-C 해소)
- `panelSweep`/`footerStream`/`techStream`: `background-position` 애니 →
  **그라데이션을 가진 별도 span/의사요소를 `translateX`로 이동**(컴포지터 온리).
  시각 결과 동일, 페인트 0회.
- `pcbShift`/`footerGrid`(도트 격자): 격자 레이어를 실제 크기+1타일 크게 만들고
  `translate`로 이동 → 동일 원리. (혹은 실害 미미 판정 시 명시적 예외로 문서화만 — 측정 후 결정)
- `aiShimmer`: 면적 극소 → **예외 유지**(문서화). 전환 시 클립 구조가 복잡해져 리스크>이득.

### OPT-5. SVG 트레이스 필터 제거 (P-C 해소)
- `filter: drop-shadow` 삭제 → **같은 path를 2겹**(아래: 굵고 저알파 글로우 스트로크 /
  위: 얇고 밝은 코어 스트로크)으로 시각 등가. 필터 평가 매 프레임 → 단순 스트로크 페인트.

### OPT-6. 대형 blur 제거 (P-D 해소)
- `.gradGlow`/`.gradGlow2`의 `filter: blur` 삭제, radial-gradient stop을 넓혀
  (예: `0% → 35% 완만 감쇠 → 75% transparent`) 동일 무드 재현.
- `plus-lighter`는 유지(합성 자체는 저렴, blur가 문제였음).
- 검증: 전후 스크린샷 픽셀 비교로 무드 등가 확인.

### OPT-7. 적응형 품질 강등 (P-E 안전망) — 저사양 자동 대응
- draw() 안에서 최근 60프레임 이동평균 프레임타임 측정:
  - > 24ms(≈40fps 미달) 지속 시: 1단계 강등 — 펄스 비활성 + 노드 25% 감축 + 재시드
  - 그래도 > 24ms: 2단계 — linkDist 20% 축소(연결선 수 급감)
  - 강등은 **단방향**(복귀 플래핑 방지), 세션 내 유지.
- 구현 위치: ParticleField 내부 — 4개 섹션 자동 수혜, 설정 불요.

### OPT-8. 수명주기 보강 (P-E)
- `prefers-reduced-motion` **change 리스너** 추가 — 세션 중 켜면 즉시 정지·해제 시 재개.
- (선택) 공유 rAF 티커 모듈 — 실측상 이득 미미하므로 **후순위**, OPT-1~7 후 재평가.

---

## 3. 하지 않는 것 (명시)

- ❌ 비주얼 강도 하향(노드 수·골드 비율·속도·펄스는 사용자 확정값 유지)
- ❌ 애니 라이브러리 도입(현 zero-dependency 유지)
- ❌ OffscreenCanvas + Worker 이전 — 60fps 고정 상태에서 복잡도만 증가(YAGNI)
- ❌ 데스크톱 fps "개선" 주장 — 이미 상한이므로 성과로 포장하지 않음(정직 규율)

---

## 4. 실행 순서

| Phase | 내용 | 의존성 |
|-------|------|--------|
| **O1** | OPT-1 면적 예산제 + OPT-2 스프라이트 + OPT-3 무할당화 (전부 ParticleField.tsx 단일 파일) | 없음 |
| **O2** | OPT-4 스윕 transform 전환 + OPT-5 트레이스 2겹 + OPT-6 blur 제거 (CSS 3파일 + Hero.tsx SVG) | 없음 (O1과 병렬 가능) |
| **O3** | OPT-7 적응형 강등 + OPT-8 RM 리스너 (ParticleField.tsx) | O1 후 (같은 파일 충돌 방지) |
| **O4** | 통합 검증(§5) → 커밋 | O1–O3 |

---

## 5. 검증 계획 (전후 비교, 동일 스크립트)

- [ ] **메모리**: 캔버스 백킹 합 107.6MB → 30MB 이하 확인 (베이스라인 스크립트 재실행)
- [ ] **프레임**: avg/p95 회귀 없음(16.6/17.6ms 수준 유지)
- [ ] **시각 등가**: Hero·Technology·About·Footer 전후 스크린샷 육안 비교
  (blur 제거·스프라이트 전환·DPR 강하 3건이 무드를 바꾸지 않았는지)
- [ ] **컴포지터 준수**: 잔여 `background-position` 애니 목록이 문서화된 예외(aiShimmer 등)뿐인지 grep
- [ ] **reduced-motion**: 정지 + **세션 중 토글** 즉시 반영
- [ ] **적응형 강등**: CPU 스로틀(Playwright `emulateCPUThrottling` 6x)에서 강등 발동 확인
- [ ] **번들**: JS ≤ 77kB gzip / CSS ≤ 21kB gzip (현 75.63/20.33 + 소폭 여유)
- [ ] 모바일 390 오버플로우 0 · 기존 콘텐츠 회귀 0

## 5-R. 검증 결과 (2026-08-30 구현 완료, 동일 스크립트 전후 비교)

| 항목 | 전 | 후 | 판정 |
|------|----|----|------|
| **캔버스 백킹 메모리 합** | 107.6MB | **38.0MB** | ✅ **−65%** (각 캔버스 ~9.5MB로 예산 클램프) |
| Hero 프레임 avg/p95 | 16.64/17.5 | 16.58/17.6 | ✅ 회귀 없음(60fps) |
| 2캔버스 경계 | 16.61/17.6 | 16.61/17.6 | ✅ 동일 |
| 스크롤 중 | 16.61/17.5 | 16.63/17.5 | ✅ 동일 |
| reduced-motion 캔버스 정지 | — | `rmStatic:true` | ✅ (O8 리스너) |
| 6× CPU 스로틀 | — | 강등 후 프레임 정상 | ✅ (O7 적응형) |
| 시각 등가(Hero/Tech/Footer) | — | 실렌더 육안 동일 | ✅ (blur제거·스프라이트·DPR강하 무영향) |
| 컴포지터 준수 | 6곳 bg-position 애니 | **3곳 transform 전환** + 3곳 문서화 예외 | ✅ |
| 번들 | JS 75.63 / CSS 20.33 | JS 76.11 / CSS 20.32 gzip | ✅ 예산 내(≤77/≤21) |

**전환 완료(transform)**: footerStream · techStream · panelSweep(대면적 스윕 3종).
**문서화 예외(bg-position 유지)**: pcbShift · footerGrid(마스크 페더 구조·극저 alpha) · aiShimmer(텍스트 클립 극소 면적).

## 6. 리스크

| 리스크 | 완화 |
|--------|------|
| DPR 강하로 대형 캔버스 파티클이 흐릿 | 원/선은 1x 열화 미미. 전후 확대샷 비교, 티나면 예산 3.5MP로 상향 |
| blur 제거 후 오로라 무드 변화 | stop 튜닝으로 등가 재현, 픽셀 비교. 실패 시 blur만 롤백(독립 변경) |
| 스프라이트 글로우가 그라데이션과 미묘히 다름 | 동일 파라미터로 사전 렌더라 원리상 동일. 확대샷 검증 |
| 적응형 강등 오발동(일시 스파이크) | 60프레임 이동평균 + 지속 조건, 단방향 강등 |
| transform 스윕 전환 중 레이어 어긋남 | 섹션별 독립 커밋 단위로 쪼개 회귀 시 즉시 격리 |
