import type { CSSProperties, JSX } from 'react';
import { COMPANY } from '../data/company';
import { SERVICES_SORTED } from '../data/services';
import { Button } from '../components/ui/Button';
import { useReveal } from '../hooks/useReveal';
import { useCountUp } from '../hooks/useCountUp';
import { usePointerParallax } from '../hooks/usePointerParallax';
import styles from './Hero.module.css';

// Hero 다음 첫 콘텐츠 섹션(첫 미니 홍보)의 앵커 — 둘러보기/스크롤 타겟.
const FIRST_PROMO = SERVICES_SORTED.find((s) => s.promo);

// 신뢰지표 — services.ts에서 도출한 "근거 있는 값"만 사용(허위 수치 금지).
// 서비스 추가 시 자동 증가. 플랫폼은 실제 링크가 존재하는 것만 집계.
const SERVICE_COUNT = SERVICES_SORTED.length;
const PLATFORM_COUNT = (() => {
  const set = new Set<string>();
  for (const s of SERVICES_SORTED) {
    if (s.links.ios) set.add('iOS');
    if (s.links.android) set.add('Android');
    if (s.links.web) set.add('Web');
  }
  return set.size;
})();

/** 슬로건을 단어 단위로 쪼개 글자별 stagger 등장에 사용. 공백/줄바꿈 보존. */
function splitWords(text: string): string[] {
  return text.split(/(\s+)/);
}

/**
 * 슬로건 안에서 serif italic 대비로 강조할 감성 어절(핵심 명사 1개).
 * "AI"(골드 그라데이션 클립)와 공존해 이중 시그니처를 만든다. 매칭 없으면 무시.
 */
const SERIF_ACCENT = '일상';

/** 어절 안에서 serif 강조어를 분리해 <em> serif italic 노드로 감싼다(HTML 주입 없음). */
function renderSerifSplit(word: string): (string | JSX.Element)[] {
  if (!word.includes(SERIF_ACCENT)) return [word];
  const parts = word.split(SERIF_ACCENT);
  return parts.flatMap((part, p) =>
    p === 0
      ? [part]
      : [
          <em key={`s${p}`} className={styles.serifAccent}>
            {SERIF_ACCENT}
          </em>,
          part,
        ],
  );
}

/**
 * 슬로건 안의 "AI" 토큰은 그라데이션 텍스트 클립으로, 감성 어절("일상")은 serif italic으로
 * 강조하기 위해 단어를 나눠 각각 별도 span 처리한다. (매칭 없으면 원문 솔리드)
 */
function renderWord(word: string, i: number) {
  const style = { '--word-i': i } as CSSProperties;
  if (!word.includes('AI')) {
    return (
      <span key={i} className={styles.word} style={style}>
        {renderSerifSplit(word)}
      </span>
    );
  }
  // "AI"만 그라데이션 클립, 앞뒤 잔여 문자는 (serif 강조 처리 후) 솔리드 잉크로.
  const parts = word.split('AI');
  return (
    <span key={i} className={styles.word} style={style}>
      {parts.flatMap((part, p) =>
        p === 0
          ? renderSerifSplit(part)
          : [
              <span key={p} className={styles.wordAI}>
                AI
              </span>,
              ...renderSerifSplit(part),
            ],
      )}
    </span>
  );
}

/**
 * 정통 프리미엄 기업 히어로 (Stripe/Linear 풍).
 * 웜크림 베이스 + 대각 골드 그라데이션 배경, 좌 대형 슬로건 카피 + 신뢰지표 통계 행,
 * 우 6서비스 절제 로고 프리뷰. 게임 HUD(LV/XP/PRESS START/UNLOCKED)는 전면 제거.
 * 모션은 transform/opacity만. reduced-motion에서 드리프트/패럴랙스/카운트업 정지.
 */
export function Hero() {
  const copyRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const heroRef = usePointerParallax<HTMLElement>();
  const words = splitWords(COMPANY.slogan);
  const promoHref = FIRST_PROMO ? `#promo-${FIRST_PROMO.id}` : '#main';

  // 신뢰지표 6·3 롤업 — 실제 도출값으로 0→목표 카운트업(과장 없음).
  const [serviceRef, serviceCount] = useCountUp<HTMLDivElement>(SERVICE_COUNT, {
    durationMs: 1200,
    delayMs: 300,
  });
  const [platformRef, platformCount] = useCountUp<HTMLDivElement>(
    PLATFORM_COUNT,
    { durationMs: 1200, delayMs: 420 },
  );

  return (
    <section
      id="top"
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="hero-heading"
    >
      {/* 배경: 웜크림 베이스 + 대각 골드 그라데이션(느린 드리프트). 장식, 스크린리더 무시. */}
      <div className={styles.heroGradient} aria-hidden="true">
        <span className={styles.gradGlow} />
        <span className={styles.hairline} />
      </div>

      <div className={`ais-container ${styles.inner}`}>
        <div className={styles.heroGrid}>
          {/* ── 좌: 카피 ── */}
          <div ref={copyRef} className={`${styles.copy} reveal`}>
            <p className={styles.eyebrow}>AI APP STUDIO</p>

            <h1 id="hero-heading" className={styles.headline}>
              {words.map((word, i) =>
                /\s+/.test(word) ? ' ' : renderWord(word, i),
              )}
            </h1>

            <p className={styles.sub}>{COMPANY.intro}</p>

            <dl className={styles.trustRow} aria-label="에이아이소프트 현황">
              <div className={styles.trustItem}>
                <dt className={styles.trustValueWrap}>
                  <span ref={serviceRef} className={styles.trustValue}>
                    {serviceCount}
                  </span>
                </dt>
                <dd className={styles.trustLabel}>서비스</dd>
              </div>
              <span className={styles.trustDivider} aria-hidden="true" />
              <div className={styles.trustItem}>
                <dt className={styles.trustValueWrap}>
                  <span ref={platformRef} className={styles.trustValue}>
                    {platformCount}
                  </span>
                </dt>
                <dd className={styles.trustLabel}>플랫폼 iOS·Android·Web</dd>
              </div>
              <span className={styles.trustDivider} aria-hidden="true" />
              <div className={styles.trustItem}>
                <dt className={styles.trustValueWrap}>
                  <span className={styles.trustValue}>AI</span>
                </dt>
                <dd className={styles.trustLabel}>기반 기술</dd>
              </div>
            </dl>

            <div className={styles.actions}>
              <Button href={promoHref} variant="primary">
                서비스 둘러보기
              </Button>
              <Button href="#about" variant="ghost">
                에이아이소프트 소개
              </Button>
            </div>
          </div>

          {/* ── 우: 6서비스 절제 로고 프리뷰 (정적, 상세는 PromoSection 위임) ── */}
          <aside
            className={styles.servicePreview}
            aria-label="에이아이소프트 서비스"
          >
            <div className={styles.previewPanel}>
              <div className={styles.previewCaption}>
                <span className={styles.previewKicker}>SERVICES</span>
                <span className={styles.previewTagline}>일상을 잇는 AI 앱</span>
              </div>
              <ul className={styles.previewGrid}>
                {SERVICES_SORTED.map((service, i) => (
                <li
                  key={service.id}
                  className={styles.previewCard}
                  style={
                    {
                      '--card-accent': service.theme.primary,
                      '--card-i': String(i),
                    } as CSSProperties
                  }
                >
                  <a
                    href={service.promo ? `#promo-${service.id}` : '#main'}
                    className={styles.previewLink}
                  >
                    <span className={styles.previewIconWrap}>
                      <img
                        className={styles.previewIcon}
                        src={service.iconUrl}
                        alt=""
                        width={40}
                        height={40}
                        loading="eager"
                        decoding="async"
                        aria-hidden="true"
                      />
                      <span
                        className={styles.previewDot}
                        aria-hidden="true"
                      />
                    </span>
                    <span className={styles.previewName}>{service.name}</span>
                  </a>
                </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* 스크롤 인디케이터 — 절제된 hairline 트랙 */}
      <a
        href={promoHref}
        className={styles.scrollHint}
        aria-label="아래로 스크롤하여 서비스 보기"
      >
        <span className={styles.scrollText}>SCROLL</span>
        <span className={styles.scrollTrack} aria-hidden="true">
          <span className={styles.scrollThumb} />
        </span>
      </a>
    </section>
  );
}
