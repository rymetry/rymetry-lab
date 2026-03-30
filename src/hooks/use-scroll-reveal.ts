'use client';

import { useEffect, useRef } from 'react';

interface UseScrollRevealOptions {
  readonly threshold?: number;
  readonly once?: boolean;
}

/**
 * IntersectionObserver で要素の可視性を検出し、.visible クラスを付与する。
 * DOM classList を直接操作する（CSS 駆動アニメーションのため React state 不使用）。
 */
export function useScrollReveal<T extends HTMLElement>({
  threshold = 0.1,
  once = true,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('visible');
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('visible');
          }
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [threshold, once]);

  return ref;
}
