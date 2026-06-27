import type { CSSProperties, ReactNode } from 'react';
import styles from './StoreBadges.module.css';

export type StoreTone = 'light' | 'dark';

export interface StoreBadgesProps {
  ios?: string;
  android?: string;
  web?: string;
  /** 배지가 놓일 카드 톤. 'dark'=어두운 표면, 'light'=밝은 표면 */
  tone?: StoreTone;
  className?: string;
}

const AppleLogo = (
  <svg
    className={styles.logo}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.36 12.78c-.02-2.18 1.78-3.23 1.86-3.28-1.01-1.48-2.59-1.68-3.15-1.7-1.34-.14-2.61.79-3.29.79-.68 0-1.72-.77-2.83-.75-1.46.02-2.8.85-3.55 2.15-1.51 2.62-.39 6.5 1.09 8.63.72 1.04 1.58 2.21 2.71 2.17 1.09-.04 1.5-.7 2.82-.7 1.31 0 1.69.7 2.83.68 1.17-.02 1.91-1.06 2.62-2.11.83-1.21 1.17-2.38 1.19-2.44-.03-.01-2.28-.88-2.3-3.49zM14.2 6.18c.6-.73 1.01-1.74.9-2.75-.87.04-1.92.58-2.54 1.31-.55.64-1.04 1.67-.91 2.65.97.08 1.95-.49 2.55-1.21z" />
  </svg>
);

const PlayLogo = (
  <svg
    className={styles.logo}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M4.2 2.6c-.3.2-.5.6-.5 1.1v16.6c0 .5.2.9.5 1.1l9-9.1-9-9.7z" opacity="0.9" />
    <path d="M16.4 8.9 6.1 3 13.4 10.3l3-1.4z" opacity="0.7" />
    <path d="M16.4 15.1 13.4 13.7 6.1 21l10.3-5.9z" opacity="0.7" />
    <path d="M20 10.9c-.5-.3-1.6-.9-3.6-2l-3 3.1 3 3.1c2-1.1 3.1-1.7 3.6-2 .6-.4.6-1.8 0-2.2z" />
  </svg>
);

const GlobeLogo = (
  <svg
    className={styles.logo}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.4 3.9 5.6 3.9 9s-1.4 6.6-3.9 9c-2.5-2.4-3.9-5.6-3.9-9S9.5 5.4 12 3z" />
  </svg>
);

interface BadgeDef {
  href: string;
  kicker: string;
  label: string;
  logo: ReactNode;
  ariaLabel: string;
}

/** 게임 CTA 톤 kicker — 다운로드를 "획득 액션"처럼. */
const INSTALL_KICKER = '▶ INSTALL';
const OPEN_KICKER = '▶ OPEN';

export function StoreBadges({
  ios,
  android,
  web,
  tone = 'light',
  className,
}: StoreBadgesProps) {
  const badges: BadgeDef[] = [];

  if (ios) {
    badges.push({
      href: ios,
      kicker: INSTALL_KICKER,
      label: 'App Store',
      logo: AppleLogo,
      ariaLabel: 'App Store에서 다운로드',
    });
  }
  if (android) {
    badges.push({
      href: android,
      kicker: INSTALL_KICKER,
      label: 'Google Play',
      logo: PlayLogo,
      ariaLabel: 'Google Play에서 다운로드',
    });
  }
  if (web) {
    badges.push({
      href: web,
      kicker: OPEN_KICKER,
      label: '웹사이트',
      logo: GlobeLogo,
      ariaLabel: '웹사이트 바로가기',
    });
  }

  if (badges.length === 0) return null;

  const listClass = [styles.list, className].filter(Boolean).join(' ');

  return (
    <div className={listClass}>
      {badges.map((badge, i) => {
        // 첫 배지 = 주 플랫폼 → 골드 채움+글로우로 강조. 나머지는 글래스 아웃라인.
        const isPrimary = i === 0;
        const isInstall = badge.kicker === INSTALL_KICKER;
        const badgeClass = [
          styles.badge,
          styles[tone],
          isPrimary ? styles.primary : styles.secondary,
        ].join(' ');
        return (
          <a
            key={badge.label}
            href={badge.href}
            className={badgeClass}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={badge.ariaLabel}
            style={{ '--bdg-i': i } as CSSProperties}
          >
            {/* 뷰포트 진입 시 1회 가로지르는 광택 (장식) */}
            <span className={styles.sheen} aria-hidden="true" />
            <span className={styles.logoWrap} aria-hidden="true">
              {badge.logo}
            </span>
            <span className={styles.text}>
              <span className={styles.kicker}>{badge.kicker}</span>
              <span className={styles.label}>{badge.label}</span>
            </span>
            {/* 무료 앱 — "획득" 보상 칩 (장식) */}
            {isInstall && (
              <span className={styles.freePin} aria-hidden="true">
                FREE
              </span>
            )}
            {/* 호버 시 떠오르는 XP 마이크로 피드백 (장식) */}
            <span className={styles.xpPop} aria-hidden="true">
              +10&nbsp;XP
            </span>
          </a>
        );
      })}
    </div>
  );
}
