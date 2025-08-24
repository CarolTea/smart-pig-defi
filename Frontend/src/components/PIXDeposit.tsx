import React, { useState, useEffect, useCallback } from 'react';
import './PIXDeposit.css';

interface PIXDepositProps {
  stellarAccount: string;
  onDepositSuccess: (amount: number, txId: string) => void;
  onClose: () => void;
}

interface PIXDepositResponse {
  id: string;
  type: string;
  url?: string;
  pixKey?: string;
  pixQRCode?: string;
  amount?: string;
  expires_at?: string;
}

const PIXDeposit: React.FC<PIXDepositProps> = ({ 
  stellarAccount, 
  onDepositSuccess, 
  onClose 
}) => {
  const [step, setStep] = useState<'amount' | 'processing' | 'pix-data' | 'waiting' | 'success'>('amount');
  const [amount, setAmount] = useState('');
  const [pixData, setPixData] = useState<PIXDepositResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Timer para expiração do PIX
  useEffect(() => {
    if (step === 'waiting' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAmountSubmit = async () => {
    if (!amount || parseFloat(amount) < 10) {
      setError('Valor mínimo: R$ 10,00');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Chamada para backend - SEP-24 Deposit
      const response = await fetch('/api/stellar/pix-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('smart_pig_token')}`
        },
        body: JSON.stringify({
          asset_code: 'USDC',
          account: stellarAccount,
          amount: amount,
          payment_method: 'PIX',
          lang: 'pt-BR'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar depósito');
      }

      setPixData(data);
      
      // Calcular tempo de expiração (15 minutos padrão)
      if (data.expires_at) {
        const expiresAt = new Date(data.expires_at).getTime();
        const now = Date.now();
        setTimeRemaining(Math.max(0, Math.floor((expiresAt - now) / 1000)));
      } else {
        setTimeRemaining(15 * 60); // 15 minutos default
      }

      setStep(data.type === 'interactive_customer_info_needed' ? 'processing' : 'pix-data');
      
    } catch (err: any) {
      setError(err.message || 'Erro ao processar depósito');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPIXKey = () => {
    if (pixData?.pixKey) {
      navigator.clipboard.writeText(pixData.pixKey);
      // Mostrar feedback visual
      const btn = document.querySelector('.copy-btn');
      btn?.classList.add('copied');
      setTimeout(() => btn?.classList.remove('copied'), 2000);
    }
  };

  const checkPaymentStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/stellar/pix-status/${pixData?.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('smart_pig_token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'completed') {
        setStep('success');
        onDepositSuccess(parseFloat(amount), data.stellar_transaction_id);
      } else if (data.status === 'error') {
        setError('Pagamento não foi processado. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao verificar status:', err);
    }
  }, [pixData?.id, amount, onDepositSuccess]);

  // Verificar status a cada 3 segundos quando aguardando
  useEffect(() => {
    if (step === 'waiting' && pixData?.id) {
      const interval = setInterval(checkPaymentStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [step, pixData?.id, checkPaymentStatus]);

  const renderStepContent = () => {
    switch (step) {
      case 'amount':
        return (
          <div className="pix-step">
            <div className="pix-header">
              <div className="pix-icon">💰</div>
              <h2>Depositar via PIX</h2>
              <p>Quanto você quer investir no Smart Pig?</p>
            </div>

            <div className="amount-input-section">
              <label htmlFor="amount">Valor em Reais (R$)</label>
              <div className="amount-input-wrapper">
                <span className="currency">R$</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  min="10"
                  step="0.01"
                  className="amount-input"
                />
              </div>
              <div className="amount-info">
                Será convertido para ~$US{(parseFloat(amount || '0') / 5.5).toFixed(2)} USDC
              </div>
            </div>

            <div className="quick-amounts">
              <h4>Valores rápidos:</h4>
              <div className="quick-buttons">
                <button onClick={() => setAmount('100')} className="quick-btn">R$ 100</button>
                <button onClick={() => setAmount('500')} className="quick-btn">R$ 500</button>
                <button onClick={() => setAmount('1000')} className="quick-btn">R$ 1.000</button>
                <button onClick={() => setAmount('5000')} className="quick-btn">R$ 5.000</button>
              </div>
            </div>

            <button 
              onClick={handleAmountSubmit}
              disabled={isLoading || !amount}
              className="pix-button primary"
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Processando...
                </>
              ) : (
                'Gerar PIX'
              )}
            </button>
          </div>
        );

      case 'processing':
        return (
          <div className="pix-step">
            <div className="pix-header">
              <div className="pix-icon loading">⏳</div>
              <h2>Processando</h2>
              <p>Preparando seu PIX com o banco...</p>
            </div>
            <div className="processing-animation">
              <div className="dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
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
                <span className="value">R$ {parseFloat(amount).toFixed(2)}</span>
              </div>
              
              <div className="timer">
                <span className="label">Expira em:</span>
                <span className="time">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            {pixData?.pixQRCode && (
              <div className="qr-section">
                <h4>QR Code PIX:</h4>
                <div className="qr-code">
                  <img src={`data:image/png;base64,${pixData.pixQRCode}`} alt="QR Code PIX" />
                </div>
              </div>
            )}

            {pixData?.pixKey && (
              <div className="pix-key-section">
                <h4>Ou copie a chave PIX:</h4>
                <div className="pix-key-wrapper">
                  <input 
                    type="text" 
                    value={pixData.pixKey} 
                    readOnly 
                    className="pix-key-input"
                  />
                  <button 
                    onClick={handleCopyPIXKey}
                    className="copy-btn"
                  >
                    📋 Copiar
                  </button>
                </div>
              </div>
            )}

            <div className="instructions">
              <h4>Como pagar:</h4>
              <ol>
                <li>Abra seu app do banco</li>
                <li>Escolha PIX</li>
                <li>Escaneie o QR Code ou cole a chave</li>
                <li>Confirme o pagamento</li>
                <li>Aguarde a confirmação</li>
              </ol>
            </div>

            <button 
              onClick={() => setStep('waiting')}
              className="pix-button primary"
            >
              Já paguei - Verificar Status
            </button>
          </div>
        );

      case 'waiting':
        return (
          <div className="pix-step">
            <div className="pix-header">
              <div className="pix-icon waiting">⏰</div>
              <h2>Aguardando Pagamento</h2>
              <p>Verificando seu PIX...</p>
            </div>

            <div className="waiting-animation">
              <div className="pulse-circle"></div>
              <div className="status-text">
                Pagamento será confirmado automaticamente
              </div>
            </div>

            <div className="payment-info">
              <div className="info-item">
                <span className="label">Valor:</span>
                <span className="value">R$ {parseFloat(amount).toFixed(2)}</span>
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
                R$ {parseFloat(amount).toFixed(2)}
              </div>
              <div className="success-conversion">
                ≈ ${(parseFloat(amount) / 5.5).toFixed(2)} USDC depositados
              </div>
              <div className="success-message">
                Seu dinheiro já está rendendo 7-10% ao ano! 🐷💰
              </div>
            </div>

            <button 
              onClick={onClose}
              className="pix-button primary"
            >
              Ver meu Porquinho! 🐷
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
        
        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PIXDeposit;