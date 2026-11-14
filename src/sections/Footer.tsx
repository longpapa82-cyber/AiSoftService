import type { CSSProperties } from 'react';
import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { usePointerParallax } from '../hooks/usePointerParallax';
import { SERVICES_SORTED } from '../data/services';
import { COMPANY } from '../data/company';
import { TechBadge } from '../components/ui/TechBadge';
import { ParticleField } from '../components/visual/ParticleField';
import styles from './Footer.module.css';

/** 서비스 대표 링크: 웹사이트가 있으면 웹, 없으면 iOS, 없으면 Android 순. */
function primaryLink(links: {
  web?: string;
  ios?: string;
  android?: string;
}): string | undefined {
  return links.web ?? links.ios ?? links.android;
}

/**
 * 갤러리 벽 하단을 닫는 Footer — 하이테크 마감.
 * 네이비 잉크 표면 위에 회로 도트 + 골드 글로우로 시스템 패널처럼 닫는다.
 * 좌측: 에이아이소프트 로고 + 슬로건, 회사 정보 요약(대표/이메일/주소).
 * 우측: 서비스 바로가기 + 정책 링크. 하단: 모노스페이스 시스템 카피.
 */
export function Footer() {
  // 단일 ref를 footer에 직접 부착하고, reveal·parallax 두 훅에 주입해 공유한다.
  // (콜백 ref 합성은 훅의 mount 이펙트가 null을 캡처해 리스너가 안 붙는 문제가 있어 ref 주입으로 전환.)
  const footerRef = useRef<HTMLElement>(null);
  useReveal<HTMLElement>({ externalRef: footerRef });
  usePointerParallax<HTMLElement>(footerRef);

  return (
    <footer
      ref={footerRef}
      className={`${styles.footer} reveal`}
      data-header-dark
    >
      {/* v15: 커서 스포트라이트 — 포인터 추종 샴페인 골드 라이트(Hero 패턴 재사용).
          --px/--py(-1~1, 훅 내부 lerp)로 translate만 이동. 포인터 없는 환경은 중앙 고정. */}
      <span className={styles.spotlight} aria-hidden="true" />
      {/* [OPT-4] 상단 골드 데이터 스트림(translateX 밴드, 컴포지터 온리). */}
      <span className={styles.stream} aria-hidden="true" />
      {/* v11 럭셔리: 필름 그레인(히어로·Technology와 동일 질감 언어) */}
      <span className={`ais-grain ${styles.grainLayer}`} aria-hidden="true" />
      {/* "System Panel Online" — 다크 배경 위 경량 신경망 파티클(연산 잔열 인상).
          near-black에 맞춰 dark 변형, 노드 수는 Hero의 절반 이하. */}
      <ParticleField
        className={styles.field}
        dark
        density={62}
        signalRatio={0.42}
        speed={1.7}
        pointerRadius={230}
        linkDist={185}
      />
      <div className={`ais-container ${styles.inner}`}>
        <div className={styles.brand}>
          <TechBadge variant="gold" dot>
            System Online
          </TechBadge>
          <a href="#top" className={styles.logo} aria-label={`${COMPANY.name} 홈으로`}>
            <span className={styles.logoMark} aria-hidden="true">
              AI
            </span>
            <span className={styles.logoText}>{COMPANY.name}</span>
          </a>
          <p className={styles.slogan}>{COMPANY.slogan}</p>

          <dl className={styles.company}>
            <div className={styles.companyRow}>
              <dt className={styles.companyTerm}>조직대표</dt>
              <dd className={styles.companyDesc}>{COMPANY.ceo}</dd>
            </div>
            <div className={styles.companyRow}>
              <dt className={styles.companyTerm}>이메일</dt>
              <dd className={styles.companyDesc}>
                <a className={styles.link} href={`mailto:${COMPANY.email}`}>
                  {COMPANY.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <nav className={styles.nav} aria-label="서비스 바로가기">
          <h2 className={styles.navTitle}>서비스</h2>
          <ul className={styles.navList}>
            {SERVICES_SORTED.map((service) => {
              const href = primaryLink(service.links);
              return (
                <li key={service.id}>
                  <a
                    className={styles.serviceLink}
                    href={href ?? '#services'}
                    target={href ? '_blank' : undefined}
                    rel={href ? 'noopener noreferrer' : undefined}
                    style={
                      { '--svc': service.theme.primary } as CSSProperties
                    }
                  >
                    <span className={styles.serviceIcon} aria-hidden="true">
                      <img
                        className={styles.serviceIconImg}
                        src={service.iconUrl}
                        alt=""
                        width={26}
                        height={26}
                        loading="lazy"
                      />
                    </span>
                    <span>{service.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

      </div>

      <div className={`ais-container ${styles.bottom}`}>
        <p className={styles.copyright}>
          <span className={styles.copyMono}>© 2026 {COMPANY.name}</span>
          <span className={styles.copyRights}>All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
}
