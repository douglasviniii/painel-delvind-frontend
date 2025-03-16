import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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
const charactersPerPage = 2000; // Defina o limite de caracteres por página do pdf

const EndPointAPI = import.meta.env.VITE_END_POINT_API;
// const EndPointAPI = "http://localhost:3000";


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
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    //const receivedReports = getAdminReceivedReports();
    const storedUsers = localStorage.getItem("data");
    const objectUser = storedUsers ? JSON.parse(storedUsers) : null;
    const user = objectUser;


    //authenticação para evitar entradas que n sejam user admin
    useEffect(() => {

        if (storedUsers) {
            try {

                if (user && user.role === "admin") {
                    // Usuário é admin, acesso permitido
                    console.log("Usuário é admin, acesso permitido.");
                } else {
                    // Usuário não é admin, redireciona
                    console.log("Usuário não é admin, redirecionando...");
                    navigate('/login'); // Ou outra página apropriada
                }
            } catch (error) {
                console.error("Erro ao analisar dados do usuário:", error);
                navigate('/login');
            }
        } else {
            console.log("Dados do usuário não encontrados, redirecionando...");
            navigate('/login');
        }
    }, [navigate]);



    useEffect(() => {
        const LoadData = async () => {
            try {
                const response = await axios.get(`${EndPointAPI}/reportadmin/find`);
                setReports(response.data);
                const response2 = await axios.get(`${EndPointAPI}/reportemployee/findsends`);
                setReportsrecived(response2.data);
                setReceivedReports(response2.data);
                const allusers = await axios.get(`${EndPointAPI}/employee/findall`);
                setAllUsers(allusers.data);
            } catch (error) {
                console.error('Erro ao buscar relatórios:', error);
            }
        }
        LoadData();
    }, [getUsers]);

    console.log(receivedReports);




    const generatePDF = async (report: any) => {
        try {
            if (!report?.report_id) throw new Error("Relatório inválido");

            const { title, author, date, content } = report.report_id;

            // Criando um elemento temporário para renderizar o conteúdo
            const tempDiv = document.createElement("div");
            tempDiv.style.width = "800px"; // Define um tamanho fixo para melhor renderização
            tempDiv.style.padding = "20px";
            tempDiv.style.fontFamily = "Arial, sans-serif";
            tempDiv.innerHTML = `
                <h1>${title || "Relatório"}</h1>
                <p><strong>Autor:</strong> ${author || "Desconhecido"}</p>
                <p><strong>Data:</strong> ${date ? new Date(date).toLocaleDateString("pt-BR") : "Sem data"}</p>
                <hr>
                <p style="white-space: pre-line;">${content || "Sem conteúdo"}</p>
            `;

            document.body.appendChild(tempDiv); // Adiciona ao body (invisível)

            const canvas = await html2canvas(tempDiv, { scale: 2 }); // Renderiza o conteúdo como imagem
            document.body.removeChild(tempDiv); // Remove o elemento temporário

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = 210; // Largura da página A4 em mm
            const pageHeight = 297; // Altura da página A4 em mm
            const margin = 10;
            const imgWidth = pageWidth - 2 * margin; // Ajusta a largura para caber na página
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calcula a altura proporcional

            let yPosition = 0;
            let pageNumber = 1;

            while (yPosition < imgHeight) {
                if (pageNumber > 1) pdf.addPage(); // Adiciona nova página após a primeira

                const section = document.createElement("canvas");
                const sectionHeight = Math.min(imgHeight - yPosition, pageHeight - 2 * margin); // Define altura da seção
                section.width = canvas.width;
                section.height = (sectionHeight * canvas.width) / imgWidth; // Ajusta para manter a proporção

                const sectionCtx = section.getContext("2d");
                sectionCtx?.drawImage(
                    canvas,
                    0,
                    yPosition * (canvas.width / imgWidth), // Captura apenas a parte necessária
                    canvas.width,
                    section.height,
                    0,
                    0,
                    section.width,
                    section.height
                );

                const sectionImgData = section.toDataURL("image/png");
                pdf.addImage(sectionImgData, "PNG", margin, margin, imgWidth, sectionHeight);
                yPosition += sectionHeight;
                pageNumber++;
            }

            pdf.save(`${title || "Relatorio"}.pdf`);
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
        }
    };

    const handleDeleteReport = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este relatório?")) {
            try {
                await axios.delete(`${EndPointAPI}/reportemployee/deletesends/${id}`);
                alert('Excluído com sucesso!');
                location.reload();
            } catch (error) {
                alert('Ocorreu um erro ao excluir o relatório');
            }
        }
    };


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
 
         const handleOpenAlertModal = () => {
         setShowAlertModal(true);
     };
 
     const handleCloseAlertModal = () => {
         setShowAlertModal(false);
     };
 
     const handleEditAlert = (alert: Alert) => {
         setEditingAlert(alert);
     };
 
     const handleCancelEdit = () => {
         setEditingAlert(null);
     }; */


    const handleCancelEdit = () => {
        setEditingAlert(null);
    };

    //Exibe os 3 ultimos Relatorios recebidos
    const reportsToDisplay = Array.isArray(receivedReports) ? receivedReports.slice(-3).reverse() : []


    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* <div className="card">
                    <div className="flex items-center mb-4">
                        <FileText size={24} className="text-primary mr-3" />
                        <h2 className="text-xl font-semibold">Relatórios</h2>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{reports.length}</div>
                    <p className="text-gray-600">Total de relatórios criados</p>
                </div> */}

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

                { <div className="card">
                    <div className="flex items-center mb-4">
                        <Bell size={24} className="text-primary mr-3" />
                        <h2 className="text-xl font-semibold">Alertas</h2>
                    </div>
                    <button
                        // onClick={handleOpenAlertModal}
                        className="text-primary hover:text-primary-dark"
                    >
                        Gerenciar alertas →
                    </button>
                </div> }
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <div className="flex items-center mb-4">
                        <Inbox size={24} className="text-primary mr-3" />
                        <h2 className="text-xl font-semibold">Relatórios Recebidos</h2>
                    </div>
                    <Link to="/admin/reports" className="text-primary hover:text-primary-dark">
                        Gerenciar Relatórios →
                    </Link>

                    {reportsToDisplay.map((report) => (
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
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-2xl relative">
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
                        <iframe
                            srcDoc={selectedReport.report_id.content}
                            style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
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

            {/* {showAlertModal && (
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