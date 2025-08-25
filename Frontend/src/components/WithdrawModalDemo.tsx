// WithdrawModalDemo.tsx - Versão mock para demonstração em vídeo
import React, { useMemo, useState } from 'react';

interface WithdrawModalDemoProps {
  availableBalance: number;
  stellarAccount: string;
  minAmount: number;
  onClose: () => void;
  onSuccess: (amount: number, txId: string) => void;
  feeBps?: number;
  fastMode?: boolean;
}

const WithdrawModalDemo: React.FC<WithdrawModalDemoProps> = ({
  availableBalance,
  stellarAccount,
  minAmount,
  onClose,
  onSuccess,
  feeBps = 50, // 0.5% fee para demo
  fastMode = true
}) => {
  const [amount, setAmount] = useState<string>('');
  const [pixKey, setPixKey] = useState<string>('usuario@smartpig.com'); // Pré-preenchido para demo
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [showProcessingSteps, setShowProcessingSteps] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  // Chaves PIX de exemplo para demo
  const demoPixKeys = [
    'usuario@smartpig.com',
    '(11) 99999-8888',
    '123.456.789-00',
    'chave-aleatoria-demo-123'
  ];

  const amountNumber = useMemo(() => {
    const n = parseFloat((amount || '').replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }, [amount]);

  const feeValue = useMemo(() => Math.floor((amountNumber * feeBps)) / 10000, [amountNumber, feeBps]);
  const netAmount = useMemo(() => Math.max(0, amountNumber - feeValue), [amountNumber, feeValue]);
  
  // Taxa de conversão realista
  const usdcAmount = useMemo(() => netAmount / 5.5, [netAmount]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const quickFill = (percentage: number) => {
    const value = Math.min(availableBalance * (percentage / 100), availableBalance);
    setAmount(String(value.toFixed(2)));
  };

  const validate = () => {
    if (!amountNumber || amountNumber <= 0) {
      return 'Informe um valor para sacar.';
    }
    if (amountNumber < minAmount) {
      return `Valor mínimo para saque é ${formatCurrency(minAmount)}.`;
    }
    if (amountNumber > availableBalance) {
      return 'Valor excede seu saldo disponível.';
    }
    if (!pixKey || pixKey.trim().length < 5) {
      return 'Informe uma chave PIX válida.';
    }
    return '';
  };

  const processingSteps = [
    { icon: '🔄', text: 'Convertendo USDC → BRL', delay: fastMode ? 600 : 1500 },
    { icon: '🔐', text: 'Assinando com Smart Contract', delay: fastMode ? 800 : 2000 },
    { icon: '🏦', text: 'Enviando para PSP via Bridge', delay: fastMode ? 700 : 1800 },
    { icon: '📱', text: 'Processando PIX', delay: fastMode ? 900 : 2500 },
    { icon: '✅', text: 'Transferência confirmada', delay: fastMode ? 500 : 1000 }
  ];

  const handleConfirm = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setError('');
    setIsProcessing(true);
    setShowProcessingSteps(true);

    // Simular steps de processamento
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessStep(i);
      await new Promise((r) => setTimeout(r, processingSteps[i].delay));
    }

    // Simular sucesso
    const txId = `SAC${Math.random().toString(36).slice(2, 8).toUpperCase()}${Date.now().toString(36).slice(-4).toUpperCase()}`;
    
    setIsProcessing(false);
    setShowProcessingSteps(false);
    onSuccess(amountNumber, txId);
  };

  const randomizePixKey = () => {
    const randomKey = demoPixKeys[Math.floor(Math.random() * demoPixKeys.length)];
    setPixKey(randomKey);
  };

  return (
    <div className="wm-overlay" role="dialog" aria-modal="true" aria-labelledby="wm-title">
      <div className="wm-sheet">
        <div className="wm-header">
          <h3 id="wm-title">💧 Sacar</h3>
          <button className="wm-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <div className="wm-body">
          <div className="wm-balance">
            <span>Saldo disponível:</span>
            <strong>{formatCurrency(availableBalance)}</strong>
          </div>

          {/* Processamento em tempo real */}
          {showProcessingSteps && (
            <div style={{
              margin: '20px 0',
              padding: '20px',
              background: 'rgba(255,215,0,0.12)',
              border: '1px solid #FFD700',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                {processingSteps[processStep]?.icon}
              </div>
              <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '8px' }}>
                {processingSteps[processStep]?.text}
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${((processStep + 1) / processingSteps.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #FFD700, #FF8E53)',
                  transition: 'width 0.5s ease',
                  borderRadius: '3px'
                }}></div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                Passo {processStep + 1} de {processingSteps.length}
              </div>
            </div>
          )}

          {!showProcessingSteps && (
            <>
              <label className="wm-label">
                Valor do saque
                <input
                  className="wm-input"
                  type="number"
                  inputMode="decimal"
                  min={minAmount}
                  step="0.01"
                  placeholder="R$ 0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>

              <div className="wm-quick">
                <button className="wm-chip" onClick={() => quickFill(25)}>25%</button>
                <button className="wm-chip" onClick={() => quickFill(50)}>50%</button>
                <button className="wm-chip" onClick={() => quickFill(75)}>75%</button>
                <button className="wm-chip" onClick={() => quickFill(100)}>Max</button>
              </div>

              <label className="wm-label">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Chave PIX de destino</span>
                  <button 
                    type="button"
                    onClick={randomizePixKey}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(255,142,83,0.35)',
                      color: '#FFE082',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    🎲 Aleatório
                  </button>
                </div>
                <input
                  className="wm-input"
                  type="text"
                  placeholder="e-mail, CPF/CNPJ, telefone ou chave aleatória"
                  autoCapitalize="off"
                  autoCorrect="off"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                />
              </label>

              <div className="wm-summary">
                <div className="wm-row">
                  <span>Valor bruto:</span>
                  <strong>{formatCurrency(amountNumber)}</strong>
                </div>
                <div className="wm-row">
                  <span>Conversão USDC:</span>
                  <strong>~${usdcAmount.toFixed(2)} USDC</strong>
                </div>
                <div className="wm-row">
                  <span>Taxa Smart Pig ({(feeBps/100).toFixed(2)}%):</span>
                  <strong>{formatCurrency(feeValue)}</strong>
                </div>
                <div className="wm-row">
                  <span>Taxa PIX:</span>
                  <strong>R$ 0,00</strong>
                </div>
                <div className="wm-row wm-total">
                  <span>Você receberá:</span>
                  <strong style={{ color: '#00e676' }}>{formatCurrency(netAmount)}</strong>
                </div>
              </div>

              {error && <div className="wm-error">{error}</div>}
            </>
          )}
        </div>

        {!showProcessingSteps && (
          <div className="wm-footer">
            <button className="wm-btn ghost" onClick={onClose} disabled={isProcessing}>Cancelar</button>
            <button
              className="wm-btn primary"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? '⏳ Processando...' : 'Confirmar Saque'}
            </button>
          </div>
        )}

        <div className="wm-footnote">
          <div>Carteira: {stellarAccount?.slice(0, 6)}…{stellarAccount?.slice(-4)}</div>
          <div>
            {fastMode ? '🎬 DEMO' : '⚡ REAL'} • 
            Liquidez: instantânea • PIX
          </div>
        </div>

        {fastMode && !showProcessingSteps && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            background: 'rgba(255,193,7,0.12)',
            border: '1px solid #FFC107',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#FFC107',
            textAlign: 'center'
          }}>
            🎬 DEMO MODE: Processamento acelerado para demonstração
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawModalDemo;