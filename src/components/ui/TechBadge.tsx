import type { ReactNode } from 'react';
import styles from './TechBadge.module.css';

interface TechBadgeProps {
  children: ReactNode;
  /** 'gold' 골드 텍스트(기본) | 'navy' 네이비 텍스트 | 'outline' 보더 칩 */
  variant?: 'gold' | 'navy' | 'outline';
  /** 앞에 점멸 점(시스템 온라인 느낌) 표시 */
  dot?: boolean;
  icon?: ReactNode;
}

/**
 * 대문자 이브로우 배지 — 섹션 카테고리 라벨.
 * "ORGANIZATION", "핵심 역량" 류 정통 이브로우에 사용.
 */
export function TechBadge({
  children,
  variant = 'gold',
  dot = false,
  icon,
}: TechBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
