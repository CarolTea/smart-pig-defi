// PIXDepositDemo.tsx - Versão mock para demonstração em vídeo
import React, { useState, useEffect } from 'react';
import './PIXDeposit.css';

interface PIXDepositDemoProps {
  stellarAccount: string;
  amount: number;
  onDepositSuccess: (amount: number, txId: string) => void;
  onClose: () => void;
  fastMode?: boolean;
}

const PIXDepositDemo: React.FC<PIXDepositDemoProps> = ({ 
  stellarAccount, 
  amount,
  onDepositSuccess, 
  onClose,
  fastMode = true
}) => {
  const [step, setStep] = useState<'processing' | 'pix-data' | 'waiting' | 'success'>('processing');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [pixData, setPixData] = useState({
    id: `PIX_${Date.now()}`,
    pixKey: `smartpig.demo.${Date.now()}@stellar.network`,
    // QR code removido - vamos usar CSS
  });

  const delays = {
    processing: fastMode ? 800 : 2000,
    pixGeneration: fastMode ? 1200 : 3000,
    paymentCheck: fastMode ? 2000 : 5000
  };

  // Simular geração do PIX
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeRemaining(fastMode ? 180 : 900); // 3 min ou 15 min
      setStep('pix-data');
    }, delays.processing);

    return () => clearTimeout(timer);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (step === 'pix-data' || step === 'waiting') {
      if (timeRemaining > 0) {
        const timer = setTimeout(() => {
          setTimeRemaining(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [step, timeRemaining]);

  // Auto-simular pagamento para demo
  useEffect(() => {
    if (step === 'waiting') {
      const timer = setTimeout(() => {
        const txId = `DEMO_TX_${Date.now().toString(36).toUpperCase()}`;
        setStep('success');
        setTimeout(() => {
          onDepositSuccess(amount, txId);
        }, 1500);
      }, delays.paymentCheck);

      return () => clearTimeout(timer);
    }
  }, [step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPIXKey = () => {
    navigator.clipboard.writeText(pixData.pixKey);
    const btn = document.querySelector('.copy-btn');
    const originalText = btn?.textContent || '📋 Copiar';
    if (btn) {
      btn.textContent = '✅ Copiado!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 2000);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'processing':
        return (
          <div className="pix-step">
            <div className="pix-header">
              <div className="pix-icon loading">⏳</div>
              <h2>Processando</h2>
              <p>Preparando seu PIX com Stellar Bridge...</p>
            </div>
            <div className="processing-animation">
              <div className="dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div style={{ 
                marginTop: '20px', 
                fontSize: '0.9rem', 
                color: 'rgba(255,255,255,0.7)' 
              }}>
                🔄 Convertendo BRL → USDC<br/>
                ⚡ Preparando Smart Contract<br/>
                🏦 Sincronizando com PSP
              </div>
            </div>
          </div>
        );

      case 'pix-data':
        return (
          <div className="pix-step">
            <div className="pix-header">
              <div className="pix-icon">📱</div>
              <h2>PIX Gerado!</h2>
              <p>Escaneie o QR Code ou copie a chave PIX</p>
            </div>

            <div className="pix-details">
              <div className="amount-display">
                <span className="label">Valor:</span>
                <span className="value">R$ {amount.toFixed(2)}</span>
              </div>
              
              <div className="timer">
                <span className="label">Expira em:</span>
                <span className="time">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            <div className="qr-section">
              <h4>QR Code PIX:</h4>
              <div className="qr-code">
                {/* QR Code simulado com CSS simples */}
                <div style={{
                  width: '180px',
                  height: '180px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  border: '3px solid #FFD700',
                  borderRadius: '10px',
                  position: 'relative',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {/* Padrão QR simulado simples */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '2px',
                    width: '120px',
                    height: '120px'
                  }}>
                    {/* Gerar padrão QR fake */}
                    {Array.from({length: 144}).map((_, i) => (
                      <div 
                        key={i}
                        style={{
                          background: (i + Math.floor(i/12)) % 3 === 0 ? 'black' : 'white',
                          width: '8px',
                          height: '8px'
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Logo PIX */}
                  <div style={{
                    position: 'absolute',
                    background: 'rgba(255,215,0,0.95)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: '#1a1a1a',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    PIX
                  </div>
                </div>
                <div style={{
                  marginTop: '10px',
                  fontSize: '0.8rem',
                  color: '#FFE082'
                }}>
                  💡 QR Code gerado pela Stellar Bridge
                </div>
              </div>
            </div>

            <div className="pix-key-section">
              <h4>Ou copie a chave PIX:</h4>
              <div className="pix-key-wrapper">
                <input 
                  type="text" 
                  value={pixData.pixKey} 
                  readOnly 
                  className="pix-key-input"
                  style={{ fontSize: '0.8rem' }}
                />
                <button 
                  onClick={handleCopyPIXKey}
                  className="copy-btn"
                >
                  📋 Copiar
                </button>
              </div>
            </div>

            <div className="instructions">
              <h4>Como pagar:</h4>
              <ol>
                <li>Abra seu app do banco</li>
                <li>Escolha PIX</li>
                <li>Escaneie o QR Code ou cole a chave</li>
                <li>Confirme o pagamento</li>
                <li>Aguarde a confirmação automática</li>
              </ol>
            </div>

            <button 
              onClick={() => setStep('waiting')}
              className="pix-button primary"
            >
              Já paguei - Verificar Status ⚡
            </button>

            {fastMode && (
              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(255,193,7,0.12)',
                border: '1px solid #FFC107',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#FFC107',
                textAlign: 'center'
              }}>
                🎬 DEMO MODE: Pagamento será aprovado automaticamente em {delays.paymentCheck / 1000}s
              </div>
            )}
          </div>
        );

      case 'waiting':
        return (
          <div className="pix-step">
            <div className="pix-header">
              <div className="pix-icon waiting">⏰</div>
              <h2>Aguardando Pagamento</h2>
              <p>Verificando seu PIX na blockchain Stellar...</p>
            </div>

            <div className="waiting-animation">
              <div className="pulse-circle"></div>
              <div className="status-text">
                💫 Monitorando transação em tempo real<br/>
                🔗 Stellar Bridge ativa<br/>
                ⚡ Conversão automática BRL → USDC
              </div>
            </div>

            <div className="payment-info">
              <div className="info-item">
                <span className="label">Valor:</span>
                <span className="value">R$ {amount.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Conversão:</span>
                <span className="value">~${(amount / 5.5).toFixed(2)} USDC</span>
              </div>
              <div className="info-item">
                <span className="label">Tempo restante:</span>
                <span className="value">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            <button 
              onClick={() => setStep('pix-data')}
              className="pix-button secondary"
            >
              ← Voltar aos dados PIX
            </button>

            {fastMode && (
              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(0,230,118,0.12)',
                border: '1px solid #00e676',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#00e676',
                textAlign: 'center',
                animation: 'pulse 2s infinite'
              }}>
                🎬 Simulando confirmação de pagamento...
              </div>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="pix-step">
            <div className="pix-header success">
              <div className="pix-icon">🎉</div>
              <h2>Pagamento Confirmado!</h2>
              <p>Seu porquinho recebeu o dinheiro!</p>
            </div>

            <div className="success-details">
              <div className="success-amount">
                R$ {amount.toFixed(2)}
              </div>
              <div className="success-conversion">
                ≈ ${(amount / 5.5).toFixed(2)} USDC depositados
              </div>
              <div className="success-message">
                🚀 Convertido automaticamente para USDC<br/>
                💰 Já está rendendo 8% ao ano na Stellar!<br/>
                ⚡ Transação confirmada em {fastMode ? '3' : '8'} segundos
              </div>

              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(255,215,0,0.12)',
                border: '1px solid #FFD700',
                borderRadius: '10px',
                fontSize: '0.9rem'
              }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '8px' }}>
                  📊 Detalhes da Operação:
                </div>
                <div style={{ color: '#FFFFFF', fontSize: '0.85rem' }}>
                  🔄 Taxa de conversão: R$ 5,50/USDC<br/>
                  ⛽ Gas fee: R$ 0,15<br/>
                  🏦 PSP fee: R$ 0,50<br/>
                  ⚡ Tempo total: {fastMode ? '4.2s' : '12.8s'}
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="pix-button primary"
            >
              Ver meu Porquinho! 🐷✨
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pix-overlay">
      <div className="pix-container">
        <button onClick={onClose} className="close-btn">✕</button>
        {renderStepContent()}
      </div>
    </div>
  );
};

export default PIXDepositDemo;