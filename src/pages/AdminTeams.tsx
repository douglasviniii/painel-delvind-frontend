import React, { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, Trash,ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

const AdminTeams: React.FC = () => {

interface User {
    _id: string; // ou number
    id: number;
    name: string;
    email: string;
    // Adicione outras propriedades relevantes do seu objeto de usuário
}

interface Team {
    _id: string; // ou number
    name_team: string;
    description: string;
    members: User[]; // Array de User
    // Adicione outras propriedades relevantes do seu objeto de equipe
}

  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [newTeam, setNewTeam] = useState({
    name_team: '',
    description: '',
    members: [] as string[],
  });

  const [users, setUsers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);


  const storedUsers = localStorage.getItem("data");
  const objectUser = storedUsers ? JSON.parse(storedUsers) : null;
  const user = objectUser;
  
  //Busca os dados
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allusers = await axios.get(`${EndPointAPI}/employee/findall`);
        setUsers(allusers.data);

        const teamscreated = await axios.get(`${EndPointAPI}/team/find`);
        setTeams(teamscreated.data);

      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);


  const handleCreateTeam = async () => {
    if (!newTeam.name_team.trim() || newTeam.members.length === 0) {
      alert('Por favor, preencha o nome da equipe e selecione pelo menos um membro');
      return;
    }

    await axios.post(`${EndPointAPI}/team/create`, newTeam);
    setNewTeam({
      name_team: '',
      description: '',
      members: [],
    });
    setShowCreateModal(false);
    location.reload();
  };

  const toggleMember = (userId: string) => {
    if (newTeam.members.includes(userId)) {
      setNewTeam({
        ...newTeam,
        members: newTeam.members.filter((id) => id !== userId),
      });
    } else {
      setNewTeam({
        ...newTeam,
        members: [...newTeam.members, userId],
      });
    }
  };

  const handledelete = async (id: string) => {
    try {
      if (window.confirm('Tem certeza que deseja excluir essa equipe?')) {
      await axios.delete(`${EndPointAPI}/team/delete/${id}`);
      location.reload();
    }
    } catch (error) {
      alert('Ocorreu um erro ao excluir essa equipe!');
    }
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate('/admin')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Gerenciar Equipes</h1>
      </div>

      <div className="mb-6 flex justify-end">
      {user.role === 'admin' && ( // Mostra o botão apenas se o usuário for admin
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Nova Equipe
          </button>
        </div>
      )}
      </div>

      {teams.length === 0 ? (
        <div className="card text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma equipe encontrada</h2>
          <p className="text-gray-600 mb-6">Comece criando sua primeira equipe</p>
          {user.role === 'admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Nova Equipe
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div key={team._id} className="card">
              {user.role === 'admin' && ( // Verifica se o usuário é admin antes de renderizar o botão
              <div className="flex justify-end mt-2">
                <Trash
                  onClick={() => {
                    handledelete(team._id);
                  }}
                  size={18}
                  className="cursor-pointer"
                />
              </div>
            )}
              <h2 className="text-xl font-semibold mb-4">{team.name_team}</h2>
              <p className="text-gray-500 text-justify break-words">{team.description}</p>
              <div className="space-y-2 mt-2">
              <h3 className="text-sm font-medium text-back-500 uppercase">Membros</h3>
              <ul className="divide-y divide-gray-200">
                {team.members.map((members) => {
                return (
                  <li key={members._id} className="py-3 flex items-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                    {members.name.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium">{members.name || 'Usuário'}</p>
                    <p className="text-sm text-gray-500">{members.email || ''}</p>
                  </div>
                  </li>
                );
                })}
              </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Equipe</h2>

            <div className="mb-4">
              <label htmlFor="name_team" className="block text-gray-700 font-medium mb-2">
                Nome da Equipe
              </label>
              <input
                type="text"
                id="name_team"
                value={newTeam.name_team}
                onChange={(e) => setNewTeam({ ...newTeam, name_team: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Selecione os Membros
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      checked={newTeam.members.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                      className="mr-3"
                    />
                    <label htmlFor={`user-${user.id}`} className="flex items-center cursor-pointer">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateTeam}
                className="btn-primary flex items-center"
              >
                <UserPlus size={20} className="mr-2" />
                Criar Equipe
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminTeams;