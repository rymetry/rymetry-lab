'use client';

import { Children, cloneElement, isValidElement, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface ScrollRevealListProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly threshold?: number;
}

/**
 * 1つの IntersectionObserver で直下の子要素を個別に監視し、
 * ビューポートに入ったタイミングで .visible を付与する。
 * 子要素には SSR 時点で .reveal を付与し、初回描画のフラッシュを防止。
 * IO 非対応環境や prefers-reduced-motion: reduce の場合は即座に
 * .visible を付与しアニメーションをスキップする。
 * グリッド等、複数アイテムを個別アニメーションさせる場合に使用。
 * 各 React 子要素は単一の DOM ノードであることを前提とする。
 */
export function ScrollRevealList({ children, className, threshold = 0.1 }: ScrollRevealListProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const makeVisible = () => {
      for (const child of container.children) {
        child.classList.add('visible');
      }
    };

    if (typeof IntersectionObserver === 'undefined') {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[ScrollRevealList] IntersectionObserver is not available. Falling back to immediate visibility.',
        );
      }
      makeVisible();
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      makeVisible();
      return;
    }

    const safeThreshold = Math.min(1, Math.max(0, threshold));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: safeThreshold },
    );

    for (const child of container.children) {
      observer.observe(child);
    }

    return () => observer.disconnect();
  }, [threshold, children]);

  const revealChildren = Children.map(children, (child) => {
    if (!isValidElement<{ className?: string }>(child)) return child;
    return cloneElement(child, {
      className: cn('reveal', child.props.className),
    });
  });

  return (
    <div ref={ref} className={cn(className)}>
      {revealChildren}
    </div>
  );
}
