import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { SERVICES_SORTED } from '../data/services';
import styles from './ServiceRail.module.css';

/**
 * 데스크톱 우측 고정 세로 도트 내비게이션.
 * 12개 서비스 룸 + 셸 섹션(히어로/기술/소개)을 순회하는 긴 페이지에서
 * "지금 어디에 있는지" + "클릭으로 이동"을 제공한다.
 *
 * - 도트 색 = 각 서비스 브랜드 primary(services.ts 재사용), 셸은 샴페인 골드.
 * - 활성 섹션 추적 = IntersectionObserver(Header 다크 적응 패턴 재사용, 스크롤 핸들러 0).
 * - 모바일(<1280px)은 미표시(터치 스크롤 충돌·공간 부족) → CSS 미디어 쿼리로 숨김.
 * - reduce-motion 시 scrollIntoView를 auto로.
 */

interface RailTarget {
  /** 스크롤 대상 요소 id (앵커) */
  id: string;
  /** 접근성/툴팁 라벨 */
  label: string;
  /** 도트 색 (브랜드 primary 또는 샴페인 골드) */
  color: string;
}

const SHELL_GOLD = 'var(--ais-gold-champagne)';

export function ServiceRail() {
  const targets = useMemo<RailTarget[]>(() => {
    const promo = SERVICES_SORTED.filter((s) => s.promo);
    return [
      { id: 'top', label: '홈', color: SHELL_GOLD },
      ...promo.map((s) => ({
        id: `promo-${s.id}`,
        label: s.name,
        color: s.theme.primary,
      })),
      { id: 'technology', label: '기술', color: SHELL_GOLD },
      { id: 'about', label: '조직소개', color: SHELL_GOLD },
    ];
  }, []);

  const [activeId, setActiveId] = useState(targets[0]?.id ?? 'top');
  const navRef = useRef<HTMLElement>(null);

  // 활성 섹션 추적: 각 대상 섹션을 관찰하다가 뷰포트 중앙에 가장 근접한 것을 활성으로.
  useEffect(() => {
    const elements = targets
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // 교차 중인 섹션들 중 뷰포트 상단에 가장 가까운 것을 활성으로 선택.
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        // 화면에 보이는 대상들 중 문서 순서상 가장 위(먼저 등장)를 활성으로.
        const firstVisible = targets.find((t) => visible.has(t.id));
        if (firstVisible) setActiveId(firstVisible.id);
      },
      // 헤더(74px)에 가린 부분을 제외하고 뷰포트 중상단을 활성 판정 밴드로.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [targets]);

  const handleJump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // 키보드/스크린리더 포커스를 대상 섹션으로 이동(이동 후 Tab 흐름 자연스럽게).
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };

  return (
    <nav ref={navRef} className={styles.rail} aria-label="섹션 바로가기">
      <ul className={styles.list}>
        {targets.map((t) => {
          const isActive = t.id === activeId;
          return (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className={[styles.dot, isActive ? styles.active : '']
                  .filter(Boolean)
                  .join(' ')}
                style={{ '--dot-color': t.color } as CSSProperties}
                aria-label={t.label}
                aria-current={isActive ? 'true' : undefined}
                onClick={handleJump(t.id)}
              >
                <span className={styles.tip} aria-hidden="true">
                  {t.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
