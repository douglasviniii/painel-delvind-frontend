import React, { useState, useEffect } from 'react';
import { User, ArrowLeft, UserPlus, Pencil, Trash, X, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import Cookie from 'js-cookie';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

const AdminUsers: React.FC = () => {

  const navigate = useNavigate();
  
  const [users, setUsers] = useState<any[]>([]);
  const [userssendreport, setUsersSendReports] = useState([]);

  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [placeholdername, setPlaceholdername] = useState('');
  const [placeholderteam, setPlaceholderteam] = useState('');
  const [placeholderpassword, setPlaceholderpassword] = useState('');
  const [idforupdate, setIdforUpdate] = useState('');

  const [createUserLoading, setCreateUserLoading] = useState(false);
  
   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allusers = await axios.get(`${EndPointAPI}/employee/findall`);
        setUsers(allusers.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);  

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {

      const response2 = await axios.get(`${EndPointAPI}/reportemployee/findsends`);
      setUsersSendReports(response2.data);

      const hasReports = userssendreport.some(report => report.employee_id._id === id);


      if (hasReports) {
        alert('Este usuário possui relatórios enviados e não pode ser excluído.');
        return;
      }
      try {
        await axios.delete(`${EndPointAPI}/employee/delete/${id}`);
        location.reload();
      } catch (error) {
        alert('Ocorreu um erro ao excluir o usuário.');
      }
    }
  };

  const handleEdit = (userToEdit: any) => {
    setShowEditUserModal(true);
    setIdforUpdate(userToEdit._id);
    setPlaceholdername(userToEdit.name);
    setPlaceholderteam(userToEdit.team);
    setPlaceholderpassword(userToEdit.password);

    setName(userToEdit.name);
    setTeam(userToEdit.team);
    setPassword(userToEdit.password);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }
 
    try {
      setCreateUserLoading(true);
      await axios.post(`${EndPointAPI}/employee/create`,{name, team, email, password});
      setName('');
      setTeam('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setCreateUserLoading(false);
      setShowCreateUserModal(false);
      location.reload();
    } catch (err: any) {
      alert('Ocorreu um erro ao criar conta do usuário!');
    } finally {
      setShowCreateUserModal(false);
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateUserLoading(true);

      const updatedData: any = {};
      if (name) updatedData.name = name;
      if (team) updatedData.team = team;
      if (password) updatedData.password = password;

      await axios.patch(`${EndPointAPI}/employee/update/${idforupdate}`, updatedData);

      setCreateUserLoading(false);
      setShowEditUserModal(false);
      location.reload();

    } catch (err: any) {
      alert('Ocorreu um erro ao atualizar a conta do usuário!');
    } finally {
      setShowEditUserModal(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate('/admin')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
      </div>

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowCreateUserModal(true)}
          className="btn-primary flex items-center"
        >
          <UserPlus size={20} className="mr-2" />
          Novo Usuário
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userItem) => (
                <tr key={userItem._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-3">
                        {userItem.name.charAt(0)}
                      </div>
                      <div className="px-6 py-4 whitespace-nowrap text-gray-500">{userItem.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    <div className="text-gray-500">{userItem.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {userItem.role || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {userItem.team || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button onClick={() => handleEdit(userItem)} className="text-primary hover:text-primary-dark mr-2">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(userItem._id)} className="text-red-500 hover:text-red-700">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[100%] max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowCreateUserModal(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Criar Novo Usuário
            </h2>

            <form onSubmit={handleCreateUserSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Digite o nome completo"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="team"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Time
                </label>
                <input
                  type="text"
                  id="team"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="input-field"
                  placeholder="Digite o time"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  De qual equipe esse colaborador fará parte? ex: Dev
                </p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Digite o email"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Digite a senha"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1"></p>
            <p className="text-xs text-gray-500 mt-1">
              A senha deve ter pelo menos 6 caracteres
            </p>
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Confirmar senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="input-field"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full btn-primary flex items-center justify-center mb-4"
            disabled={createUserLoading}
          >
            {createUserLoading ? (
              <span>Carregando...</span>
            ) : (
              <>
                <Users size={20} className="mr-2" />
                <span>Criar conta</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )}


  {showEditUserModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[100%] max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={() => setShowEditUserModal(false)}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          Criar Novo Usuário
        </h2>

        <form onSubmit={handleEditUserSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder={placeholdername}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="team"
              className="block text-gray-700 font-medium mb-2"
            >
              Time
            </label>
            <input
              type="text"
              id="team"
              value={team}
              placeholder={placeholderteam}
              onChange={(e) =>
                setTeam(e.target.value)
              }
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              De qual equipe esse colaborador fará parte? ex: Dev
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder={placeholderpassword}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              A senha deve ter pelo menos 6 caracteres
            </p>
          </div>

          <button
            type="submit"
            className="w-full btn-primary flex items-center justify-center mb-4"
            disabled={createUserLoading}
          >
            {createUserLoading ? (
              <span>Carregando...</span>
            ) : (
              <>
                <Users size={20} className="mr-2" />
                <span>Atualizar</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )}
</Layout>
);
};

export default AdminUsers;