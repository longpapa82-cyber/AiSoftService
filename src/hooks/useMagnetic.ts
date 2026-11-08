import { useEffect, useRef } from 'react';

/**
 * 포인터가 요소에 접근하면 커서 방향으로 살짝 끌려가는 "자석" 효과 훅.
 * --mag-x / --mag-y (px) CSS 변수를 갱신하고, 실제 변형·복귀 전환은 CSS가 처리한다.
 *
 * - reduced-motion / 터치(coarse) 환경: 비활성(변수 미갱신 → CSS 기본 0)
 * - rAF로 포인터 이동 스로틀
 * - 이탈 시 0,0으로 리셋 → CSS transition이 스프링 복귀
 *
 * @param strength 최대 끌림 거리(px). 과하면 어색하므로 작게.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 6) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReduced || isCoarse) return;

    let rafId = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      rafId = 0;
      if (!pending) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // 중심 기준 포인터 오프셋을 반경으로 정규화해 strength만큼 끌림(최대 strength로 클램프).
      const dx = (pending.x - cx) / (rect.width / 2);
      const dy = (pending.y - cy) / (rect.height / 2);
      el.style.setProperty('--mag-x', `${Math.max(-1, Math.min(1, dx)) * strength}px`);
      el.style.setProperty('--mag-y', `${Math.max(-1, Math.min(1, dy)) * strength}px`);
    };

    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      el.style.setProperty('--mag-x', '0px');
      el.style.setProperty('--mag-y', '0px');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [strength]);

  return ref;
}
