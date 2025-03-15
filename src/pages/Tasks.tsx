import React, { useEffect, useState } from 'react';
import { Plus, CheckSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import axios from 'axios';
import Cookie from 'js-cookie';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

const Tasks: React.FC = () => {

const [showCreateModal, setShowCreateModal] = useState(false);
const [user, setUsers] = useState<any[]>([]);

const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: '',
    members: [] as string[],
});

const [userTasks, setUserTasks] = useState<any[]>([]); // Correção aqui!

const [isAdmin, setIsAdmin] = useState(false);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.put(
        `${EndPointAPI}/task/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${Cookie.get('token')}`,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar status:");
      alert("Ocorreu um erro ao atualizar o status!");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await axios.delete(`${EndPointAPI}/task/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookie.get('token')}`,
          },
        });

        fetchTasks();
      } catch (error) {
        console.error("Erro ao excluir tarefa:");
        alert("Ocorreu um erro ao excluir essa tarefa!");
      }
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.date) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
  
    const storedUsers = localStorage.getItem("data");
    const user = storedUsers ? JSON.parse(storedUsers) : null;
  
    if (!user) {
      alert('Erro: usuário não encontrado. Faça login novamente.');
      return;
    }
  
    try {
      if (user.role === 'admin') {
        await axios.post(`${EndPointAPI}/task/createadmin`, newTask);
      } else if (user.role === 'Colaborador') {
        await axios.post(`${EndPointAPI}/task/create`, newTask, {
          headers: {
            Authorization: `Bearer ${Cookie.get('token')}`,
          },
        });
      } else {
        alert('Erro: Permissão insuficiente para criar tarefas.');
        return;
      }
  
      alert('Tarefa criada com sucesso!');
      setShowCreateModal(false);
    
      fetchTasks();
    } catch (error) {
      alert('Erro ao criar tarefa. Tente novamente.');
      console.error(error);
    }
  };
  
  const fetchTasks = async () => {
    try {
      const storedUsers = localStorage.getItem("data");
      const user = storedUsers ? JSON.parse(storedUsers) : null;
  
      if (!user) {
        alert('Erro: Usuário não encontrado. Faça login novamente.');
        return;
      }
  
      let tasks = [];
  
      if (user.role === 'admin') {
        setIsAdmin(true);
        const { data } = await axios.get(`${EndPointAPI}/task/findadmin`);
        tasks = data;
      } else {
        const { data: userTasks } = await axios.get(`${EndPointAPI}/task/find`, {
          headers: {
            Authorization: `Bearer ${Cookie.get('token')}`,
          },
        });
  
        const { data: adminTasks } = await axios.get(`${EndPointAPI}/task/findtaskmembers`, {
          headers: {
            Authorization: `Bearer ${Cookie.get('token')}`,
          },
        });
  
        const uniqueTasks = [...new Map([...userTasks, ...adminTasks].map(task => [task._id, task])).values()];
        
        tasks = uniqueTasks;
      }
  
      setUserTasks(tasks);
      const { data: usersData } = await axios.get(`${EndPointAPI}/employee/findall`);
      setUsers(usersData); 
  
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Tarefas</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {isAdmin ? 'Criar Tarefa' : 'Adicionar Tarefa'}
        </button>
      </div>
      
      {userTasks.length === 0 ? (
        <div className="card text-center py-12">
          <CheckSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma tarefa encontrada</h2>
          <p className="text-gray-600 mb-6">Você não possui tarefas atribuídas no momento</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus size={20} className="mr-2" />
            {isAdmin ? 'Criar Tarefa' : 'Adicionar Tarefa'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Tasks */}
          <div className="card">
            <div className="flex items-center mb-4">
              <AlertCircle size={20} className="text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold">Pendentes</h2>
            </div>
            <div className="space-y-4">
              {userTasks
                .filter(task => task.status === 'pending')
                .map((task, index) => (
                  <div key={task.id || index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Vencimento: {new Date(task.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => handleStatusChange(task._id, 'in-progress')}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                      >
                        Iniciar
                      </button>
                      <button 
                        onClick={() => handleStatusChange(task._id, 'completed')}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                      >
                        Concluir
                      </button>
                        <button 
                          onClick={() => handleDelete(task._id)}
                          className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded ml-auto"
                        >
                          Excluir
                        </button>
                    </div>
                  </div>
                ))}
              {userTasks.filter(task => task.status === 'pending').length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhuma tarefa pendente</p>
              )}
            </div>
          </div>
          
          {/* In Progress Tasks */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Clock size={20} className="text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold">Em Andamento</h2>
            </div>
            <div className="space-y-4">
              {userTasks
                .filter(task => task.status === 'in-progress')
                .map((task, index) => (
                  <div key={task._id || index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Vencimento: {new Date(task.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => handleStatusChange(task._id, 'pending')}
                        className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded"
                      >
                        Pendente
                      </button>
                      <button 
                        onClick={() => handleStatusChange(task._id, 'completed')}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                      >
                        Concluir
                      </button>
                        <button 
                          onClick={() => handleDelete(task._id)}
                          className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded ml-auto"
                        >
                          Excluir
                        </button>
                    </div>
                  </div>
                ))}
              {userTasks.filter(task => task.status === 'in-progress').length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhuma tarefa em andamento</p>
              )}
            </div>
          </div>
          
          {/* Completed Tasks */}
          <div className="card">
            <div className="flex items-center mb-4">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <h2 className="text-lg font-semibold">Concluídas</h2>
            </div>
            <div className="space-y-4">
              {userTasks
                .filter(task => task.status === 'completed')
                .map((task, index) => (
                  <div key={task._id || index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Vencimento: {new Date(task.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => handleStatusChange(task._id, 'pending')}
                        className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded"
                      >
                        Pendente
                      </button>
                      <button 
                        onClick={() => handleStatusChange(task._id, 'in-progress')}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                      >
                        Reabrir
                      </button>
                        <button 
                          onClick={() => handleDelete(task._id)}
                          className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded ml-auto"
                        >
                          Excluir
                        </button>
                    </div>
                  </div>
                ))}
              {userTasks.filter(task => task.status === 'completed').length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhuma tarefa concluída</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isAdmin ? 'Criar Nova Tarefa' : 'Adicionar Tarefa'}
            </h2>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Título
              </label>
              <input
                type="text"
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="input-field"
                rows={3}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="dueDate" className="block text-gray-700 font-medium mb-2">
                Data de Vencimento
              </label>
              <input
                type="date"
                id="dueDate"
                value={newTask.date}
                onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            {isAdmin && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Atribuir a
                </label>
                <div className="space-y-2">
                  {user.map((u) => (
                  <div key={u._id} className="flex items-center bg-gray-100 p-2 rounded-md shadow-sm">
                  <input
                  type="checkbox"
                  id={`assign-${u._id}`}
                  checked={newTask.members.includes(u._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                    setNewTask({
                    ...newTask, 
                    members: [...newTask.members, u._id]
                    });
                    } else {
                    setNewTask({
                    ...newTask, 
                    members: newTask.members.filter(id => id !== u._id)
                    });
                    }
                  }}
                  className="mr-2"
                  />
                  <label htmlFor={`assign-${u._id}`}>{`${u.name} - ${u.role}`}</label>
                  </div>
                  ))}
                </div>
              </div>
            )}
            
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
                onClick={handleCreateTask}
                className="btn-primary"
              >
                {isAdmin ? 'Criar Tarefa' : 'Adicionar Tarefa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Tasks;