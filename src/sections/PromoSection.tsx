import type { CSSProperties } from 'react';
import type { AppService } from '../data/services';
import { StoreBadges } from '../components/ui/StoreBadges';
import { useReveal } from '../hooks/useReveal';
import { iconFor } from './Features';
import styles from './PromoSection.module.css';

/**
 * 서비스별 "미니 홍보 사이트" 섹션.
 * 각 서비스의 실제 웹/앱 디자인(시그니처 컬러·폰트·라운드·모티프)을 그대로 재현해
 * 해당 서비스만의 풀 테마로 잠깐 전환된다. promo 데이터가 있는 서비스에만 렌더된다.
 *
 * 테마 격리: palette를 --p-* 인라인 변수로 주입 → 전역 토큰 비오염, 한 컴포넌트로 N개 브랜드.
 */
interface PromoSectionProps {
  service: AppService;
  /** 좌우 배치 방향. 짝수/홀수로 교차하면 리듬이 생긴다. */
  flip?: boolean;
}

export function PromoSection({ service, flip = false }: PromoSectionProps) {
  const { promo } = service;
  const reveal = useReveal<HTMLDivElement>();

  if (!promo) return null;

  const themeVars = {
    '--p-bg': promo.palette.bg,
    '--p-hero': promo.palette.heroGradient,
    '--p-surface': promo.palette.surface,
    '--p-primary': promo.palette.primary,
    '--p-accent': promo.palette.accent,
    '--p-ink': promo.palette.ink,
    '--p-ink-soft': promo.palette.inkSoft,
    '--p-on-primary': promo.palette.onPrimary,
    '--p-font-display': promo.fontDisplay,
    '--p-font-body': promo.fontBody,
    '--p-radius': `${promo.radius}px`,
  } as CSSProperties;

  const sectionClass = [
    styles.section,
    styles[`motif_${promo.motif}`],
    flip ? styles.flip : '',
  ]
    .filter(Boolean)
    .join(' ');

  // 헤드라인: 줄바꿈(\n) 보존 + accent 강조 분리
  const headlineLines = promo.headline.split('\n');

  return (
    <section
      className={sectionClass}
      style={themeVars}
      aria-labelledby={`promo-${service.id}-title`}
    >
      {/* motif 배경 장식 레이어 (CSS로 그림) */}
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.blobA} />
        <span className={styles.blobB} />
      </div>

      <div className="ais-container">
        <div ref={reveal} className={`${styles.inner} reveal`}>
          {/* ── 좌: 미니 헤더 + 카피 ── */}
          <div className={styles.copy}>
            <div className={styles.miniHeader}>
              <img
                className={styles.logo}
                src={service.iconUrl}
                alt=""
                width={40}
                height={40}
                loading="lazy"
              />
              <span className={styles.brand}>{service.name}</span>
              <span className={styles.kicker}>{promo.kicker}</span>
            </div>

            <h2 id={`promo-${service.id}-title`} className={styles.headline}>
              {headlineLines.map((line, i) => (
                <span key={i} className={styles.headlineLine}>
                  {line}
                  {i === headlineLines.length - 1 && promo.headlineAccent && (
                    <span className={styles.accent}>{promo.headlineAccent}</span>
                  )}
                </span>
              ))}
            </h2>

            <p className={styles.subcopy}>{promo.subcopy}</p>

            {/* 통계 하이라이트 칩 */}
            <ul className={styles.highlights}>
              {promo.highlights.map((h) => (
                <li key={h.label} className={styles.highlight}>
                  <strong className={styles.highlightValue}>{h.value}</strong>
                  <span className={styles.highlightLabel}>{h.label}</span>
                </li>
              ))}
            </ul>

            <StoreBadges
              ios={service.links.ios}
              android={service.links.android}
              web={service.links.web}
              tone="light"
              className={styles.badges}
            />
          </div>

          {/* ── 우: 앱 비주얼 (아이콘 + 기능 카드 미니 목업) ── */}
          <div className={styles.visual}>
            <div className={styles.appCard}>
              <div className={styles.appCardGlow} aria-hidden="true" />
              <img
                className={styles.appIcon}
                src={service.iconUrl}
                alt={`${service.name} 앱 아이콘`}
                width={120}
                height={120}
                loading="lazy"
              />
              <span className={styles.appName}>{service.name}</span>
              <span className={styles.appTagline}>{service.tagline}</span>

              <ul className={styles.featureList}>
                {service.features.map((f) => (
                  <li key={f.title} className={styles.featureItem}>
                    <span className={styles.featureIcon} aria-hidden="true">
                      {iconFor(f.icon)}
                    </span>
                    <span className={styles.featureText}>
                      <strong className={styles.featureTitle}>{f.title}</strong>
                      <span className={styles.featureDesc}>{f.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
