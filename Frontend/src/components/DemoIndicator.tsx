// DemoIndicator.tsx - Indicador visual de modo demonstração
import React, { useState, useEffect } from 'react';

interface DemoIndicatorProps {
  isVisible?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showStats?: boolean;
}

const DemoIndicator: React.FC<DemoIndicatorProps> = ({ 
  isVisible = true, 
  position = 'top-right',
  showStats = true 
}) => {
  const [stats, setStats] = useState({
    operations: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    levelUps: 0
  });

  const [isMinimized, setIsMinimized] = useState(false);

  // Escutar eventos de demo para atualizar estatísticas
  useEffect(() => {
    const handleDemoEvent = (event: CustomEvent) => {
      const { type, amount, level } = event.detail;
      
      setStats(prev => ({
        ...prev,
        operations: prev.operations + 1,
        totalDeposited: type === 'deposit' ? prev.totalDeposited + amount : prev.totalDeposited,
        totalWithdrawn: type === 'withdraw' ? prev.totalWithdrawn + amount : prev.totalWithdrawn,
        levelUps: type === 'levelup' ? prev.levelUps + 1 : prev.levelUps
      }));
    };

    // @ts-ignore - Custom events
    window.addEventListener('smartpig-demo-event', handleDemoEvent);
    
    return () => {
      // @ts-ignore
      window.removeEventListener('smartpig-demo-event', handleDemoEvent);
    };
  }, []);

  const getPositionStyles = () => {
    const base = {
      position: 'fixed' as const,
      zIndex: 9999,
      fontSize: '0.75rem',
      fontWeight: 'bold',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    };

    switch (position) {
      case 'top-left':
        return { ...base, top: '10px', left: '10px' };
      case 'bottom-right':
        return { ...base, bottom: '10px', right: '10px' };
      case 'bottom-left':
        return { ...base, bottom: '10px', left: '10px' };
      default: // top-right
        return { ...base, top: '10px', right: '10px' };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!isVisible) return null;

  return (
    <div 
      style={{
        ...getPositionStyles(),
        background: isMinimized 
          ? 'linear-gradient(45deg, #FF6B35, #F7931E)' 
          : 'linear-gradient(45deg, #FF6B35, #F7931E, #FFD700)',
        color: '#1a1a1a',
        padding: isMinimized ? '8px 12px' : '10px 15px',
        borderRadius: isMinimized ? '20px' : '12px',
        minWidth: isMinimized ? 'auto' : '200px'
      }}
      onClick={() => setIsMinimized(!isMinimized)}
      title={isMinimized ? 'Clique para expandir estatísticas' : 'Clique para minimizar'}
    >
      {isMinimized ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🎬</span>
          <span>DEMO</span>
        </div>
      ) : (
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: showStats ? '8px' : '0' 
          }}>
            <span style={{ fontSize: '1rem' }}>🎬</span>
            <span>MODO DEMONSTRAÇÃO</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>✕</span>
          </div>
          
          {showStats && (
            <div style={{ 
              fontSize: '0.65rem', 
              opacity: 0.9,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4px'
            }}>
              <div>⚡ Operações: {stats.operations}</div>
              <div>📈 Level UPs: {stats.levelUps}</div>
              <div>💰 Depositado: {formatCurrency(stats.totalDeposited)}</div>
              <div>💸 Sacado: {formatCurrency(stats.totalWithdrawn)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Hook para disparar eventos de demo
export const useDemoEvents = () => {
  const triggerDemoEvent = (type: 'deposit' | 'withdraw' | 'levelup', data: any = {}) => {
    const event = new CustomEvent('smartpig-demo-event', {
      detail: { type, ...data }
    });
    window.dispatchEvent(event);
  };

  return { triggerDemoEvent };
};

export default DemoIndicator;