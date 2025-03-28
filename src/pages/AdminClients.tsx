import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { v4 as uuidv4 } from 'uuid'; // Importando para gerar IDs únicos
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// Importando o CSS do react-tabs, se necessário
import 'react-tabs/style/react-tabs.css';

interface Client {
  id: string;
  name: string;
  cnpjCpf?: string;
  phone?: string;
  email?: string;
  city?: string;
  website?: string;
  contact: string; // Mantendo o campo de contato para compatibilidade
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
  proofNumber?: string;
  status?: string;
  proofHour?: string;
  services?: string;
  description?: string;
  // Outras informações do comprovante
}

const AdminClients: React.FC = () => {
  const [showClientModal, setShowClientModal] = useState(false);
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [showIssueProofModal, setShowIssueProofModal] = useState(false);
  const [showProofHistoryModal, setShowProofHistoryModal] = useState(false);
  const [showClientDetailsModal, setShowClientDetailsModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Simulação de usuários
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedUserIdForHistory, setSelectedUserIdForHistory] = useState<string | null>(null);
  const [userProofs, setUserProofs] = useState<Proof[]>([]);
  const [showViewProofModal, setShowViewProofModal] = useState(false);
  const [selectedProofToView, setSelectedProofToView] = useState<Proof | null>(null);
  const [newClientData, setNewClientData] = useState({
    name: '',
    cnpjCpf: '',
    phone: '',
    email: '',
    city: '',
    website: '',
    cep: '',
    address: '',


  });
  const [newContractData, setNewContractData] = useState({
    contractType: '',
    startDate: '',
    endDate: '',
    // Add other contract fields as needed
  });
  const [proofData, setProofData] = useState({
    contractId: '',
    proofNumber: '',
    status: '',
    proofDate: '',
    proofHour: '',
    services: '',
    description: '',
    value: '',
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

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
    setNewClientData({
      name: '',
      cnpjCpf: '',
      phone: '',
      email: '',
      city: '',
      website: '',
      cep: '',
      address: '',
    });
  };

  const handleEditClient = () => {
    if (!editingClient) return;
    console.log('Editando cliente:', newClientData);
    const updatedClients = clients.map((client) =>
      client.id === editingClient.id ? { ...client, ...newClientData } : client
    );
    setClients(updatedClients);
    setShowClientModal(false);
    setIsEditing(false);
    alert('Cliente atualizado (simulação)');
    setNewClientData({
      name: '',
      cnpjCpf: '',
      phone: '',
      email: '',
      city: '',
      website: '',
      cep: '',
      address: '',
    });
    setEditingClient(null);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setIsEditing(true);
    setNewClientData({
      name: client.name || '',
      cnpjCpf: client.cnpjCpf || '',
      phone: client.phone || '',
      email: client.email || '',
      city: client.city || '',
      website: client.website || '',
      cep: client.cep || '',
      address: client.address || '',
    });
    setShowClientModal(true);
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
      paymentAmount: proofData.value, // Usando o campo 'value' para o valor
      paymentDate: proofData.proofDate,
      issuedAt: new Date().toLocaleString(),
      proofNumber: proofData.proofNumber,
      status: proofData.status,
      proofHour: proofData.proofHour,
      services: proofData.services,
      description: proofData.description,
    };
    setProofs([...proofs, newProof]);
    alert('Comprovante emitido (simulação)');
    setProofData({
      contractId: '',
      proofNumber: '',
      status: '',
      proofDate: '',
      proofHour: '',
      services: '',
      description: '',
      value: '',
    });
  };

  const openClientDetails = (client: Client) => {
    setSelectedClient(client);
    setShowClientDetailsModal(true);
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

  const handleDownloadClientDetails = () => {
    if (!selectedClient) {
      alert('Nenhum cliente selecionado.');
      return;
    }
  
    import('jspdf').then((jsPDF) => {
      const doc = new jsPDF.default({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });
  
      // Configurações de layout
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let y = 15;
      const headerColor = '#9966cc';
      const textColor = '#333333';
      const inputBackgroundColor = '#f0f0f0';
      const circleColor = '#8b51ff';
      const rectRadius = 3;
      const numberWidth = 8;
      const fieldXPadding = 4;
      const fieldYPadding = 2;
      const minFieldHeight = 7;
      const circleRadius = 3.5;
      const borderWidth = 0.5;
      const headerBottomMargin = 6;
      const columnGap = 8;
      const maxFieldWidth = (pageWidth / 2) - margin - columnGap/2 - numberWidth - 5;
  
      // Função para desenhar número dentro de bolinha
      const drawNumberInCircle = (x, y, number) => {
        doc.setDrawColor(headerColor);
        doc.setFillColor(circleColor);
        doc.circle(x, y, circleRadius, 'FD');
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#ffffff');
        const textPos = doc.getTextDimensions(number.toString(), { fontSize: 8 });
        doc.text(number.toString(), x - textPos.w/2, y + textPos.h/3);
        doc.setTextColor(textColor);
      };
  
      // Função para criar campos
      const createField = (x, y, label, value, fieldNumber, fieldWidth) => {
        doc.setFontSize(8);
        const textLines = doc.splitTextToSize(value || '', fieldWidth - 2*fieldXPadding);
        const lineHeight = 3.5;
        const fieldHeight = Math.max(minFieldHeight, (textLines.length * lineHeight) + 2*fieldYPadding);
        
        // Desenhar número dentro de bolinha (apenas para campos 1-6)
        if (fieldNumber <= 6) {
          drawNumberInCircle(x + circleRadius, y + fieldHeight/2, fieldNumber);
        }
        
        // Label acima do campo
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(label, x + numberWidth, y - 1.5);
        
        // Campo de fundo
        doc.setFillColor(inputBackgroundColor);
        doc.roundedRect(
          x + numberWidth,
          y,
          fieldWidth,
          fieldHeight,
          rectRadius,
          rectRadius,
          'FD'
        );
        
        // Texto do campo
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(textColor);
        doc.text(textLines, 
          x + numberWidth + fieldXPadding, 
          y + fieldYPadding + 2.5, {
          lineHeightFactor: 1
        });
        
        return fieldHeight;
      };
  
      // Cabeçalho com borda
      doc.setFillColor(headerColor);
      doc.setDrawColor('#000000');
      doc.setLineWidth(borderWidth);
      doc.roundedRect(
        margin, 
        y, 
        pageWidth - 2 * margin, 
        9, 
        2,
        2, 
        'FD'
      );
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#ffffff');
      doc.text('Delvind LTDA', margin + 5, y + 6);
      doc.setFontSize(10);
      doc.text('CLIENTE', pageWidth - margin - 10, y + 6, { align: 'right' });
      y += 9 + headerBottomMargin;
  
      // Dados do cliente organizados em duas colunas
      const clientFields = [
        // Coluna esquerda
        [
          { label: 'NOME', value: selectedClient.name || '' },
          { label: 'CNPJ/CPF', value: selectedClient.cnpjCpf || '' },
          { label: 'TELEFONE', value: selectedClient.phone || '' }
        ],
        // Coluna direita
        [
          { label: 'E-MAIL', value: selectedClient.email || '' },
          { label: 'ENDEREÇO', value: selectedClient.address || '' },
          { label: 'CIDADE/CEP', value: `${selectedClient.city || ''} ${selectedClient.cep || ''}` }
        ]
      ];
  
      // Desenhar os campos
      let maxY = y;
      const fieldWidth = (pageWidth / 2) - margin - columnGap/2 - numberWidth - 5;
      
      clientFields.forEach((column, colIndex) => {
        const xPos = colIndex === 0 ? margin : pageWidth/2 + columnGap/2;
        let currentY = y;
        
        column.forEach((field, fieldIndex) => {
          const fieldNumber = (colIndex * column.length) + fieldIndex + 1;
          const fieldHeight = createField(
            xPos,
            currentY,
            field.label,
            field.value,
            fieldNumber,
            fieldWidth
          );
          
          currentY += fieldHeight + 6;
          maxY = Math.max(maxY, currentY);
        });
      });
  
      // Campo adicional para site/observações (se existir)
      if (selectedClient.website || selectedClient.notes) {
        const fullWidth = pageWidth - 2*margin - numberWidth;
        const combinedValue = [selectedClient.website, selectedClient.notes].filter(Boolean).join('\n');
        const textLines = doc.splitTextToSize(combinedValue, fullWidth - 2*fieldXPadding);
        const fieldHeight = Math.max(minFieldHeight, (textLines.length * 3.5) + 2*fieldYPadding);
        
        // Label
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('SITE/OBSERVAÇÕES', margin + numberWidth, maxY - 1.5);
        
        // Campo
        doc.setFillColor(inputBackgroundColor);
        doc.roundedRect(
          margin + numberWidth,
          maxY,
          fullWidth,
          fieldHeight,
          rectRadius,
          rectRadius,
          'FD'
        );
        
        // Texto
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(textLines, margin + numberWidth + fieldXPadding, maxY + fieldYPadding + 2.5, {
          lineHeightFactor: 1
        });
        
        maxY += fieldHeight + 6;
      }
  
      // Salvar o PDF
      const fileName = `cliente_${selectedClient.name.replace(/\s+/g, '_').substring(0, 20)}.pdf`;
      doc.save(fileName);
    });
  };
  const handleDownloadProofPdf = (proof: Proof) => {
    if (!proof) {
      alert('Selecione um comprovante para baixar.');
      return;
    }

    const { proofNumber, status, proofDate, proofHour, services, description, paymentAmount } = proof;
    const numeroComprovante = proofNumber || proof.id.substring(0, 8).toUpperCase();
    const dataFormatada = proofDate ? new Date(proofDate).toLocaleDateString('pt-BR') : 'Data inválida';
    const horaFormatada = proofHour || '00:00';
    const valorFormatado = parseFloat(paymentAmount || '0').toFixed(2);
    const servicesList = services ? services.split('\n').map(s => s.trim()).filter(s => s) : [];
    const descriptionList = description ? description.split('\n').map(d => d.trim()).filter(d => d) : [];
    const totalAmount = parseFloat(paymentAmount || '0').toFixed(2);

    import('jspdf').then((jsPDF) => {
      const doc = new jsPDF.default({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      // Configurações de layout
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let y = 15;
      const headerColor = '#9966cc';
      const textColor = '#333333';
      const inputBackgroundColor = '#f0f0f0';
      const circleColor = '#8b51ff';
      const rectRadius = 3;
      const numberWidth = 8;
      const fieldXPadding = 4;
      const fieldYPadding = 2;
      const minFieldHeight = 7;
      const circleRadius = 3.5;
      const borderWidth = 0.5;
      const headerBottomMargin = 6; // Novo: Espaço adicional após o cabeçalho

      // Função para desenhar número dentro de bolinha
      const drawNumberInCircle = (x, y, number) => {
        doc.setDrawColor(headerColor);
        doc.setFillColor(circleColor);
        doc.circle(x, y, circleRadius, 'FD');
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#ffffff');
        const textPos = doc.getTextDimensions(number.toString(), { fontSize: 8 });
        doc.text(number.toString(), x - textPos.w/2, y + textPos.h/3);
        doc.setTextColor(textColor);
      };

      // Função para criar campos
      const createField = (x, y, label, value, fieldNumber, fieldWidth) => {
        doc.setFontSize(8);
        const textLines = doc.splitTextToSize(value || '', fieldWidth - 2*fieldXPadding);
        const lineHeight = 3.5;
        const fieldHeight = Math.max(minFieldHeight, (textLines.length * lineHeight) + 2*fieldYPadding);
        
        if (fieldNumber <= 4) {
          drawNumberInCircle(x + circleRadius, y + fieldHeight/2, fieldNumber);
        }
        
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(label, x + numberWidth, y - 1.5);
        
        doc.setFillColor(inputBackgroundColor);
        doc.roundedRect(
          x + numberWidth,
          y,
          fieldWidth,
          fieldHeight,
          rectRadius,
          rectRadius,
          'FD'
        );
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(textColor);
        doc.text(textLines, 
          x + numberWidth + fieldXPadding, 
          y + fieldYPadding + 2.5, {
          lineHeightFactor: 1
        });
        
        return fieldHeight;
      };

      // Cabeçalho Principal com borda e margem inferior
      doc.setFillColor(headerColor);
      doc.setDrawColor('#000000');
      doc.setLineWidth(borderWidth);
      doc.roundedRect(
        margin, 
        y, 
        pageWidth - 2 * margin, 
        9, 
        2,
        2, 
        'FD'
      );
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#ffffff');
      doc.text('Delvind LTDA', margin + 5, y + 6);
      doc.setFontSize(10);
      doc.text('SERVIÇOS PAGOS', pageWidth - margin - 10, y + 6, { align: 'right' });
      
      // Ajuste: Adicionado espaço após o cabeçalho
      y += 9 + headerBottomMargin; // Altura do cabeçalho (9mm) + margem inferior (6mm)

      // Campos (1-4)
      const fieldWidth = (pageWidth - 2*margin - numberWidth - 8) / 2;
      
      // Linha 1 (DATA e HORA)
      const dataHeight = createField(margin, y, 'DATA', dataFormatada, 1, fieldWidth);
      const horaHeight = createField(margin + numberWidth + fieldWidth + 8, y, 'HORA', horaFormatada, 2, fieldWidth);
      y += Math.max(dataHeight, horaHeight) + 6;

      // Linha 2 (STATUS e N° COMPROVANTE)
      const statusHeight = createField(margin, y, 'STATUS', status ? status.toUpperCase() : '', 3, fieldWidth);
      const comprovanteHeight = createField(margin + numberWidth + fieldWidth + 8, y, 'N° COMPROVANTE', numeroComprovante, 4, fieldWidth);
      y += Math.max(statusHeight, comprovanteHeight) + 12;

      // Tabela de Serviços
      const colWidths = [pageWidth * 0.35, pageWidth * 0.45, pageWidth * 0.2];
      const tableHeaderHeight = 7;
      const tableRowHeight = 6;

      // Cabeçalho da Tabela
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.rect(margin + numberWidth, y, pageWidth - 2*margin - numberWidth, tableHeaderHeight, 'D');
      doc.text('SERVIÇOS', margin + numberWidth + 4, y + 4.5);
      doc.text('DESCRIÇÃO', margin + numberWidth + colWidths[0] + 4, y + 4.5);
      doc.text('VALOR R$', pageWidth - margin - 4, y + 4.5, { align: 'right' });
      y += tableHeaderHeight;

      // Linhas da Tabela
      doc.setFont('helvetica', 'normal');
      const itemsCount = Math.max(servicesList.length, descriptionList.length);
      
      for (let i = 0; i < itemsCount; i++) {
        doc.rect(margin + numberWidth, y, pageWidth - 2*margin - numberWidth, tableRowHeight, 'D');
        
        if (i < servicesList.length) {
          doc.text(servicesList[i], margin + numberWidth + 4, y + 3.5);
        }
        
        if (i < descriptionList.length) {
          doc.text(descriptionList[i], margin + numberWidth + colWidths[0] + 4, y + 3.5);
        }
        
        if (i === 0) {
          doc.text(`R$ ${valorFormatado}`, pageWidth - margin - 4, y + 3.5, { align: 'right' });
        }
        
        y += tableRowHeight;
      }

      // Total
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.rect(margin + numberWidth, y, pageWidth - 2*margin - numberWidth, tableRowHeight, 'D');
      doc.text('TOTAL', margin + numberWidth + 4, y + 3.5);
      doc.text(`R$ ${totalAmount}`, pageWidth - margin - 4, y + 3.5, { align: 'right' });

      // Download do PDF
      doc.save(`comprovante_${numeroComprovante}.pdf`);
    });
  };


  

  return (
    <Layout>
      <div className="font-sans flex min-h-screen flex-col p-4">
        <Tabs>
          <TabList className="mb-4 ">
            <Tab>Painel</Tab>
            <Tab>Clientes</Tab>
            <Tab>Emitir Comprovante</Tab>
            <Tab >Histórico de Comprovantes</Tab>
          </TabList>

          {/* Aba Painel */}
          <TabPanel>
            <h2 className="text-2xl font-semiboldmb-4 ">Painel de Controle</h2>
            <div className="flex gap-5">
              <div className="bg-white rounded-md shadow-md p-6 w-1/2">
                <h3 className="text-lg font-semibold mb-2">Total de Comprovantes</h3>
                <p className="text-3xl font-bold text-indigo-600">{proofs.length}</p>
              </div>
              <div className="bg-white rounded-md shadow-md p-6 w-1/2">
                <h3 className="text-lg font-semibold mb-2">Total de Clientes Cadastrados</h3>
                <p className="text-3xl font-bold text-green-600">{clients.length}</p>
              </div>
            </div>
          </TabPanel>

          {/* Aba Clientes */}
          <TabPanel>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Clientes Cadastrados</h2>
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowClientModal(true)}
              >
                Cadastrar Cliente
              </button>
            </div>
            {clients.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">Nome</th>
                    <th className="py-2 px-4 text-center font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-gray-200">
                      <td className="py-2 px-4 text-gray-700">{client.name}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-1"
                          onClick={() => openClientDetails(client)}
                        >
                          Ver Detalhes
                        </button>
                        <button
                      onClick={() => handleOpenEditModal(client)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                    >
                      Editar
                    </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
            )}
          </TabPanel>

          {/* Aba Emitir Comprovante */}
          <TabPanel>
            <h2 className="text-2xl  font-semibold mb-4">Emitir Comprovante Avulso</h2>
            {/* Conteúdo do modal de emitir comprovante */}
            {/* Issue Proof Modal */}
            <div className="bg-white rounded-md shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-600 text-center">Emitir Comprovante</h3>
              <div className="mb-3">
                <label htmlFor="proofNumber" className="block text-gray-700 text-sm font-bold mb-1">
                  N° do Comprovante:
                </label>
                <input
                  type="text"
                  id="proofNumber"
                  name="proofNumber"
                  value={proofData.proofNumber}
                  onChange={handleProofChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-1">
                  Status do Comprovante:
                </label>
                <select
                  id="status"
                  name="status"
                  value={proofData.status}
                  onChange={handleProofChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-1/2">
                  <label htmlFor="proofDate" className="block text-gray-700 text-sm font-bold mb-1">
                    Data:
                  </label>
                  <input
                    type="date"
                    id="proofDate"
                    name="proofDate"
                    value={proofData.proofDate}
                    onChange={handleProofChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="proofHour" className="block text-gray-700 text-sm font-bold mb-1">
                    Hora:
                  </label>
                  <input
                    type="time"
                    id="proofHour"
                    name="proofHour"
                    value={proofData.proofHour}
                    onChange={handleProofChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="services" className="block text-gray-700 text-sm font-bold mb-1">
                  Serviços:
                </label>
                <textarea
                  id="services"
                  name="services"
                  value={proofData.services}
                  onChange={handleProofChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  placeholder="Lista de serviços"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-1">
                  Descrição:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={proofData.description}
                  onChange={handleProofChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  placeholder="Descrição detalhada"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="value" className="block text-gray-700 text-sm font-bold mb-1">
                  Valor R$:
                </label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={proofData.value}
                  onChange={handleProofChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                />
              </div>
              
              <div className="text-right">
                <button
                  onClick={handleIssueProof}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                >
                  Gerar Comprovante
                </button>
              </div>
            </div>
          </TabPanel>


          {/* Aba Histórico de Comprovantes */}
          <TabPanel>
            <h2 className="text-2xl font-semibold mb-4">Histórico de Comprovantes</h2>
            {/* Conteúdo do modal de histórico de comprovantes */}
            {/* Proof History Modal */}
            <div className="bg-white rounded-md shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-600 text-center">
                Histórico de Comprovantes
                {selectedUserIdForHistory && ` - Usuário ${selectedUserIdForHistory}`}
              </h3>
              {proofs.length > 0 ? (
                <>
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
                      {proofs.map((proof) => (
                        <tr key={proof.id} className="border-b border-gray-200">
                          <td className="py-2 px-4 text-gray-700">{proof.contractId || 'Avulso'}</td>
                          <td className="py-2 px-4 text-gray-700">R$ {parseFloat(proof.paymentAmount).toFixed(2)}</td>
                          <td className="py-2 px-4 text-gray-700">{proof.paymentDate}</td>
                          <td className="py-2 px-4 text-center">
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs mr-1"
                              onClick={() => {
                                setSelectedProofToView(proof);
                                setShowViewProofModal(true);
                              }}
                            >
                              Visualizar
                            </button>
                            <button
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
                              onClick={() => handleDownloadProofPdf(proof)}
                            >
                              Baixar PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Modal para Visualizar Comprovante */}
                  {showViewProofModal && selectedProofToView && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                      <div className="bg-white rounded-md p-6 w-full max-w-lg relative shadow-lg">
                        <button
                          onClick={() => setShowViewProofModal(false)}
                          className="absolute top-2 right-2 bg-transparent border-none text-gray-500 text-xl cursor-pointer"
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Visualizar Comprovante</h3>
                        <div>
                          <p className="mb-2"><strong>N°:</strong> {selectedProofToView.proofNumber || selectedProofToView.id.substring(0, 8).toUpperCase()}</p>
                          <p className="mb-2"><strong>Status:</strong> {selectedProofToView.status ? selectedProofToView.status.toUpperCase() : ''}</p>
                          <p className="mb-2"><strong>Data:</strong> {new Date(selectedProofToView.paymentDate).toLocaleDateString('pt-BR')}</p>
                          <p className="mb-2"><strong>Hora:</strong> {selectedProofToView.proofHour || ''}</p>
                          <p className="mb-2"><strong>Serviços:</strong> {selectedProofToView.services || ''}</p>
                          <p className="mb-2"><strong>Descrição:</strong> {selectedProofToView.description || ''}</p>
                          <p className="mb-4"><strong>Valor:</strong> R$ {parseFloat(selectedProofToView.paymentAmount || '0').toFixed(2)}</p>
                          {/* Adicione outros detalhes, se necessário */}
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => handleDownloadProofPdf(selectedProofToView)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                          >
                            Baixar PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center">Nenhum comprovante encontrado.</p>
              )}
            </div>
          </TabPanel>

        </Tabs>
        {/* Modal para Cadastro de Cliente (Aba Cadastrar Clientes - modal) */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white rounded-md p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={() => { setShowClientModal(false); setIsEditing(false); setNewClientData({ name: '', cnpjCpf: '', phone: '', email: '', city: '', website: '', cep: '', address: '' }); setEditingClient(null); }}
              className="absolute top-2 right-2 bg-transparent border-none text-gray-500 text-xl cursor-pointer"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-600 text-center">
              {isEditing ? 'Editar Cliente' : 'Cadastrar Cliente'}
            </h3>
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
              <label htmlFor="cnpjCpf" className="block text-gray-700 text-sm font-bold mb-2">
                CNPJ/CPF:
              </label>
              <input
                type="text"
                id="cnpjCpf"
                name="cnpjCpf"
                value={newClientData.cnpjCpf}
                onChange={handleClientChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                Telefone:
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={newClientData.phone}
                onChange={handleClientChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                E-mail:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newClientData.email}
                onChange={handleClientChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
                Cidade:
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={newClientData.city}
                onChange={handleClientChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">
                Site:
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={newClientData.website}
                onChange={handleClientChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cep" className="block text-gray-700 text-sm font-bold mb-2">
                CEP:
              </label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={newClientData.cep}
                onChange={handleClientChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                Endereço:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={newClientData.address}
                onChange={handleClientChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>
            
            <div className="text-right">
              {isEditing ? (
                <button
                  onClick={handleEditClient}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm mr-2"
                >
                  Salvar Edição
                </button>
              ) : (
                <button
                  onClick={handleAddClient}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                >
                  Cadastrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

        {/* Modal para Detalhes do Cliente */}
        {showClientDetailsModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white rounded-md p-6 w-full max-w-md relative shadow-lg">
              <button
                onClick={() => setShowClientDetailsModal(false)}
                className="absolute top-2 right-2 bg-transparent border-none text-gray-500 text-xl cursor-pointer"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Detalhes do Cliente</h3>
              <div>
                <p className="mb-2"><strong>Nome:</strong> {selectedClient.name || 'Não informado'}</p>
                <p className="mb-2"><strong>CNPJ/CPF:</strong> {selectedClient.cnpjCpf || 'Não informado'}</p>
                <p className="mb-2"><strong>Telefone:</strong> {selectedClient.phone || 'Não informado'}</p>
                <p className="mb-2"><strong>E-mail:</strong> {selectedClient.email || 'Não informado'}</p>
                <p className="mb-2"><strong>Cidade:</strong> {selectedClient.city || 'Não informado'}</p>
                <p className="mb-2"><strong>CEP:</strong> {selectedClient.cep || 'Não informado'}</p> {/* Novo campo */}
                <p className="mb-2"><strong>Endereço:</strong> {selectedClient.address || 'Não informado'}</p> {/* Novo campo */}
                <p className="mb-4"><strong>Site:</strong> {selectedClient.website || 'Não informado'}</p>
                {/* Adicione outros detalhes aqui */}
              </div>
              <div className="text-right">
                <button
                  onClick={handleDownloadClientDetails}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                >
                  Baixar Detalhes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Adicionar Novo Contrato */}
        {showNewContractModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
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
                <input
                  type="text"
                  id="contractType"
                  name="contractType"
                  value={newContractData.contractType}
                  onChange={handleContractChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                />
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
                    Data de Fim:
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
              {/* Adicione outros campos do contrato aqui */}
              <div className="text-right">
                <button
                  onClick={handleCreateContract}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                >
                  Criar Contrato
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminClients;