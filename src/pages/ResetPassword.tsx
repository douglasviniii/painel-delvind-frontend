import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a hash fragment in the URL (from password reset email)
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      // The recovery token is automatically handled by Supabase
      // We just need to show the password reset form
    } else {
      // If no recovery token, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      //await updatePassword(password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">DELVIND</h1>
            <p className="text-gray-600 mt-2">Painel Empresarial</p>
          </div>
          
          <div className="text-center py-4">
            <KeyRound size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Senha redefinida com sucesso!</h2>
            <p className="text-gray-600 mb-6">
              Sua senha foi atualizada. Agora você pode fazer login com sua nova senha.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Ir para o login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">DELVIND</h1>
          <p className="text-gray-600 mt-2">Painel Empresarial</p>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Redefinir sua senha</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Nova senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              A senha deve ter pelo menos 6 caracteres
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirmar nova senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Redefinir senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;