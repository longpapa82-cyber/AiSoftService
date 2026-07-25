import type { CSSProperties } from 'react';
import { useReveal } from '../../hooks/useReveal';
import styles from './SectionHeader.module.css';

export type SectionHeaderAlign = 'left' | 'center';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  desc?: string;
  align?: SectionHeaderAlign;
  /**
   * serif 챕터 카운터(예: "회사 소개 / 03"). title 위에 옅게 오버랩되어
   * 에디토리얼 챕터감을 준다. 생략 시 미표시.
   */
  chapter?: string;
  /** h2에 부여할 id. 섹션의 aria-labelledby와 연결한다. */
  id?: string;
  className?: string;
}

/** 제목을 단어 단위로 분해(공백 보존)해 stagger 리빌에 사용. */
function splitTitleWords(text: string): string[] {
  return text.split(/(\s+)/);
}

/**
 * 섹션 머리글. (선택) serif 챕터 카운터 + eyebrow(브랜드 라벨) + h2 + 설명.
 * useReveal 훅 + .reveal 클래스로 스크롤 진입 시 부드럽게 등장하며,
 * h2 제목은 단어 단위 stagger로 순차 리빌된다(transform/opacity만, JS 추가 훅 없음).
 */
export function SectionHeader({
  eyebrow,
  title,
  desc,
  align = 'left',
  chapter,
  id,
  className,
}: SectionHeaderProps) {
  const ref = useReveal<HTMLDivElement>();

  const classNames = [styles.header, styles[align], 'reveal', className]
    .filter(Boolean)
    .join(' ');

  const words = splitTitleWords(title);

  return (
    <div ref={ref} className={classNames}>
      {chapter && (
        <span className={styles.chapter} aria-hidden="true">
          {chapter}
        </span>
      )}
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 id={id} className={styles.title}>
        {words.map((word, i) =>
          /\s+/.test(word) ? (
            ' '
          ) : (
            <span
              key={i}
              className={styles.titleWord}
              style={{ '--w-i': i } as CSSProperties}
            >
              {word}
            </span>
          ),
        )}
      </h2>
      {desc && <p className={styles.desc}>{desc}</p>}
    </div>
  );
}
