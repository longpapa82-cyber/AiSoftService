import { useReveal } from '../hooks/useReveal';
import { SERVICES_SORTED } from '../data/services';
import { COMPANY } from '../data/company';
import { TechBadge } from '../components/ui/TechBadge';
import styles from './Footer.module.css';

/** 서비스 대표 링크: 웹사이트가 있으면 웹, 없으면 iOS, 없으면 Android 순. */
function primaryLink(links: {
  web?: string;
  ios?: string;
  android?: string;
}): string | undefined {
  return links.web ?? links.ios ?? links.android;
}

/**
 * 갤러리 벽 하단을 닫는 Footer — 하이테크 마감.
 * 네이비 잉크 표면 위에 회로 도트 + 골드 글로우로 시스템 패널처럼 닫는다.
 * 좌측: AI Soft 로고 + 슬로건, 회사 정보 요약(대표/이메일/주소).
 * 우측: 서비스 바로가기 + 정책 링크. 하단: 모노스페이스 시스템 카피.
 */
export function Footer() {
  const ref = useReveal<HTMLElement>();

  return (
    <footer ref={ref} className={`${styles.footer} reveal`}>
      <div className={`ais-container ${styles.inner}`}>
        <div className={styles.brand}>
          <TechBadge variant="gold" dot>
            System Online
          </TechBadge>
          <a href="#top" className={styles.logo} aria-label={`${COMPANY.name} 홈으로`}>
            <span className={styles.logoMark} aria-hidden="true">
              AI
            </span>
            <span className={styles.logoText}>{COMPANY.name}</span>
          </a>
          <p className={styles.slogan}>{COMPANY.slogan}</p>

          <dl className={styles.company}>
            <div className={styles.companyRow}>
              <dt className={styles.companyTerm}>대표</dt>
              <dd className={styles.companyDesc}>{COMPANY.ceo}</dd>
            </div>
            <div className={styles.companyRow}>
              <dt className={styles.companyTerm}>이메일</dt>
              <dd className={styles.companyDesc}>
                <a className={styles.link} href={`mailto:${COMPANY.email}`}>
                  {COMPANY.email}
                </a>
              </dd>
            </div>
            <div className={styles.companyRow}>
              <dt className={styles.companyTerm}>주소</dt>
              <dd className={styles.companyDesc}>{COMPANY.address}</dd>
            </div>
          </dl>
        </div>

        <nav className={styles.nav} aria-label="서비스 바로가기">
          <h2 className={styles.navTitle}>서비스</h2>
          <ul className={styles.navList}>
            {SERVICES_SORTED.map((service) => {
              const href = primaryLink(service.links);
              return (
                <li key={service.id}>
                  <a
                    className={styles.serviceLink}
                    href={href ?? '#services'}
                    target={href ? '_blank' : undefined}
                    rel={href ? 'noopener noreferrer' : undefined}
                  >
                    <span className={styles.serviceEmoji} aria-hidden="true">
                      {service.emoji}
                    </span>
                    <span>{service.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

      </div>

      <div className={`ais-container ${styles.bottom}`}>
        <p className={styles.copyright}>
          <span className={styles.copyMono}>© 2026 {COMPANY.name}</span>
          <span className={styles.copyRights}>All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
}
