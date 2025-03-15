import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, KeyRound, Shield } from 'lucide-react';
import axios from 'axios';
import Cookie from 'js-cookie';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

const Login: React.FC = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
     try {
        setLoading(true);
        const response = await axios.post(`${EndPointAPI}/employee/auth`, {email:email, password:password});
        Cookie.set('token', response.data.token);
        localStorage.setItem(`data`, JSON.stringify(response.data.employee));
        navigate('/dashboard');
    } catch (error) {
      console.log(error);
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    } 
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      setLoading(true);
      const response = await axios.post(`${EndPointAPI}/admin/auth`, {email:adminEmail, password:adminPassword});
      Cookie.set('token', response.data.token);
      localStorage.setItem(`data`, JSON.stringify(response.data.admin));
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setError('Por favor, informe seu email');
      return;
    }

    setLoading(true);
/*     try {
      await resetPassword(forgotEmail);
      setResetSent(true);
      setError('');
    } catch (err) {
      setError('Erro ao enviar email de redefinição');
    } finally {
      setLoading(false);
    } */
  };

  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">DELVIND</h1>
            <p className="text-gray-600 mt-2">Acesso Administrativo</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div className="mb-6">
            <label htmlFor="adminEmail" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="adminEmail"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="input-field"
                required
              />
              <label htmlFor="adminPassword" className="block text-gray-700 font-medium mb-2">
                Senha Administrativa
              </label>
              <input
                type="password"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              onClick={() => setShowAdminLogin(true)}
              className="w-full btn-primary flex items-center justify-center mb-4"
              disabled={loading}
            >
              {loading ? (
                <span>Carregando...</span>
              ) : (
                <>
                  <Shield size={20} className="mr-2" />
                  <span>Acessar Painel Administrativo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAdminLogin(false);
                setAdminPassword('');
                setError('');
              }}
              className="w-full text-primary hover:text-primary-dark flex items-center justify-center"
            >
              Voltar para o login
            </button>
          </form>
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!showForgotPassword ? (
          <>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
                <div className="flex justify-end mt-1">
                  {/*<button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Esqueceu sua senha?
                  </button>*/}
                </div>  
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center mb-4"
                disabled={loading}
              >
                {loading ? (
                  <span>Carregando...</span>
                ) : (
                  <>
                    <LogIn size={20} className="mr-2" />
                    <span>Entrar</span>
                  </>
                )}
              </button>

              {/* Removido o link para registro */}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(true)}
                  className="text-primary hover:text-primary-dark flex items-center justify-center mx-auto"
                >
                  <Shield size={18} className="mr-2" />
                  <span>Acesso Administrativo</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div>
            {resetSent ? (
              <div className="text-center py-4">
                <KeyRound size={48} className="mx-auto text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Email enviado!</h2>
                <p className="text-gray-600 mb-6">
                  Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSent(false);
                    setForgotEmail('');
                  }}
                  className="btn-primary"
                >
                  Voltar para o login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <h2 className="text-xl font-semibold mb-4">Redefinir senha</h2>
                <p className="text-gray-600 mb-4">
                  Informe seu email e enviaremos instruções para redefinir sua senha.
                </p>

                <div className="mb-6">
                  <label htmlFor="forgotEmail" className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;