"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface LazyComponentOptions {
  fallback?: React.ReactNode;
  delay?: number;
  threshold?: number;
}

export const useLazyComponent = <T extends React.ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): {
  Component: T | null;
  loading: boolean;
  error: Error | null;
  loadComponent: () => Promise<void>;
  Fallback: React.ComponentType<Record<string, unknown>>;
} => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { fallback, delay = 0, threshold = 0 } = options;

  const loadComponent = useCallback(async () => {
    if (Component || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Delay opcional para evitar carregamento desnecessário
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const importedModule = await importFn();
      setComponent(() => importedModule.default);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading lazy component:', err);
    } finally {
      setLoading(false);
    }
  }, [Component, loading, delay, importFn]);

  // Intersection Observer para carregar quando visível
  useEffect(() => {
    if (typeof window === 'undefined' || Component) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadComponent();
          observer.disconnect();
        }
      },
      { threshold }
    );

    // Observar um elemento dummy ou o body
    const dummyElement = document.createElement('div');
    document.body.appendChild(dummyElement);
    observer.observe(dummyElement);

    return () => {
      observer.disconnect();
      if (dummyElement.parentNode) {
        dummyElement.parentNode.removeChild(dummyElement);
      }
    };
  }, [Component, loadComponent, threshold]);

  const DefaultFallback = () => React.createElement('div', null, 'Loading...');

  return {
    Component,
    loading,
    error,
    loadComponent,
    Fallback: (fallback as unknown as React.ComponentType<Record<string, unknown>>) || DefaultFallback
  };
};
