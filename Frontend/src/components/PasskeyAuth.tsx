import React, { useState, useEffect } from 'react';
import './PasskeyAuth.css';

interface StellarAccount {
  publicKey: string;
  contractId: string;
  balance: number;
}

interface PasskeyAuthProps {
  onAuthenticated: (account: StellarAccount) => void;
}

const PasskeyAuth: React.FC<PasskeyAuthProps> = ({ onAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'welcome' | 'create' | 'signin'>('welcome');
  const [deviceSupported, setDeviceSupported] = useState(true);

  useEffect(() => {
    // Verificar se o dispositivo suporta WebAuthn/Passkeys
    checkPasskeySupport();
  }, []);

  const checkPasskeySupport = () => {
    let isSupported = false;
    
    try {
      isSupported = !!(
        window.PublicKeyCredential && 
        typeof window.PublicKeyCredential === 'function' &&
        window.navigator.credentials
      );
    } catch (error) {
      isSupported = false;
    }
    
    setDeviceSupported(isSupported);
  };

  const createPasskey = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Verificar suporte novamente
      if (!window.PublicKeyCredential) {
        throw new Error('Passkeys não são suportados neste dispositivo');
      }

      // Configuração do WebAuthn para criar passkey
      const createOptions: CredentialCreationOptions = {
        publicKey: {
          challenge: new Uint8Array(32), // Em produção, vem do servidor
          rp: {
            name: "Smart Pig DeFi",
            id: "localhost" // Seu domínio
          },
          user: {
            id: new TextEncoder().encode(`user_${Date.now()}`),
            name: "smart.pig.user@stellar.network",
            displayName: "Smart Pig User"
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256 (secp256r1 - suportado pelo Stellar)
            { alg: -257, type: "public-key" } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Usar biometria do dispositivo
            userVerification: "required",
            residentKey: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
      };

      // Criar passkey
      const credential = await navigator.credentials.create(createOptions) as PublicKeyCredential;
      
      if (!credential) {
        throw new Error('Falha ao criar passkey');
      }

      // Simular criação de Smart Wallet na Stellar
      const stellarAccount = await createStellarSmartWallet(credential);
      
      // Salvar referência local do passkey
      localStorage.setItem('smart_pig_passkey_id', credential.id);
      localStorage.setItem('smart_pig_account', JSON.stringify(stellarAccount));

      onAuthenticated(stellarAccount);

    } catch (err: any) {
      console.error('Erro ao criar passkey:', err);
      setError(err.message || 'Erro ao criar passkey. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithPasskey = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Verificar se há passkey salvo
      const savedPasskeyId = localStorage.getItem('smart_pig_passkey_id');
      
      const getOptions: CredentialRequestOptions = {
        publicKey: {
          challenge: new Uint8Array(32), // Em produção, vem do servidor
          allowCredentials: savedPasskeyId ? [{
            id: new TextEncoder().encode(savedPasskeyId),
            type: 'public-key'
          }] : [],
          userVerification: "required",
          timeout: 60000
        }
      };

      // Autenticar com passkey
      const credential = await navigator.credentials.get(getOptions) as PublicKeyCredential;
      
      if (!credential) {
        throw new Error('Falha na autenticação');
      }

      // Recuperar ou recriar conta Stellar
      let stellarAccount = JSON.parse(localStorage.getItem('smart_pig_account') || 'null');
      
      if (!stellarAccount) {
        // Se não tem conta salva, buscar na rede Stellar baseado no passkey
        stellarAccount = await retrieveStellarAccount(credential);
      }

      onAuthenticated(stellarAccount);

    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Erro na autenticação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simular criação de Smart Wallet na Stellar (na prática, usa Passkey Kit)
  const createStellarSmartWallet = async (credential: PublicKeyCredential): Promise<StellarAccount> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Em produção, aqui você usaria:
    // const passkey = new PasskeyKit({
    //   rpcUrl: process.env.REACT_APP_STELLAR_RPC_URL,
    //   networkPassphrase: process.env.REACT_APP_STELLAR_NETWORK_PASSPHRASE,
    //   factoryContractId: process.env.REACT_APP_STELLAR_FACTORY_CONTRACT_ID
    // });
    // const account = await passkey.createWallet(credential);

    return {
      publicKey: `G${Math.random().toString(36).substring(2, 34).toUpperCase()}`,
      contractId: `C${Math.random().toString(36).substring(2, 34).toUpperCase()}`,
      balance: 0
    };
  };

  const retrieveStellarAccount = async (credential: PublicKeyCredential): Promise<StellarAccount> => {
    // Simular busca na rede Stellar
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Em produção, aqui você buscaria o smart wallet associado ao passkey
    const savedAccount = localStorage.getItem('smart_pig_account');
    if (savedAccount) {
      return JSON.parse(savedAccount);
    }

    throw new Error('Conta não encontrada. Crie uma nova conta.');
  };

  const getStepContent = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="passkey-welcome">
            <div className="passkey-hero">
              <div className="passkey-icon">🐷</div>
              <h1>SMART PIG</h1>
              <p>DeFi Simplificado com Passkeys</p>
            </div>

            <div className="passkey-benefits">
              <div className="benefit-card">
                <div className="benefit-icon">🔐</div>
                <h3>Segurança Máxima</h3>
                <p>Autenticação biométrica sem senhas ou chaves privadas</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">⚡</div>
                <h3>Ultra Simples</h3>
                <p>Entre com face ID, digital ou PIN do seu dispositivo</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">💰</div>
                <h3>DeFi Invisível</h3>
                <p>Yield farming de 7-10% a.a. simples como usar Pix</p>
              </div>
            </div>

            <div className="passkey-actions">
              <button 
                onClick={() => setStep('create')}
                className="passkey-button primary"
                disabled={!deviceSupported}
              >
                Criar Conta com Passkey
              </button>
              
              <button 
                onClick={() => setStep('signin')}
                className="passkey-button secondary"
                disabled={!deviceSupported}
              >
                Entrar com Passkey Existente
              </button>
            </div>

            {!deviceSupported && (
              <div className="device-warning">
                ⚠️ Seu dispositivo não suporta passkeys. Use um dispositivo mais recente.
              </div>
            )}
          </div>
        );

      case 'create':
        return (
          <div className="passkey-create">
            <button onClick={() => setStep('welcome')} className="back-button">
              ← Voltar
            </button>
            
            <div className="passkey-header">
              <div className="passkey-icon">🆕</div>
              <h2>Criar Smart Wallet</h2>
              <p>Vamos criar sua carteira inteligente na Stellar</p>
            </div>

            <div className="passkey-info">
              <div className="info-item">
                ✅ Smart Wallet será criado na blockchain Stellar
              </div>
              <div className="info-item">
                ✅ Seu passkey controlará a carteira
              </div>
              <div className="info-item">
                ✅ Sem chaves privadas para memorizar
              </div>
              <div className="info-item">
                ✅ Compatível com Pix para depósitos
              </div>
            </div>

            <button 
              onClick={createPasskey}
              className="passkey-button primary large"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Criando Smart Wallet...
                </>
              ) : (
                'Criar com Face ID / Touch ID'
              )}
            </button>
          </div>
        );

      case 'signin':
        return (
          <div className="passkey-signin">
            <button onClick={() => setStep('welcome')} className="back-button">
              ← Voltar
            </button>
            
            <div className="passkey-header">
              <div className="passkey-icon">🔓</div>
              <h2>Entrar no Smart Pig</h2>
              <p>Use seu passkey para acessar sua carteira</p>
            </div>

            <div className="passkey-device-info">
              <div className="device-item">
                📱 Face ID / Touch ID
              </div>
              <div className="device-item">
                💻 Windows Hello
              </div>
              <div className="device-item">
                🔑 Chave de segurança (YubiKey)
              </div>
            </div>

            <button 
              onClick={signInWithPasskey}
              className="passkey-button primary large"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Autenticando...
                </>
              ) : (
                'Entrar com Passkey'
              )}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="passkey-container">
      <div className="passkey-card">
        {getStepContent()}
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
      </div>

      <footer className="passkey-footer">
        <div className="footer-item">
          🌟 Powered by Stellar Passkeys
        </div>
        <div className="footer-item">
          🔒 WebAuthn Security Standard
        </div>
      </footer>
    </div>
  );
};

export default PasskeyAuth;