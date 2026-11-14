import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * 스크롤 진입 시 요소에 .is-visible 클래스를 부여하는 IntersectionObserver 훅.
 * 스크롤 핸들러 churn 없이 컴포지터 친화적 리빌 애니메이션을 구현한다.
 *
 * @param options.externalRef 한 DOM 노드를 다른 훅과 공유할 때 전달. 주면 내부 ref 대신 이 ref를 관찰한다.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  once?: boolean;
  externalRef?: RefObject<T | null>;
}) {
  const internalRef = useRef<T>(null);
  const { threshold = 0.15, once = true, externalRef } = options ?? {};
  // 관찰은 외부 ref(주어졌다면)의 노드에, 반환은 항상 내부 ref(직접 부착 호출부 호환).
  const activeRef = externalRef ?? internalRef;

  useEffect(() => {
    const el = activeRef.current;
    if (!el) return;

    // reduced-motion 사용자는 즉시 표시
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }

    // IntersectionObserver 미지원 환경 폴백: 즉시 표시
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('is-visible');
          }
        }
      },
      // rootMargin을 아래로 넉넉히 줘 뷰포트 진입 직전에 미리 표시(빈 화면 방지)
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);

    // 안전망: 어떤 이유로든 콜백이 늦으면 콘텐츠가 영구히 숨지 않도록 강제 표시
    const safety = window.setTimeout(() => {
      el.classList.add('is-visible');
    }, 1600);

    return () => {
      window.clearTimeout(safety);
      io.disconnect();
    };
  }, [threshold, once, activeRef]);

  return internalRef;
}
