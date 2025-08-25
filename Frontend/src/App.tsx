// App.tsx - VERSÃO COMPLETA com modo demo
import React, { useState } from 'react';
import SmartPig from './components/SmartPig';
import SmartPigDemo from './components/SmartPigDemo';      // NOVO
import DemoIndicator from './components/DemoIndicator';    // NOVO
import PasskeyAuth from './components/PasskeyAuth';
import './App.css';

interface StellarAccount {
  publicKey: string;
  contractId: string;
  balance: number;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stellarAccount, setStellarAccount] = useState<StellarAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false); // NOVO

  const handleAuthenticated = (account: StellarAccount) => {
    setStellarAccount(account);
    setIsAuthenticated(true);
    
    // Salvar na sessão para recarregar automático
    localStorage.setItem('smart_pig_session', JSON.stringify({
      isAuthenticated: true,
      stellarAccount: account
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStellarAccount(null);
    
    // Limpar sessão
    localStorage.removeItem('smart_pig_session');
    localStorage.removeItem('smart_pig_passkey_id');
    localStorage.removeItem('smart_pig_account');
  };

  // Recuperar sessão ao carregar
  React.useEffect(() => {
    const savedSession = localStorage.getItem('smart_pig_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.isAuthenticated && session.stellarAccount) {
          setStellarAccount(session.stellarAccount);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
        localStorage.removeItem('smart_pig_session');
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-pig">🐷</div>
          <h2>Carregando Smart Pig...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !stellarAccount) {
    return <PasskeyAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="App">
      {/* Componente principal - DEMO ou NORMAL */}
      {isDemoMode ? (
        <SmartPigDemo 
          stellarAccount={stellarAccount}
          onLogout={handleLogout}
        />
      ) : (
        <SmartPig 
          stellarAccount={stellarAccount}
          onLogout={handleLogout}
        />
      )}
      
      {/* Indicador de demo mode */}
      <DemoIndicator 
        isVisible={isDemoMode}
        position="top-right"
        showStats={true}
      />
      
      {/* Botão para alternar modo */}
      <button 
        onClick={() => setIsDemoMode(!isDemoMode)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: isDemoMode ? '#FF4444' : '#00AA00',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 9999,
          fontWeight: 'bold'
        }}
      >
        {isDemoMode ? '🎬 DEMO ON' : '✅ NORMAL'}
      </button>
    </div>
  );
}

export default App;