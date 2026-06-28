import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { COMPANY } from '../data/company';
import { useScrollProgress } from '../hooks/useScrollProgress';
import logoMark from '../assets/brand/aisoft-logo.png';
import styles from './Header.module.css';

interface NavItem {
  href: string;
  label: string;
}

interface HeaderProps {
  /** 지금까지 "수집"한 서비스 수 (스크롤로 통과한 미니 홍보 섹션). */
  collected: number;
  /** 수집 가능한 총 서비스 수. */
  total: number;
}

const NAV_ITEMS: NavItem[] = [
  { href: '#promo-mytravel', label: '서비스' },
  { href: '#technology', label: '기술' },
  { href: '#about', label: '조직소개' },
];

const SCROLL_THRESHOLD = 24;

/**
 * 상단 고정 헤더. 로고(AI Soft) + 앵커 메뉴.
 * 스크롤 시 배경 블러/보더가 강해지는 상태 전환(opacity/backdrop만 변경).
 * 모바일에서는 메뉴를 펼치는 토글 패널 제공.
 */
export function Header({ collected, total }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerClass = [styles.header, scrolled ? styles.scrolled : '']
    .filter(Boolean)
    .join(' ');

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={headerClass}>
      <div className={`ais-container ${styles.inner}`}>
        <a href="#top" className={styles.logo} aria-label={`${COMPANY.name} 홈`}>
          <img
            className={styles.logoMark}
            src={logoMark}
            alt=""
            width={34}
            height={34}
            aria-hidden="true"
          />
          <span className={styles.logoText}>AI&nbsp;Soft</span>
          <span className={styles.logoTag} aria-hidden="true">
            AI&nbsp;APP&nbsp;STUDIO
          </span>
        </a>

        {/* 수집 카운터 — 서비스를 통과(수집)할수록 채워지는 게임 HUD */}
        <span
          className={[styles.collect, collected > 0 ? styles.collectActive : '']
            .filter(Boolean)
            .join(' ')}
          role="status"
          aria-live="polite"
          aria-label={`서비스 ${total}개 중 ${collected}개 확인함`}
        >
          <span className={styles.collectIcon} aria-hidden="true">
            ◈
          </span>
          <span className={styles.collectNum}>
            {collected}/{total}
          </span>
          <span className={styles.collectLabel} aria-hidden="true">
            COLLECTED
          </span>
        </span>

        <nav className={styles.nav} aria-label="주요 메뉴">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#promo-mytravel" className={styles.navCta}>
            둘러보기
          </a>
        </nav>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={[styles.menuIcon, menuOpen ? styles.menuIconOpen : '']
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* 스크롤 진행 골드바 — 페이지를 "플레이"하며 차오르는 XP 라인 */}
      <span className={styles.progress} aria-hidden="true">
        <span
          className={styles.progressFill}
          style={{ '--scroll': progress } as CSSProperties}
        />
      </span>

      <div
        id="mobile-menu"
        className={[styles.mobilePanel, menuOpen ? styles.mobileOpen : '']
          .filter(Boolean)
          .join(' ')}
        hidden={!menuOpen}
      >
        <ul className={styles.mobileList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={styles.mobileLink}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
