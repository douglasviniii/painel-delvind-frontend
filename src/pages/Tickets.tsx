import React, { useEffect, useState } from 'react';
import { Plus, LifeBuoy, CheckCircle, Send, Trash2Icon } from 'lucide-react';
import Layout from '../components/Layout';
import axios from 'axios';
import Cookie from 'js-cookie';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

interface Ticket {
  _id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  status: 'open' | 'closed';
}

interface Props {
  title?: string;
}

const Tickets: React.FC<Props> = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);

  //const [isAdmin, setIsAdmin] = useState(Boolean);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
  });
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);

  const handleCreateTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      return alert('Por favor, preencha todos os campos');
    }

    const objectNewTicket = {
      title: newTicket.title,
      description: newTicket.description,
    };

    const storedUsers = localStorage.getItem("data");
    const user = storedUsers ? JSON.parse(storedUsers) : null;

    if (!user) {
      return alert('Usuário não encontrado');
    }

    const endpoint = user.role === 'admin'
      ? `${EndPointAPI}/called/createadmin`
      : `${EndPointAPI}/called/create`;

    const config = user.role !== 'admin' ? {
      headers: {
        Authorization: `Bearer ${Cookie.get('token')}`,
      },
    } : {};

    try {
      await axios.post(endpoint, objectNewTicket, config);

      const subject = `Novo Chamado: ${newTicket.title}`;
      const body = `Descrição do problema: ${newTicket.description}\n\nCriado por: ${user.name}`;
      window.location.href = `mailto:contato@delvind.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      setNewTicket({ title: '', description: '' });
      setShowCreateModal(false);
      fetchUserTickets();
    } catch (error) {
      console.error("Erro ao criar o chamado:", error);
      alert("Ocorreu um erro ao criar o chamado!");
    }
  };

  const toggleDropdown = (ticketId: string) => {
    setOpenDropdown(prev => (prev === ticketId ? null : ticketId));
  };

  const handleCloseTicket = async (id: string) => {
    const confirmation = window.confirm('Tem certeza que deseja fechar este chamado?');
    if (!confirmation) return;

    try {
      await axios.put(`${EndPointAPI}/called/status/${id}`, { status: 'closed' });
      alert('Chamado fechado com sucesso!');
      setShowCreateModal(false);
      fetchUserTickets();
    } catch (error) {
      console.error("Erro ao fechar o chamado:", error);
      alert("Ocorreu um erro ao fechar esse chamado!");
    }
  };

  const handleDeleteTicket = async (id: string) => {
    const confirmation = window.confirm('Tem certeza que deseja excluir este chamado?');
    if (!confirmation) return;

    try {
      await axios.delete(`${EndPointAPI}/called/delete/${id}`);

      alert('Chamado excluído com sucesso!');
      setShowCreateModal(false);
      fetchUserTickets();
    } catch (error) {
      console.error("Erro ao excluir o chamado:", error);
      alert("Ocorreu um erro ao excluir esse chamado!");
    }
  };

  const fetchUserTickets = async () => {
    try {
      const storedUsers = localStorage.getItem("data");
      const user = storedUsers ? JSON.parse(storedUsers) : null;

      if (user) {
        const endpoint = user.role === 'admin'
          ? `${EndPointAPI}/called/findadmin`
          : `${EndPointAPI}/called/find`;

        const config = user.role !== 'admin' ? {
          headers: {
            Authorization: `Bearer ${Cookie.get('token')}`,
          },
        } : {};

        const response = await axios.get(endpoint, config);
        setUserTickets(response.data);
      } else {
        console.error("Usuário não encontrado no localStorage");
      }
    } catch (error) {
      console.error("Erro ao buscar tickets:", error);
      alert("Ocorreu um erro ao carregar os tickets.");
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chamados</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Abrir Chamado
        </button>
      </div>

      {userTickets.length === 0 ? (
        <div className="card text-center py-12">
          <LifeBuoy size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhum chamado encontrado</h2>
          <p className="text-gray-600 mb-6">Você não possui chamados abertos no momento</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus size={20} className="mr-2" />
            <span className="hidden sm:inline">Abrir Chamado</span> {/* Esconde o texto em telas pequenas */}
          </button>
        </div>

      ) : (
        <div className="grid grid-cols-1 gap-6">
          {userTickets.map(ticket => (
            <div key={ticket._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">{ticket.title}</h2>
                    <span className={`ml-3 px-2 py-1 text-xs rounded-full ${ticket.status === 'open'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {ticket.status === 'open' ? 'Aberto' : 'Fechado'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Criado por {ticket.author} em {new Date(ticket.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {/* Dropdown Box para os Botões */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(ticket._id)}
                    className="btn-secondary flex items-center"
                  >
                    <span>Opções</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {/* Menu Dropdown */}
                  {openDropdown === ticket._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                      {ticket.status === 'open' && (
                        <>
                          <button
                            onClick={() => {
                              const subject = `Re: ${ticket.title}`;
                              const body = `Referente ao chamado criado em ${new Date(ticket.date).toLocaleDateString('pt-BR')}:\n\n${ticket.description}`;
                              window.location.href = `mailto:contato@delvind.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Send size={18} className="mr-1 inline" />
                            Enviar Email
                          </button>

                          <button
                            onClick={() => handleCloseTicket(ticket._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <CheckCircle size={18} className="mr-1 inline" />
                            Fechar Chamado
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDeleteTicket(ticket._id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Trash2Icon size={18} className="mr-1 inline" />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <p>{ticket.description}</p>
              </div>
            </div>
          ))}
        </div>

      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Abrir Novo Chamado</h2>

            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Título
              </label>
              <input
                type="text"
                id="title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Descrição do Problema
              </label>
              <textarea
                id="description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="input-field"
                rows={5}
                required
              />
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
                onClick={handleCreateTicket}
                className="btn-primary flex items-center"
              >
                <Send size={20} className="mr-2" />
                Abrir Chamado
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Tickets;