import type { CSSProperties } from 'react';
import type { AppService } from '../data/services';
import { StoreBadges, type StoreTone } from '../components/ui/StoreBadges';
import { useReveal } from '../hooks/useReveal';
import styles from './ServiceCard.module.css';

export interface ServiceCardProps {
  service: AppService;
  /** bento 위계: 첫 카드 등 강조 카드는 featured로 넓게 전시 */
  featured?: boolean;
  /** 스태거 등장용 인덱스 */
  index?: number;
}

/**
 * 카드 표면 밝기를 보고 StoreBadges 톤을 결정한다.
 * 밝은 표면(크림/화이트)에는 'light', 어두운 표면(네이비)에는 'dark'.
 */
function toneForSurface(surface: string): StoreTone {
  const hex = surface.replace('#', '');
  if (hex.length < 6) return 'dark';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // 상대 휘도 근사치
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? 'light' : 'dark';
}

/**
 * 갤러리 작품 카드. service.theme를 CSS 변수로 주입해
 * 각 카드가 자기 브랜드 컬러/폰트로 채색된다.
 */
export function ServiceCard({ service, featured = false, index = 0 }: ServiceCardProps) {
  const ref = useReveal<HTMLElement>();
  const { theme } = service;

  const cardStyle = {
    '--svc-surface': theme.surface,
    '--svc-ink': theme.ink,
    '--svc-ink-soft': theme.inkSoft,
    '--svc-primary': theme.primary,
    '--svc-accent': theme.accent,
    '--svc-gradient': theme.gradient,
    '--svc-font': theme.font,
    '--svc-on-primary': theme.onPrimary,
    '--reveal-delay': `${index * 90}ms`,
  } as CSSProperties;

  const tone = toneForSurface(theme.surface);
  const isLive = service.status === 'live';
  const titleId = `svc-${service.id}-title`;

  return (
    <article
      ref={ref}
      className={[styles.card, featured ? styles.featured : '', 'reveal']
        .filter(Boolean)
        .join(' ')}
      style={cardStyle}
      aria-labelledby={titleId}
    >
      {/* 작품 상단: 무드 그라디언트 영역 + 실제 앱 아이콘 */}
      <div className={styles.stage} aria-hidden="true">
        <span className={styles.iconGlow} />
        <img
          className={styles.appIcon}
          src={service.iconUrl}
          alt=""
          width={104}
          height={104}
          loading="lazy"
          decoding="async"
        />
        <span className={styles.accentLine} />
      </div>

      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.mood}>{service.moodLabel}</span>
          {isLive && (
            <span className={styles.liveBadge}>
              <span className={styles.liveDot} aria-hidden="true" />
              LIVE
            </span>
          )}
        </div>

        <h3 id={titleId} className={styles.name}>
          {service.name}
        </h3>
        <p className={styles.tagline}>{service.tagline}</p>
        <p className={styles.desc}>{service.description}</p>

        {service.stats && service.stats.length > 0 && (
          <dl className={styles.stats}>
            {service.stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <StoreBadges
          ios={service.links.ios}
          android={service.links.android}
          web={service.links.web}
          tone={tone}
          className={styles.badges}
        />
      </div>
    </article>
  );
}

/**
 * 확장성을 암시하는 빈 슬롯 카드. 점선 보더, 갤러리 벽 톤.
 * "더 많은 서비스가 준비 중입니다"
 */
export function ComingSoonCard() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={[styles.card, styles.placeholder, 'reveal'].join(' ')}
    >
      <div className={styles.placeholderInner}>
        <span className={styles.placeholderGlyph} aria-hidden="true">
          +
        </span>
        <p className={styles.placeholderTitle}>더 많은 서비스가 준비 중입니다</p>
        <p className={styles.placeholderDesc}>
          AI Soft의 다음 작품을 기대해 주세요
        </p>
      </div>
    </div>
  );
}
