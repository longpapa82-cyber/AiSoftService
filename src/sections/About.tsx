import { COMPANY } from '../data/company';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TechBadge } from '../components/ui/TechBadge';
import { useReveal } from '../hooks/useReveal';
import styles from './About.module.css';

/**
 * About 섹션. 회사 소개 본문을 네이비 잉크 패널 + 거대 워드마크로 크게 전시.
 */
export function About() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className="ais-container">
        <div className={styles.heading}>
          <TechBadge variant="gold" dot>
            ORGANIZATION
          </TechBadge>
          <SectionHeader title="조직 소개" id="about-title" />
        </div>

        <div ref={ref} className={`${styles.grid} reveal`}>
          <div className={styles.intro}>
            <span className={styles.introTag} aria-hidden="true">
              // about_us
            </span>
            <p className={styles.slogan}>{COMPANY.slogan}</p>
            <p className={styles.body}>{COMPANY.intro}</p>
            <span className={styles.wordmark} aria-hidden="true">
              {COMPANY.name}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
