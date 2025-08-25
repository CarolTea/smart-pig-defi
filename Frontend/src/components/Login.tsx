import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simular chamada API
    setTimeout(() => {
      onLogin(formData.email, formData.password);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🐷</div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">SMART PIG</h1>
          <p className="text-gray-300">Entre na sua conta</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              📧 Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${
                errors.email ? 'border-red-500' : 'border-white/30'
              }`}
              placeholder="seu@email.com"
            />
            {errors.email && <span className="text-red-400 text-sm mt-1 block">{errors.email}</span>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              🔒 Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${
                errors.password ? 'border-red-500' : 'border-white/30'
              }`}
              placeholder="Sua senha"
            />
            {errors.password && <span className="text-red-400 text-sm mt-1 block">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Entrando...
              </>
            ) : (
              'Entrar no Smart Pig'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-4">
          <a href="#" className="block text-center text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
            Esqueci minha senha
          </a>
          
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-white/30"></div>
            <span className="px-4 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-white/30"></div>
          </div>
          
          <button 
            onClick={onSwitchToRegister}
            className="w-full bg-transparent border border-yellow-400 text-yellow-400 font-medium py-3 px-4 rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300"
          >
            Criar nova conta
          </button>
        </div>

        {/* Benefícios */}
        <div className="mt-8 space-y-2">
          <div className="text-green-400 text-sm flex items-center">
            <span className="mr-2">✅</span>
            Rendimento de 7-10% a.a.
          </div>
          <div className="text-green-400 text-sm flex items-center">
            <span className="mr-2">✅</span>
            Proteção cambial em USDC
          </div>
          <div className="text-green-400 text-sm flex items-center">
            <span className="mr-2">✅</span>
            Depósito via Pix instantâneo
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;