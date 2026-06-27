import { useEffect, useState } from 'react';

/**
 * 문서 전체 스크롤 진척률(0~1)을 반환하는 훅.
 * rAF 스로틀 + passive 리스너로 스크롤 핸들러 churn을 방지한다.
 *
 * 진행바 채움은 호출 측에서 transform: scaleX(progress)로 처리(컴포지터 친화).
 * 진척률 자체는 "모션"이 아니라 위치 정보이므로 reduced-motion에서도 갱신한다.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const compute = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      // 스크롤 영역이 없으면(짧은 페이지) 0으로 둔다.
      const next = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      setProgress(Math.min(1, Math.max(0, next)));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(compute);
    };

    compute(); // 초기 1회
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}
