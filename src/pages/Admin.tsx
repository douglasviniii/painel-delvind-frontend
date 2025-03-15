import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import {
    Users,
    Bell,
    FileText,
    Inbox,
    Trash,
    X,
    AlertCircle,
    Pencil,
    Trash2,
    Send
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useData } from "../context/DataContext";
import { Alert, User } from "../types";
import axios from 'axios';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

const Admin: React.FC = () => {
    const {
        addAlert,
        getAdminReceivedReports,
        deleteReport,
        getUsers,
        getUserAlerts,
        deleteAlert,
        resendAlert,
        updateAlert,
    } = useData();

    const [alertMessage, setAlertMessage] = useState("");
    const [alertUserId, setAlertUserId] = useState("");

    const [selectedReport, setSelectedReport] = useState<any>(null);

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

    const [reports, setReports] = useState(Number);
    const [reportsrecived, setReportsrecived] = useState(Number);
    const [users, setAllUsers] = useState([]);
    const [receivedReports, setReceivedReports] = useState([]);

    const navigate = useNavigate();

    const storedUsers = localStorage.getItem("data");
    const objectUser = storedUsers ? JSON.parse(storedUsers) : null;
    const user = objectUser;

    useEffect(() => {
        const storedUsers = localStorage.getItem("data");
    
        if (!storedUsers) {
          console.log("Dados do usuário não encontrados, redirecionando...");
          return navigate('/login');
        }
    
        try {
          const user = JSON.parse(storedUsers);
          if (user?.role !== "admin") {
            console.log("Usuário não é admin, redirecionando...");
            return navigate('/login'); 
          }

        } catch (error) {
          console.error("Erro ao analisar dados do usuário:", error);
          return navigate('/login'); 
        }
      }, [navigate]);
    

    useEffect(() => {
        const LoadData = async () => {
          try {
            const [reportResponse, reportReceivedResponse, allUsersResponse] = await Promise.all([
              axios.get(`${EndPointAPI}/reportadmin/find`),
              axios.get(`${EndPointAPI}/reportemployee/findsends`),
              axios.get(`${EndPointAPI}/employee/findall`)
            ]);
    
            setReports(reportResponse.data);
            setReportsrecived(reportReceivedResponse.data);
            setReceivedReports(reportReceivedResponse.data);
            setAllUsers(allUsersResponse.data);
          } catch (error) {
            console.error('Erro ao buscar dados:', error);
          }
        };
    
        LoadData();
      }, []);

      const generatePDF = (report: any) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(report.report_id.title, 10, 10);
    
        doc.setFontSize(12);
        let content = report.report_id.content.replace(/<[^>]+>/g, ""); 
        content = content.replace(/&nbsp;/g, "\n"); 
    
        let yPosition = 20;
    
        const lines = doc.splitTextToSize(content, 180); 
    
        lines.forEach((line, index) => {
            if (yPosition > doc.internal.pageSize.height - 20) {
                doc.addPage(); 
                yPosition = 20; 
            }
    
            doc.text(line, 10, yPosition);
            yPosition += 10; 
        });

        doc.save(`${report.report_id.title}.pdf`);
    };
    
     
/*     const generatePDF = (report: any) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(report.report_id.title, 10, 10);
        doc.setFontSize(12);
        doc.text(report.report_id.content.replace(/<[^>]+>/g, ""), 10, 20);
        doc.save(`${report.report_id.title}.pdf`);
    }; */

    const handleSendAlert = async () => {
        if (!alertMessage.trim() || !alertUserId) {
          alert("Por favor, preencha todos os campos corretamente.");
          return;
        }
      
        try {
          await axios.post(`${EndPointAPI}/notifications/create`, {
            id: alertUserId,
            message: alertMessage,
          });
      
          setAlertMessage("");
          setAlertUserId("");
      
          alert("Alerta enviado com sucesso!");
      
        } catch (error) {
          // Log de erro no console
          console.error("Erro ao enviar alerta:", error);
      
          // Exibindo uma mensagem mais clara para o usuário
          const errorMessage = "Ocorreu um erro inesperado ao enviar o alerta. Tente novamente.";
          alert(errorMessage);
        }
      };

    const handleDeleteReport = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja excluir este relatório?")) return;
      
        try {
          await axios.delete(`${EndPointAPI}/reportemployee/deletesends/${id}`);

          alert('Relatório excluído com sucesso!');

          setReports((prevReports) => prevReports.filter(report => report._id !== id));
      
        } catch (error) {
          console.error('Erro ao excluir relatório:', error); // Log do erro para debug
          alert('Ocorreu um erro ao excluir o relatório. Tente novamente mais tarde.');
        }
      };

    const handleOpenAlertModal = () => {
        setShowAlertModal(true);
    };

/*  IMPLEMENTAR NA VERSAO 2.0
    const handleCloseAlertModal = () => {
        setShowAlertModal(false);
    };

    const handleEditAlert = (alert: Alert) => {
        setEditingAlert(alert);
    };

    const handleDeleteAlert = async (alertId: string) => {
        console.log("Excluindo alerta com ID:", alertId);
        if (window.confirm("Tem certeza que deseja excluir este alerta?")) {
            try {
                await deleteAlert(alertId);
                console.log("Alerta excluído com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir o alerta:", error);
            }
        }
    };
    
    const handleResendAlert = async (alert: Alert) => {
        try {
            await resendAlert(alert);
            console.log("Alerta reenviado com sucesso!");
        } catch (error) {
            console.error("Erro ao reenviar alerta:", error);
            console.log("Erro ao reenviar alerta.");
        }
    };

    const handleSaveAlert = async (alert: Alert) => {
        try {
            if (editingAlert) {
                await updateAlert(editingAlert); // Use a função updateAlert do DataContext
                setEditingAlert(null);
            }
        } catch (error) {
            console.error("Erro ao salvar alerta:", error);
            console.log("Erro ao salvar alerta.");
        }
    };

    const handleCancelEdit = () => {
        setEditingAlert(null);
    }; */

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card">
                    <div className="flex items-center mb-4">
                        <FileText size={24} className="text-primary mr-3" />
                        <h2 className="text-xl font-semibold">Relatórios</h2>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{reports.length}</div>
                    <p className="text-gray-600">Total de relatórios criados</p>
                </div>

                <div className="card">
                    <div className="flex items-center mb-4">
                        <Inbox size={24} className="text-primary mr-3" />
                        <h2 className="text-xl font-semibold">Recebidos</h2>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">
                        {reportsrecived.length}
                    </div>
                    <p className="text-gray-600">Relatórios recebidos</p>
                </div>

                <div className="card">
                    <div className="flex items-center mb-4">
                        <Users size={24} className="text-primary mr-3" />
                        <h2 className="text-xl font-semibold">Usuários</h2>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{users.length}</div>
                    <p className="text-gray-600">Total de usuários ativos</p>
                </div>

                <div className="card">
                    <div className="flex items-center mb-4">
                        <Bell size={24} className="text-primary mr-3" />
                        <h2 className="text-xl font-semibold">Alertas</h2>
                    </div>
                    <button
                        onClick={handleOpenAlertModal}
                        className="text-primary hover:text-primary-dark"
                    >
                        Gerenciar alertas →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
                <div className="flex items-center mb-6">
                    <Inbox size={24} className="text-primary mr-3" />
                    <h2 className="text-xl font-semibold">Relatórios Recebidos</h2>
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-4">
                    {receivedReports.map((report) => (
                    <div
                        key={report._id}
                        className="p-4 border border-gray-200 rounded-md flex justify-between items-start"
                    >
                        <div>
                        <h3 className="font-medium">{report.report_id.title}</h3>
                        <p className="text-sm text-gray-600">
                            Enviado por {report.report_id.author} em{" "}
                            {new Date(report.report_id.date).toLocaleDateString("pt-BR")}
                        </p>
                        </div>
                        <div className="flex space-x-2">
                        <button
                            onClick={() => setSelectedReport(report)}
                            className="text-primary hover:text-primary-dark text-sm"
                        >
                            Visualizar
                        </button>
                        <button
                            onClick={() => generatePDF(report)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                            Baixar PDF
                        </button>
                        <button
                            onClick={() => handleDeleteReport(report._id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            <Trash size={16} />
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                </div>


                <div className="card">
                    <div className="flex items-center mb-6">
                        <Bell size={24} className="text-primary mr-3" />
                        <h2 className="text-xl font-semibold">Enviar Alerta</h2>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="alertUserId"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Usuário
                        </label>
                        <select
                            id="alertUserId"
                            value={alertUserId}
                            onChange={(e) => setAlertUserId(e.target.value)}
                            className="input-field"
                            required
                        >
                            <option value="">Selecione um usuário</option>{users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="alertMessage"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Mensagem
                        </label>
                        <textarea
                            id="alertMessage"
                            value={alertMessage}
                            onChange={(e) => setAlertMessage(e.target.value)}
                            className="input-field"
                            rows={3}
                            placeholder="Ex: João, por favor passe no RH hoje."
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => handleSendAlert()}
                            className="btn-primary"
                        >
                            Enviar Alerta
                        </button>
                    </div>
                </div>
            </div>

            {selectedReport && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-2xl relative max-h-[90%] overflow-y-auto">
                    <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setSelectedReport(null)}
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-semibold mb-4">
                        {selectedReport.report_id.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                        Enviado por {selectedReport.report_id.author} em{" "}
                        {new Date(selectedReport.report_id.date).toLocaleDateString("pt-BR")}
                    </p>
                    <div
                        className="p-4 border border-gray-300 rounded-md bg-gray-100"
                        dangerouslySetInnerHTML={{
                        __html: selectedReport.report_id.content,
                        }}
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                        onClick={() => setSelectedReport(null)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                        >
                        Fechar
                        </button>
                    </div>
                    </div>
                </div>
                )}

            {/* IMPLEMENTAR NA VERSAO 2.0 */}
{/*             {showAlertModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-2xl relative">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                            onClick={handleCloseAlertModal}
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Alertas</h2>
                        {users.some(user => getUserAlerts(user._id).length > 0) ? (
                            <ul>
                                {users.map((user) => (
                                    getUserAlerts(user._id).map((alert: Alert) => (
                                        <li key={alert._id} className="mb-4">
                                            <div className="p-4 border border-gray-200 rounded-md">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <AlertCircle size={18} className="text-yellow-500 mr-2" />
                                                        {editingAlert?._id === alert._id ? (
                                                            <input
                                                                type="text"
                                                                value={editingAlert.message}
                                                                onChange={(e) => setEditingAlert({ ...editingAlert, message: e.target.value })}
                                                                className="input-field"
                                                            />
                                                        ) : (
                                                            <span className="font-medium">{alert.message}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center">
                                                        {editingAlert?._id === alert._id ? (
                                                            <>
                                                                <button onClick={() => handleSaveAlert(alert)} className="text-green-500 hover:text-green-700 mr-2">
                                                                    Salvar
                                                                </button>
                                                                <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700">
                                                                    Cancelar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => handleEditAlert(alert)} className="text-blue-500 hover:text-blue-700 mr-2">
                                                                    <Pencil size={16} />
                                                                </button>
                                                                <button onClick={() => handleDeleteAlert(alert._id)} className="text-red-500 hover:text-red-700 mr-2">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                                <button onClick={() => handleResendAlert(alert)} className="text-green-500 hover:text-green-700">
                                                                    <Send size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-600">
                                                    Enviado para: {alert.user.name} ({alert.user.email})
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-600">Não possui nenhum alerta no momento.</p>
                        )}
                    </div>
                </div>
            )} */}
        </Layout>
    );
};

export default Admin;