# 🐷 Smart Pig - DeFi Simplificado

> **"Se qualquer pessoa usa sem ajuda, criamos a solução certa"**

**Smart Pig** é uma plataforma DeFi que revoluciona o acesso ao yield farming para brasileiros, permitindo investimentos via PIX com retornos de 7-10% ao ano em USDC, usando uma interface gamificada onde um porquinho cresce conforme seus investimentos.

## 🎯 **Visão Geral**

### **💡 O Problema**
- **R$ 1,2 trilhão** parados na poupança rendendo apenas 6% a.a.
- **86%** dos brasileiros querem alternativas à poupança
- **Apenas 3%** da população acessa DeFi
- DeFi tradicional é complexo demais para 95% das pessoas

### **🚀 Nossa Solução: "DeFi Invisível"**
- **PIX → USDC → Yield Pools** de forma completamente transparente
- **Autenticação biométrica** sem senhas ou chaves privadas
- **Interface gamificada** que torna investir divertido
- **Compliance total** com regulamentação brasileira

## ✨ **Funcionalidades**

### **🔐 Autenticação Stellar Passkeys**
- Login com **Face ID**, **Touch ID** ou **Windows Hello**
- **Smart Wallets** na blockchain Stellar
- Sem seed phrases ou senhas para memorizar
- Protocolo **secp256r1** (Stellar Protocol 21)

### **🎮 Interface Gamificada**
- **Porquinho evolutivo** com 5 níveis baseados no saldo:
  - 🐷 **Nível 1** (R$ 0-500) - Iniciante
  - 🐽 **Nível 2** (R$ 500-2K) - Crescendo  
  - 🐖 **Nível 3** (R$ 2K-5K) - Prosperando
  - 🐷👑 **Nível 4** (R$ 5K-15K) - Rico
  - 🐷💎 **Nível 5** (R$ 15K+) - Magnata

### **💸 Sistema PIX Nativo**
- **Depósitos instantâneos** via PIX
- **QR Code** gerado automaticamente
- **Conversão automática** BRL → USDC
- **Liquidez instantânea** para saques

### **📊 Rendimentos em Tempo Real**
- **7-10% ao ano** em USDC
- **Proteção cambial** automática
- **Ganhos visíveis** em tempo real
- **Histórico detalhado** de transações

## 🛠️ **Tecnologias**

### **Frontend**
- **React 18** com TypeScript
- **CSS3** com animações modernas
- **WebAuthn API** para Passkeys
- **Responsive Design** mobile-first

### **Backend**
- **NestJS** com TypeScript
- **Stellar SDK** para blockchain
- **PIX Integration** via Stellar Anchors
- **WebHooks** para status em tempo real

### **Blockchain**
- **Stellar Network** (Mainnet)
- **Smart Contracts** Soroban
- **Aquarius Protocol** para yield pools
- **USDC** como stablecoin base

## 🚀 **Como Executar**

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Git

### **Instalação**

```bash
# Clonar o repositório
git clone https://github.com/CarolTea/smart-pig-defi.git
cd smart-pig-defi

# Instalar dependências do Frontend
cd Frontend
npm install

# Instalar dependências do Backend
cd ../Backend  
npm install
```

### **Executando o Projeto**

```bash
# Terminal 1 - Frontend (porta 3000)
cd Frontend
npm start

# Terminal 2 - Backend (porta 3001) 
cd Backend
npm run start:dev
```

### **Acessar a aplicação**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🎬 **Modo Demo**

Para apresentações e vídeos, o Smart Pig inclui um modo demo completo:

### **Ativando o Demo Mode**
1. Faça login normalmente
2. Clique no botão **"✅ NORMAL"** (canto inferior esquerdo)
3. Botão ficará **"🎬 DEMO ON"** (vermelho)

### **Funcionalidades Demo**
- ✅ **Saldo inicial**: R$ 2.400 (nível 2)
- ✅ **Ganhos em tempo real** acelerados
- ✅ **PIX instantâneo** com QR code CSS
- ✅ **Level ups automáticos** nos depósitos
- ✅ **Valores pré-configurados** para impacto visual

## 📁 **Estrutura do Projeto**

```
smart-pig-defi/
├── Frontend/                  # React TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── SmartPig.tsx           # Interface principal
│   │   │   ├── SmartPigDemo.tsx       # Versão demo  
│   │   │   ├── PIXDeposit.tsx         # Modal de depósito
│   │   │   ├── WithdrawModal.tsx      # Modal de saque
│   │   │   ├── PasskeyAuth.tsx        # Autenticação
│   │   │   └── DemoIndicator.tsx      # Indicador demo
│   │   ├── App.tsx                    # Navegação principal
│   │   └── App.css                    # Estilos globais
│   └── public/                        # Arquivos públicos
└── Backend/                   # NestJS
    ├── src/                   # Código fonte
    ├── test/                  # Testes
    └── package.json           # Dependências
```

## 🎨 **Design System**

### **Cores Oficiais**
- **Primária**: `#FFD700` (Dourado)
- **Secundária**: `#FFEB3B` (Amarelo vibrante)  
- **Accent**: `#C6FF00` (Verde-amarelo neon)
- **Background**: Gradiente `#1a1a1a → #2A5298`

### **Componentes**
- **Porquinho 3D** como mascote
- **Moedas douradas** para valor
- **Animações suaves** (bounce, glow, progress)
- **Glassmorphism** e gradientes modernos

## 📈 **Roadmap**

### **✅ Fase 1 - Protótipo (Concluída)**
- Interface gamificada completa
- Autenticação Passkeys mockada
- Sistema PIX simulado
- Design system implementado

### **🔄 Fase 2 - Integração (Em Desenvolvimento)**
- Backend NestJS com Stellar
- PIX real via Stellar Anchors
- Smart Wallets funcionais
- Webhooks e WebSockets

### **🚀 Fase 3 - Produção**
- Deploy AWS/Vercel
- Testes E2E completos
- Auditoria de segurança
- Launch oficial

## 🤝 **Parcerias Estratégicas**

- **🏦 Banco do Brasil** - "Poupança Digital BB"
- **🏪 Sicredi** - "Porquinho Cooperativo"  
- **⭐ Stellar Foundation** - Infraestrutura blockchain
- **🌊 Aquarius Protocol** - Pools de liquidez DeFi

## 📊 **Mercado**

- **TAM**: R$ 1,2 trilhão (poupança brasileira)
- **SAM**: 30M brasileiros com >R$ 10k investidos  
- **Meta 5 anos**: 300K clientes, R$ 4,5B sob gestão

## 🔒 **Segurança**

- ✅ **Stellar Blockchain** com smart contracts auditáveis
- ✅ **Passkeys WebAuthn** padrão bancário FIDO2
- ✅ **Criptografia secp256r1** nativa 
- ✅ **Proteção anti-phishing** domain-specific
- ✅ **Compliance LGPD** total

## 🧪 **Testes**

```bash
# Executar testes
npm test

# Cobertura de testes  
npm run test:coverage

# Testes E2E
npm run test:e2e
```

## 📝 **Contribuindo**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Commit**
- `feat:` nova funcionalidade
- `fix:` correção de bug  
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes


## 👥 **Time**

- **Carolina** - Product Owner & Frontend Developer
- **XXXXXX** - Backend Developer & Stellar Integration
- **Claude AI** - AI Assistant & Technical Documentation

---

<div align="center">

**🐷 Transformando DeFi complexo em algo tão simples quanto usar Pix 🐷**

Feito com ❤️ no Brasil 🇧🇷

</div>
