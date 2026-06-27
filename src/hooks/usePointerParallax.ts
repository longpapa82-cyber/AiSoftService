import { useEffect, useRef } from 'react';

/**
 * 포인터 위치에 따라 컨테이너에 --px / --py (-1 ~ 1) CSS 변수를 부여한다.
 * 자식 요소는 calc(var(--px) * Npx) 로 깊이별 패럴랙스를 표현.
 * - reduced-motion 사용자/터치 환경에서는 비활성(0 고정).
 * - requestAnimationFrame으로 스로틀해 스크롤/포인터 churn 방지.
 */
export function usePointerParallax<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // 정밀 포인터(마우스)에서만 — 터치는 제외
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // -1 ~ 1 정규화
      targetX = ((e.clientX - r.left) / r.width) * 2 - 1;
      targetY = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      // 부드러운 추종(lerp)
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      el.style.setProperty('--px', curX.toFixed(4));
      el.style.setProperty('--py', curY.toFixed(4));
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
