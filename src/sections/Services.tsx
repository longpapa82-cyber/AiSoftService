import { SERVICES_SORTED } from '../data/services';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ServiceCard, ComingSoonCard } from './ServiceCard';
import styles from './Services.module.css';

/**
 * 사이트의 핵심 섹션. 각 서비스를 "갤러리 작품"으로 전시한다.
 * bento/비균일 레이아웃: 첫 카드(myTravel)를 더 크게 강조하고,
 * 나머지를 우측 컬럼에 배치, 마지막에 확장성 암시용 빈 슬롯 카드.
 */
export function Services() {
  const [featured, ...rest] = SERVICES_SORTED;

  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className="ais-container">
        <SectionHeader
          id="services-title"
          eyebrow="Portfolio of Worlds"
          title="하나의 스튜디오, 세 개의 세계"
          desc="각 서비스는 저마다의 색과 무드를 가진 작품입니다. AI Soft가 빚어낸 세계를 둘러보세요."
          align="center"
        />

        <div className={styles.bento}>
          {featured && (
            <div className={styles.featuredSlot}>
              <ServiceCard service={featured} featured index={0} />
            </div>
          )}

          {rest.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i + 1} />
          ))}

          <ComingSoonCard />
        </div>
      </div>
    </section>
  );
}
