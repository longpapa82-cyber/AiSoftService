import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';

/**
 * 뷰포트 진입 시 0 → target 으로 숫자를 올리는 카운트업 훅.
 * requestAnimationFrame 기반(ease-out)으로 컴포지터/메인스레드 부담을 최소화한다.
 *
 * 설계 원칙(useReveal와 동일 철학):
 * - reduced-motion 사용자는 애니메이션 없이 즉시 target 표시
 * - IntersectionObserver 미지원 시 즉시 target 표시
 * - 한 번만 실행(once) — 재진입해도 다시 굴리지 않음
 *
 * Phase 2~4 공용: Hero XP, Technology 게이지/링, 퀘스트 카운터에서 재사용.
 *
 * @returns [ref, value] — ref를 관찰 대상에 붙이고, value를 렌더에 표시
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  options?: {
    /** 애니메이션 길이(ms) */
    durationMs?: number;
    /** 시작 지연(ms) */
    delayMs?: number;
    /** 관찰 임계치 */
    threshold?: number;
  },
): [MutableRefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(0);
  const { durationMs = 1200, delayMs = 0, threshold = 0.4 } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // reduced-motion / IO 미지원: 즉시 최종값
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      setValue(target);
      return;
    }

    let rafId = 0;
    let timeoutId = 0;
    let started = false;

    // ease-out cubic — 빠르게 출발해 부드럽게 안착(보상감)
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const run = () => {
      let startTs = 0;
      const tick = (ts: number) => {
        if (startTs === 0) startTs = ts;
        const elapsed = ts - startTs;
        const progress = Math.min(elapsed / durationMs, 1);
        setValue(Math.round(target * easeOut(progress)));
        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            io.unobserve(entry.target);
            timeoutId = window.setTimeout(run, delayMs);
          }
        }
      },
      { threshold },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [target, durationMs, delayMs, threshold]);

  return [ref, value];
}
