import { useState, type CSSProperties } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TechBadge } from '../components/ui/TechBadge';
import { useReveal } from '../hooks/useReveal';
import { SERVICES_SORTED, type AppService } from '../data/services';
import semiconductor from '../assets/photos/semiconductor.jpg';
import styles from './Features.module.css';

/** 서비스 테마를 CSS 변수로 노출하는 스타일 객체 생성. */
function svcVars(service: AppService): CSSProperties {
  return {
    '--svc-primary': service.theme.primary,
    '--svc-accent': service.theme.accent,
  } as CSSProperties;
}

interface FeaturePanelProps {
  service: AppService;
}

/** 활성 서비스의 기능 3종을 stagger 진입으로 표시하는 패널.
 *  탭 전환으로 나타나므로 IntersectionObserver(useReveal) 대신 CSS 키프레임으로 진입한다. */
function FeaturePanel({ service }: FeaturePanelProps) {
  return (
    <div
      id={`features-panel-${service.id}`}
      role="tabpanel"
      aria-labelledby={`features-tab-${service.id}`}
      className={styles.panel}
      style={svcVars(service)}
    >
      <div className={styles.panelHead}>
        <img
          className={styles.panelIcon}
          src={service.iconUrl}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
        <div className={styles.panelTitleWrap}>
          <span className={styles.panelEyebrow}>{service.moodLabel}</span>
          <h3 className={styles.panelName}>{service.name}</h3>
          <p className={styles.panelTagline}>{service.tagline}</p>
        </div>
      </div>

      <ul className={styles.grid}>
        {service.features.map((feature, index) => (
          <li
            key={`${service.id}-${feature.title}`}
            className={styles.feature}
            style={
              { '--reveal-delay': `calc(${index} * var(--ais-stagger))` } as CSSProperties
            }
          >
            <span className={styles.featureIcon} aria-hidden="true">
              {iconFor(feature.icon)}
            </span>
            <h4 className={styles.featureTitle}>{feature.title}</h4>
            <p className={styles.featureDesc}>{feature.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Material Symbols 아이콘 이름을 이모지로 매핑.
 * (외부 아이콘 폰트 추가 부담 없이 일관된 시각 표현)
 * PromoSection 등에서도 동일 매핑을 재사용한다.
 */
export function iconFor(name: string): string {
  const map: Record<string, string> = {
    auto_awesome: '✨',
    partly_cloudy_day: '🌤️',
    tune: '🎛️',
    pin_drop: '📍',
    health_and_safety: '🩺',
    favorite: '💗',
    newspaper: '🗞️',
    event: '🗓️',
    bookmark: '🔖',
  };
  return map[name] ?? '◆';
}

/**
 * Features 섹션. 서비스별 탭으로 전환하며 각 서비스가 잘하는 기능을 전시.
 * 활성 탭/패널은 해당 서비스 컬러를 포인트로 사용한다.
 */
export function Features() {
  const [activeId, setActiveId] = useState(SERVICES_SORTED[0]?.id ?? '');
  const bannerRef = useReveal<HTMLElement>();
  const active =
    SERVICES_SORTED.find((s) => s.id === activeId) ?? SERVICES_SORTED[0];

  if (!active) return null;

  return (
    <section
      id="features"
      className={styles.section}
      aria-labelledby="features-heading"
    >
      <div className="ais-container">
        <div className={styles.inner}>
          <SectionHeader
            id="features-heading"
            eyebrow="핵심 기능"
            title="각 서비스가 잘하는 것"
          />

          {/* 하드웨어/정밀공학 매거진 밴드 — 반도체 실사 위 네이비/골드 오버레이 */}
          <figure className={`${styles.hwBand} reveal`} ref={bannerRef}>
            <img
              className={styles.hwBandImg}
              src={semiconductor}
              alt="정밀하게 설계된 반도체 회로기판"
              width={1100}
              height={620}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.hwBandOverlay} aria-hidden="true" />
            <figcaption className={styles.hwBandCaption}>
              <span className={styles.hwBandBadge}>
                <TechBadge variant="gold" dot>
                  ON-DEVICE
                </TechBadge>
              </span>
              <p className={styles.hwBandText}>
                칩에서 화면까지. 하드웨어 가속 위에 올린 AI로 빠르고 정밀한
                경험을 설계합니다.
              </p>
              <span className={styles.hwBandCode}>// SILICON_TO_SCREEN</span>
            </figcaption>
          </figure>

          <div
            className={styles.tablist}
            role="tablist"
            aria-label="서비스별 핵심 기능"
          >
            {SERVICES_SORTED.map((service) => {
              const isActive = service.id === active.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  id={`features-tab-${service.id}`}
                  aria-selected={isActive}
                  aria-controls={`features-panel-${service.id}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                  style={svcVars(service)}
                  onClick={() => setActiveId(service.id)}
                >
                  <img
                    className={styles.tabIcon}
                    src={service.iconUrl}
                    alt=""
                    width={24}
                    height={24}
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                  {service.name}
                </button>
              );
            })}
          </div>

          {/* key로 패널 재마운트 → 전환 애니메이션 + 기능 stagger 재생 */}
          <FeaturePanel key={active.id} service={active} />
        </div>
      </div>
    </section>
  );
}
