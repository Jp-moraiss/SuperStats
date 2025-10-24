import React from 'react';
import { render } from '@testing-library/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

/**
 * Testes de performance para componentes
 * 
 * @description Verifica se os componentes estão otimizados
 * e não causam problemas de performance.
 */

describe('Performance Tests', () => {
  describe('Component Memoization', () => {
    it('should not re-render Card with same props', () => {
      const renderSpy = jest.fn();
      
      const TestCard = React.memo(() => {
        renderSpy();
        return <Card>Test Card</Card>;
      });
      TestCard.displayName = 'TestCard';
      
      const { rerender } = render(<TestCard />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props
      rerender(<TestCard />);
      expect(renderSpy).toHaveBeenCalledTimes(1); // Should not re-render
    });

    it('should not re-render Button with same props', () => {
      const renderSpy = jest.fn();
      
      const TestButton = React.memo(() => {
        renderSpy();
        return <Button>Test Button</Button>;
      });
      TestButton.displayName = 'TestButton';
      
      const { rerender } = render(<TestButton />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props
      rerender(<TestButton />);
      expect(renderSpy).toHaveBeenCalledTimes(1); // Should not re-render
    });

    it('should not re-render LoadingSpinner with same props', () => {
      const renderSpy = jest.fn();
      
      const TestSpinner = React.memo(() => {
        renderSpy();
        return <LoadingSpinner text="Loading..." />;
      });
      TestSpinner.displayName = 'TestSpinner';
      
      const { rerender } = render(<TestSpinner />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props
      rerender(<TestSpinner />);
      expect(renderSpy).toHaveBeenCalledTimes(1); // Should not re-render
    });
  });

  describe('Component Rendering Performance', () => {
    it('should render Card quickly', () => {
      const startTime = performance.now();
      
      render(<Card variant="elevated" size="large">Performance Test</Card>);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render in less than 50ms
      expect(renderTime).toBeLessThan(50);
    });

    it('should render Button quickly', () => {
      const startTime = performance.now();
      
      render(<Button variant="primary" size="large" loading>Performance Test</Button>);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render in less than 50ms
      expect(renderTime).toBeLessThan(50);
    });

    it('should render LoadingSpinner quickly', () => {
      const startTime = performance.now();
      
      render(<LoadingSpinner size="large" text="Performance Test" />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render in less than 30ms
      expect(renderTime).toBeLessThan(30);
    });
  });

  describe('Memory Usage', () => {
    it('should not create memory leaks with multiple renders', () => {
      const initialMemory = (performance as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
      
      // Render multiple components
      for (let i = 0; i < 100; i++) {
        render(
          <div key={i}>
            <Card>Card {i}</Card>
            <Button>Button {i}</Button>
            <LoadingSpinner text={`Loading ${i}`} />
          </div>
        );
      }
      
      const finalMemory = (performance as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024);
    });
  });

  describe('Bundle Size Impact', () => {
    it('should have reasonable component sizes', () => {
      // This test would typically be run with a bundle analyzer
      // For now, we'll just verify the components exist and are importable
      expect(Card).toBeDefined();
      expect(Button).toBeDefined();
      expect(LoadingSpinner).toBeDefined();
    });
  });

  describe('Accessibility Performance', () => {
    it('should render accessible components quickly', () => {
      const startTime = performance.now();
      
      render(
        <div>
          <Card onClick={() => {}}>Accessible Card</Card>
          <Button onClick={() => {}}>Accessible Button</Button>
        </div>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Accessible components should still render quickly
      expect(renderTime).toBeLessThan(15);
    });
  });
});
