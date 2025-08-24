import React, { useState, useEffect } from 'react';
import PIXDeposit from './PIXDeposit';
import WithdrawModal from './WithdrawModal';
import './SmartPig.css';
import './WithdrawModal.css';

interface StellarAccount {
  publicKey: string;
  contractId: string;
  balance: number;
}

interface SmartPigProps {
  stellarAccount: StellarAccount;
  onLogout: () => void;
}

const SmartPig: React.FC<SmartPigProps> = ({ stellarAccount, onLogout }) => {
  const [balance, setBalance] = useState(stellarAccount.balance || 0);
  const [depositAmount, setDepositAmount] = useState('');
  const [pigLevel, setPigLevel] = useState(1);
  const [showMessage, setShowMessage] = useState('');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showPIXModal, setShowPIXModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isProcessingDeposit] = useState(false);

  const MIN_WITHDRAW = 10; // ajuste se necessário

  // Atualizar nível do porquinho baseado no saldo
  useEffect(() => {
    const newLevel = getPigLevel(balance);
    if (newLevel !== pigLevel) {
      setPigLevel(newLevel);
      if (newLevel > pigLevel) {
        setShowMessage(getMotivationalMessage(newLevel, balance));
        setTimeout(() => setShowMessage(''), 4000);
      }
    }
  }, [balance, pigLevel]);

  // Simular ganhos diários (7% ao ano)
  useEffect(() => {
    if (balance > 0) {
      const interval = setInterval(() => {
        const dailyEarnings = balance * 0.07 / 365;
        setTotalEarnings(prev => prev + dailyEarnings / 24); // Por hora para demo
      }, 3600000); // A cada hora

      return () => clearInterval(interval);
    }
  }, [balance]);

  // Níveis do porquinho baseado no saldo
  const getPigLevel = (amount: number) => {
    if (amount < 500) return 1;
    if (amount < 2000) return 2;
    if (amount < 5000) return 3;
    if (amount < 15000) return 4;
    return 5;
  };

  // Mensagens motivacionais por nível
  const getMotivationalMessage = (level: number, amount: number) => {
    const messages = [
      { level: 1, message: "🐷 Seu porquinho está começando a crescer! Continue investindo!" },
      { level: 2, message: "🐷✨ Ótimo! Seu porquinho está ficando mais gordo e feliz!" },
      { level: 3, message: "🐷💰 Parabéns! Seu porquinho está prosperando!" },
      { level: 4, message: "🐷👑 Incrível! Seu porquinho está quase um barão!" },
      { level: 5, message: "🐷💎 LENDÁRIO! Seu porquinho é agora um magnata!" }
    ];
    return messages.find(m => m.level === level)?.message || '';
  };

  const handleQuickDeposit = (amount: string) => {
    setDepositAmount(amount);
    setShowPIXModal(true);
  };

  const handlePIXDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) < 10) {
      setShowMessage("⚠️ Valor mínimo para depósito: R$ 10,00");
      setTimeout(() => setShowMessage(''), 3000);
      return;
    }
    setShowPIXModal(true);
  };

  const handleDepositSuccess = (amount: number, txId: string) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    
    // Simular conversão USDC (taxa aproximada R$ 5,50)
    const usdcAmount = amount / 5.5;
    
    // Atualizar ganhos estimados
    const dailyEarnings = newBalance * 0.07 / 365;
    setTotalEarnings(prev => prev + dailyEarnings);
    
    setShowMessage(`🎉 Depósito realizado! +R$ ${amount.toFixed(2)} (~$${usdcAmount.toFixed(2)} USDC)`);
    setDepositAmount('');
    setShowPIXModal(false);
    
    setTimeout(() => setShowMessage(''), 5000);
  };

  const handleOpenWithdraw = () => {
    if (balance < MIN_WITHDRAW) {
      setShowMessage(`⚠️ Saldo insuficiente para sacar. Mínimo: R$ ${MIN_WITHDRAW.toFixed(2)}`);
      setTimeout(() => setShowMessage(''), 3000);
      return;
    }
    setShowWithdrawModal(true);
  };

  const handleWithdrawSuccess = (amount: number, txId: string) => {
    const saque = Math.min(amount, balance);
    const newBalance = balance - saque;
    setBalance(newBalance);

    // Conversão inversa (USDC -> BRL) meramente informativa
    const usdcAmount = saque / 5.5;

    setShowMessage(`✅ Saque realizado! -R$ ${saque.toFixed(2)} (~$${usdcAmount.toFixed(2)} USDC) • TX: ${txId.slice(0,8)}…`);
    setShowWithdrawModal(false);

    setTimeout(() => setShowMessage(''), 5000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatUSDC = (value: number) => {
    const usdc = value / 5.5; // Conversão aproximada
    return `$${usdc.toFixed(2)} USDC`;
  };

  const getPigEmoji = (level: number) => {
    const pigs = ['🐷', '🐽', '🐖', '🐷👑', '🐷💎'];
    return pigs[level - 1] || '🐷';
  };

  const getNextLevelThreshold = (level: number) => {
    const thresholds = [500, 2000, 5000, 15000, 50000];
    return thresholds[level - 1] || 50000;
  };

  const getProgressPercentage = () => {
    if (pigLevel === 5) return 100;
    
    const currentThreshold = getNextLevelThreshold(pigLevel - 1) || 0;
    const nextThreshold = getNextLevelThreshold(pigLevel);
    const progress = ((balance - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    
    return Math.max(0, Math.min(100, progress));
  };

  return (
    <div className="smart-pig-container">
      {/* Header com info da carteira */}
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>🐷 SMART PIG</h1>
            <p>DeFi Simplificado via Stellar</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#FFEB3B' }}>
            <div>📊 Carteira: {stellarAccount.publicKey.substring(0, 8)}...</div>
            <div>⚡ Rede: Stellar Mainnet</div>
            <button 
              onClick={onLogout}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid #FFD700', 
                color: '#FFFFFF', 
                padding: '5px 10px', 
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '5px'
              }}
            >
              🚪 Sair
            </button>
          </div>
        </div>
      </header>

      {/* Porquinho Principal */}
      <div className="pig-section">
        <div className={`pig-container level-${pigLevel}`}>
          <div className="pig-emoji">
            {getPigEmoji(pigLevel)}
          </div>
          <div className="pig-level">Nível {pigLevel}</div>
        </div>
        
        {/* Informações do Saldo */}
        <div className="balance-info">
          <h2>Seu Porquinho tem:</h2>
          <div className="balance-amount">{formatCurrency(balance)}</div>
          <div className="balance-amount" style={{ fontSize: '1.5rem', color: '#C6FF00' }}>
            {formatUSDC(balance)}
          </div>
          <div className="earnings">
            💰 Rendeu hoje: {formatCurrency(totalEarnings)}
          </div>
        </div>
      </div>

      {/* Área de Depósito via PIX */}
      <div className="deposit-section">
        <h3>💸 Alimentar o Porquinho (Depósito via PIX)</h3>
        <div className="deposit-form">
          <input
            type="number"
            placeholder="R$ 0,00"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="deposit-input"
            min="10"
            step="0.01"
            inputMode="decimal"
          />
          <button 
            onClick={handlePIXDeposit} 
            className="deposit-button"
            disabled={isProcessingDeposit}
          >
            {isProcessingDeposit ? (
              <>⏳ Processando...</>
            ) : (
              <>📱 Depositar via PIX</>
            )}
          </button>
        </div>
        
        {/* Botão de Saque (mobile-friendly, full width) */}
        <div style={{ marginTop: 12 }}>
          <button
            onClick={handleOpenWithdraw}
            className="withdraw-button danger"
            disabled={balance < MIN_WITHDRAW}
            style={{ width: '100%' }}
          >
            🏧 Sacar
          </button>
          {balance < MIN_WITHDRAW && (
            <div className="amount-info warning">
              Saldo mínimo para saque: R$ {MIN_WITHDRAW.toFixed(2)}
            </div>
          )}
        </div>

        {/* Botões Rápidos */}
        <div className="quick-buttons">
          <button onClick={() => handleQuickDeposit('100')} className="quick-btn">R$ 100</button>
          <button onClick={() => handleQuickDeposit('500')} className="quick-btn">R$ 500</button>
          <button onClick={() => handleQuickDeposit('1000')} className="quick-btn">R$ 1.000</button>
          <button onClick={() => handleQuickDeposit('5000')} className="quick-btn">R$ 5.000</button>
        </div>
      </div>

      {/* Mensagens Motivacionais */}
      {showMessage && (
        <div className="message-container">
          <div className="motivational-message">
            {showMessage}
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-title">Rendimento Anual</div>
          <div className="stat-value">7-10% a.a.</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Proteção Cambial</div>
          <div className="stat-value">💵 USDC</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Liquidez</div>
          <div className="stat-value">⚡ Instantânea</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Blockchain</div>
          <div className="stat-value">🌟 Stellar</div>
        </div>
      </div>

      {/* Progresso para Próximo Nível */}
      <div className="progress-section">
        <h4>Progresso para o próximo nível:</h4>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <p>
          {pigLevel < 5 
            ? `Faltam ${formatCurrency(getNextLevelThreshold(pigLevel) - balance)} para o próximo nível!`
            : "🎉 Nível máximo alcançado! Você é um magnata DeFi!"
          }
        </p>
      </div>

      {/* Modal PIX */}
      {showPIXModal && (
        <PIXDeposit
          stellarAccount={stellarAccount.publicKey}
          onDepositSuccess={handleDepositSuccess}
          onClose={() => {
            setShowPIXModal(false);
            setDepositAmount('');
          }}
        />
      )}

      {/* Modal de Saque */}
      {showWithdrawModal && (
        <WithdrawModal
          availableBalance={balance}
          stellarAccount={stellarAccount.publicKey}
          minAmount={MIN_WITHDRAW}
          // feeBps={100} // opcional: 1% (comente/ajuste se quiser)
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={(amount: number, txId: string) => handleWithdrawSuccess(amount, txId)}
        />
      )}

      {/* Informações Adicionais */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '15px',
        border: '1px solid rgba(255,215,0,0.2)'
      }}>
        <h4 style={{ color: '#FFD700', marginBottom: '15px' }}>🔐 Segurança Smart Pig</h4>
        <div style={{ color: '#FFFFFF', fontSize: '0.9rem', lineHeight: '1.4' }}>
          <div>✅ Smart Wallet protegida por Passkeys biométricos</div>
          <div>✅ Protocolos auditados na blockchain Stellar</div>
          <div>✅ Conversão automática PIX → USDC → Yield Pools</div>
          <div>✅ Compliance total com regulamentação brasileira</div>
        </div>
      </div>
    </div>
  );
};

export default SmartPig;
