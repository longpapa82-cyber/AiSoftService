import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { AppService } from '../data/services';
import { StoreBadges } from '../components/ui/StoreBadges';
import { MoodIcon } from '../components/ui/MoodIcon';
import { DoraniMascot } from '../components/DoraniMascot';
import { useReveal } from '../hooks/useReveal';
import { iconFor } from '../lib/icons';
import styles from './PromoSection.module.css';

/**
 * FitSnap(cloth) 모티프용 의류 라인 아이콘 path — fitsnap 홍보웹 BgApparel의 ICONS 재사용.
 * 둥근 join·부드러운 곡선으로 톤 통일. 배경에 은은히 떠다니며 "옷장/피팅룸" 분위기를 만든다.
 */
const CLOTH_PATHS: Record<string, string> = {
  tshirt: 'M6 9.5 8.8 7A3.2 3.2 0 0 0 12 8.6 3.2 3.2 0 0 0 15.2 7L18 9.5l-2.3 2v6.9H8.3v-6.9L6 9.5Z',
  dress: 'M9.2 4h5.6l-1 4 2.4 11.8H7.8L10.2 8ZM9.2 4 11 6.5M14.8 4 13 6.5',
  hanger: 'M12 6a1.6 1.6 0 1 1 1.4 2.3c-.9.2-1.4.7-1.4 1.5l7.4 4.1c1 .6.6 2.1-.5 2.1H4.1c-1.1 0-1.5-1.5-.5-2.1L11 9.3',
  coat: 'M8 5 6 8v11h5V5m2 0v14h5V8l-2-3M12 5 8 5m4 0 4 0M12 5v10',
};
/** 배경에 배치할 아이콘 순서(위치 프리셋은 CSS clothIcon0~7). */
const CLOTH_ICONS = ['hanger', 'dress', 'tshirt', 'coat', 'hanger', 'tshirt', 'dress', 'coat'];

// 숏킷 cosmos 트윙클 색(홍보웹 Hero 실측): 옐로 포인트 #ffc800 3개 + 흰·라이트블루·민트 혼합.
const COSMOS_TWINKLES = ['#ffc800', '#ffffff', '#ffc800', '#bbd8ff', '#7de3ae', '#ffc800'];

/**
 * FitSnap highlight 칩용 라인 SVG 아이콘 — 이모지 대신 코랄 톤 라인으로 통일(홍보웹 톤).
 * key는 services.ts highlights[].icon 값과 매칭. 없으면 iconFor(이모지) 폴백.
 */
const LINE_ICONS: Record<string, string> = {
  checkroom: CLOTH_PATHS.tshirt, // 가상 착용 = 티셔츠 라인
  straighten: 'M4 20 20 4M4 20l0-4M4 20l4 0M8 16l-2-2M12 12l-2-2M16 8l-2-2', // 자(줄자) 라인
  verified: 'M20 7 10 17l-5-5M9 4l1.5 1.5M15 4l-1.5 1.5', // 체크(확인) 라인
};

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
        {/* 로픽 모티프: 홍보웹 배경 시그니처 — 오로라 4겹 + 도트그리드 + 그레인 + 입자 6개.
            전부 .decor(z-index:-2) 하위 span → 섹션 경계 페더(.section::before/::after)와
            충돌 없음(같은 엘리먼트 의사요소는 하나뿐이라 span으로 분리). */}
        {promo.motif === 'law' && (
          <>
            <span className={styles.lawDots} />
            <span className={styles.lawGrain} />
            <span className={styles.lawAurora} />
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={`lp-${i}`}
                className={`${styles.lawParticle} ${styles[`lawP${i}`]}`}
              />
            ))}
          </>
        )}
        {/* FitSnap 모티프(cloth): 홍보웹 BgApparel 이식 —
            떠다니는 의류 라인 아이콘(옷걸이·티셔츠·드레스·코트) + 옷걸이 레일 + grain. */}
        {promo.motif === 'cloth' && (
          <>
            <span className={styles.clothGrain} />
            {CLOTH_ICONS.map((c, i) => (
              <svg
                key={`ci-${i}`}
                className={`${styles.clothIcon} ${styles[`clothIcon${i}`]}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={CLOTH_PATHS[c]} />
              </svg>
            ))}
            {[0, 1].map((i) => (
              <svg
                key={`rail-${i}`}
                className={`${styles.clothRail} ${styles[`clothRail${i}`]}`}
                viewBox="0 0 120 44"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="8" x2="116" y2="8" />
                {[24, 60, 96].map((x) => (
                  <g key={x}>
                    <path d={`M${x} 8 q0 -4 3 -4`} />
                    <path d={`M${x} 8 l-8 12 h16 z`} />
                  </g>
                ))}
              </svg>
            ))}
          </>
        )}
        {/* 숏킷 모티프(cosmos): 홍보웹 Hero 무대 시그니처 이식 —
            궤도 링 이중(우상단·좌하단) + 광원 blob 2 + 옐로 트윙클 5개(#ffc800 포인트).
            전부 .decor(z-index:-2) 하위 → 우측 폰 목업 뒤 배경에 은은히(라이트 섹션 유지). */}
        {promo.motif === 'cosmos' && (
          <>
            <span className={styles.cosmosGlowA} />
            <span className={styles.cosmosGlowB} />
            <svg
              className={styles.cosmosOrbit}
              viewBox="0 0 1000 600"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              {/* 홍보웹 무대의 곡선 궤도 라인 — 전폭 대형 링(우상단 이중 + 좌측 대형 + 좌하단). */}
              <circle cx="820" cy="120" r="300" stroke="rgba(255,255,255,0.16)" strokeWidth="2.5" />
              <circle cx="820" cy="120" r="420" stroke="rgba(255,255,255,0.09)" strokeWidth="2" />
              <circle cx="120" cy="300" r="360" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <circle cx="60" cy="560" r="220" stroke="rgba(255,255,255,0.13)" strokeWidth="2.5" />
            </svg>
            {COSMOS_TWINKLES.map((t, i) => (
              <span
                key={`ck-${i}`}
                className={`${styles.cosmosTwinkle} ${styles[`cosmosTw${i}`]}`}
                style={{ background: t, color: t }}
              />
            ))}
          </>
        )}
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

            {/* 통계 하이라이트 칩 (icon이 있으면 값 옆에 아이콘 표시) */}
            <ul className={styles.highlights}>
              {promo.highlights.map((h) => (
                <li key={h.label} className={styles.highlight}>
                  {h.icon &&
                    (LINE_ICONS[h.icon] ? (
                      <span className={styles.highlightIcon} aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          width="20"
                          height="20"
                        >
                          <path d={LINE_ICONS[h.icon]} />
                        </svg>
                      </span>
                    ) : (
                      <span className={styles.highlightIcon} aria-hidden="true">
                        {iconFor(h.icon)}
                      </span>
                    ))}
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
            {promo.beforeAfter ? (
              promo.beforeAfter.layout === 'sideBySide' ? (
                /* facePreview: 전/후를 나란히 비교 — 픽셀 정렬 아닌 쌍의 경계 어긋남 방지 */
                <CompareSideBySide data={promo.beforeAfter} />
              ) : (
                /* FitSnap: before/after 좌우 드래그 슬라이더 — 밀면 상의가 바뀌는 시그니처 */
                <CompareSliderVisual data={promo.beforeAfter} serviceName={service.name} />
              )
            ) : promo.analysisCard ? (
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
                {/* 시그니처 배지(숏킷: "14분 → 30초!") — 폰 우상단 기울임 스티커 */}
                {promo.shotBadge && (
                  <span className={styles.shotBadge}>{promo.shotBadge}</span>
                )}
              </div>
            ) : promo.mascot || promo.mascotComponent ? (
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
                  {/* 도란: 벡터 SVG 컴포넌트(dorani.js 이식). 그 외: 정적 이미지. mascotImg 스타일 공유. */}
                  {promo.mascotComponent === 'dorani' ? (
                    <DoraniMascot className={styles.mascotImg} />
                  ) : (
                    <img
                      className={styles.mascotImg}
                      src={promo.mascot}
                      alt={`${service.name} 마스코트`}
                      width={200}
                      height={200}
                      loading="lazy"
                    />
                  )}
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

/**
 * facePreview 전/후 나란히 비교 — 독립 생성된 쌍이라 픽셀 정렬이 아니므로 슬라이더(경계 어긋남)
 * 대신 두 이미지를 좌우로 나란히 배치한다. 각 이미지는 자기 프레임 안에서 object-fit: cover로
 * 안정적으로 보여지고, 하단 라벨(수술 전 / AI 예상 결과)로 전·후를 명확히 구분한다.
 */
function CompareSideBySide({
  data,
}: {
  data: { before: string; after: string; beforeLabel?: string; afterLabel?: string };
}) {
  const beforeLabel = data.beforeLabel ?? '수술 전';
  const afterLabel = data.afterLabel ?? 'AI 예상 결과';
  return (
    <div className={styles.sbsWrap}>
      <figure className={styles.sbsCell}>
        <img className={styles.sbsImg} src={data.before} alt={beforeLabel} loading="lazy" />
        <figcaption className={`${styles.sbsTag} ${styles.sbsTagBefore}`}>{beforeLabel}</figcaption>
      </figure>
      <figure className={styles.sbsCell}>
        <img className={styles.sbsImg} src={data.after} alt={afterLabel} loading="lazy" />
        <figcaption className={`${styles.sbsTag} ${styles.sbsTagAfter}`}>{afterLabel}</figcaption>
      </figure>
    </div>
  );
}

/**
 * FitSnap before/after 좌우 드래그 슬라이더 — 밀면 상의가 바뀌는 시그니처(홍보웹 CompareSlider 이식).
 *
 * 왜 슬라이더가 성립하는가: before/after가 픽셀 정렬(상의 밴드만 교체, 밴드 밖 원본 복원)이라
 * 경계선을 어디에 두어도 인물 윤곽이 맞물린다. after를 전체 깔고, before를 clip-path로 왼쪽 pos%만 노출.
 *
 * 성능: 경계 위치는 CSS 변수(--pos)로 직접 조작 → 드래그 중 React 리렌더 없이 컴포지터만 갱신.
 * 진입 자동 스윕: IntersectionObserver로 뷰포트 진입 시 1회 왕복 시연. 사용자 조작 시 영구 중단.
 * 접근성: 핸들 role="slider" + aria-valuenow, 키보드 ←/→(±2)·Home/End(0/100), 터치 드래그(pointer).
 */
function CompareSliderVisual({
  data,
  serviceName,
}: {
  data: {
    before: string;
    after: string;
    beforeLabel?: string;
    afterLabel?: string;
    focusY?: number;
    afterFocusY?: number;
    reversed?: boolean;
  };
  serviceName: string;
}) {
  const INITIAL = 50;
  const beforeLabel = data.beforeLabel ?? '원본';
  const afterLabel = data.afterLabel ?? 'AI 가상 착용';
  // 세로 초점 보정(앱 BeforeAfterSlider focusY/afterFocusY) — before/after 머리 위치를 맞춘다.
  const beforePos = `50% ${data.focusY ?? 50}%`;
  const afterPos = `50% ${data.afterFocusY ?? data.focusY ?? 50}%`;

  // 방향: 기본은 after=바탕 / before=clip(왼쪽 노출) → 왼쪽=before, 오른쪽=after(FitSnap).
  // reversed면 before=바탕 / after=clip(왼쪽 노출) → 왼쪽=after, 오른쪽=before(홍보웹/앱 방향).
  const reversed = data.reversed ?? false;
  const baseSrc = reversed ? data.before : data.after;
  const baseAlt = reversed ? beforeLabel : afterLabel;
  const basePos = reversed ? beforePos : afterPos;
  const clipSrc = reversed ? data.after : data.before;
  const clipAlt = reversed ? afterLabel : beforeLabel;
  const clipPos = reversed ? afterPos : beforePos;

  const stageRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(INITIAL); // 리렌더 없이 현재값 추적(키보드/드래그 공용)
  const [pos, setPos] = useState(INITIAL); // aria-valuenow 표시용
  const interacted = useRef(false); // 한 번이라도 조작하면 자동 스윕 영구 중단
  const rafRef = useRef<number | null>(null);
  const dragging = useRef(false);

  // 경계 위치 반영: DOM CSS 변수 직접 조작(리렌더 회피) + aria용 state 동기화.
  const apply = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(100, next));
    posRef.current = clamped;
    if (stageRef.current) stageRef.current.style.setProperty('--pos', `${clamped}%`);
    setPos(Math.round(clamped));
  }, []);

  // 사용자 조작 시작: 자동 스윕 중단(rAF 취소) + 이후 재개 안 함.
  const stopAuto = useCallback(() => {
    interacted.current = true;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // 진입 시 자동 스윕 — 경계선이 좌↔우로 왕복하며 "밀면 옷이 바뀐다"를 시연.
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const el = stageRef.current;
    if (!el) return;

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started || interacted.current) return;
        started = true;
        io.disconnect();

        // 이징 왕복: 50 → 22% → 82% → 50. 총 ~3.4s.
        const KEYS = [
          { t: 0, v: INITIAL },
          { t: 900, v: 22 },
          { t: 2100, v: 82 },
          { t: 3400, v: INITIAL },
        ];
        const startTs = performance.now();
        const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
        const tick = (now: number) => {
          if (interacted.current) return;
          const elapsed = now - startTs;
          let seg = KEYS.length - 1;
          for (let i = 0; i < KEYS.length - 1; i++) {
            if (elapsed < KEYS[i + 1].t) {
              seg = i;
              break;
            }
          }
          if (elapsed >= KEYS[KEYS.length - 1].t) {
            apply(INITIAL);
            rafRef.current = null;
            return;
          }
          const a = KEYS[seg];
          const b = KEYS[seg + 1];
          const p = ease((elapsed - a.t) / (b.t - a.t));
          apply(a.v + (b.v - a.v) * p);
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [apply]);

  // 포인터 x → 경계 %(마우스·터치 공용, pointer capture로 스테이지 밖 드래그도 추적).
  const fromClientX = useCallback((clientX: number) => {
    const el = stageRef.current;
    if (!el) return posRef.current;
    const rect = el.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    stopAuto();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    apply(fromClientX(e.clientX));
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    apply(fromClientX(e.clientX));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let handled = true;
    if (e.key === 'ArrowLeft') apply(posRef.current - 2);
    else if (e.key === 'ArrowRight') apply(posRef.current + 2);
    else if (e.key === 'Home') apply(0);
    else if (e.key === 'End') apply(100);
    else handled = false;
    if (handled) {
      e.preventDefault();
      stopAuto();
    }
  };

  return (
    <div className={styles.csWrap}>
      <div
        ref={stageRef}
        className={styles.csStage}
        style={{ ['--pos' as string]: `${INITIAL}%` } as CSSProperties}
        aria-label={`${serviceName} 변경 전후 비교 슬라이더`}
      >
        {/* 바탕 이미지: 전체 깔림(경계 오른쪽에 노출). 기본 after / reversed면 before */}
        <img
          className={styles.csImg}
          src={baseSrc}
          alt={`${serviceName} — ${baseAlt}`}
          draggable={false}
          style={{ objectPosition: basePos }}
        />
        {/* clip 이미지: 왼쪽 pos%만 노출. 기본 before / reversed면 after */}
        <div className={styles.csClip}>
          <img
            className={styles.csImg}
            src={clipSrc}
            alt={`${serviceName} — ${clipAlt}`}
            draggable={false}
            style={{ objectPosition: clipPos }}
          />
        </div>

        {/* 라벨: 위치(왼/오)는 이미지 노출과 일치시키고, 골드 강조는 항상 after(결과)에 둔다.
            기본: 왼쪽=before(어두움)·오른쪽=after(골드). reversed: 왼쪽=after(골드)·오른쪽=before(어두움). */}
        <span
          className={`${styles.csLabel} ${styles.csLabelLeft} ${reversed ? styles.csLabelAccent : styles.csLabelMuted}`}
        >
          {reversed ? afterLabel : beforeLabel}
        </span>
        <span
          className={`${styles.csLabel} ${styles.csLabelRight} ${reversed ? styles.csLabelMuted : styles.csLabelAccent}`}
        >
          {reversed ? beforeLabel : afterLabel}
        </span>
        <span className={styles.csSheen} aria-hidden="true" />

        {/* 드래그 히트 영역(스테이지 전체) + 핸들 */}
        <div
          className={styles.csDrag}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className={styles.csHandle}
            role="slider"
            tabIndex={0}
            aria-label="비교 경계"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pos}
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
          >
            <span className={styles.csGrip} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                  d="M9 6 L5 12 L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 6 L19 12 L15 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <p className={styles.csHint}>핸들을 좌우로 밀어 전후를 비교해 보세요</p>
    </div>
  );
}
