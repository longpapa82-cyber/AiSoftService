import type { CSSProperties } from 'react';
import type { AppService } from '../data/services';
import { StoreBadges } from '../components/ui/StoreBadges';
import { MoodIcon } from '../components/ui/MoodIcon';
import { useReveal } from '../hooks/useReveal';
import { iconFor } from '../lib/icons';
import styles from './PromoSection.module.css';

/**
 * 조항 텍스트 안에서 핵심 문구(emphasis)만 볼드+컬러 하이라이트로 감싼다.
 * XSS 안전: HTML 주입 없이 문자열 split → React 노드 배열로 반환.
 * emphasis가 없거나 매칭 안 되면 원문 그대로.
 */
function renderEmphasis(text: string, emphasis: string | undefined, cls: string) {
  if (!emphasis || !text.includes(emphasis)) return text;
  const parts = text.split(emphasis);
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <strong key={i} className={cls}>
            {emphasis}
          </strong>,
          part,
        ],
  );
}

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
}

export function PromoSection({ service, flip = false }: PromoSectionProps) {
  const { promo } = service;
  const reveal = useReveal<HTMLDivElement>();

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
      id={`promo-${service.id}`}
      className={sectionClass}
      style={themeVars}
      aria-labelledby={`promo-${service.id}-title`}
    >
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

      {/* 여행 무드 이모지(Voice Buddy): 배경 blob 위·전경 콘텐츠 아래 별도 레이어.
          .decor(z-index:-2)에 두면 콘텐츠에 가려지므로 자체 레이어(z-index:1)로 분리. */}
      {promo.travelDecor && (
        <div className={styles.travelDecor} aria-hidden="true">
          {promo.travelDecor.map((icon, i) => (
            <span
              key={`td-${i}`}
              className={`${styles.travelIcon} ${styles[`travelIcon${i}`]}`}
            >
              {icon}
            </span>
          ))}
        </div>
      )}

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
              {promo.trialBadge && (
                <span className={styles.trialBadge}>{promo.trialBadge}</span>
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

            {/* 언어 스왑 위젯(Voice Buddy): 통역 방향을 한눈에 — CTA 위 pill */}
            {promo.langSwap && (
              <div className={styles.langSwap} aria-label="지원 통역 방향">
                <span className={styles.langSwapSide}>
                  <span className={styles.langSwapFlag} aria-hidden="true">
                    {promo.langSwap.from.flag}
                  </span>
                  <span className={styles.langSwapLabel}>{promo.langSwap.from.label}</span>
                </span>
                <span className={styles.langSwapArrow} aria-hidden="true">
                  ⇄
                </span>
                <span className={styles.langSwapSide}>
                  <span className={styles.langSwapFlag} aria-hidden="true">
                    {promo.langSwap.to.flag}
                  </span>
                  <span className={styles.langSwapLabel}>{promo.langSwap.to.label}</span>
                </span>
              </div>
            )}

            <StoreBadges
              ios={service.links.ios}
              android={service.links.android}
              web={service.links.web}
              tone={promo.dark ? 'dark' : 'light'}
              comingSoon={service.status === 'coming_soon'}
              androidPending={service.links.androidPending}
              primaryStore={service.links.webIsLegal}
              className={styles.badges}
            />

            {promo.disclaimer && (
              <p className={styles.disclaimer}>{promo.disclaimer}</p>
            )}
          </div>

          {/* ── 우: 비주얼 — 실제 앱 화면/여행지 실사/아이콘 카드 (서비스별 분기) ── */}
          <div className={styles.visual}>
            {promo.analysisCard ? (
              /* 로픽: 부엉이 마스코트 + 글래스 "분석 결과" 카드 (안심도 + 주의/안전 조항) */
              <div className={styles.analysisWrap}>
                {promo.mascot && (
                  <div className={styles.analysisMascot}>
                    <span className={styles.mascotGlow} aria-hidden="true" />
                    <img
                      className={styles.analysisMascotImg}
                      src={promo.mascot}
                      alt={`${service.name} 마스코트`}
                      width={120}
                      height={120}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className={styles.analysisCard}>
                  <div className={styles.analysisHead}>
                    <span className={styles.analysisDocGroup}>
                      <span className={styles.analysisDocIcon} aria-hidden="true">
                        📄
                      </span>
                      <span className={styles.analysisDoc}>
                        {promo.analysisCard.docLabel}
                      </span>
                    </span>
                    <span
                      className={styles.analysisScore}
                      style={
                        {
                          '--score': promo.analysisCard.safetyScore,
                          '--safe': promo.accentSafe ?? promo.palette.primary,
                        } as CSSProperties
                      }
                    >
                      <strong className={styles.analysisScoreNum}>
                        {promo.analysisCard.safetyScore}
                      </strong>
                      <span className={styles.analysisScoreLabel}>안심도</span>
                    </span>
                  </div>

                  {/* 위험/안전 집계 pill — 스캔 결과를 한눈에 정량 요약 (홍보 사이트 시그니처) */}
                  {promo.analysisCard.tally && (
                    <div className={styles.tally} aria-label="조항 검토 요약">
                      <span
                        className={styles.tallyRisk}
                        style={
                          {
                            '--clause-color': promo.accentCaution ?? '#eab308',
                          } as CSSProperties
                        }
                      >
                        위험 {promo.analysisCard.tally.risk}
                      </span>
                      <span className={styles.tallyDivider} aria-hidden="true" />
                      <span
                        className={styles.tallySafe}
                        style={
                          {
                            '--clause-color': promo.accentSafe ?? '#10b981',
                          } as CSSProperties
                        }
                      >
                        안전 {promo.analysisCard.tally.safe}
                      </span>
                    </div>
                  )}

                  <ul className={styles.clauseList} aria-label="분석된 조항">
                    {promo.analysisCard.clauses.map((c) => (
                      <li
                        key={c.tag}
                        className={`${styles.clauseItem} ${
                          c.kind === 'caution'
                            ? styles.clauseCaution
                            : styles.clauseSafe
                        }`}
                        style={
                          {
                            '--clause-color':
                              c.kind === 'caution'
                                ? (promo.accentCaution ?? '#eab308')
                                : (promo.accentSafe ?? '#10b981'),
                          } as CSSProperties
                        }
                      >
                        <span className={styles.clauseKind} aria-hidden="true">
                          {c.kind === 'caution' ? '주의' : '안전'}
                        </span>
                        <span className={styles.clauseBody}>
                          <strong className={styles.clauseTag}>{c.tag}</strong>
                          <span className={styles.clauseText}>
                            {renderEmphasis(c.text, c.emphasis, styles.clauseEmph)}
                          </span>
                          {/* 부엉이가 풀어주는 "쉽게 말하면…" 설명 버블 (주의 조항의 쉬운 해설) */}
                          {c.ownerNote && (
                            <span className={styles.ownerNote}>
                              <span
                                className={styles.ownerNoteIcon}
                                aria-hidden="true"
                              >
                                🦉
                              </span>
                              <span className={styles.ownerNoteText}>
                                {c.ownerNote}
                              </span>
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {promo.steps && (
                  <ol className={styles.analysisSteps}>
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
            ) : promo.shot ? (
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
                  {/* 소리 확산 링(Voice Buddy): 마스코트 뒤로 퍼지는 음성 파동 */}
                  {promo.soundRings &&
                    Array.from({ length: promo.soundRings }).map((_, i) => (
                      <span
                        key={`ring-${i}`}
                        className={`${styles.soundRing} ${styles[`soundRing${i}`]}`}
                        aria-hidden="true"
                      />
                    ))}
                  <span className={styles.mascotGlow} aria-hidden="true" />
                  <img
                    className={styles.mascotImg}
                    src={promo.mascot}
                    alt={`${service.name} 마스코트`}
                    width={200}
                    height={200}
                    loading="lazy"
                  />
                  {/* 통역 데모 칩(Voice Buddy): 마스코트 주변을 감싸며 떠다니는 흰 pill */}
                  {promo.chatChips?.map((chip, i) => (
                    <span
                      key={chip.text}
                      className={`${styles.chatChip} ${styles[`chatChip${i}`]}`}
                    >
                      <span
                        className={`${styles.chatChipDot} ${styles[`chatChipDot_${chip.tone}`]}`}
                        aria-hidden="true"
                      />
                      {chip.text}
                    </span>
                  ))}
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
