import type { CSSProperties } from 'react';
import { COMPANY } from '../data/company';
import { SERVICES_SORTED } from '../data/services';
import { Button } from '../components/ui/Button';
import { useReveal } from '../hooks/useReveal';
import styles from './Hero.module.css';

// 첫 서비스(myTravel)의 웹 링크를 보조 CTA로 노출.
const FEATURED = SERVICES_SORTED.find((s) => s.links.web);

/**
 * 풀블리드 히어로. 어두운 갤러리 벽 위에 은은한 aurora blob이 떠 있고,
 * 거대한 슬로건 헤드라인 + 서브카피 + CTA + 떠다니는 서비스 칩으로 구성.
 * 모션은 transform/opacity만 사용. reduced-motion에서 blob/float 정지.
 */
export function Hero() {
  const copyRef = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section
      id="top"
      className={styles.hero}
      aria-labelledby="hero-heading"
    >
      {/* 배경: aurora / mesh blob (장식, 스크린리더 무시) */}
      <div className={styles.aurora} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobA}`} />
        <span className={`${styles.blob} ${styles.blobB}`} />
        <span className={`${styles.blob} ${styles.blobC}`} />
        <span className={styles.grid} />
      </div>

      <div className={`ais-container ${styles.inner}`}>
        <div ref={copyRef} className={`${styles.copy} reveal`}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            {COMPANY.name} · AI App Studio
          </span>

          <h1 id="hero-heading" className={styles.headline}>
            {COMPANY.slogan}
          </h1>

          <p className={styles.sub}>{COMPANY.intro}</p>

          <div className={styles.actions}>
            <Button href="#services" variant="primary" icon="→">
              서비스 둘러보기
            </Button>
            {FEATURED?.links.web && (
              <Button href={FEATURED.links.web} variant="outline">
                {FEATURED.name} 웹사이트
              </Button>
            )}
          </div>

          {/* 떠다니는 서비스 칩 */}
          <ul className={styles.chips} aria-label="AI Soft 서비스">
            {SERVICES_SORTED.map((service, i) => (
              <li
                key={service.id}
                className={styles.chip}
                style={
                  {
                    '--chip-accent': service.theme.primary,
                    '--chip-delay': `${i * 0.9}s`,
                    '--chip-index': String(i),
                  } as CSSProperties
                }
              >
                <span className={styles.chipEmoji} aria-hidden="true">
                  {service.emoji}
                </span>
                <span className={styles.chipBody}>
                  <span className={styles.chipName}>{service.name}</span>
                  <span className={styles.chipMood}>{service.moodLabel}</span>
                </span>
              </li>
            ))}
          </ul>
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
