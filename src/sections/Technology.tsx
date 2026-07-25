import { SectionHeader } from '../components/ui/SectionHeader';
import { TechBadge } from '../components/ui/TechBadge';
import { useReveal } from '../hooks/useReveal';
import { useCountUp } from '../hooks/useCountUp';
import { useTilt } from '../hooks/useTilt';
import { SERVICES } from '../data/services';
import type { MutableRefObject, RefObject } from 'react';
import trustTeam from '../assets/photos/trust-team.jpg';
import styles from './Technology.module.css';

/**
 * 여러 훅의 ref를 한 DOM 노드에 병합할 때 사용.
 * useRef 기반 ref는 런타임상 가변이므로 .current 할당이 안전하다(타입만 정정).
 */
function assignRef<T>(ref: RefObject<T> | MutableRefObject<T | null>, node: T | null) {
  (ref as MutableRefObject<T | null>).current = node;
}

/**
 * Technology 섹션.
 * 밝은 Hero/About 사이에 놓이는 유일한 다크 앵커 — 다크 네이비 프리미엄 역량 섹션.
 * 게임 스탯보드(게이지/링/레어도)를 걷어내고, '이미 서비스에 반영된 검증된 역량을
 * 큰 수치 하나로 자신 있게 제시'하는 정통 신뢰 연출로 구성한다.
 * 강조 수치는 services.ts 데이터에서 도출하여 과장/허위를 배제한다.
 */

// ── 데이터 기반 수치 도출(하드코딩 반복 금지) ──
const SERVICE_COUNT = SERVICES.length;

// myTravel stats의 "지원 언어" 값에서 숫자만 추출 (예: "17개" → 17)
const LANGUAGE_COUNT = (() => {
  const travel = SERVICES.find((s) => s.id === 'mytravel');
  const langStat = travel?.stats?.find((st) => st.label === '지원 언어');
  const parsed = langStat ? parseInt(langStat.value, 10) : NaN;
  return Number.isNaN(parsed) ? null : parsed;
})();

// 데이터에 web/ios/android 링크가 실제로 존재하는 플랫폼만 집계
const PLATFORMS = (() => {
  const set = new Set<string>();
  for (const svc of SERVICES) {
    if (svc.links.ios) set.add('iOS');
    if (svc.links.android) set.add('Android');
    if (svc.links.web) set.add('Web');
  }
  // 표기 순서 보장
  return ['iOS', 'Android', 'Web'].filter((p) => set.has(p));
})();

interface TechMetric {
  /** 큰 카운터 타이포로 표시될 핵심 값 */
  value: string;
  /** 값 뒤 단위/접미 */
  unit?: string;
  label: string;
}

interface TechCapability {
  /** 인라인 SVG 키 */
  icon: 'ai' | 'location' | 'globe' | 'devices';
  /** 역량 카테고리 라벨 (정통 기업 톤) */
  category: string;
  title: string;
  desc: string;
  metric: TechMetric;
}

const CAPABILITIES: TechCapability[] = [
  {
    icon: 'ai',
    category: 'AI 엔진',
    title: '생성형 AI 설계',
    desc: '목적지나 증상을 입력하면 AI가 여행 일정을 짜고 건강 관련 참고 정보를 제안합니다.',
    metric: { value: '3', unit: '단계', label: 'AI 자동 완성' },
  },
  {
    icon: 'location',
    category: '위치 기반',
    title: '위치 기반 추천',
    desc: '실시간 위치를 기반으로 주변 펫 시설과 여행 동선을 똑똑하게 추천합니다.',
    metric: { value: '실시간', label: '주변 탐색·동선' },
  },
  {
    icon: 'globe',
    category: '글로벌',
    title: '다국어 지원',
    desc: '글로벌 사용자를 위해 다양한 언어로 동일한 경험을 제공합니다.',
    metric:
      LANGUAGE_COUNT !== null
        ? { value: String(LANGUAGE_COUNT), unit: '개 언어', label: 'myTravel 기준' }
        : { value: '다국어', label: '글로벌 대응' },
  },
  {
    icon: 'devices',
    category: '플랫폼',
    title: '크로스플랫폼',
    desc: `iOS·Android·Web 어디서나 끊김 없는 경험으로 ${SERVICE_COUNT}개 서비스를 이용할 수 있습니다.`,
    // 서비스가 늘면 자동 반영되는 "서비스 수"를 대표 수치로 — 정체된 '3개 플랫폼' 느낌 제거.
    metric: {
      value: String(SERVICE_COUNT),
      unit: '개 서비스',
      label: PLATFORMS.join(' · '),
    },
  },
];

const ICONS: Record<TechCapability['icon'], JSX.Element> = {
  ai: (
    <path
      d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3zM18.5 14.5l.95 2.3 2.3.95-2.3.95-.95 2.3-.95-2.3-2.3-.95 2.3-.95.95-2.3z"
      fill="currentColor"
    />
  ),
  location: (
    <path
      d="M12 2c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"
      fill="currentColor"
    />
  ),
  globe: (
    <path
      d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.93 6h-2.95a15.7 15.7 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a7.96 7.96 0 010-4h3.38a16.5 16.5 0 000 4H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.03 8.03 0 015.07 16zm2.95-8H5.07a8.03 8.03 0 014.33-3.56A15.7 15.7 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82A14.6 14.6 0 0112 19.96zM14.34 14H9.66a14.7 14.7 0 010-4h4.68a14.7 14.7 0 010 4zm.27 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14a16.5 16.5 0 000-4h3.38a7.96 7.96 0 010 4h-3.38z"
      fill="currentColor"
    />
  ),
  devices: (
    <path
      d="M3 6h14v2H5v8h6v2H3a1 1 0 01-1-1V7a1 1 0 011-1zm15 3h3a1 1 0 011 1v9a1 1 0 01-1 1h-3a1 1 0 01-1-1v-9a1 1 0 011-1zm.5 9.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
      fill="currentColor"
    />
  ),
};

/**
 * 정통 역량 카드.
 * 큰 수치(metric)를 카드의 주역으로 삼는 신뢰 연출.
 * 수치가 정수형이면 useCountUp으로 '실적을 세는' 정통 카운터를 붙이고,
 * '실시간'처럼 비수치 값은 롤업 없이 정적 렌더한다.
 */
function CapabilityCard({ cap, index }: { cap: TechCapability; index: number }) {
  const revealRef = useReveal<HTMLLIElement>();
  const tiltRef = useTilt<HTMLLIElement>(6);

  // metric.value가 순수 정수면 카운트업 대상. 아니면 롤업 없이 정적 표시.
  const numericTarget = /^\d+$/.test(cap.metric.value)
    ? parseInt(cap.metric.value, 10)
    : null;
  // 카운터는 metric 정수값(3/6/17…)에 연결 — 게이지가 아니라 '실적을 세는' 카운터.
  const [countRef, counted] = useCountUp<HTMLSpanElement>(numericTarget ?? 0, {
    durationMs: 1100,
    delayMs: 200 + index * 120,
  });
  const displayValue = numericTarget !== null ? String(counted) : cap.metric.value;

  // reveal 클래스 토글 + 틸트 리스너를 카드 요소에 병합.
  const setRefs = (node: HTMLLIElement | null) => {
    assignRef(revealRef, node);
    assignRef(tiltRef, node);
  };

  return (
    <li
      ref={setRefs}
      className={`${styles.card} reveal`}
      style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
    >
      {/* ── 헤더: 아이콘 슬롯 + 카테고리 이브로우 ── */}
      <div className={styles.cardTop}>
        <span className={styles.iconWrap} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" role="img">
            {ICONS[cap.icon]}
          </svg>
        </span>
        <span className={styles.category}>{cap.category}</span>
      </div>

      {/* ── 큰 수치 — 카드의 주역 ── */}
      <div className={styles.metric}>
        <span ref={countRef} className={styles.metricValue}>
          {displayValue}
        </span>
        {cap.metric.unit && (
          <span className={styles.metricUnit}>{cap.metric.unit}</span>
        )}
      </div>
      <span className={styles.metricLabel}>{cap.metric.label}</span>

      {/* 게이지가 아닌 순수 구획선(hairline divider) */}
      <span className={styles.divider} aria-hidden="true" />

      <h3 className={styles.cardTitle}>{cap.title}</h3>
      <p className={styles.cardDesc}>{cap.desc}</p>

      <span className={styles.cardGlow} aria-hidden="true" />
    </li>
  );
}

export function Technology() {
  const bannerRef = useReveal<HTMLElement>();
  return (
    <section
      id="technology"
      className={styles.section}
      aria-labelledby="technology-heading"
    >
      <div className="ais-container">
        <div className={styles.badgeRow}>
          <TechBadge variant="navy" dot>
            핵심 역량
          </TechBadge>
          <TechBadge variant="outline">{`${SERVICE_COUNT}개 서비스 · ${PLATFORMS.length}개 플랫폼`}</TechBadge>
        </div>

        <SectionHeader
          eyebrow="TECHNOLOGY"
          title="에이아이소프트의 기술력"
          desc={`${SERVICE_COUNT}개의 서비스를 관통하는 AI·위치·다국어·크로스플랫폼 역량으로 일상의 문제를 단순하게 풉니다.`}
          id="technology-heading"
        />

        {/* 신뢰/전문성 매거진 배너 — 협업 팀 실사 위 네이비/골드 오버레이 */}
        <figure className={`${styles.banner} reveal`} ref={bannerRef}>
          <img
            className={styles.bannerImg}
            src={trustTeam}
            alt="사람과 AI의 협업을 표현한 연출 이미지"
            width={1100}
            height={733}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.bannerOverlay} aria-hidden="true" />
          <figcaption className={styles.bannerCaption}>
            <span className={styles.bannerCode}>사람 × AI</span>
            <p className={styles.bannerText}>
              사람의 통찰과 AI 엔진으로, 기획부터 출시까지 이어갑니다.
            </p>
            <span className={styles.bannerStats}>
              {`${LANGUAGE_COUNT ?? '다국어'}${
                LANGUAGE_COUNT !== null ? '개 언어' : ''
              } · ${SERVICE_COUNT}개 서비스 · ${PLATFORMS.join(' / ')}`}
            </span>
            {/* 건강 관련 성능 문구 근접 고지 (표시광고법 중요정보 근접표시 원칙) */}
            <span className={styles.bannerNote}>
              AI 건강 가이드는 참고용이며 수의학적 진단을 대체하지 않습니다.
            </span>
          </figcaption>
        </figure>

        {/* 정통 요약 라인 — 게이지/퍼센트 없이 라인 디바이더 역할만 */}
        <p className={styles.summaryLine}>
          AI · 위치 · 다국어 · 크로스플랫폼 — {SERVICE_COUNT}개 서비스 전반에
          적용
        </p>

        <ul className={styles.grid}>
          {CAPABILITIES.map((cap, i) => (
            <CapabilityCard key={cap.title} cap={cap} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
