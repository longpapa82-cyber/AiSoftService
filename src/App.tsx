import './styles/global.css';

import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { PromoSection } from './sections/PromoSection';
import { Features } from './sections/Features';
import { Technology } from './sections/Technology';
import { About } from './sections/About';
import { Footer } from './sections/Footer';
import { SERVICES_SORTED } from './data/services';

export default function App() {
  // promo 데이터가 있는 서비스만 미니 홍보 섹션으로 전시 (확장 가능 구조)
  const promoServices = SERVICES_SORTED.filter((s) => s.promo);

  return (
    <>
      <a className="ais-skip-link" href="#main">
        본문 바로가기
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        {/* 서비스별 미니 홍보 사이트 — 각 서비스 풀 테마로 전환. 좌우 지그재그 리듬 */}
        {promoServices.map((service, i) => (
          <PromoSection key={service.id} service={service} flip={i % 2 === 1} />
        ))}
        <Features />
        <Technology />
        <About />
      </main>
      <Footer />
    </>
  );
}
