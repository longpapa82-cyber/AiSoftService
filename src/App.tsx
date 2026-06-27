import './styles/global.css';

import { useCallback, useState } from 'react';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { PromoSection } from './sections/PromoSection';
import { Technology } from './sections/Technology';
import { About } from './sections/About';
import { Footer } from './sections/Footer';
import { SERVICES_SORTED } from './data/services';

export default function App() {
  // promo 데이터가 있는 서비스만 미니 홍보 섹션으로 전시 (확장 가능 구조)
  const promoServices = SERVICES_SORTED.filter((s) => s.promo);
  const totalCollectible = promoServices.length;

  // 게이미피케이션: 스크롤하며 통과한 서비스를 "수집"한다.
  // 규모가 작아 Context 대신 App state + 콜백 prop으로 충분(KISS/YAGNI).
  const [collected, setCollected] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const handleCollect = useCallback((id: string) => {
    setCollected((prev) => {
      if (prev.has(id)) return prev; // 중복 수집 방지(상태 동일 → 리렌더 없음)
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return (
    <>
      <a className="ais-skip-link" href="#main">
        본문 바로가기
      </a>
      <Header collected={collected.size} total={totalCollectible} />
      <main id="main">
        <Hero />
        {/* 서비스별 미니 홍보 사이트 — 각 서비스 풀 테마로 전환. 좌우 지그재그 리듬 */}
        {promoServices.map((service, i) => (
          <PromoSection
            key={service.id}
            service={service}
            flip={i % 2 === 1}
            onCollect={handleCollect}
          />
        ))}
        <Technology />
        <About />
      </main>
      <Footer />
    </>
  );
}
