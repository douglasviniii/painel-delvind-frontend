import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Users, Plus, UserPlus, ArrowLeft,Trash, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
//import { Bar } from 'react-chartjs-2';
//import { Customer } from '../types/index';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Modal from 'react-modal';
//import html2canvas from 'html2canvas';
//import jsPDF from 'jspdf';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
Modal.setAppElement('#root'); // Substitua '#root' pelo ID do elemento raiz da sua aplicação

const Finance: React.FC = () => {

  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  //const [notesToday, setNotesToday] = useState(0);
  //const [filter, setFilter] = useState('week'); // 'day', 'week', 'month', 'year'
  //const [notesLast7Days, setNotesLast7Days] = useState(0);
  //const [activeClients, setActiveClients] = useState(0);
  //const [forecast48h, setForecast48h] = useState(0);

/*   const [chartData, setChartData] = useState({
    labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    datasets: [{
      label: 'Notas Emitidas',
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }],
  }); */

  //const [showChartModal, setShowChartModal] = useState(false);

  const [paymentLinkData, setPaymentLinkData] = useState({
    name: '',
    amount: 0,
  });

  //const [totalEntradas, setTotalEntradas] = useState(0);
  //const [totalSaidas, setTotalSaidas] = useState(0);
  
  //const chartRef = useRef(null); // Referência para o gráfico

/*   useEffect(() => {
    fetchTransactions();
    fetchCustomers();
  }, []); */

/*   useEffect(() => {
    updateDashboardData();
    generateChartData();
  }, [transactions, filter]);  */
  

  // const fetchTransactions = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${API_URL}/transactions`, {
  //       params: { api_key: API_KEY },

  //       const fakeTransaction = {
  //         id: 'fake-transaction-123',
  //         amount: 5000, // 50 reais em centavos
  //         status: 'paid',
  //         created_at: new Date().toISOString(),
  //       };
  //     });
  //     setTransactions(response.data);
  //   } catch (error) {
  //     console.error('Erro ao buscar transações:', error);
  //   }
  //   setLoading(false);
  // };

/*   const fetchTransactions = async () => {
    setLoading(true);
  
    // Declarar um array de transações fake
    const fakeTransactions = [
      {
        id: 'fake-transaction-123',
        amount: 5000, // 50 reais em centavos
        status: 'paid',
        created_at: new Date().toISOString(),
      },
      {
        id: 'fake-transaction-456',
        amount: 10000, // 100 reais em centavos
        status: 'denied',
        created_at: new Date().toISOString(),
      },
      {
          id: 'fake-transaction-789',
          amount: 2500, // 25 reais em centavos
          status: 'pending',
          created_at: new Date().toISOString(),
      }
    ];
  
    try {
      // Buscar transações da API
      const response = await axios.get(`${API_URL}/transactions`, {
        params: { api_key: API_KEY },
      });
  
      // Verificar se a resposta da API contém dados
      if (response.data.data && response.data.data.length > 0) {
        // Combinar as transações fake com as transações da API
        setTransactions([...fakeTransactions, ...response.data.data]);
      } else {
        // Se não houver dados da API, usar apenas as transações fake
        setTransactions(fakeTransactions);
      }
  
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      // Em caso de erro, usar apenas as transações fake
      setTransactions(fakeTransactions);
    }
    setLoading(false);
  }; */
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentLinkData({
      ...paymentLinkData,
      [e.target.name]: e.target.value,
    });
  };

/*   const fetchCustomers = async () => {
    try {
      const response = await axios.get<{ data: Customer[] }>(`${API_URL}/customers`, {
        params: { api_key: API_KEY },
      });
      const activeCustomers = response.data.data.filter((customer: Customer) => {
        const lastTransactionDate = new Date(customer.last_transaction.created_at);
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return lastTransactionDate >= thirtyDaysAgo;
      });
      setActiveClients(activeCustomers.length);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  }; */

/*   const updateDashboardData = () => {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);

    let todayCount = 0;
    let last7DaysCount = 0;

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.created_at);
      if (transactionDate.toDateString() === today.toDateString()) {
        todayCount++;
      }
      if (transactionDate >= last7Days) {
        last7DaysCount++;
      }
    });

    setNotesToday(todayCount);
    setNotesLast7Days(last7DaysCount);

    const last7DaysTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      return transactionDate >= sevenDaysAgo;
    });
    const totalLast7Days = last7DaysTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const averagePerDay = totalLast7Days / 7;
    const forecast = averagePerDay * 2;
    setForecast48h(forecast / 100);
  }; */

  const handleGeneratePaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${EndPointAPI}/payment/create`,{name:paymentLinkData.name, amount:paymentLinkData.amount})
      window.open(response.data.response.url, '_blank');
    } catch (error) {
      console.error('Erro ao gerar link de pagamento:', error);
      alert('Erro ao gerar link de pagamento.');
    }
  };

  const handleDesactivePaymentLink = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
    try {
      await axios.patch(`${EndPointAPI}/payment/desactivate/${id}`);
      alert('Link de pagamento desativado com sucesso!');
      location.reload();
    } catch (error) {
      alert('Ocorreu um erro ao desativar esse link de pagamento');
    }
  }
}

/*   const generateChartData = () => {
    const today = new Date();
    let startDate;
    let labels = [];
    let dailyCounts = [];
    let dailyEntradas = [];
    let dailySaidas = [];
    let dailyTotal = [];
  
    switch (filter) {
      case 'day':
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        labels = ['Hoje'];
        dailyCounts = [0];
        dailyEntradas = [0];
        dailySaidas = [0];
        dailyTotal = [0];
        break;
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        dailyCounts = Array(7).fill(0);
        dailyEntradas = Array(7).fill(0);
        dailySaidas = Array(7).fill(0);
        dailyTotal = Array(7).fill(0);
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        labels = Array.from({ length: today.getDate() }, (_, i) => String(i + 1));
        dailyCounts = Array(today.getDate()).fill(0);
        dailyEntradas = Array(today.getDate()).fill(0);
        dailySaidas = Array(today.getDate()).fill(0);
        dailyTotal = Array(today.getDate()).fill(0);
        break;
      case 'year':
        startDate = new Date(today);
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        dailyCounts = Array(12).fill(0);
        dailyEntradas = Array(12).fill(0);
        dailySaidas = Array(12).fill(0);
        dailyTotal = Array(12).fill(0);
        break;
      default:
        return;
    }
  
    let entradasTotal = 0;
    let saidasTotal = 0;
  
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.created_at);
      if (transactionDate >= startDate) {
        let index;
        switch (filter) {
          case 'day':
            index = 0;
            break;
          case 'week':
            index = transactionDate.getDay();
            break;
          case 'month':
            index = transactionDate.getDate() - 1;
            break;
          case 'year':
            index = transactionDate.getMonth();
            break;
          default:
            return;
        }
        dailyCounts[index]++;
        if (transaction.status === 'paid') {
          dailyEntradas[index] = (dailyEntradas[index] || 0) + (transaction.amount / 100);
          entradasTotal += (transaction.amount / 100);
        } else if (transaction.status === 'denied') {
          dailySaidas[index] = (dailySaidas[index] || 0) + (transaction.amount / 100);
          saidasTotal += (transaction.amount / 100);
        }
        dailyTotal[index] = (dailyEntradas[index] || 0) - (dailySaidas[index] || 0);
      }
    });
  
    setTotalEntradas(entradasTotal);
    setTotalSaidas(saidasTotal);
  
    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Notas Emitidas',
          data: dailyCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Entradas (R$)',
          data: dailyEntradas,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Saídas (R$)',
          data: dailySaidas,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Total (R$)',
          data: dailyTotal,
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        },
      ],
    });
  };
 */
/*   const openChartModal = () => {
    setShowChartModal(true);
  };

  const closeChartModal = () => {
    setShowChartModal(false);
  };

  const downloadChartAsPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('chart.pdf');
    }
  }; */

  useEffect(()=>{
    async function LoadData() {
      setLoading(true);
      const data = await axios.get(`${EndPointAPI}/payment/find`);
      setTransactions(data.data.response.content);
      setLoading(false);
    }
    LoadData();
  },[]);

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <button onClick={() => navigate('/admin')} className="mr-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Painel de Controle</h1>
      </div>


{/*       
      <Dashboard
        notesToday={notesToday}
        notesLast7Days={notesLast7Days}
        activeClients={activeClients}
        forecast48h={forecast48h}
      />

      
      <div className="mb-6">
        <button onClick={openChartModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Exibir Gráfico
        </button>
      </div>

       <Modal
        isOpen={showChartModal}
        onRequestClose={closeChartModal}
        contentLabel="Gráfico de Notas Emitidas"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0"
      >
        <div className="bg-white p-6 rounded-lg w-4/5 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Notas Emitidas</h2>
          <div className="mb-4 flex space-x-2">
            <button onClick={() => setFilter('day')} className={`px-3 py-1 rounded ${filter === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Dia</button>
            <button onClick={() => setFilter('week')} className={`px-3 py-1 rounded ${filter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Semana</button>
            <button onClick={() => setFilter('month')} className={`px-3 py-1 rounded ${filter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Mês</button>
            <button onClick={() => setFilter('year')} className={`px-3 py-1 rounded ${filter === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Ano</button>
          </div>
          <div ref={chartRef}>
            <Bar data={chartData} />
          </div>
          <div className="mt-4">
            <p>Entradas: R$ {totalEntradas.toFixed(2)}</p>
            <p>Saídas: R$ {totalSaidas.toFixed(2)}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={downloadChartAsPDF} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
              Baixar PDF
            </button>
            <button onClick={closeChartModal} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
              Fechar
            </button>
          </div>
        </div>
      </Modal> */}

      {/* Gerar Link de Pagamento */}
      <PaymentLinkForm
        paymentLinkData={paymentLinkData}
        handleInputChange={handleInputChange}
        handleGeneratePaymentLink={handleGeneratePaymentLink}
      />

      
      <TransactionsList loading={loading} transactions={transactions} 
      handleDesactivePaymentLink={handleDesactivePaymentLink}
      /> 
    </Layout>
  );
};

/* // Componente Dashboard
const Dashboard: React.FC<{
  notesToday: number;
  notesLast7Days: number;
  activeClients: number;
  forecast48h: number;
}> = ({ notesToday, notesLast7Days, activeClients, forecast48h }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border rounded">
        <h2 className="text-lg font-semibold">Notas Hoje</h2>
        <p className="text-2xl">{notesToday}</p>
      </div>
      <div className="p-4 border rounded">
        <h2 className="text-lg font-semibold">Últimos 7 dias</h2>
        <p className="text-2xl">{notesLast7Days}</p>
      </div>
      <div className="p-4 border rounded">
        <h2 className="text-lg font-semibold">Clientes Ativos</h2>
        <p className="text-2xl">{activeClients}</p>
      </div>
      <div className="p-4 border rounded">
        <h2 className="text-lg font-semibold">Previsão 48h</h2>
        <p className="text-2xl">R$ {forecast48h}</p>
      </div>
    </div>
  );
}; */

// Componente Formulário de Link de Pagamento
const PaymentLinkForm: React.FC<{
  paymentLinkData: { name: string, amount: number};
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGeneratePaymentLink: (e: React.FormEvent) => Promise<void>;
}> = ({ paymentLinkData, handleInputChange, handleGeneratePaymentLink }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Gerar Link de Pagamento</h2>
      <form onSubmit={handleGeneratePaymentLink} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome para o pagamento
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={paymentLinkData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
          />
          
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Valor (R$)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={paymentLinkData.amount}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Gerar Link
        </button>
      </form>
    </div>
  );
};

   // Componente Lista de Transações
const TransactionsList: React.FC<{
  loading: boolean;
  transactions: any[];
  handleDesactivePaymentLink: (e: React.FormEvent) => Promise<void>;
}> = ({ loading, transactions, handleDesactivePaymentLink }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transações</h2>
      {loading ? (
        <p className="text-gray-600">Carregando transações...</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {transactions.map((t) => (
            <li key={t.id} className="py-3">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t.name}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {(t.total_amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Criado em {new Date(t.created_at).toLocaleDateString()}
                  </p>
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-500">
                    {t.url}
                    </a>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {t.status}
                  </span>
                    {t.status === 'active' && (
                    <button onClick={() => handleDesactivePaymentLink(t.id)} className="text-red-500 hover:text-red-700">
                      <XCircle size={18} /> 
                    </button>
                    )}
                </div>

              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};  

export default Finance;