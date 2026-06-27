import { useReveal } from '../../hooks/useReveal';
import styles from './SectionHeader.module.css';

export type SectionHeaderAlign = 'left' | 'center';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  desc?: string;
  align?: SectionHeaderAlign;
  /** h2에 부여할 id. 섹션의 aria-labelledby와 연결한다. */
  id?: string;
  className?: string;
}

/**
 * 섹션 머리글. eyebrow(브랜드 라벨) + h2 + 설명.
 * useReveal 훅 + .reveal 클래스로 스크롤 진입 시 부드럽게 등장한다.
 */
export function SectionHeader({
  eyebrow,
  title,
  desc,
  align = 'left',
  id,
  className,
}: SectionHeaderProps) {
  const ref = useReveal<HTMLDivElement>();

  const classNames = [styles.header, styles[align], 'reveal', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classNames}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {desc && <p className={styles.desc}>{desc}</p>}
    </div>
  );
}
