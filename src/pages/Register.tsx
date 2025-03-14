// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { UserPlus, ArrowLeft } from 'lucide-react';

// const Register: React.FC = () => {
//   const [name, setName] = useState('');
//   const [displayName, setDisplayName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
    
//     if (password !== confirmPassword) {
//       setError('As senhas não coincidem');
//       return;
//     }
    
//     if (password.length < 6) {
//       setError('A senha deve ter pelo menos 6 caracteres');
//       return;
//     }
    
//     if (!name.trim() || !displayName.trim()) {
//       setError('Por favor, preencha seu nome completo e nome de exibição');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       await register(email, password, name, displayName);
//       setSuccess(true);
//     } catch (err: any) {
//       setError(err.message || 'Erro ao criar conta');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-primary">DELVIND</h1>
//             <p className="text-gray-600 mt-2">Painel Empresarial</p>
//           </div>
          
//           <div className="text-center py-4">
//             <UserPlus size={48} className="mx-auto text-green-500 mb-4" />
//             <h2 className="text-xl font-semibold mb-2">Conta criada com sucesso!</h2>
//             <p className="text-gray-600 mb-6">
//               Você já pode fazer login com suas credenciais.
//             </p>
//             <button
//               onClick={() => navigate('/login')}
//               className="btn-primary"
//             >
//               Ir para o login
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-primary">DELVIND</h1>
//           <p className="text-gray-600 mt-2">Painel Empresarial</p>
//         </div>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
//               Nome completo
//             </label>
//             <input
//               type="text"
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="input-field"
//               required
//             />
//           </div>
          
//           <div className="mb-4">
//             <label htmlFor="displayName" className="block text-gray-700 font-medium mb-2">
//               Nome de exibição
//             </label>
//             <input
//               type="text"
//               id="displayName"
//               value={displayName}
//               onChange={(e) => setDisplayName(e.target.value)}
//               className="input-field"
//               required
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Este é o nome que será exibido nos relatórios e tarefas
//             </p>
//           </div>
          
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="input-field"
//               required
//             />
//           </div>
          
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
//               Senha
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="input-field"
//               required
//               minLength={6}
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               A senha deve ter pelo menos 6 caracteres
//             </p>
//           </div>
          
//           <div className="mb-6">
//             <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
//               Confirmar senha
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="input-field"
//               required
//             />
//           </div>
          
//           <button
//             type="submit"
//             className="w-full btn-primary flex items-center justify-center mb-4"
//             disabled={loading}
//           >
//             {loading ? (
//               <span>Carregando...</span>
//             ) : (
//               <>
//                 <UserPlus size={20} className="mr-2" />
//                 <span>Criar conta</span>
//               </>
//             )}
//           </button>
          
//           <div className="text-center">
//             <Link to="/login" className="text-primary hover:text-primary-dark flex items-center justify-center">
//               <ArrowLeft size={18} className="mr-2" />
//               <span>Voltar para o login</span>
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;