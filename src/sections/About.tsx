import type { JSX } from 'react';
import { COMPANY } from '../data/company';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TechBadge } from '../components/ui/TechBadge';
import { useReveal } from '../hooks/useReveal';
import styles from './About.module.css';

/**
 * About 섹션 — 밝은 에디토리얼 회사 소개.
 * Technology(다크 네이비) 다음에 놓여 밝음↔다크 리듬을 완성한다.
 * 크림/웜 서페이스 위에 리드 스테이트먼트 + 가치 카드 그리드 + 신뢰 지표 +
 * 대표 정보 순으로 회사의 철학과 실체를 정통 기업 톤으로 전시한다.
 * 콘텐츠는 실제 6개 앱 도메인·플랫폼·SoT(company.ts)에 근거해 과장을 배제한다.
 */

interface AboutValue {
  /** 인라인 SVG 아이콘 키 */
  icon: 'widgets' | 'favorite' | 'hub' | 'verified_user';
  title: string;
  desc: string;
}

// 확정 콘텐츠: 회사의 철학을 확장한 리드 스테이트먼트(슬로건 재탕이 아님).
const LEAD_STATEMENT =
  '일상의 크고 작은 순간마다, AI가 곁에서 조용히 돕습니다. 에이아이소프트는 여행부터 반려동물, 마음 습관, 음악, 계약서까지 — 매일의 물음에 답하는 AI 앱을 하나씩 만들어 갑니다.';

// 비전/미션/가치 4종 — 아이콘 + 제목 + 설명.
const VALUES: AboutValue[] = [
  {
    icon: 'widgets',
    title: '일상 밀착 AI',
    desc: '여행 일정, 반려동물 케어, 마음 습관, 음악 만들기, 계약서 이해까지. 거창한 미래가 아니라 오늘 당장 마주하는 일상의 순간에 AI를 담습니다.',
  },
  {
    icon: 'favorite',
    title: '따뜻한 기술',
    desc: '기술을 위한 기술이 아니라 사람을 위한 기술을 지향합니다. 복잡한 것은 AI가 대신 풀고, 사용자에게는 쉽고 다정한 경험만 남기려 합니다.',
  },
  {
    icon: 'hub',
    title: '확장하는 생태계',
    desc: '하나의 앱에 머물지 않습니다. 새로운 서비스를 계속 더할 수 있는 구조 위에서, 일상의 더 많은 영역으로 AI 서비스를 넓혀 갑니다.',
  },
  {
    icon: 'verified_user',
    title: '정직한 안내',
    desc: 'AI의 도움은 참고와 편의를 위한 것임을 분명히 밝힙니다. 건강·법률 같은 중요한 판단은 전문가의 몫으로 남겨 두고, 과장 없이 있는 그대로 안내합니다.',
  },
];

// 신뢰 지표 — 실제 서비스 수·플랫폼·도메인·대표 정보에서 파생(허위 확장 없음).
const TRUST_SIGNALS: readonly string[] = [
  '일상 곳곳을 잇는 6개의 AI 앱 서비스',
  'iOS·Android·Web 3개 플랫폼 지원',
  '여행·반려·일상·음악·법률까지 넓어지는 서비스 영역',
  `대표 ${COMPANY.ceo} · 문의 ${COMPANY.email}`,
];

// Material Symbols 대응 인라인 SVG(이모지 대신 정통 라인 아이콘 — Technology와 동일 패턴).
const VALUE_ICONS: Record<AboutValue['icon'], JSX.Element> = {
  widgets: (
    <path
      d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm13 0l3.5 6h-7L17 14z"
      fill="currentColor"
    />
  ),
  favorite: (
    <path
      d="M12 21l-1.45-1.32C5.4 15.03 2 11.94 2 8.14 2 5.6 3.98 3.6 6.5 3.6c1.42 0 2.79.66 3.7 1.71l1.8 2.06 1.8-2.06a4.92 4.92 0 013.7-1.71C22.02 3.6 24 5.6 24 8.14c0 3.8-3.4 6.89-8.55 11.54L12 21z"
      transform="translate(-1 0)"
      fill="currentColor"
    />
  ),
  hub: (
    <path
      d="M12 2a3 3 0 00-1 5.83V10H7.83A3 3 0 106 12.83V15H4.83a3 3 0 101.17 1.83V17H13v-2.17A3 3 0 0011 12.83V10h1v2.17A3 3 0 1013 10V7.83A3 3 0 0012 2z"
      fill="currentColor"
    />
  ),
  verified_user: (
    <path
      d="M12 2l8 3v6c0 4.8-3.4 8.9-8 10-4.6-1.1-8-5.2-8-10V5l8-3zm-1.1 12.6l5-5-1.4-1.4-3.6 3.6-1.6-1.6L7.9 11.6l3 3z"
      fill="currentColor"
    />
  ),
};

/** 리드 스테이트먼트에서 강조할 서비스 도메인 키워드(웜 골드 밑줄). */
const HIGHLIGHT_TERM = '여행부터 반려동물, 마음 습관, 음악, 계약서까지';

/** 리드 스테이트먼트를 렌더하되 도메인 나열 구절만 강조 노드로 분리(HTML 주입 없음). */
function renderLead(): JSX.Element[] {
  const parts = LEAD_STATEMENT.split(HIGHLIGHT_TERM);
  if (parts.length !== 2) {
    return [<span key="lead">{LEAD_STATEMENT}</span>];
  }
  return [
    <span key="lead-a">{parts[0]}</span>,
    <em key="lead-em" className={styles.leadHighlight}>
      {HIGHLIGHT_TERM}
    </em>,
    <span key="lead-b">{parts[1]}</span>,
  ];
}

function ValueCard({ value, index }: { value: AboutValue; index: number }) {
  const ref = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      className={`${styles.valueCard} reveal`}
      style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
    >
      <span className={styles.valueIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" role="img">
          {VALUE_ICONS[value.icon]}
        </svg>
      </span>
      <h3 className={styles.valueTitle}>{value.title}</h3>
      <p className={styles.valueDesc}>{value.desc}</p>
    </li>
  );
}

export function About() {
  const leadRef = useReveal<HTMLDivElement>();
  const signalsRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className="ais-container">
        <div className={styles.heading}>
          <TechBadge variant="gold" dot>
            ORGANIZATION
          </TechBadge>
          <SectionHeader
            chapter="회사 소개 / 03"
            eyebrow="회사 소개"
            title="에이아이소프트"
            id="about-title"
          />
        </div>

        {/* ── 리드 스테이트먼트 — 회사 철학을 큰 타이포로 ── */}
        <div ref={leadRef} className={`${styles.lead} reveal`}>
          <p className={styles.leadText}>{renderLead()}</p>
        </div>

        {/* ── 가치 카드 그리드 — 비전/미션/가치 ── */}
        <ul className={styles.values}>
          {VALUES.map((value, i) => (
            <ValueCard key={value.title} value={value} index={i} />
          ))}
        </ul>

        {/* ── 신뢰 지표 + 대표 정보 패널 ── */}
        <div ref={signalsRef} className={`${styles.trust} reveal`}>
          <div className={styles.trustHead}>
            <span className={styles.trustEyebrow}>AT A GLANCE</span>
            <p className={styles.trustLead}>{COMPANY.slogan}</p>
          </div>
          <ul className={styles.signalList}>
            {TRUST_SIGNALS.map((signal) => (
              <li key={signal} className={styles.signalItem}>
                <span className={styles.signalDot} aria-hidden="true" />
                <span>{signal}</span>
              </li>
            ))}
          </ul>
          <span className={styles.wordmark} aria-hidden="true">
            {COMPANY.name}
          </span>
        </div>
      </div>
    </section>
  );
}
