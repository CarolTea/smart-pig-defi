// SmartPigDemo.tsx - Versão com mocks para vídeo demonstrativo
import React, { useState, useEffect } from 'react';
import PIXDepositDemo from './PIXDepositDemo';
import WithdrawModalDemo from './WithdrawModalDemo';
import './SmartPig.css';
import './WithdrawModal.css';

interface StellarAccount {
  publicKey: string;
  contractId: string;
  balance: number;
}

interface SmartPigDemoProps {
  stellarAccount: StellarAccount;
  onLogout: () => void;
}

// MOCK DATA para demonstração
const DEMO_CONFIG = {
  FAST_MODE: true, // Acelera todas as animações
  AUTO_EARNINGS: true, // Ganhos automáticos para demo
  REALISTIC_VALUES: true, // Valores mais impactantes
  QUICK_LEVEL_UP: true // Sobe de nível mais rápido
};

const SmartPigDemo: React.FC<SmartPigDemoProps> = ({ stellarAccount, onLogout }) => {
  // Estados com valores iniciais mais interessantes para demo
  const [balance, setBalance] = useState(stellarAccount.balance || 2400); // Começar com saldo interessante
  const [depositAmount, setDepositAmount] = useState('');
  const [pigLevel, setPigLevel] = useState(2); // Começar no nível 2
  const [showMessage, setShowMessage] = useState('');
  const [totalEarnings, setTotalEarnings] = useState(45.67); // Ganhos já acumulados
  const [showPIXModal, setShowPIXModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isProcessingDeposit] = useState(false);
  
  // Estados adicionais para demo
  const [dailyEarningsRate, setDailyEarningsRate] = useState(0);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);

  const MIN_WITHDRAW = 10;

  // Simular ganhos em tempo real mais visíveis para demo
  useEffect(() => {
    if (balance > 0 && DEMO_CONFIG.AUTO_EARNINGS) {
      const interval = setInterval(() => {
        const dailyRate = balance * 0.08 / 365; // 8% ao ano
        const minuteRate = dailyRate / (24 * 60); // Por minuto para demo
        
        setTotalEarnings(prev => {
          const newEarnings = prev + minuteRate;
          setDailyEarningsRate(minuteRate);
          return newEarnings;
        });
      }, DEMO_CONFIG.FAST_MODE ? 1000 : 60000); // A cada segundo em modo fast

      return () => clearInterval(interval);
    }
  }, [balance]);

  // Atualizar nível com animação especial para demo
  useEffect(() => {
    const newLevel = getPigLevel(balance);
    if (newLevel !== pigLevel) {
      setPigLevel(newLevel);
      if (newLevel > pigLevel) {
        setShowLevelUpAnimation(true);
        setShowMessage(getMotivationalMessage(newLevel, balance));
        
        // Animação de level up mais longa para demo
        setTimeout(() => {
          setShowLevelUpAnimation(false);
        }, 3000);
        
        setTimeout(() => setShowMessage(''), 6000);
      }
    }
  }, [balance, pigLevel]);

  // Níveis ajustados para demo (valores menores = mais level ups)
  const getPigLevel = (amount: number) => {
    if (DEMO_CONFIG.QUICK_LEVEL_UP) {
      if (amount < 1000) return 1;
      if (amount < 2500) return 2;
      if (amount < 5000) return 3;
      if (amount < 8000) return 4;
      return 5;
    }
    
    // Valores originais
    if (amount < 500) return 1;
    if (amount < 2000) return 2;
    if (amount < 5000) return 3;
    if (amount < 15000) return 4;
    return 5;
  };

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

  // Mock aprimorado para demo - valores mais impactantes
  const handleDepositSuccess = (amount: number, txId: string) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    
    const usdcAmount = amount / 5.5;
    
    // Simular boost nos ganhos após depósito
    const dailyEarnings = newBalance * 0.08 / 365;
    setTotalEarnings(prev => prev + dailyEarnings * 0.1); // Bonus
    
    // Mensagem mais elaborada para demo
    const levelBefore = pigLevel;
    const levelAfter = getPigLevel(newBalance);
    
    let message = `🎉 Depósito realizado! +R$ ${amount.toFixed(2)} (~$${usdcAmount.toFixed(2)} USDC)`;
    
    if (levelAfter > levelBefore) {
      message += ` 🚀 LEVEL UP! Nível ${levelAfter}!`;
    }
    
    setShowMessage(message);
    setDepositAmount('');
    setShowPIXModal(false);
    
    setTimeout(() => setShowMessage(''), 8000);
  };

  const handleOpenWithdraw = () => {
    if (balance < MIN_WITHDRAW) {
      setShowMessage(`⚠️ Saldo insuficiente para sacar. Mínimo: R$ ${MIN_WITHDRAW.toFixed(2)}`);
      setTimeout(() => setShowMessage(''), 3000);
      return;
    }
    setShowWithdrawModal(true);
  };

  // Mock de saque mais realista para demo
  const handleWithdrawSuccess = (amount: number, txId: string) => {
    const saque = Math.min(amount, balance);
    const newBalance = balance - saque;
    setBalance(newBalance);

    const usdcAmount = saque / 5.5;

    // Simular taxa de conversão realista
    const fee = saque * 0.005; // 0.5% fee
    const netAmount = saque - fee;

    setShowMessage(
      `✅ Saque processado! R$ ${netAmount.toFixed(2)} enviado via PIX • Taxa: R$ ${fee.toFixed(2)} • TX: ${txId}`
    );
    setShowWithdrawModal(false);

    setTimeout(() => setShowMessage(''), 8000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatUSDC = (value: number) => {
    const usdc = value / 5.5;
    return `$${usdc.toFixed(2)} USDC`;
  };

  // Trocar emoji por imagem real
  const getPigImage = (level: number) => {
    // Assumindo que há imagens pig-level-1.png até pig-level-5.png
    return `/Assets/pig-level-${level}.png`;
  };

  // Fallback para emoji se imagem não carregar
  const getPigEmoji = (level: number) => {
    const pigs = ['🐷', '🐷', '🐖', '🐷👑', '🐷💎'];
    return pigs[level - 1] || '🐷';
  };

  const getNextLevelThreshold = (level: number) => {
    if (DEMO_CONFIG.QUICK_LEVEL_UP) {
      const thresholds = [1000, 2500, 5000, 8000, 15000];
      return thresholds[level - 1] || 15000;
    }
    
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
            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
              💰 Taxa diária: +{formatCurrency(dailyEarningsRate * 24 * 60)}
            </div>
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

      {/* Porquinho Principal com imagem real */}
      <div className="pig-section">
        <div className={`pig-container level-${pigLevel} ${showLevelUpAnimation ? 'level-up-animation' : ''}`}>
          <div className="pig-emoji">
            <img 
              src={getPigImage(pigLevel)} 
              alt={`Porquinho nível ${pigLevel}`}
              onError={(e) => {
                // Fallback para emoji se imagem não carregar
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'block';
                }
              }}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            <span style={{ display: 'none' }}>{getPigEmoji(pigLevel)}</span>
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
          <div style={{ fontSize: '0.9rem', color: '#FFE082', marginTop: '8px' }}>
            📈 Rendimento: {((totalEarnings / balance) * 365 * 100).toFixed(2)}% a.a.
          </div>
        </div>
      </div>

      {/* Resto do componente permanece igual... */}
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
        
        {/* Botão de Saque */}
        <div style={{ marginTop: 12 }}>
          <button
            onClick={handleOpenWithdraw}
            className="withdraw-button danger"
            disabled={balance < MIN_WITHDRAW}
            style={{ width: '100%' }}
          >
            💧 Sacar
          </button>
          {balance < MIN_WITHDRAW && (
            <div className="amount-info warning">
              Saldo mínimo para saque: R$ {MIN_WITHDRAW.toFixed(2)}
            </div>
          )}
        </div>

        {/* Botões Rápidos com valores para demo */}
        <div className="quick-buttons">
          <button onClick={() => handleQuickDeposit('500')} className="quick-btn">R$ 500</button>
          <button onClick={() => handleQuickDeposit('1000')} className="quick-btn">R$ 1.000</button>
          <button onClick={() => handleQuickDeposit('2500')} className="quick-btn">R$ 2.500</button>
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

      {/* Modal PIX Demo */}
      {showPIXModal && (
        <PIXDepositDemo
          stellarAccount={stellarAccount.publicKey}
          amount={parseFloat(depositAmount)}
          onDepositSuccess={handleDepositSuccess}
          onClose={() => {
            setShowPIXModal(false);
            setDepositAmount('');
          }}
          fastMode={DEMO_CONFIG.FAST_MODE}
        />
      )}

      {/* Modal de Saque Demo */}
      {showWithdrawModal && (
        <WithdrawModalDemo
          availableBalance={balance}
          stellarAccount={stellarAccount.publicKey}
          minAmount={MIN_WITHDRAW}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={handleWithdrawSuccess}
          fastMode={DEMO_CONFIG.FAST_MODE}
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

export default SmartPigDemo;