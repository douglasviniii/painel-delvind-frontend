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
const [updateCounter, setUpdateCounter] = useState(0);
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

  // Atualiza a lista de tarefas quando o updateCounter mudar
useEffect(() => {
  fetchTasks();
}, [updateCounter]);

// Função para excluir tarefa
const handleDelete = async (taskId: string) => {
  try {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta tarefa?');
    if (!confirmed) return;

    const storedUsers = localStorage.getItem("data");
    const user = storedUsers ? JSON.parse(storedUsers) : null;

    if (!user) {
      alert('Erro: usuário não encontrado. Faça login novamente.');
      return;
    }

    if (user.role === 'admin') {
      await axios.delete(`${EndPointAPI}/task/deleteadmin/${taskId}`);
    } else if (user.role === 'Colaborador') {
      await axios.delete(`${EndPointAPI}/task/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      });
    } else {
      alert('Erro: Permissão insuficiente para excluir tarefas.');
      return;
    }

    alert('Tarefa excluída com sucesso!');
    setUpdateCounter(updateCounter + 1); // Atualiza o contador para forçar o useEffect
  } catch (error) {
    alert('Erro ao excluir tarefa. Tente novamente.');
    console.error(error);
  }
};


const handleCreateTask = async () => {
  if (!newTask.title.trim() || !newTask.description.trim() || !newTask.date) {
    alert('Por favor, preencha todos os campos obrigatórios');
    return;
  }

  // Corrige a diferença de fuso horário sem alterar a data original inserida pelo usuário
  const selectedDate = new Date(newTask.date);
  selectedDate.setDate(selectedDate.getDate() + 1); // Adiciona 1 dia à data selecionada
  selectedDate.setHours(23, 59, 59, 999); // Define o horário final do dia

  try {
    const taskData = {
      ...newTask,
      date: selectedDate.toISOString(), // Salva a data ajustada no formato ISO
    };

    const storedUsers = localStorage.getItem("data");
    const user = storedUsers ? JSON.parse(storedUsers) : null;

    if (!user) {
      alert('Erro: usuário não encontrado. Faça login novamente.');
      return;
    }

    // Criação de tarefa com base na permissão do usuário
    if (user.role === 'admin') {
      await axios.post(`${EndPointAPI}/task/createadmin`, taskData);
    } else if (user.role === 'Colaborador') {
      await axios.post(`${EndPointAPI}/task/create`, taskData, {
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
    setUpdateCounter(updateCounter + 1); // Atualizar lista de tarefas
    fetchTasks();
  } catch (error) {
    alert('Erro ao criar tarefa. Tente novamente.');
    console.error(error);
  }
};
  

  // Atualiza a lista de tarefas quando o updateCounter mudar
  useEffect(() => {
    fetchTasks();
  }, [updateCounter]);
  
  
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
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma tarefa encontrada</h2>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

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
                  <div key={task.id || index} className="p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
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
                  <div key={task._id || index} className="p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
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
                  <div key={task._id || index} className="p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {isAdmin ? 'Criar Nova Tarefa' : 'Adicionar Tarefa'}
          </h2>

          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-600 font-medium mb-2">
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
            <label htmlFor="description" className="block text-gray-600 font-medium mb-2">
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
            <label htmlFor="dueDate" className="block text-gray-600 font-medium mb-2">
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
          <label className="block text-gray-600 font-medium mb-2">
            Atribuir a
          </label>
          <div className="max-h-40 overflow-y-auto space-y-2"> {/* Ajustando a altura e permitindo rolagem */}
            {user.map((u) => (
              <div key={u._id} className="flex items-center bg-gray-100 p-2 rounded-md shadow-sm hover:bg-gray-200 transition-colors">
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
                  className="mr-3"
                  aria-labelledby={`assign-${u._id}-label`}
                />
                <label htmlFor={`assign-${u._id}`} id={`assign-${u._id}-label`} className="flex items-center cursor-pointer">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 border-2 border-white">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.role}</p>
                  </div>
                </label>
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