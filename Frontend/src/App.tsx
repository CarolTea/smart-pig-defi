import React, { useState } from 'react';
import SmartPig from './components/SmartPig';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, _setIsLoading] = useState(false);

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
      <SmartPig 
        stellarAccount={stellarAccount}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
