import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Eye, Trash, Download, Send } from 'lucide-react';
import Layout from '../components/Layout';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import axios from 'axios';
import Cookie from 'js-cookie';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

const Dashboard: React.FC = () => {

  //const navigate = useNavigate();

  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const reportRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isAdmin, setIsAdmin] = useState(Boolean);
  const [reports, setReports] = useState([]);

  //implementar na segunda versão!
/*   const [userAlerts, setUserAlerts] = useState([
    { id: 1, message: "Atualização disponível para seu sistema." },
    { id: 2, message: "Seu pagamento foi confirmado!" },
    { id: 3, message: "Nova mensagem recebida no suporte." }
  ]); */



/*   const handleMarkAlertAsRead = (id: string) => {
  //implementar na segunda versão
  }; */

  //excluir relatorio
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
      const storedUsers = localStorage.getItem("data");
      const objectUser = storedUsers ? JSON.parse(storedUsers) : null;
      const user = objectUser;

      if(user && user.role === 'admin'){
      try {
        await axios.delete(`${EndPointAPI}/reportadmin/delete/${id}`);
        alert('Excluído com sucesso!');
        location.reload();
      } catch (error) {
        alert('Ocorreu um erro ao excluir o relatório');
      }
    }else{
      try {
        await axios.delete(`${EndPointAPI}/reportemployee/delete/${id}`);
        alert('Excluído com sucesso!');
        location.reload();
      } catch (error) {
        alert('Ocorreu um erro ao excluir o relatório');
      }      
    }
    };
  }

  //Enviar relatório para o Admin
  const handleSendReport = async (id: string) => {
    try {
        await axios.post(`${EndPointAPI}/reportemployee/send/${id}`,{}, {
          headers:{
             Authorization: `Bearer ${Cookie.get('token')}`,
          }
        })
      alert('Relatório enviado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao enviar o relatório');
    }
  };

  //Buscar relatórios criados pelo colaborador
  const handlefindreports = async () => { 
    const storedUsers = localStorage.getItem("data");
    const objectUser = storedUsers ? JSON.parse(storedUsers) : null;
    const user = objectUser;

    if(user && user.role === 'admin'){
      setIsAdmin(true);
      try {
        const response = await axios.get(`${EndPointAPI}/reportadmin/find`);
        setReports(response.data);
      } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
      } 
    } else {
      try {
        const response = await axios.get(`${EndPointAPI}/reportemployee/find`,{
          headers:{
            Authorization: `Bearer ${Cookie.get('token')}`,
          }
        });
        setReports(response.data);
      } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
      }
    }
  }
  //baixar em PDF
  const handleDownloadPDF = async (id: string) => {
    const report = reports.find((r) => r._id === id);
    if (!report) return;

    const reportElement = reportRefs.current[id];
    if (!reportElement) {
      alert('Erro ao gerar PDF. Por favor, visualize o relatório primeiro.');
      return;
    }

    try {
      const dataUrl = await toPng(reportElement, {
        backgroundColor: '#fff',
        quality: 1.0,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (reportElement.offsetHeight * imgWidth) / reportElement.offsetWidth;

      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`relatorio-${report.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      alert("PDF gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    }
  };

  const handlefindalerts = async () => {
    try {
      return
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  }
  //Busca todos os dados ao atualizar a página
  useEffect(()=> {
    handlefindreports(); 
    handlefindalerts();
  },[])

  return (
     <Layout>
{/*
      //implementar na segunda versão
        {userAlerts.length > 0 && (
        <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Notificações</h2>
          <ul>
             {userAlerts.map(alert => (
              <li key={alert.id} className="flex justify-between items-center py-2 border-b border-yellow-200">
                <span>{alert.message}</span>
                <button onClick={() => handleMarkAlertAsRead(alert.id)} className="text-sm text-blue-600">Marcar como lida</button>
              </li>
            ))} 
          </ul>
        </div>
      )}  */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Relatórios</h1>
        <Link to="/reports/new" className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Criar Relatório
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="card text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhum relatório encontrado</h2>
          <p className="text-gray-600 mb-6">Comece criando seu primeiro relatório</p>
          <Link to="/reports/new" className="btn-primary inline-flex items-center">
            <Plus size={20} className="mr-2" />
            Criar Relatório
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reports.map((report) => (
            <div key={report._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{report.title}</h2>
                  <p className="text-gray-600 text-sm">
                    Criado por {report.author} em {new Date(report.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedReport(selectedReport === report._id ? null : report._id)}
                    className="btn-secondary flex items-center"
                  >
                    <Eye size={18} className="mr-1" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(report._id)}
                    className="btn-secondary flex items-center"
                    disabled={selectedReport !== report._id}
                  >
                    <Download size={18} className="mr-1" />
                    Baixar PDF
                  </button>
                  
                    {!isAdmin && (
                    <button onClick={() => handleSendReport(report._id)} className="btn-secondary flex items-center">
                      <Send size={18} className="mr-1" />
                      Enviar
                    </button>
                    )}

                  <button onClick={() => handleDelete(report._id)} className="btn-danger flex items-center">
                    <Trash size={18} className="mr-1" />
                      Excluir
                  </button>
                </div>
              </div>
              {selectedReport === report._id && (
                <div
                  ref={(el) => (reportRefs.current[report._id] = el)}
                  className="mt-4 p-4 border border-gray-200 rounded-md bg-white"
                  dangerouslySetInnerHTML={{ __html: report.content }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </Layout> 
  
  );
};

export default Dashboard;