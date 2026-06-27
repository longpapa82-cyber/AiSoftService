import { useEffect, useRef } from 'react';

/**
 * 포인터 위치 기반 3D 틸트 훅.
 * 요소에 --tilt-x / --tilt-y / --tilt-px / --tilt-py CSS 변수를 갱신하고,
 * 실제 변형(rotateX/Y)·광택 위치는 CSS가 처리한다(관심사 분리 + 컴포지터 친화).
 *
 * - reduced-motion: 비활성(변수 미갱신)
 * - 터치/coarse 포인터: 비활성(틸트는 마우스 전용 — 모바일 오작동 방지)
 * - rAF로 포인터 이동을 스로틀
 *
 * @param maxDeg 최대 기울기 각도(deg)
 */
export function useTilt<T extends HTMLElement = HTMLElement>(maxDeg = 6) {
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
      const { x, y } = pending;
      const rect = el.getBoundingClientRect();
      // -0.5 ~ 0.5 정규화
      const px = (x - rect.left) / rect.width - 0.5;
      const py = (y - rect.top) / rect.height - 0.5;
      // 위쪽으로 기울면 rotateX 양수가 되도록 부호 조정
      el.style.setProperty('--tilt-y', `${px * maxDeg * 2}deg`);
      el.style.setProperty('--tilt-x', `${-py * maxDeg * 2}deg`);
      // 광택 하이라이트 위치(0~100%)
      el.style.setProperty('--tilt-px', `${(px + 0.5) * 100}%`);
      el.style.setProperty('--tilt-py', `${(py + 0.5) * 100}%`);
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
      // 원위치 — 부드럽게 복귀(CSS transition이 처리)
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [maxDeg]);

  return ref;
}
