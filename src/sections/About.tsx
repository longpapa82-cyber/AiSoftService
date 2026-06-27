import { useState } from 'react';
import { COMPANY } from '../data/company';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useReveal } from '../hooks/useReveal';
import styles from './About.module.css';

const COPY_RESET_MS = 1800;

type InfoRow = {
  key: string;
  label: string;
  icon: string;
};

const INFO_ROWS: readonly InfoRow[] = [
  { key: 'ceo', label: '대표이사', icon: '👤' },
  { key: 'email', label: '이메일', icon: '✉️' },
  { key: 'address', label: '주소', icon: '📍' },
] as const;

/**
 * About 섹션. 회사 소개 본문 + 신뢰감 있는 정보 카드(대표/이메일/주소).
 * 이메일은 mailto 링크 + 클립보드 복사 버튼으로 클릭/복사 가능.
 */
export function About() {
  const ref = useReveal<HTMLDivElement>();
  const [copied, setCopied] = useState(false);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(COMPANY.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPY_RESET_MS);
    } catch {
      // 클립보드 접근 실패 시(권한/비보안 컨텍스트) mailto 링크로 폴백 — 조용히 무시.
    }
  }

  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className="ais-container">
        <SectionHeader
          eyebrow="COMPANY"
          title="회사 소개"
          id="about-title"
        />

        <div ref={ref} className={`${styles.grid} reveal`}>
          <div className={styles.intro}>
            <p className={styles.slogan}>{COMPANY.slogan}</p>
            <p className={styles.body}>{COMPANY.intro}</p>
            <span className={styles.wordmark} aria-hidden="true">
              {COMPANY.name}
            </span>
          </div>

          <dl className={styles.info}>
            {INFO_ROWS.map((row) => (
              <div key={row.key} className={styles.row}>
                <dt className={styles.term}>
                  <span className={styles.rowIcon} aria-hidden="true">
                    {row.icon}
                  </span>
                  {row.label}
                </dt>
                <dd className={styles.value}>
                  {row.key === 'ceo' && COMPANY.ceo}

                  {row.key === 'email' && (
                    <span className={styles.emailWrap}>
                      <a className={styles.emailLink} href={`mailto:${COMPANY.email}`}>
                        {COMPANY.email}
                      </a>
                      <button
                        type="button"
                        className={styles.copyBtn}
                        onClick={handleCopyEmail}
                        aria-label={
                          copied ? '이메일 주소 복사됨' : '이메일 주소 복사'
                        }
                      >
                        <span aria-hidden="true">{copied ? '복사됨 ✓' : '복사'}</span>
                      </button>
                    </span>
                  )}

                  {row.key === 'address' && COMPANY.address}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
