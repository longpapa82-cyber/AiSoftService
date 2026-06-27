import type { CSSProperties } from 'react';
import { COMPANY } from '../data/company';
import { SERVICES_SORTED } from '../data/services';
import { Button } from '../components/ui/Button';
import { TechBadge } from '../components/ui/TechBadge';
import { useReveal } from '../hooks/useReveal';
import { usePointerParallax } from '../hooks/usePointerParallax';
import aiCore from '../assets/photos/ai-core.jpg';
import styles from './Hero.module.css';

// 첫 서비스(myTravel)의 웹 링크를 보조 CTA로 노출.
const FEATURED = SERVICES_SORTED.find((s) => s.links.web);

/** 슬로건을 단어 단위로 쪼개 글자별 stagger 등장에 사용. 공백/줄바꿈 보존. */
function splitWords(text: string): string[] {
  return text.split(/(\s+)/);
}

/**
 * 풀블리드 히어로. 어두운 갤러리 벽 위에 은은한 aurora blob이 떠 있고,
 * 거대한 슬로건 헤드라인 + 서브카피 + CTA + 떠다니는 서비스 칩으로 구성.
 * 모션은 transform/opacity만 사용. reduced-motion에서 blob/float 정지.
 */
export function Hero() {
  const copyRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const heroRef = usePointerParallax<HTMLElement>();
  const words = splitWords(COMPANY.slogan);

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
      </div>

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

          {/* XP 진척 게이지 — 슬로건 위 장식 HUD */}
          <div
            className={styles.xpRow}
            role="img"
            aria-label="플레이어 경험치 게이지"
          >
            <span className={styles.xpLabel}>XP</span>
            <span className={styles.xpTrack} aria-hidden="true">
              <span className={styles.xpFill} />
            </span>
            <span className={styles.xpValue}>9,999</span>
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
              href="#services"
              variant="primary"
              icon="▶"
              className={styles.startBtn}
            >
              서비스 둘러보기
              <span className={styles.startMono} aria-hidden="true">
                PRESS&nbsp;START
              </span>
            </Button>
            {FEATURED?.links.web && (
              <Button href={FEATURED.links.web} variant="outline">
                {FEATURED.name} 웹사이트
              </Button>
            )}
          </div>

          {/* 언락된 캐릭터 슬롯 — 레어도 테두리 + 미니 스탯 */}
          <ul className={styles.chips} aria-label="언락된 AI Soft 서비스">
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
                        style={
                          { '--stat': `${72 + i * 9}%` } as CSSProperties
                        }
                      />
                    </span>
                    <span className={styles.chipStatVal}>+XP</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 우측 실사 비주얼: AI 코어 — 글래스 프레임 + 골드 헤어라인 + subtle float */}
        <div className={styles.visual} aria-hidden="true">
          <figure className={styles.visualFrame}>
            <img
              className={styles.visualImg}
              src={aiCore}
              alt=""
              width={720}
              height={900}
              loading="eager"
              decoding="async"
            />
            {/* 네이비/골드 그라디언트 오버레이로 텍스트 가독성·매거진 톤 확보 */}
            <span className={styles.visualOverlay} />
            <span className={styles.visualHairline} />
          </figure>

          {/* 플로팅 테크 태그 */}
          <span className={styles.visualBadge}>
            <TechBadge variant="gold" dot>
              NPU · NEURAL ENGINE
            </TechBadge>
          </span>

          {/* 진척 링 — 메인 퀘스트 게이지 */}
          <span className={styles.questRing}>
            <span className={styles.questRingNum}>3</span>
            <span className={styles.questRingLabel}>QUEST</span>
          </span>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <a
        href="#services"
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
