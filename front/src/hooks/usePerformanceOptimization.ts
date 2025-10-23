"use client";

import { useCallback, useRef } from 'react';

interface PerformanceOptions {
  enableVirtualScrolling?: boolean;
  enableDebouncing?: boolean;
  debounceDelay?: number;
  enableMemoization?: boolean;
  enablePreloading?: boolean;
}

export const usePerformanceOptimization = (options: PerformanceOptions = {}) => {
  const {
    enableVirtualScrolling = false,
    debounceDelay = 300,
    enablePreloading = true
  } = options;

  const preloadedResources = useRef<Set<string>>(new Set());

  // Debounce function
  const debounce = useCallback(
    <T extends (...args: unknown[]) => unknown>(func: T, delay: number = debounceDelay): T => {
      let timeoutId: NodeJS.Timeout;
      return ((...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      }) as T;
    },
    [debounceDelay]
  );

  // Throttle function
  const throttle = useCallback(
    <T extends (...args: unknown[]) => unknown>(func: T, delay: number = 100): T => {
      let lastCall = 0;
      return ((...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          return func(...args);
        }
        return undefined;
      }) as T;
    },
    []
  );

  // Preload resources
  const preloadResource = useCallback((url: string, type: 'image' | 'script' | 'style' = 'image') => {
    if (preloadedResources.current.has(url)) return;

    const link = document.createElement('link');
    link.rel = type === 'image' ? 'preload' : 'prefetch';
    link.href = url;
    
    if (type === 'image') {
      link.as = 'image';
    } else if (type === 'script') {
      link.as = 'script';
    } else if (type === 'style') {
      link.as = 'style';
    }

    document.head.appendChild(link);
    preloadedResources.current.add(url);
  }, []);

  // Preload critical images
  const preloadCriticalImages = useCallback((imageUrls: string[]) => {
    if (!enablePreloading) return;
    
    imageUrls.forEach(url => preloadResource(url, 'image'));
  }, [enablePreloading, preloadResource]);

  // Intersection Observer para lazy loading
  const createIntersectionObserver = useCallback((
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ) => {
    if (typeof window === 'undefined') return null;

    return new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });
  }, []);

  // Virtual scrolling helper
  const calculateVirtualScroll = useCallback((
    scrollTop: number,
    itemHeight: number,
    containerHeight: number,
    totalItems: number
  ) => {
    if (!enableVirtualScrolling) {
      return { startIndex: 0, endIndex: totalItems - 1, visibleItems: totalItems };
    }

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      totalItems - 1
    );
    const visibleItems = endIndex - startIndex + 1;

    return { startIndex, endIndex, visibleItems };
  }, [enableVirtualScrolling]);

  // Performance monitoring
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    if (typeof window === 'undefined' || !window.performance) {
      fn();
      return;
    }

    const start = performance.now();
    fn();
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
  }, []);

  // Memory usage monitoring
  const getMemoryUsage = useCallback(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return null;
    }

    const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    if (!memory) {
      return null;
    }
    
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    };
  }, []);

  return {
    debounce,
    throttle,
    preloadResource,
    preloadCriticalImages,
    createIntersectionObserver,
    calculateVirtualScroll,
    measurePerformance,
    getMemoryUsage
  };
};
