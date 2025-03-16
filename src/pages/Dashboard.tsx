import React, { useState, useRef, useEffect } from 'react';
import { Link} from 'react-router-dom';
import { Plus, FileText, Eye, Download, Pencil, Send, Trash, Menu } from 'lucide-react';
import Layout from '../components/Layout';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import axios from 'axios';
import Cookie from 'js-cookie';
import { Save, ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Report {
  _id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  isDropdownOpen?: boolean; // Opcional, pois você adiciona isso dinamicamente
  // ... outros campos do seu relatório
}

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

const Dashboard: React.FC = () => {

  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const reportRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isAdmin, setIsAdmin] = useState(Boolean);
  const [reports, setReports] = useState<Report[]>([]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [idReport, setIdReport] = useState('');
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
      [{ 'table': true }]
    ],
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const isSmallScreen = () => {
    return screenSize.width < 1200 && screenSize.height < 750;
  };

  const handleResize = () => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



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
  
      const pageHeight = 297; // Altura de uma página A4
      const maxHeight = pageHeight - 10; // Limite para a imagem, com margem
  
      let remainingHeight = imgHeight;
      let yPosition = 0;
  
      // Adiciona a primeira página com o conteúdo ajustado
      const adjustedHeight = Math.min(remainingHeight, maxHeight);
      pdf.addImage(dataUrl, 'PNG', 0, yPosition, imgWidth, adjustedHeight);
      remainingHeight -= adjustedHeight; // Atualiza a altura restante
  
      // Adiciona novas páginas apenas se houver conteúdo restante
      while (remainingHeight > 0) {
        pdf.addPage(); // Adiciona uma nova página
        yPosition = 0;
  
        // Adiciona o conteúdo da próxima parte da imagem
        const nextHeight = Math.min(remainingHeight, maxHeight);
        pdf.addImage(dataUrl, 'PNG', 0, yPosition, imgWidth, nextHeight);
        remainingHeight -= nextHeight; // Atualiza o restante da altura da imagem
      }
  
      // Se houver conteúdo restante, o PDF será salvo
      if (remainingHeight <= 0) {
        pdf.save(`relatorio-${report.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        alert("PDF gerado com sucesso!");
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    }
  };

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
    if (!window.confirm('Tem certeza que deseja excluir este relatório?')) return;
  
    const storedUsers = localStorage.getItem("data");
    const user = storedUsers ? JSON.parse(storedUsers) : null;
  
    if (!user) {
      alert('Usuário não encontrado!');
      return;
    }
  
    const endpoint = user.role === 'admin'
      ? `${EndPointAPI}/reportadmin/delete/${id}`
      : `${EndPointAPI}/reportemployee/delete/${id}`;
  
    try {
      await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      });
      alert('Excluído com sucesso!');
      setReports(prev => prev.filter(report => report.id !== id));
    } catch (error) {
      console.error('Erro ao excluir o relatório:', error);
      alert('Ocorreu um erro ao excluir o relatório');
    }
  };

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
    const user = storedUsers ? JSON.parse(storedUsers) : null;
  
    if (!user) {
      console.error('Usuário não encontrado');
      return;
    }
  
    const endpoint = user.role === 'admin'
      ? `${EndPointAPI}/reportadmin/find`
      : `${EndPointAPI}/reportemployee/find`;
  
    if (user.role === 'admin') {
      setIsAdmin(true);
    }
  
    const headers = user.role !== 'admin' ? {
      Authorization: `Bearer ${Cookie.get('token')}`,
    } : {};
  
    try {
      const response = await axios.get(endpoint, { headers });
      setReports(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
    }
  };

/*   const handlefindalerts = async () => {
    try {
      return
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  } */

  const handleEdit = async (report: object) => {
    {
      if (!report) {
        alert('Relatório não encontrado.');
        return;
      }
      setIdReport(report._id);
      setTitle((report as { title: string }).title);
      setContent((report as {content: string }).content);
      setIsEditModalOpen(true);
    }
  };

  const handleEditClosed = async () =>{
    setTitle('');
    setContent('');    
    setIsEditModalOpen(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!window.confirm('Tem certeza que deseja atualizar este relatório?')) return;
    
    const data = {title,content};
    const id = idReport;

    const storedUsers = localStorage.getItem("data");
    const user = storedUsers ? JSON.parse(storedUsers) : null;
  
    if (!user) {
      alert('Usuário não encontrado!');
      return;
    }
  
    const endpoint = user.role === 'admin'
      ? `${EndPointAPI}/reportadmin/update/${id}`
      : `${EndPointAPI}/reportemployee/update/${id}`;
  
    try {
      await axios.patch(endpoint, data,{
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      });

      alert('Alteração realizada com sucesso!');
      LoadData();
      handleEditClosed();
    } catch (error) {
      console.error('Erro ao excluir o relatório:', error);
      alert('Ocorreu um erro ao excluir o relatório');
    }

  };

  const dropdownRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});



  const LoadData = async () => {
    handlefindreports(); 
  };
  useEffect(()=> {
    LoadData(); 
  },[])



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach((reportId) => {
        const dropdownRef = dropdownRefs.current[reportId].current;
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
          setReports((prevReports) =>
            prevReports.map((report) =>
              report._id === reportId
                ? { ...report, isDropdownOpen: false }
                : report
            )
          );
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reports]);

  const handleReportDropdownToggle = (reportId: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === reportId
          ? { ...report, isDropdownOpen: !report.isDropdownOpen }
          : report
      )
    );
  };
  
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

    {/*PARA EDIÇÃO DO RELATÓRIO*/}  
    {isEditModalOpen ? (
        <>
          <div className="mb-6 flex items-center">
            <button
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft onClick={()=> handleEditClosed()} size={24} />
            </button>
            <h1 className="text-2xl font-bold">Criar Novo Relatório</h1>
          </div>

          <form onSubmit={handleSubmit} className="card">
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Título do Relatório
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
                Conteúdo
              </label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                className="bg-white"
              />
              <p className="text-sm text-gray-500 mt-2">
                Use as ferramentas acima para formatar seu texto e adicionar tabelas.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="btn-secondary mr-2"
                onClick={()=> handleEditClosed()}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center"
              >
                <Save size={20} className="mr-2" />
                Salvar Alterações
              </button>
            </div>
          </form>                      
       </>
    ):(
    <>

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
            <div className="flex flex-col md:flex-row md:justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{report.title}</h2>
                <p className="text-gray-600 text-sm">
                  Criado por {report.author} em {new Date(report.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="relative">
                {isSmallScreen() && (
                  <button
                    onClick={() => handleReportDropdownToggle(report._id)} // Correção aqui: passe report._id
                    className="btn-secondary flex items-center"
                  >
                    <Menu size={18} className="mr-1" />
                    Opções
                  </button>
                )}
                <div
                  ref={(el) => {
                    if (!dropdownRefs.current[report._id]) {
                      dropdownRefs.current[report._id] = { current: null };
                    }
                    dropdownRefs.current[report._id].current = el;
                  }}
                  className={`absolute right-0 mt-2 bg-white rounded-md shadow-lg p-2 z-10 ${
                    report.isDropdownOpen ? '' : 'hidden'
                  }`}
                >
                  <div className="flex flex-col">
                    <button
                      onClick={() => setSelectedReport(selectedReport === report._id ? null : report._id)}
                      className="btn-secondary flex items-center mb-2"
                    >
                      <Eye size={18} className="mr-1" />
                      Visualizar
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(report._id)}
                      className="btn-secondary flex items-center mb-2"
                      disabled={selectedReport !== report._id}
                    >
                      <Download size={18} className="mr-1" />
                      Baixar PDF
                    </button>
                    <button
                      onClick={() => handleEdit(report)}
                      className="btn-secondary flex items-center mb-2"
                    >
                      <Pencil size={18} className="mr-1" />
                      Editar
                    </button>
                    {!isAdmin && (
                      <button onClick={() => handleSendReport(report._id)} className="btn-secondary flex items-center mb-2">
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

                {!isSmallScreen() && (
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
                    <>
                      <button
                        onClick={() => handleEdit(report)}
                        className="btn-secondary flex items-center"
                      >
                        <Pencil size={18} className="mr-1" />
                        Editar
                      </button>
                    </>
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
                )}

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
    </>
  )}
  </Layout> 
  );
};

export default Dashboard;