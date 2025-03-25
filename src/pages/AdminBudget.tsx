import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import BudgetList from '../components/BudgetList';
import BudgetForm from '../components/BudgetForm';
import ChartDisplay from '../components/ChartDisplay';
import { ArrowLeft, Plus, FileText, BarChart2 } from 'lucide-react';
import { Budget, BudgetItem } from '../types/budget';
import axios from 'axios';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminBudget: React.FC = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [budgets, setBudgets] = useState([]);

  const [newBudget, setNewBudget] = useState<Budget>({
    id: '',
    clientName: '',
    clientDocument: '',
    clientEmail: '',
    clientPhone: '',
    technician: user?.displayName || '',
    items: [],
    technicalNotes: '',
    total: 0,
    createdAt: '',
  });

  const [currentItem, setCurrentItem] = useState<BudgetItem>({
    name: '',
    description: '',
    value: 0,
    id: ''
  });

  const [expandedBudgets, setExpandedBudgets] = useState<{ [key: string]: boolean }>({});
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editedBudget, setEditedBudget] = useState<Budget | null>(null);
  const [showChart, setShowChart] = useState(false);

  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [{
      label: 'Valor Total dos Orçamentos',
      data: [] as number[],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  });

  const addItem = () => {
    if (!currentItem.name || !currentItem.description || !currentItem.value) {
      alert('Por favor, preencha todos os campos do item');
      return;
    }
    setNewBudget((prev) => ({
      ...prev,
      items: [...prev.items, { ...currentItem, id: Date.now().toString() }],
    }));
    setCurrentItem({ name: '', description: '', value: 0, id: '' });
  };

  const removeItem = (id: string) => {
    setNewBudget((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  };

  const calculateTotal = (items: BudgetItem[]) => {
    return items.reduce((sum, item) => sum + item.value, 0);
  };

  const loadData = async () => {
    try {
      const response = await axios.get(`${EndPointAPI}/budget/find`);
      
      const sortedBudgets = response.data.sort((a: { createdAt: string }, b: { createdAt: string }) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setBudgets(sortedBudgets);
    } catch (error) {
      console.error('Erro ao carregar os orçamentos:', error);
      alert('Ocorreu um erro ao carregar os orçamentos!');
    }
  };

  const handleCreateBudget = async () => {

    if (!newBudget.technician || newBudget.items.length === 0) {
      alert('Por favor, preencha o técnico responsável e adicione pelo menos um item');
      return;
    }

    try {

      await axios.post(`${EndPointAPI}/budget/create`, {
        ...newBudget,
        total: calculateTotal(newBudget.items),
      });

      alert('Orçamento criado com sucesso!');


    } catch (error) {

      console.error('Erro ao criar orçamento:', error);
      alert('Ocorreu um erro ao criar orçamento! Por favor, tente novamente.');
    }

    resetBudgetForm();

    setShowCreateModal(false);
    loadData();
  };

  const resetBudgetForm = () => {
    setNewBudget({
      id: '',
      clientName: '',
      clientDocument: '',
      clientEmail: '',
      clientPhone: '',
      technician: user?.displayName || '',
      items: [],
      technicalNotes: '',
      total: 0,
      createdAt: '',
    });
  };


  const deleteBudget = async (id: string) => {
    const confirmation = window.confirm('Tem certeza que deseja excluir este orçamento?');
    if (!confirmation) return;

    try {
      await axios.delete(`<span class="math-inline">\{EndPointAPI\}/budget/delete/</span>{id}`);
      alert('Orçamento excluído com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro ao excluir o orçamento:', error);
      alert('Ocorreu um erro ao excluir o orçamento!');
    }
  };

  const downloadPDF = (budget: Budget) => {
    const doc = new jsPDF();

    const img = new Image();
    img.src = '/logo-delvind.png';
    img.onload = () => {
      // Logotipo
      doc.addImage(img, 'PNG', 0, 0, 35, 35);

      // Título "ORÇAMENTO"
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 128); // Azul escuro
      doc.text("ORÇAMENTO", 40, 10);

      // Informações da empresa (Preto)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0); // Preto
      doc.text("DELVIND TECNOLOGIA DA INFORMAÇÃO LTDA", 120, 10);

      // Informações do cliente (Preto)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 128); // Azul escuro
      doc.text("CLIENTE: " + (budget.clientName || "DETALHESDOCHIMA"), 40, 15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 128); // Azul escuro
      doc.text("CNPJ: " + (budget.clientDocument || ""), 40, 20);
      doc.text("EMAIL: " + (budget.clientEmail || ""), 40, 25);
      doc.text("TEL: " + (budget.clientPhone || ""), 40, 30);
      doc.text("DATA: " + (budget.createdAt ? new Date(budget.createdAt).toLocaleDateString() : "07/03/2025"), 40, 35);
      doc.text("TÉCNICO: " + (budget.technician || "DOUGLAS"), 40, 40);
        // Informações da empresa (lado direito)
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold'); // Negrito
        doc.text("EMPRESA DELVIND", 150, 15);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal'); // Normal
        doc.text("CNPJ: 57.278.676/0001-69", 150, 20);
        doc.text("TEL: 45 8800-0647", 150, 25);
        doc.text("SITE: www.delvind.com", 150, 30);
        doc.text("E-MAIL: contato.delvind.com", 150, 35);

        // Cabeçalho da tabela
        doc.line(10, 70, 190, 70);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold'); // Negrito
        doc.text("Item", 30, 75);
        doc.text("Descrição", 90, 75);
        doc.text("Valor (R$)", 160, 75);
        doc.line(10, 77, 190, 77);

        // Linhas verticais do cabeçalho
        doc.line(65, 70, 65, 77);
        doc.line(145, 70, 145, 77);

        let y = 82;
        budget.items.forEach(item => {
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal'); // Normal
          doc.text(item.name, 30, y);
          doc.text(item.description, 90, y);
          doc.text(`R$ ${item.value.toFixed(2)}`, 160, y);
          y += 10;
          doc.line(10, y - 5, 190, y - 5);

          // Linhas verticais para cada item
          doc.line(65, y - 15, 65, y - 5);
          doc.line(145, y - 15, 145, y - 5);
        });

        // Linhas verticais nos cantos da tabela
        doc.line(10, 70, 10, y + 2);
        doc.line(190, 70, 190, y + 2);

        // Total final
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold'); // Negrito
        doc.text("Total Final", 27, y);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal'); // Normal
        doc.text("Valor total do projeto.", 80, y);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold'); // Negrito
        doc.text(`R$ ${budget.total.toFixed(2)}`, 158, y);
        doc.line(10, y + 2, 190, y + 2);
        doc.line(65, y + 2, 65, y - 5);
        doc.line(145, y + 2, 145, y - 5);

        // Descrição
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold'); // Negrito
        doc.text("DESCRIÇÃO", 10, y + 30);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal'); // Normal
        const description = budget.technicalNotes || "Não há descrição";
        const lines: string[] = doc.splitTextToSize(description, 180);
        y += 40;
        lines.forEach((line: string) => {
          doc.text(line, 10, y);
          y += 5;
        });

        doc.save(`orcamento_${budget.id}.pdf`);
      };
    };

    const toggleExpand = (id: string) => {
      setExpandedBudgets((prevExpanded) => ({
        ...prevExpanded,
        [id]: !prevExpanded[id],
      }));
    };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudgetId(budget._id);
    setEditedBudget(budget);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editedBudget) {
      alert('Nenhuma alteração foi feita.');
      return;
    }

    try {
      await axios.patch(`<span class="math-inline">\{EndPointAPI\}/budget/update/</span>{id}`, editedBudget);

      alert('Alteração realizada com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      alert('Ocorreu um erro ao atualizar orçamento! Por favor, tente novamente.');
    }

    setEditingBudgetId(null);
    setEditedBudget(null);
  };

  const handleShowChart = () => {
    setShowChart(!showChart);
    if (!showChart) {
      const labels = budgets.map((budget) => budget.clientName ? budget.clientName : `Orçamento ${budget.id}`);
      const data = budgets.map((budget) => budget.total);
      setChartData({ labels: labels, datasets: [{ label: 'Valor Total dos Orçamentos', data: data, backgroundColor: 'rgba(54, 162, 235, 0.5)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 }] });
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  
  const chartOptions = { responsive: true, plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Valor Total dos Orçamentos' } } };

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin')} className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-center sm:text-left">Orçamentos</h1>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap sm:flex-nowrap justify-center sm:justify-end w-full sm:w-auto">
          <button onClick={() => setShowCreateModal(true)} className="btn-primary sm:w-auto w-full sm:mr-2 mb-2 sm:mb-0">
            <Plus size={20} className="mr-1" /> Novo
          </button>
          <button onClick={handleShowChart} className="btn-secondary sm:w-auto w-full sm:mr-2 mb-2 sm:mb-0">
            <BarChart2 size={20} className="mr-1" /> Gráfico
          </button>
          <button onClick={() => downloadPDF({ id: 'all', items: budgets.flatMap(budget => budget.items), total: budgets.reduce((acc, budget) => acc + budget.total, 0), createdAt: new Date().toISOString(), technician: user?.displayName || '', technicalNotes: budgets.map(b => b.technicalNotes).join('\n'), clientName: 'Todos os Clientes' })} className="btn-secondary sm:w-auto w-full">
            <FileText size={20} className="mr-1" /> Relatório
          </button>
        </div>
      </div>

      {showChart && <ChartDisplay chartData={chartData} chartOptions={chartOptions} />}

      {budgets.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">Nenhum orçamento encontrado.</p>
        </div>
      ) : (
        <BudgetList
          budgets={budgets}
          expandedBudgets={expandedBudgets}
          toggleExpand={toggleExpand}
          handleEditBudget={handleEditBudget}
          downloadPDF={downloadPDF}
          deleteBudget={deleteBudget}
        />
      )}

      {showCreateModal && (
        <BudgetForm
          newBudget={newBudget}
          setNewBudget={setNewBudget}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          addItem={addItem}
          removeItem={removeItem}
          calculateTotal={calculateTotal}
          handleCreateBudget={handleCreateBudget}
          setShowCreateModal={setShowCreateModal}
        />
      )}

      {editingBudgetId && editedBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Orçamento</h2>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Dados do Cliente (Opcional)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Nome do Cliente</label>
                  <input type="text" value={editedBudget.clientName} onChange={(e) => setEditedBudget({ ...editedBudget, clientName: e.target.value })} className="input-field" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Documento</label>
                  <input type="text" value={editedBudget.clientDocument} onChange={(e) => setEditedBudget({ ...editedBudget, clientDocument: e.target.value })} className="input-field" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input type="email" value={editedBudget.clientEmail} onChange={(e) => setEditedBudget({ ...editedBudget, clientEmail: e.target.value })} className="input-field" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Telefone</label>
                  <input type="tel" value={editedBudget.clientPhone} onChange={(e) => setEditedBudget({ ...editedBudget, clientPhone: e.target.value })} className="input-field" />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Itens do Orçamento</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {editedBudget.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                        <td className="px-6 py-4">{item.description}</td>
                        <td className="px-6 py-4 text-right">R$ {item.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Observações Técnicas</label>
              <textarea value={editedBudget.technicalNotes} onChange={(e) => setEditedBudget({ ...editedBudget, technicalNotes: e.target.value })} className="input-field" rows={4} />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setEditingBudgetId(null)} className="btn-secondary">Cancelar</button>
              <button type="button" onClick={() => handleSaveEdit(editedBudget._id)} className="btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminBudget;