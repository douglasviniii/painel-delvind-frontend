import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { v4 as uuidv4 } from 'uuid'; // Importando para gerar IDs únicos

interface Client {
  id: string;
  name: string;
  contact: string; // Adicione outros campos de contato conforme necessário
  // Outras informações do cliente
}

interface Contract {
  id: string;
  clientId: string; // ID do cliente ao qual o contrato pertence
  contractType: string;
  startDate: string;
  endDate: string;
  // Outros campos do contrato
  payments: Payment[]; // Array para armazenar os pagamentos do contrato
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  // Outras informações do pagamento
}

interface User {
  id: string;
  name: string;
  // Outras informações do usuário
}

interface Proof {
  id: string;
  userId?: string; // ID do usuário que gerou o comprovante
  contractId?: string; // ID do contrato (opcional)
  paymentAmount: string;
  paymentDate: string;
  issuedAt: string;
  // Outras informações do comprovante
}

const AdminClients: React.FC = () => {
  const [showClientModal, setShowClientModal] = useState(false);
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [showIssueProofModal, setShowIssueProofModal] = useState(false);
  const [showProofHistoryModal, setShowProofHistoryModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Simulação de usuários
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedUserIdForHistory, setSelectedUserIdForHistory] = useState<string | null>(null);
  const [userProofs, setUserProofs] = useState<Proof[]>([]);
  const [newClientData, setNewClientData] = useState({
    name: '',
    contact: '',
    // Adicione outros campos do cliente aqui
  });
  const [newContractData, setNewContractData] = useState({
    contractType: '',
    startDate: '',
    endDate: '',
    // Add other contract fields as needed
  });
  const [proofData, setProofData] = useState({
    contractId: '',
    paymentAmount: '',
    paymentDate: '',
    // Add other proof-related fields as needed
  });
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [proofs, setProofs] = useState<Proof[]>([]);

  useEffect(() => {
    // Simulação de carregamento de dados do local storage
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
    const storedContracts = localStorage.getItem('contracts');
    if (storedContracts) {
      setContracts(JSON.parse(storedContracts));
    }
    const storedProofs = localStorage.getItem('proofs');
    if (storedProofs) {
      setProofs(JSON.parse(storedProofs));
    }
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    // Simulação de salvamento de dados no local storage
    localStorage.setItem('clients', JSON.stringify(clients));
    localStorage.setItem('contracts', JSON.stringify(contracts));
    localStorage.setItem('proofs', JSON.stringify(proofs));
    localStorage.setItem('users', JSON.stringify(users));
  }, [clients, contracts, proofs, users]);

  const handleClientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContractChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewContractData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProofChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setProofData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddClient = () => {
    console.log('Adicionando novo cliente:', newClientData);
    const newClient: Client = { id: uuidv4(), ...newClientData };
    setClients([...clients, newClient]);
    setShowClientModal(false);
    alert('Cliente cadastrado (simulação)');
    setNewClientData({ name: '', contact: '' });
  };

  const handleCreateContract = () => {
    if (!selectedClient) {
      alert('Selecione um cliente para adicionar um contrato.');
      return;
    }
    console.log('Criando novo contrato para o cliente:', selectedClient.name, newContractData);
    const newContract: Contract = {
      id: uuidv4(),
      clientId: selectedClient.id,
      ...newContractData,
      payments: [],
    };
    setContracts([...contracts, newContract]);
    setShowNewContractModal(false);
    alert('Contrato criado (simulação)');
    setNewContractData({ contractType: '', startDate: '', endDate: '' });
    setSelectedClient(null);
  };

  const handleIssueProof = () => {
    console.log('Issuing proof:', proofData);
    const userId = 'user123'; // Simulação de usuário logado
    setShowIssueProofModal(false);
    const newProof: Proof = {
      id: uuidv4(),
      userId: userId,
      contractId: proofData.contractId,
      paymentAmount: proofData.paymentAmount,
      paymentDate: proofData.paymentDate,
      issuedAt: new Date().toLocaleString(),
    };
    setProofs([...proofs, newProof]);
    alert('Comprovante emitido (simulação)');
    setProofData({ contractId: '', paymentAmount: '', paymentDate: '' });
  };

  const openClientDetails = (client: Client) => {
    setSelectedClient(client);
    console.log('Abrindo detalhes do cliente:', client.name);
  };

  const openNewContractForm = (client: Client) => {
    setSelectedClient(client);
    setShowNewContractModal(true);
    setNewContractData({ contractType: '', startDate: '', endDate: '' });
  };

  const openProofHistory = (userId: string) => {
    setSelectedUserIdForHistory(userId);
    const proofsForUser = proofs.filter(proof => proof.userId === userId);

    setUserProofs(proofsForUser);
    setShowProofHistoryModal(true);
  };

  return (
    <Layout>
      <div className="font-sans flex min-h-screen flex-col p-4">
        {/* Main Content */}
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-semibold mb-4">Clientes</h2>
          <div className="mb-5 flex gap-2">
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowClientModal(true)}
            >
              Cadastrar Cliente
            </button>
            {selectedClient && (
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => openNewContractForm(selectedClient)}
              >
                Novo contrato para {selectedClient.name}
              </button>
            )}
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowIssueProofModal(true)}
            >
              Emitir comprovante avulso
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm ml-1"
              onClick={() => openProofHistory('user123')}
            >
              Hist. Comprovantes
            </button>
          </div>

          <div className="flex gap-5 mb-8">
            {/* ... (cálculos de total, total pago, pendentes - precisará ser atualizado) ... */}
            <div className="border border-gray-300 rounded-md p-5 text-center w-1/3 bg-gray-100">
              <div className="font-bold mb-2 text-gray-700">Total de Clientes</div>
              <div className="text-lg text-gray-500">{clients.length}</div>
            </div>
            {/* ... outros cards (precisam ser implementados com base nos dados) ... */}
          </div>

          {/* Listagem de Clientes */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Clientes Cadastrados</h3>
            {clients.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">Nome</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">Contato</th>
                    <th className="py-2 px-4 text-center font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-gray-200">
                      <td className="py-2 px-4 text-gray-700">{client.name}</td>
                      <td className="py-2 px-4 text-gray-700">{client.contact}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-1"
                          onClick={() => openClientDetails(client)}
                        >
                          Ver Detalhes
                        </button>

                        {/* Adicionar botão para editar cliente aqui */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
            )}
          </div>

          {/* Area para exibir contratos (dentro da tela principal, mas idealmente na página do cliente) */}
          {selectedClient && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-2 text-gray-700">Contratos de {selectedClient.name}</h4>
              {contracts.filter(contract => contract.clientId === selectedClient.id).length > 0 ? (
                <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="py-2 px-4 text-left font-semibold text-gray-700">Tipo</th>
                      <th className="py-2 px-4 text-left font-semibold text-gray-700">Início</th>
                      <th className="py-2 px-4 text-left font-semibold text-gray-700">Fim</th>
                      <th className="py-2 px-4 text-center font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts
                      .filter(contract => contract.clientId === selectedClient.id)
                      .map((contract) => (
                        <tr key={contract.id} className="border-b border-gray-200">
                          <td className="py-2 px-4 text-gray-700">{contract.contractType}</td>
                          <td className="py-2 px-4 text-gray-700">{contract.startDate}</td>
                          <td className="py-2 px-4 text-gray-700">{contract.endDate}</td>
                          <td className="py-2 px-4 text-center">
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-1"
                              onClick={() => console.log(`Ver detalhes do contrato ${contract.id}`)}
                            >
                              Ver
                            </button>
                            {/* Adicionar botão para editar contrato aqui */}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">Nenhum contrato cadastrado para este cliente.</p>
              )}
            </div>
          )}

          {/* Area to display proofs (pode ser movida para um histórico de pagamentos) */}
          {/* ... (a seção de comprovantes pode ser revisada e movida para um local mais apropriado) ... */}
        </div>

        {/* Modal para Cadastro de Cliente */}
        {showClientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white rounded-md p-6 w-full max-w-md relative shadow-lg">
              <button
                onClick={() => setShowClientModal(false)}
                className="absolute top-2 right-2 bg-transparent border-none text-gray-500 text-xl cursor-pointer"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Cadastrar Cliente</h3>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Nome:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newClientData.name}
                  onChange={handleClientChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2">
                  Contato:
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={newClientData.contact}
                  onChange={handleClientChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                />
              </div>
              {/* Adicione outros campos do cliente aqui */}
              <div className="text-right">
                <button
                  onClick={handleAddClient}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Adicionar Contrato */}
        {showNewContractModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white rounded-md p-6 w-full max-w-md relative shadow-lg">
              <button
                onClick={() => setShowNewContractModal(false)}
                className="absolute top-2 right-2 bg-transparent border-none text-gray-500 text-xl cursor-pointer"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Novo Contrato para {selectedClient.name}</h3>
              <div className="mb-4">
                <label htmlFor="contractType" className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo de Contrato:
                </label>
                <select
                  id="contractType"
                  name="contractType"
                  value={newContractData.contractType}
                  onChange={handleContractChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                >
                  <option value="">SeSelecione</option>
                  <option value="servico">Serviço</option>
                  <option value="venda">Venda</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="w-1/2">
                  <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Data de Início:
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={newContractData.startDate}
                    onChange={handleContractChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Data de Término:
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={newContractData.endDate}
                    onChange={handleContractChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                </div>
              </div>
              {/* Add more form fields for the contract */}
              <div className="text-right">
                <button
                  onClick={handleCreateContract}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                >
                  Adicionar Contrato
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issue Proof Modal */}
        {showIssueProofModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white rounded-md p-6 w-full max-w-md relative shadow-lg">
              <button
                onClick={() => setShowIssueProofModal(false)}
                className="absolute top-2 right-2 bg-transparent border-none text-gray-500 text-xl cursor-pointer"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Emitir Comprovante Avulso</h3>
              <div className="mb-4">
                <label htmlFor="contractId" className="block text-gray-700 text-sm font-bold mb-2">
                  ID do Contrato (Opcional):
                </label>
                <input
                  type="text"
                  id="contractId"
                  name="contractId"
                  value={proofData.contractId}
                  onChange={handleProofChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  placeholder="Se aplicável"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="paymentAmount" className="block text-gray-700 text-sm font-bold mb-2">
                  Valor do Pagamento:
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  name="paymentAmount"
                  value={proofData.paymentAmount}
                  onChange={handleProofChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="paymentDate" className="block text-gray-700 text-sm font-bold mb-2">
                  Data do Pagamento:
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  name="paymentDate"
                  value={proofData.paymentDate}
                  onChange={handleProofChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                />
              </div>
              {/* Adicione outros campos para um comprovante avulso, se necessário */}
              <div className="text-right">
                <button
                  onClick={handleIssueProof}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                >
                  Gerar Comprovante
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Proof History Modal */}
        {showProofHistoryModal && selectedUserIdForHistory && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-11"
          >
            <div
              className="bg-white rounded-md p-6 w-full max-w-lg relative shadow-lg"
            >
              <button
                onClick={() => setShowProofHistoryModal(false)}
                className="absolute top-2 right-2 bg-transparent border-none text-gray-500 text-xl cursor-pointer"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
                Histórico de Comprovantes
                {selectedUserIdForHistory && ` - Usuário ${selectedUserIdForHistory}`}
              </h3>
              {userProofs.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="py-2 px-4 text-left font-semibold text-gray-700">Contrato ID</th>
                      <th className="py-2 px-4 text-left font-semibold text-gray-700">Valor</th>
                      <th className="py-2 px-4 text-left font-semibold text-gray-700">Data</th>
                      <th className="py-2 px-4 text-center font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProofs.map((proof) => (
                      <tr key={proof.id} className="border-b border-gray-200">
                        <td className="py-2 px-4 text-gray-700">{proof.contractId || 'Avulso'}</td>
                        <td className="py-2 px-4 text-gray-700">R$ {parseFloat(proof.paymentAmount).toFixed(2)}</td>
                        <td className="py-2 px-4 text-gray-700">{proof.paymentDate}</td>
                        <td className="py-2 px-4 text-center">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                            onClick={() => console.log(`Visualizar comprovante ${proof.id}`)}
                          >
                            Visualizar
                          </button>
                          {/* Adicionar botão para baixar PDF aqui */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center">Nenhum comprovante encontrado para este usuário.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminClients;