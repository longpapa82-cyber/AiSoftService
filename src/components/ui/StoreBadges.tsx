import type { CSSProperties, ReactNode } from 'react';
import styles from './StoreBadges.module.css';

export type StoreTone = 'light' | 'dark';

export interface StoreBadgesProps {
  ios?: string;
  android?: string;
  web?: string;
  /** 배지가 놓일 카드 톤. 'dark'=어두운 표면, 'light'=밝은 표면 */
  tone?: StoreTone;
  /**
   * 미출시 모드. true면 ios/android 링크 유무와 무관하게
   * App Store·Google Play를 "준비 중" 비활성 배지로 표기(링크 아님).
   * web 링크는 정상 노출. 주 CTA(골드)는 web으로.
   */
  comingSoon?: boolean;
  /**
   * Android만 준비 중(스토어 미출시)일 때 true.
   * comingSoon(전체 미출시)과 달리, iOS·web은 정상 링크로 두고
   * Google Play만 "준비 중" 비활성 배지로 표기한다(iOS 출시 + Android 준비 중 혼합 상태).
   * comingSoon이 true면 무시된다(그때는 두 스토어 모두 준비 중).
   */
  androidPending?: boolean;
  /**
   * true면 web 링크가 있어도 App Store(ios)를 주 CTA(골드 강조)로 승격.
   * web이 홍보 랜딩이 아니라 법적 고지 페이지인 앱(myToday)에서 설치를 우선할 때 사용.
   * comingSoon일 때는 무시된다(준비 중 배지엔 주 CTA 개념이 web뿐).
   */
  primaryStore?: boolean;
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
  /** 링크 URL. 미출시(준비 중) 배지는 undefined → <span>으로 렌더. */
  href?: string;
  kicker: string;
  label: string;
  logo: ReactNode;
  ariaLabel: string;
  /** 골드 채움+글로우로 강조되는 주 CTA 여부 */
  primary: boolean;
  /** 미출시(준비 중) — 비활성 배지로 렌더 */
  pending?: boolean;
}

/** 게임 CTA 톤 kicker — 다운로드를 "획득 액션"처럼. */
const INSTALL_KICKER = '▶ INSTALL';
const OPEN_KICKER = '▶ OPEN';
const SOON_KICKER = '▶ SOON';

export function StoreBadges({
  ios,
  android,
  web,
  tone = 'light',
  comingSoon = false,
  androidPending = false,
  primaryStore = false,
  className,
}: StoreBadgesProps) {
  const badges: BadgeDef[] = [];

  // 미출시면 App Store·Google Play를 "준비 중" 비활성 배지로 표기(링크 유무 무관).
  // 주 CTA(골드 강조) 우선순위:
  //   - primaryStore(설치 우선): App Store > Google Play > 웹사이트
  //   - 기본: 웹사이트 > App Store > Google Play
  const primaryLabel = primaryStore
    ? ios
      ? 'App Store'
      : android
        ? 'Google Play'
        : '웹사이트'
    : web
      ? '웹사이트'
      : ios
        ? 'App Store'
        : 'Google Play';

  if (comingSoon) {
    // App Store·Google Play는 항상 "준비 중"으로 자리 표시(기대감 유발), web은 정상 링크.
    badges.push({
      kicker: SOON_KICKER,
      label: 'App Store',
      logo: AppleLogo,
      ariaLabel: 'App Store 출시 준비 중',
      primary: false,
      pending: true,
    });
    badges.push({
      kicker: SOON_KICKER,
      label: 'Google Play',
      logo: PlayLogo,
      ariaLabel: 'Google Play 출시 준비 중',
      primary: false,
      pending: true,
    });
    if (web) {
      badges.push({
        href: web,
        kicker: OPEN_KICKER,
        label: '웹사이트',
        logo: GlobeLogo,
        ariaLabel: '웹사이트 바로가기',
        primary: true,
      });
    }
  } else {
    if (ios) {
      badges.push({
        href: ios,
        kicker: INSTALL_KICKER,
        label: 'App Store',
        logo: AppleLogo,
        ariaLabel: 'App Store에서 다운로드',
        primary: 'App Store' === primaryLabel,
      });
    }
    if (android) {
      badges.push({
        href: android,
        kicker: INSTALL_KICKER,
        label: 'Google Play',
        logo: PlayLogo,
        ariaLabel: 'Google Play에서 다운로드',
        primary: 'Google Play' === primaryLabel,
      });
    } else if (androidPending) {
      // Android만 준비 중 — Google Play를 "준비 중" 비활성 배지로(iOS·web은 정상 링크).
      badges.push({
        kicker: SOON_KICKER,
        label: 'Google Play',
        logo: PlayLogo,
        ariaLabel: 'Google Play 출시 준비 중',
        primary: false,
        pending: true,
      });
    }
    if (web) {
      badges.push({
        href: web,
        kicker: OPEN_KICKER,
        label: '웹사이트',
        logo: GlobeLogo,
        ariaLabel: '웹사이트 바로가기',
        primary: '웹사이트' === primaryLabel,
      });
    }
  }

  if (badges.length === 0) return null;

  const listClass = [styles.list, className].filter(Boolean).join(' ');

  return (
    <div className={listClass}>
      {badges.map((badge, i) => {
        // 주 CTA(badge.primary) = 웹사이트 → 골드 채움+글로우로 강조. 나머지는 글래스 아웃라인.
        const isPrimary = badge.primary;
        const isInstall = badge.kicker === INSTALL_KICKER;
        const badgeClass = [
          styles.badge,
          styles[tone],
          isPrimary ? styles.primary : styles.secondary,
          badge.pending ? styles.pending : '',
        ]
          .filter(Boolean)
          .join(' ');

        const inner = (
          <>
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
            {/* 미출시 — "준비 중" 상태 핀 */}
            {badge.pending && (
              <span className={styles.soonPin} aria-hidden="true">
                준비 중
              </span>
            )}
          </>
        );

        // 미출시(준비 중) 배지는 링크가 아니므로 <span aria-disabled>로 렌더.
        if (badge.pending) {
          return (
            <span
              key={badge.label}
              className={badgeClass}
              aria-disabled="true"
              aria-label={badge.ariaLabel}
              style={{ '--bdg-i': i } as CSSProperties}
            >
              {inner}
            </span>
          );
        }

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
            {inner}
          </a>
        );
      })}
    </div>
  );
}
