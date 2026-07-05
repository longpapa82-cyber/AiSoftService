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
 * AI Soft의 핵심 기술 역량을 카드로 전시한다.
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
  /** 모노스페이스 코드 라벨 — 하이테크 시그니처 */
  code: string;
  /** 게임 HUD 업적 등급 라벨 (ACHIEVEMENT 타이틀) */
  achievement: string;
  title: string;
  desc: string;
  metric: TechMetric;
  /** 진척 게이지 채움 비율(0~100) — 게임 스탯 보드 */
  gauge: number;
  /** 게이지 우측 모노 라벨 ("100%" / "MAX" 등) */
  gaugeLabel: string;
  /** 레어도 칩 컬러 토큰 (게임 RPG 레어도) */
  rarity: 'rare' | 'epic' | 'legend' | 'gold';
}

const CAPABILITIES: TechCapability[] = [
  {
    icon: 'ai',
    code: 'CORE_AI',
    achievement: 'AI ARCHITECT',
    title: '생성형 AI 설계',
    desc: '목적지·증상만 입력하면 AI가 여행 일정과 건강 가이드를 자동으로 설계합니다.',
    metric: { value: '3', unit: '단계', label: 'AI 자동 완성' },
    gauge: 100,
    gaugeLabel: 'MAX',
    rarity: 'legend',
  },
  {
    icon: 'location',
    code: 'GEO_ENGINE',
    achievement: 'REALTIME SCOUT',
    title: '위치 기반 추천',
    desc: '실시간 위치를 기반으로 주변 펫 시설과 여행 동선을 똑똑하게 추천합니다.',
    metric: { value: '실시간', label: '주변 탐색·동선' },
    gauge: 100,
    gaugeLabel: 'LIVE',
    rarity: 'epic',
  },
  {
    icon: 'globe',
    code: 'MULTI_LANG',
    achievement: 'GLOBAL LINGUIST',
    title: '다국어 지원',
    desc: '글로벌 사용자를 위해 다양한 언어로 동일한 경험을 제공합니다.',
    metric:
      LANGUAGE_COUNT !== null
        ? { value: String(LANGUAGE_COUNT), unit: '개 언어', label: 'myTravel 기준' }
        : { value: '다국어', label: '글로벌 대응' },
    gauge: 100,
    gaugeLabel: LANGUAGE_COUNT !== null ? `${LANGUAGE_COUNT} LANGS` : 'MULTI',
    rarity: 'rare',
  },
  {
    icon: 'devices',
    code: 'CROSS_PLATFORM',
    achievement: 'OMNI DEPLOY',
    title: '크로스플랫폼',
    desc: `iOS·Android·Web 어디서나 끊김 없는 경험으로 ${SERVICE_COUNT}개 서비스를 이용할 수 있습니다.`,
    // 서비스가 늘면 자동 반영되는 "서비스 수"를 대표 수치로 — 정체된 '3개 플랫폼' 느낌 제거.
    metric: {
      value: String(SERVICE_COUNT),
      unit: '개 서비스',
      label: PLATFORMS.join(' · '),
    },
    gauge: 100,
    gaugeLabel: `${PLATFORMS.length} PLATFORMS`,
    rarity: 'gold',
  },
];

// ── 게임 스탯 보드 상단 요약 (총 진척/언락 카운터) ──
const TOTAL_QUESTS = CAPABILITIES.length;
const UNLOCKED_QUESTS = CAPABILITIES.length; // 모든 역량이 LIVE = 언락 완료
const COMPLETION_PCT = Math.round((UNLOCKED_QUESTS / TOTAL_QUESTS) * 100);

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

// 진척 링 둘레 — stroke-dasharray 계산용 (r=20)
const RING_RADIUS = 20;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

function CapabilityCard({ cap, index }: { cap: TechCapability; index: number }) {
  const revealRef = useReveal<HTMLLIElement>();
  const tiltRef = useTilt<HTMLLIElement>(6);
  // 게이지 0→목표 롤업. 카드마다 살짝 시차를 둬 "스탯이 채워지는" 연출.
  const [gaugeRef, g] = useCountUp<HTMLLIElement>(cap.gauge, {
    durationMs: 1100,
    delayMs: 200 + index * 120,
  });
  // 세 훅의 ref를 한 요소에 병합(reveal 클래스 토글 + 틸트 리스너 + 카운트업 관찰).
  // 각 훅의 ref는 런타임상 가변(useRef)이라 .current 할당이 안전하다.
  const setRefs = (node: HTMLLIElement | null) => {
    assignRef(revealRef, node);
    assignRef(tiltRef, node);
    assignRef(gaugeRef, node);
  };
  const dashOffset = RING_CIRC * (1 - g / 100);
  return (
    <li
      ref={setRefs}
      className={`${styles.card} ${styles[`r_${cap.rarity}`]} reveal`}
      style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
    >
      {/* ── HUD 헤더: 업적 등급 + LIVE 언락 칩 ── */}
      <div className={styles.hudRow}>
        <span className={styles.achievement}>
          <span className={styles.achievementStar} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="11" height="11">
              <path
                d="M12 2l2.9 6.26L21.5 9l-5 4.6L18 21l-6-3.4L6 21l1.5-7.4-5-4.6 6.6-.74L12 2z"
                fill="currentColor"
              />
            </svg>
          </span>
          {cap.achievement}
        </span>
        <span className={styles.rarityChip}>
          <span className={styles.rarityDot} aria-hidden="true" />
          UNLOCKED
        </span>
      </div>

      <div className={styles.cardTop}>
        <span className={styles.iconWrap} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" role="img">
            {ICONS[cap.icon]}
          </svg>
        </span>

        {/* ── 진척 링 (게임 스탯 게이지) ── */}
        <span
          className={styles.ring}
          role="img"
          aria-label={`달성률 ${cap.gauge}%`}
        >{/* aria는 최종값으로 고정(스크린리더에 롤업 노이즈 방지) */}
          <svg viewBox="0 0 48 48" width="48" height="48">
            <circle
              className={styles.ringTrack}
              cx="24"
              cy="24"
              r={RING_RADIUS}
              fill="none"
            />
            <circle
              className={styles.ringFill}
              cx="24"
              cy="24"
              r={RING_RADIUS}
              fill="none"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <span className={styles.ringValue}>{g}%</span>
        </span>
      </div>

      <div className={styles.metric}>
        <span className={styles.metricValue}>{cap.metric.value}</span>
        {cap.metric.unit && (
          <span className={styles.metricUnit}>{cap.metric.unit}</span>
        )}
      </div>
      <span className={styles.metricLabel}>{cap.metric.label}</span>

      <h3 className={styles.cardTitle}>{cap.title}</h3>
      <p className={styles.cardDesc}>{cap.desc}</p>

      {/* ── 하단 스탯 게이지 바 (XP/진척감) ── */}
      <div className={styles.statBar}>
        <span className={styles.statCode}>{cap.code}</span>
        <span className={styles.gaugeTrack} aria-hidden="true">
          <span
            className={styles.gaugeFill}
            style={{ '--gauge': `${g}%` } as React.CSSProperties}
          />
        </span>
        <span className={styles.gaugeLabel}>{cap.gaugeLabel}</span>
      </div>

      <span className={styles.cardGlow} aria-hidden="true" />
    </li>
  );
}

export function Technology() {
  const bannerRef = useReveal<HTMLElement>();
  const boardReveal = useReveal<HTMLDivElement>();
  // 보드 진척 게이지·퀘스트 카운터 롤업
  const [boardPctRef, boardPct] = useCountUp<HTMLDivElement>(COMPLETION_PCT, {
    durationMs: 1100,
    delayMs: 200,
  });
  const [questRef, quests] = useCountUp<HTMLElement>(UNLOCKED_QUESTS, {
    durationMs: 900,
    delayMs: 200,
  });
  const setBoardRefs = (node: HTMLDivElement | null) => {
    assignRef(boardReveal, node);
    assignRef(boardPctRef, node);
  };
  return (
    <section
      id="technology"
      className={styles.section}
      aria-labelledby="technology-heading"
    >
      <div className="ais-container">
        <div className={styles.badgeRow}>
          <TechBadge variant="navy" dot>
            NEURAL ENGINE
          </TechBadge>
          <TechBadge variant="outline">{`${SERVICE_COUNT} SERVICES // ${PLATFORMS.length} PLATFORMS`}</TechBadge>
        </div>

        <SectionHeader
          eyebrow="TECHNOLOGY"
          title="AI Soft의 기술력"
          desc={`${SERVICE_COUNT}개의 서비스를 관통하는 AI·위치·다국어·크로스플랫폼 역량으로 일상의 문제를 단순하게 풉니다.`}
          id="technology-heading"
        />

        {/* 신뢰/전문성 매거진 배너 — 협업 팀 실사 위 네이비/골드 오버레이 */}
        <figure className={`${styles.banner} reveal`} ref={bannerRef}>
          <img
            className={styles.bannerImg}
            src={trustTeam}
            alt="AI Soft 팀이 협업하며 서비스를 설계하는 모습"
            width={1100}
            height={733}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.bannerOverlay} aria-hidden="true" />
          <figcaption className={styles.bannerCaption}>
            <span className={styles.bannerCode}>// HUMAN_x_MACHINE</span>
            <p className={styles.bannerText}>
              사람의 통찰과 AI 엔진이 만나는 곳. 기획부터 출시까지 한 팀이
              설계합니다.
            </p>
            <span className={styles.bannerStats}>
              {`${LANGUAGE_COUNT ?? '다국어'}${
                LANGUAGE_COUNT !== null ? '개 언어' : ''
              } · ${SERVICE_COUNT}개 서비스 · ${PLATFORMS.join(' / ')}`}
            </span>
          </figcaption>
        </figure>

        {/* ── 스탯 보드 요약 HUD: 총 퀘스트 진척 게이지 ── */}
        <div className={`${styles.board} reveal`} ref={setBoardRefs}>
          <div className={styles.boardHead}>
            <span className={styles.boardLabel}>// STAT_BOARD</span>
            <span ref={questRef} className={styles.boardQuests}>
              <strong>{quests}</strong>/{TOTAL_QUESTS} QUESTS UNLOCKED
            </span>
          </div>
          <div className={styles.boardBar} aria-hidden="true">
            <span
              className={styles.boardFill}
              style={{ '--gauge': `${boardPct}%` } as React.CSSProperties}
            />
          </div>
          <span className={styles.boardPct}>{boardPct}%</span>
        </div>

        <ul className={styles.grid}>
          {CAPABILITIES.map((cap, i) => (
            <CapabilityCard key={cap.title} cap={cap} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
