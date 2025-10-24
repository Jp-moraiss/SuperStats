/**
 * Exemplos de uso dos componentes genéricos criados
 * 
 * @description Demonstra como usar os novos componentes reutilizáveis
 * em diferentes cenários da aplicação.
 */

import React from 'react';
import { 
  Card, 
  Button, 
  LoadingSpinner 
} from '@/components';
import { FaHeart, FaStar, FaTrash } from 'react-icons/fa';

/**
 * Exemplo 1: Card com diferentes variantes
 */
export const CardExamples = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {/* Card padrão */}
      <Card variant="default" size="medium">
        <h3>Card Padrão</h3>
        <p>Conteúdo do card com estilo padrão</p>
      </Card>

      {/* Card elevado */}
      <Card variant="elevated" size="medium">
        <h3>Card Elevado</h3>
        <p>Card com sombra mais pronunciada</p>
      </Card>

      {/* Card com outline */}
      <Card variant="outlined" size="medium">
        <h3>Card Outlined</h3>
        <p>Card com borda colorida</p>
      </Card>

      {/* Card clicável */}
      <Card 
        variant="default" 
        size="medium" 
        hoverable 
        onClick={() => console.log('Card clicado!')}
      >
        <h3>Card Clicável</h3>
        <p>Clique para interagir</p>
      </Card>
    </div>
  );
};

/**
 * Exemplo 2: Botões com diferentes variantes e estados
 */
export const ButtonExamples = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {/* Botões primários */}
      <Button variant="primary" size="medium">
        Botão Primário
      </Button>

      <Button variant="secondary" size="medium">
        Botão Secundário
      </Button>

      {/* Botões com ícones */}
      <Button 
        variant="success" 
        size="medium"
        icon={<FaHeart />}
        iconPosition="left"
      >
        Curtir
      </Button>

      <Button 
        variant="error" 
        size="medium"
        icon={<FaTrash />}
        iconPosition="right"
      >
        Excluir
      </Button>

      {/* Botão com loading */}
      <Button variant="primary" size="medium" loading>
        Carregando...
      </Button>

      {/* Botão desabilitado */}
      <Button variant="primary" size="medium" disabled>
        Desabilitado
      </Button>

      {/* Botão full width */}
      <Button variant="ghost" size="large" fullWidth>
        Botão Full Width
      </Button>
    </div>
  );
};

/**
 * Exemplo 3: Loading spinners
 */
export const LoadingExamples = () => {
  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <LoadingSpinner size="small" />
      <LoadingSpinner size="medium" text="Carregando..." />
      <LoadingSpinner size="large" color="var(--color-success)" text="Processando..." />
    </div>
  );
};

/**
 * Exemplo 4: Combinação de componentes
 */
export const CombinedExample = () => {
  const [loading, setLoading] = React.useState(false);

  const handleAction = async () => {
    setLoading(true);
    // Simular operação assíncrona
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <Card variant="elevated" size="large" padding="large">
      <h2>Exemplo Combinado</h2>
      <p>Este exemplo mostra como combinar diferentes componentes genéricos.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button 
          variant="primary" 
          size="medium"
          loading={loading}
          onClick={handleAction}
          icon={<FaStar />}
          iconPosition="left"
        >
          {loading ? 'Processando...' : 'Avaliar'}
        </Button>
        
        <Button variant="ghost" size="medium">
          Cancelar
        </Button>
      </div>
      
      {loading && (
        <div style={{ marginTop: '1rem' }}>
          <LoadingSpinner size="small" text="Aguarde..." />
        </div>
      )}
    </Card>
  );
};


