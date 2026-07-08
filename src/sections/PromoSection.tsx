import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { AppService } from '../data/services';
import { StoreBadges } from '../components/ui/StoreBadges';
import { MoodIcon } from '../components/ui/MoodIcon';
import { useReveal } from '../hooks/useReveal';
import { iconFor } from '../lib/icons';
import styles from './PromoSection.module.css';

// 토스트 표시 시간(ms) — 진입 후 잠깐 떴다 사라진다.
const TOAST_MS = 2600;

/**
 * 서비스별 "미니 홍보 사이트" 섹션.
 * 각 서비스의 실제 웹/앱 디자인(시그니처 컬러·폰트·라운드·모티프)을 그대로 재현해
 * 해당 서비스만의 풀 테마로 잠깐 전환된다. promo 데이터가 있는 서비스에만 렌더된다.
 *
 * 테마 격리: palette를 --p-* 인라인 변수로 주입 → 전역 토큰 비오염, 한 컴포넌트로 N개 브랜드.
 */
interface PromoSectionProps {
  service: AppService;
  /** 좌우 배치 방향. 짝수/홀수로 교차하면 리듬이 생긴다. */
  flip?: boolean;
  /** 섹션이 뷰포트에서 충분히 보일 때 1회 호출 — 게이미피케이션 "수집". */
  onCollect?: (id: string) => void;
}

export function PromoSection({
  service,
  flip = false,
  onCollect,
}: PromoSectionProps) {
  const { promo } = service;
  const reveal = useReveal<HTMLDivElement>();
  const sectionRef = useRef<HTMLElement>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // 섹션이 절반 이상 보이면 "수집" → onCollect 1회 + UNLOCKED 토스트 1회.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    let done = false;
    let toastTimer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !done) {
            done = true;
            io.unobserve(entry.target); // 한 번만 — 중복 수집 방지
            onCollect?.(service.id);
            setToastVisible(true);
            toastTimer = window.setTimeout(() => setToastVisible(false), TOAST_MS);
          }
        }
      },
      // 섹션 상단이 뷰포트 중앙(아래 35%) 안에 들어오면 수집.
      // threshold 0.5는 뷰포트보다 긴 섹션에서 트리거 안 될 수 있어 rootMargin으로 대체.
      { threshold: 0.01, rootMargin: '0px 0px -35% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (toastTimer) window.clearTimeout(toastTimer); // 언마운트 시 타이머 정리
    };
  }, [service.id, onCollect]);

  if (!promo) return null;

  const themeVars = {
    '--p-bg': promo.palette.bg,
    '--p-hero': promo.palette.heroGradient,
    '--p-surface': promo.palette.surface,
    '--p-primary': promo.palette.primary,
    '--p-accent': promo.palette.accent,
    '--p-ink': promo.palette.ink,
    '--p-ink-soft': promo.palette.inkSoft,
    '--p-on-primary': promo.palette.onPrimary,
    '--p-font-display': promo.fontDisplay,
    '--p-font-body': promo.fontBody,
    '--p-radius': `${promo.radius}px`,
  } as CSSProperties;

  const sectionClass = [
    styles.section,
    styles[`motif_${promo.motif}`],
    promo.dark ? styles.dark : '',
    flip ? styles.flip : '',
  ]
    .filter(Boolean)
    .join(' ');

  // 헤드라인: 줄바꿈(\n) 보존 + accent 강조 분리
  const headlineLines = promo.headline.split('\n');

  return (
    <section
      ref={sectionRef}
      id={`promo-${service.id}`}
      className={sectionClass}
      style={themeVars}
      aria-labelledby={`promo-${service.id}-title`}
    >
      {/* 수집 토스트 — 섹션 진입 시 "✓ {서비스} UNLOCKED" 1회 (게임 보상감) */}
      <div
        className={`${styles.unlockToast} ${
          toastVisible ? styles.unlockToastShow : ''
        }`}
        role="status"
        aria-live="polite"
      >
        <span className={styles.unlockCheck} aria-hidden="true">
          ✓
        </span>
        <span className={styles.unlockText}>
          <strong>{service.name}</strong> UNLOCKED
        </span>
      </div>

      {/* 실사 히어로 배경 (있으면) — 각 서비스 홈의 실제 사진. 오버레이로 가독성 확보 */}
      {promo.heroImage && (
        <div className={styles.heroBg} aria-hidden="true">
          <img
            className={styles.heroImg}
            src={promo.heroImage}
            alt=""
            style={{ objectPosition: promo.heroFocus ?? 'center' }}
            loading="lazy"
          />
          <span className={styles.heroScrim} />
        </div>
      )}

      {/* motif 배경 장식 레이어 (CSS로 그림) */}
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.blobA} />
        <span className={styles.blobB} />
        {/* 잎사귀 모티프(myToday): 섹션 곳곳에 떠다니는 개별 나뭇잎 */}
        {promo.motif === 'leaf' &&
          Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={`${styles.leaf} ${styles[`leaf${i}`]}`} />
          ))}
      </div>

      <div className="ais-container">
        <div ref={reveal} className={`${styles.inner} reveal`}>
          {/* ── 좌: 미니 헤더 + 카피 ── */}
          <div className={styles.copy}>
            <div className={styles.miniHeader}>
              <img
                className={styles.logo}
                src={service.iconUrl}
                alt=""
                width={40}
                height={40}
                loading="lazy"
              />
              <span className={styles.brand}>{service.name}</span>
              <span className={styles.kicker}>{promo.kicker}</span>
              {service.status === 'coming_soon' && (
                <span className={styles.comingSoon}>
                  <span className={styles.comingSoonDot} aria-hidden="true" />
                  COMING SOON
                </span>
              )}
            </div>

            <h2 id={`promo-${service.id}-title`} className={styles.headline}>
              {headlineLines.map((line, i) => (
                <span key={i} className={styles.headlineLine}>
                  {line}
                  {i === headlineLines.length - 1 && promo.headlineAccent && (
                    <span className={styles.accent}>{promo.headlineAccent}</span>
                  )}
                </span>
              ))}
            </h2>

            <p className={styles.subcopy}>{promo.subcopy}</p>

            {/* 통계 하이라이트 칩 */}
            <ul className={styles.highlights}>
              {promo.highlights.map((h) => (
                <li key={h.label} className={styles.highlight}>
                  <strong className={styles.highlightValue}>{h.value}</strong>
                  <span className={styles.highlightLabel}>{h.label}</span>
                </li>
              ))}
            </ul>

            <StoreBadges
              ios={service.links.ios}
              android={service.links.android}
              web={service.links.web}
              tone={promo.dark ? 'dark' : 'light'}
              comingSoon={service.status === 'coming_soon'}
              primaryStore={service.links.webIsLegal}
              className={styles.badges}
            />

            {promo.disclaimer && (
              <p className={styles.disclaimer}>{promo.disclaimer}</p>
            )}
          </div>

          {/* ── 우: 비주얼 — 실제 앱 화면/여행지 실사/아이콘 카드 (서비스별 분기) ── */}
          <div className={styles.visual}>
            {promo.shot ? (
              /* 실제 앱 홈 화면 스크린샷 → 폰 프레임 목업 (myPet) */
              <div className={styles.phone}>
                <span className={styles.phoneNotch} aria-hidden="true" />
                <img
                  className={styles.phoneShot}
                  src={promo.shot}
                  alt={`${service.name} 앱 화면`}
                  loading="lazy"
                />
              </div>
            ) : promo.mascot ? (
              /* 마스코트 히어로 + 기분 칩 + 스텝 (myToday: 새싹 성장 서사) */
              <div className={styles.growCard}>
                <div className={styles.mascotStage}>
                  <span className={styles.mascotGlow} aria-hidden="true" />
                  <img
                    className={styles.mascotImg}
                    src={promo.mascot}
                    alt={`${service.name} 마스코트`}
                    width={200}
                    height={200}
                    loading="lazy"
                  />
                </div>

                {promo.moods && (
                  <ul className={styles.moods} aria-label="기분 단계">
                    {promo.moods.map((m) => (
                      <li key={m.label} className={styles.moodChip}>
                        <span
                          className={styles.moodEmoji}
                          style={{ background: m.color }}
                          aria-hidden="true"
                        >
                          <MoodIcon score={m.score} />
                        </span>
                        <span className={styles.moodLabel}>{m.label}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {promo.steps && (
                  <ol className={styles.growSteps}>
                    {promo.steps.map((s) => (
                      <li key={s.no} className={styles.step}>
                        <span className={styles.stepNo} aria-hidden="true">
                          {s.no}
                        </span>
                        <span className={styles.stepBody}>
                          <strong className={styles.stepTitle}>{s.title}</strong>
                          <span className={styles.stepDesc}>{s.desc}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ) : promo.steps ? (
              /* 번호 매긴 스텝 흐름 (myTravel: 3단계로 완성하는 여행 계획) */
              <ol className={styles.steps}>
                {promo.steps.map((s) => (
                  <li key={s.no} className={styles.step}>
                    <span className={styles.stepNo} aria-hidden="true">
                      {s.no}
                    </span>
                    <span className={styles.stepBody}>
                      <strong className={styles.stepTitle}>{s.title}</strong>
                      <span className={styles.stepDesc}>{s.desc}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : promo.stars ? (
              /* 스타 라인업 그리드 (내새끼: 원형 컬러 아바타 칩) */
              <ul className={styles.stars}>
                {promo.stars.map((star) => (
                  <li key={star.name} className={styles.starChip}>
                    <span
                      className={styles.starAvatar}
                      style={{ background: star.color }}
                      aria-hidden="true"
                    >
                      {star.name.slice(0, 1)}
                    </span>
                    <span className={styles.starText}>
                      <strong className={styles.starName}>{star.name}</strong>
                      <span className={styles.starTag}>{star.tag}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : promo.gallery ? (
              /* 실제 여행지 실사 카드 갤러리 */
              <ul className={styles.gallery}>
                {promo.gallery.map((g) => (
                  <li key={g.label} className={styles.galleryCard}>
                    <img
                      className={styles.galleryImg}
                      src={g.src}
                      alt={g.label}
                      loading="lazy"
                    />
                    <span className={styles.galleryMeta}>
                      <strong className={styles.galleryLabel}>{g.label}</strong>
                      {g.sub && (
                        <span className={styles.gallerySub}>{g.sub}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              /* 아이콘 + 기능 카드 (myBaby: 화이트 카드 UI 그대로) */
              <div className={styles.appCard}>
                <div className={styles.appCardGlow} aria-hidden="true" />
                <img
                  className={styles.appIcon}
                  src={service.iconUrl}
                  alt={`${service.name} 앱 아이콘`}
                  width={120}
                  height={120}
                  loading="lazy"
                />
                <span className={styles.appName}>{service.name}</span>
                <span className={styles.appTagline}>{service.tagline}</span>

                <ul className={styles.featureList}>
                  {service.features.map((f) => (
                    <li key={f.title} className={styles.featureItem}>
                      <span className={styles.featureIcon} aria-hidden="true">
                        {iconFor(f.icon)}
                      </span>
                      <span className={styles.featureText}>
                        <strong className={styles.featureTitle}>{f.title}</strong>
                        <span className={styles.featureDesc}>{f.desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
