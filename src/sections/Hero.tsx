import type { CSSProperties } from 'react';
import { COMPANY } from '../data/company';
import { SERVICES_SORTED } from '../data/services';
import { Button } from '../components/ui/Button';
import { useReveal } from '../hooks/useReveal';
import { useCountUp } from '../hooks/useCountUp';
import { usePointerParallax } from '../hooks/usePointerParallax';
import styles from './Hero.module.css';

// Hero 다음 첫 콘텐츠 섹션(첫 미니 홍보)의 앵커 — 둘러보기/스크롤 타겟.
const FIRST_PROMO = SERVICES_SORTED.find((s) => s.promo);

// 미니 스탯 칩 — services.ts에서 도출한 "근거 있는 값"만 사용(허위 수치 금지).
const SERVICE_COUNT = SERVICES_SORTED.length;
const PLATFORM_COUNT = (() => {
  const set = new Set<string>();
  for (const s of SERVICES_SORTED) {
    if (s.links.ios) set.add('iOS');
    if (s.links.android) set.add('Android');
    if (s.links.web) set.add('Web');
  }
  return set.size;
})();

// 히어로 HUD의 XP 목표치 — 진입 시 0부터 이 값까지 롤업된다.
const HERO_XP = 9999;
// 다음 레벨까지 필요한 총 경험치(게이지 100% 기준). 바 채움 비율 산출용.
const HERO_XP_NEXT = 10000;

/**
 * 배경 부유 XP 오브 — 골드/파스텔 빛 입자. 에셋 없이 CSS로 떠다닌다.
 * 각 입자의 위치(left/top)·크기·애니메이션 속도/딜레이를 분산해 자연스러운 부유.
 * gold=true면 골드 발광, 아니면 파스텔. (장식, aria-hidden)
 */
const HERO_ORBS = [
  { left: '12%', top: '24%', size: 10, dur: 11, delay: 0, gold: true },
  { left: '22%', top: '68%', size: 6, dur: 14, delay: 1.5, gold: false },
  { left: '34%', top: '14%', size: 7, dur: 13, delay: 0.8, gold: false },
  { left: '68%', top: '20%', size: 9, dur: 12, delay: 2.2, gold: true },
  { left: '80%', top: '58%', size: 6, dur: 15, delay: 0.4, gold: false },
  { left: '88%', top: '32%', size: 8, dur: 10, delay: 1.1, gold: true },
  { left: '56%', top: '76%', size: 5, dur: 16, delay: 2.8, gold: false },
  { left: '46%', top: '40%', size: 7, dur: 13, delay: 1.9, gold: true },
] as const;

/** 슬로건을 단어 단위로 쪼개 글자별 stagger 등장에 사용. 공백/줄바꿈 보존. */
function splitWords(text: string): string[] {
  return text.split(/(\s+)/);
}

/**
 * 히어로. 게임 HUD(레벨/XP/언락 서비스 칩)는 유지하되, 우측 실사 비주얼은 제거해
 * 핵심 메시지 중심으로 간결화. 카피/HUD를 단일 컬럼으로 배치.
 * 모션은 transform/opacity만 사용. reduced-motion에서 blob/float 정지.
 */
export function Hero() {
  const copyRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const heroRef = usePointerParallax<HTMLElement>();
  const words = splitWords(COMPANY.slogan);
  const promoHref = FIRST_PROMO ? `#promo-${FIRST_PROMO.id}` : '#main';

  // XP 숫자 롤업 — 카운트업 값으로 바 채움 비율(--xp-pct)을 동기화해
  // 숫자와 게이지가 함께 차오르게 한다(이전: 숫자=JS, 바=CSS 독립 → 불일치).
  const [xpRef, xp] = useCountUp<HTMLDivElement>(HERO_XP, {
    durationMs: 1500,
    delayMs: 300,
  });
  const xpPct = Math.min(100, (xp / HERO_XP_NEXT) * 100);

  return (
    <section
      id="top"
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="hero-heading"
    >
      {/* 배경: aurora / mesh blob (장식, 스크린리더 무시). 마우스 패럴랙스 반응. */}
      <div className={styles.aurora} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobA}`} />
        <span className={`${styles.blob} ${styles.blobB}`} />
        <span className={`${styles.blob} ${styles.blobC}`} />
        <span className={styles.grid} />
        {/* 가로 스캔라인 글로우 — 하이테크 "스캐닝" 디테일 */}
        <span className={styles.scanline} />
      </div>

      {/* 부유 XP 오브 — 골드/파스텔 빛 입자 (장식) */}
      <div className={styles.orbs} aria-hidden="true">
        {HERO_ORBS.map((orb, i) => (
          <span
            key={i}
            className={`${styles.orb} ${orb.gold ? styles.orbGold : styles.orbPastel}`}
            style={
              {
                left: orb.left,
                top: orb.top,
                '--orb-size': `${orb.size}px`,
                '--orb-dur': `${orb.dur}s`,
                '--orb-delay': `${orb.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* 코너 HUD 브래킷 — "게임 화면 안" 프레임 (절제, 장식) */}
      <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

      <div className={`ais-container ${styles.inner}`}>
        <div ref={copyRef} className={`${styles.copy} reveal`}>
          {/* 플레이어 레벨 배지 — HUD 진입점 */}
          <div className={styles.levelBar}>
            <span className={styles.levelBadge}>
              <span className={styles.levelLv}>LV.∞</span>
              <span className={styles.levelDiv} aria-hidden="true">
                //
              </span>
              <span className={styles.levelTitle}>AI APP STUDIO</span>
            </span>
            <span className={styles.statusChip}>
              <span className={styles.statusDot} aria-hidden="true" />
              ONLINE
            </span>
          </div>

          {/* 미니 스탯 칩 — services.ts 도출 값(근거 있는 수치만) */}
          <ul className={styles.statChips} aria-label="에이아이소프트 현황">
            <li className={styles.statChip}>
              <span className={styles.statChipIcon} aria-hidden="true">
                ◈
              </span>
              <strong className={styles.statChipNum}>{SERVICE_COUNT}</strong>
              <span className={styles.statChipLabel}>SERVICES</span>
            </li>
            <li className={styles.statChip}>
              <span className={styles.statChipIcon} aria-hidden="true">
                ⬡
              </span>
              <strong className={styles.statChipNum}>{PLATFORM_COUNT}</strong>
              <span className={styles.statChipLabel}>PLATFORMS</span>
            </li>
            <li className={styles.statChip}>
              <span className={styles.statChipIcon} aria-hidden="true">
                ⚡
              </span>
              <strong className={styles.statChipNum}>AI</strong>
              <span className={styles.statChipLabel}>POWERED</span>
            </li>
          </ul>

          {/* XP 진척 게이지 — RPG 경험치 바. 카운트업 값으로 채움 동기화. */}
          <div
            ref={xpRef}
            className={styles.xpRow}
            style={{ '--xp-pct': `${xpPct}%` } as CSSProperties}
            role="img"
            aria-label={`경험치 ${HERO_XP.toLocaleString('en-US')} / 다음 레벨까지 ${HERO_XP_NEXT.toLocaleString('en-US')}`}
          >
            {/* 바 위 캡션: 좌측 XP 배지 + 우측 현재/다음 레벨 수치 */}
            <div className={styles.xpMeta} aria-hidden="true">
              <span className={styles.xpBadge}>
                <span className={styles.xpBadgeIcon}>✦</span>XP
              </span>
              <span className={styles.xpNext}>
                <span className={styles.xpNow}>{xp.toLocaleString('en-US')}</span>
                <span className={styles.xpSep}>/</span>
                {HERO_XP_NEXT.toLocaleString('en-US')}
              </span>
            </div>
            {/* 두꺼운 트랙: 세그먼트 눈금 + 채움 + 리딩 엣지 */}
            <span className={styles.xpTrack} aria-hidden="true">
              <span className={styles.xpFill}>
                <span className={styles.xpEdge} />
              </span>
              <span className={styles.xpSegments} />
            </span>
          </div>

          <h1 id="hero-heading" className={styles.headline}>
            {words.map((word, i) =>
              /\s+/.test(word) ? (
                ' '
              ) : (
                <span
                  key={i}
                  className={styles.word}
                  style={{ '--word-i': i } as CSSProperties}
                >
                  {word}
                </span>
              ),
            )}
          </h1>

          <p className={styles.sub}>{COMPANY.intro}</p>

          <div className={styles.actions}>
            <Button
              href={promoHref}
              variant="primary"
              icon="▶"
              className={styles.startBtn}
            >
              서비스 둘러보기
              <span className={styles.startMono} aria-hidden="true">
                PRESS&nbsp;START
              </span>
            </Button>
          </div>

          {/* 언락된 캐릭터 슬롯 — 레어도 테두리 + 미니 스탯 */}
          <ul className={styles.chips} aria-label="언락된 에이아이소프트 서비스">
            {SERVICES_SORTED.map((service, i) => (
              <li
                key={service.id}
                className={`${styles.chip} ${styles[`rare${i % 3}`]}`}
                style={
                  {
                    '--chip-accent': service.theme.primary,
                    '--chip-delay': `${i * 0.9}s`,
                    '--chip-index': String(i),
                  } as CSSProperties
                }
              >
                <span className={styles.chipIconWrap}>
                  <img
                    className={styles.chipIcon}
                    src={service.iconUrl}
                    alt=""
                    width={36}
                    height={36}
                    loading="eager"
                    decoding="async"
                    aria-hidden="true"
                  />
                  <span className={styles.chipLevel} aria-hidden="true">
                    {`LV.${i + 1}`}
                  </span>
                </span>
                <span className={styles.chipBody}>
                  <span className={styles.chipTop}>
                    <span className={styles.chipName}>{service.name}</span>
                    <span className={styles.chipUnlocked} aria-hidden="true">
                      UNLOCKED
                    </span>
                  </span>
                  <span className={styles.chipMood}>{service.moodLabel}</span>
                  <span className={styles.chipStat} aria-hidden="true">
                    <span className={styles.chipStatBar}>
                      <span
                        className={styles.chipStatFill}
                        style={{ '--stat': `${72 + i * 9}%` } as CSSProperties}
                      />
                    </span>
                    <span className={styles.chipStatVal}>+XP</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <a
        href={promoHref}
        className={styles.scrollHint}
        aria-label="아래로 스크롤하여 서비스 보기"
      >
        <span className={styles.scrollText}>SCROLL</span>
        <span className={styles.scrollTrack} aria-hidden="true">
          <span className={styles.scrollThumb} />
        </span>
      </a>
    </section>
  );
}
