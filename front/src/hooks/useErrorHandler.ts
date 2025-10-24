"use client";

import { useCallback } from 'react';

interface ErrorHandlerOptions {
  onError?: (error: Error, context: string) => void;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { onError } = options;

  const handleError = useCallback((error: unknown, context: string) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    console.error(`Error in ${context}:`, errorObj);
    
    if (onError) {
      onError(errorObj, context);
    }
    
    // Aqui você pode adicionar lógica para mostrar notificações ao usuário
    // Por exemplo, usando um toast ou modal de erro
  }, [onError]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T | undefined> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context);
      return fallback;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};
