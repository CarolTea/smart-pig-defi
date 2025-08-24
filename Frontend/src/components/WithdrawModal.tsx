import React, { useMemo, useState } from 'react';

interface WithdrawModalProps {
  availableBalance: number;
  stellarAccount: string;
  minAmount: number;
  onClose: () => void;
  onSuccess: (amount: number, txId: string) => void;
  /** Opcional: taxa em basis points. Ex.: 100 = 1%. Default: 0 */
  feeBps?: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  availableBalance,
  stellarAccount,
  minAmount,
  onClose,
  onSuccess,
  feeBps = 0,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [pixKey, setPixKey] = useState<string>(''); // opcional: chave PIX do usuário
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const amountNumber = useMemo(() => {
    const n = parseFloat((amount || '').replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }, [amount]);

  const feeValue = useMemo(() => Math.floor((amountNumber * feeBps)) / 10000, [amountNumber, feeBps]);
  const netAmount = useMemo(() => Math.max(0, amountNumber - feeValue), [amountNumber, feeValue]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const quickFill = (v: number) => {
    setAmount(String(Math.min(v, availableBalance).toFixed(2)));
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

  const handleConfirm = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    setIsProcessing(true);

    // Simulação do fluxo de saque/transferência PIX
    // Aqui você implementaria: conversão USDC->BRL, envio via provedor / PSP, etc.
    await new Promise((r) => setTimeout(r, 1400));

    // txId simulado
    const txId = `SAC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    setIsProcessing(false);
    onSuccess(netAmount, txId);
  };

  return (
    <div className="wm-overlay" role="dialog" aria-modal="true" aria-labelledby="wm-title">
      <div className="wm-sheet">
        <div className="wm-header">
          <h3 id="wm-title">🏧 Sacar</h3>
          <button className="wm-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <div className="wm-body">
          <div className="wm-balance">
            <span>Saldo disponível:</span>
            <strong>{formatCurrency(availableBalance)}</strong>
          </div>

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
            <button className="wm-chip" onClick={() => quickFill(50)}>R$ 50</button>
            <button className="wm-chip" onClick={() => quickFill(100)}>R$ 100</button>
            <button className="wm-chip" onClick={() => quickFill(200)}>R$ 200</button>
            <button className="wm-chip" onClick={() => quickFill(Math.floor(availableBalance))}>Max</button>
          </div>

          <label className="wm-label">
            Chave PIX de destino
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
              <span>Mínimo:</span>
              <strong>{formatCurrency(minAmount)}</strong>
            </div>
            <div className="wm-row">
              <span>Taxa {feeBps ? `(${(feeBps/100).toFixed(2)}%)` : ''}:</span>
              <strong>{formatCurrency(feeValue)}</strong>
            </div>
            <div className="wm-row wm-total">
              <span>Você receberá:</span>
              <strong>{formatCurrency(netAmount)}</strong>
            </div>
          </div>

          {error && <div className="wm-error">{error}</div>}
        </div>

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

        <div className="wm-footnote">
          <div>Carteira: {stellarAccount?.slice(0, 6)}…{stellarAccount?.slice(-4)}</div>
          <div>Liquidez: instantânea • PIX</div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
