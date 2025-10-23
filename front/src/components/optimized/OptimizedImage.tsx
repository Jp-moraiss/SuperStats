"use client";

import Image from 'next/image';
import { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  className?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  className = '',
  placeholder = 'empty',
  blurDataURL,
  sizes,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  if (hasError) {
    return (
      <div 
        className={`image-error ${className}`}
        style={{ width, height }}
      >
        <div className="error-content">
          <span>⚠️</span>
          <p>Erro ao carregar imagem</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`optimized-image-container ${className}`}>
      {isLoading && (
        <div 
          className="image-skeleton"
          style={{ width, height }}
        >
          <div className="skeleton-shimmer"></div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`optimized-image ${isLoading ? 'loading' : 'loaded'}`}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  );
};
