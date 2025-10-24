/**
 * Exemplos de otimizações de performance implementadas
 * 
 * @description Demonstra como usar os componentes otimizados
 * e as técnicas de performance implementadas.
 */

import React from 'react';
import { 
  DynamicPowerRadarChart,
  DynamicAlignmentChart,
  DynamicPublisherChart
} from '@/components/charts/DynamicCharts';
import { 
  DynamicCharacterTable as DynamicTable,
  DynamicStatCard as DynamicStat
} from '@/components/dashboard/DynamicTables';
import { Card, Button, LoadingSpinner } from '@/components';

/**
 * Exemplo 1: Componentes de gráficos com lazy loading
 */
export const DynamicChartsExample = () => {
  const [showCharts, setShowCharts] = React.useState(false);
  
  return (
    <Card variant="elevated" size="large" padding="large">
      <h2>Gráficos Dinâmicos</h2>
      <p>Os gráficos são carregados apenas quando necessário, melhorando a performance inicial.</p>
      
      <Button 
        variant="primary" 
        onClick={() => setShowCharts(!showCharts)}
        style={{ marginBottom: '1rem' }}
      >
        {showCharts ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
      </Button>
      
      {showCharts && (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <DynamicPowerRadarChart 
            data={[]} 
            selectedCharacter={null} 
          />
          <DynamicAlignmentChart data={[]} />
          <DynamicPublisherChart data={[]} />
        </div>
      )}
    </Card>
  );
};

/**
 * Exemplo 2: Componentes de tabela com lazy loading
 */
export const DynamicTablesExample = () => {
  const [showTables, setShowTables] = React.useState(false);
  
  return (
    <Card variant="elevated" size="large" padding="large">
      <h2>Tabelas Dinâmicas</h2>
      <p>As tabelas são carregadas dinamicamente para melhorar a performance.</p>
      
      <Button 
        variant="secondary" 
        onClick={() => setShowTables(!showTables)}
        style={{ marginBottom: '1rem' }}
      >
        {showTables ? 'Ocultar Tabelas' : 'Mostrar Tabelas'}
      </Button>
      
      {showTables && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DynamicTable 
            data={[]} 
            onCharacterSelect={() => {}} 
          />
          <DynamicStat 
            title="Estatística" 
            value={100} 
            variant="total" 
          />
        </div>
      )}
    </Card>
  );
};

/**
 * Exemplo 3: Componentes memoizados
 */
export const MemoizedComponentsExample = () => {
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState('Usuário');
  
  return (
    <Card variant="outlined" size="medium" padding="medium">
      <h2>Componentes Memoizados</h2>
      <p>Estes componentes são otimizados com React.memo para evitar re-renderizações desnecessárias.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Button 
          variant="primary" 
          onClick={() => setCount(count + 1)}
        >
          Contador: {count}
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={() => setName(name === 'Usuário' ? 'Admin' : 'Usuário')}
        >
          Nome: {name}
        </Button>
      </div>
      
      {/* Estes componentes não re-renderizam quando count muda */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Card variant="flat" size="small">
          <h3>Card Memoizado</h3>
          <p>Este card não re-renderiza desnecessariamente</p>
        </Card>
        
        <div>
          <LoadingSpinner size="small" text="Loading..." />
        </div>
      </div>
    </Card>
  );
};

/**
 * Exemplo 4: Lazy loading com Intersection Observer
 */
export const LazyLoadingExample = () => {
  const [visible, setVisible] = React.useState(false);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('lazy-content');
    if (element) {
      observer.observe(element);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <Card variant="elevated" size="large" padding="large">
      <h2>Lazy Loading com Intersection Observer</h2>
      <p>O conteúdo abaixo só é carregado quando visível na tela.</p>
      
      <div 
        id="lazy-content"
        style={{ 
          height: '200px', 
          background: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '2px dashed #ccc',
          borderRadius: '8px'
        }}
      >
        {visible ? (
          <div>
            <h3>Conteúdo Carregado!</h3>
            <p>Este conteúdo foi carregado apenas quando ficou visível.</p>
            <DynamicPowerRadarChart data={[]} selectedCharacter={null} />
          </div>
        ) : (
          <LoadingSpinner size="medium" text="Aguardando visibilidade..." />
        )}
      </div>
    </Card>
  );
};
