import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Trash, X } from "lucide-react";
import Layout from "../components/Layout";
import axios from "axios";
import html2canvas from "html2canvas";

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

const AdminReports: React.FC = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(
                    `${EndPointAPI}/reportemployee/findsends`
                );
                setReports(response.data);
                setFilteredReports(response.data);
            } catch (error) {
                console.error("Erro ao buscar relatórios:", error);
            }
        };
        fetchReports();
    }, []);

    useEffect(() => {
        let results = reports.filter((report) => {
            if (report.report_id && report.report_id.title) {
                return report.report_id.title.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
        });

        results.sort((a, b) => {
            let aValue, bValue;
            if (sortBy === "date") {
                aValue = a.report_id?.date ? new Date(a.report_id.date) : null;
                bValue = b.report_id?.date ? new Date(b.report_id.date) : null;
            } else if (sortBy === "title") {
                aValue = a.report_id?.title?.toLowerCase() || "";
                bValue = b.report_id?.title?.toLowerCase() || "";
            } else if (sortBy === "author") {
                aValue = a.report_id?.author?.toLowerCase() || "";
                bValue = b.report_id?.author?.toLowerCase() || "";
            }

            if (aValue === null || bValue === null) {
                return aValue === null ? 1 : -1;
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredReports(results);
    }, [searchTerm, sortBy, sortOrder, reports]);

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

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-6">Relatórios Recebidos</h1>

            <div className="mb-4 flex space-x-2">
                <input
                    type="text"
                    placeholder="Pesquisar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-field"
                >
                    <option value="date">Data</option>
                    <option value="title">Título</option>
                    <option value="author">Autor</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="input-field"
                >
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                </select>
            </div>

            <div className="card">
                {filteredReports.map((report) => (
                    <div
                        key={report._id}
                        className="p-4 border border-gray-200 rounded-md flex justify-between items-start"
                    >
                        <div>
                            {report.report_id && report.report_id.title ? (
                                <h3 className="font-medium">{report.report_id.title}</h3>
                            ) : (
                                <h3 className="font-medium">Título Indisponível</h3> 
                            )}
                            <p className="text-sm text-gray-600">
                                Enviado por {report.report_id?.author} em{" "}
                                {report.report_id?.date && new Date(report.report_id.date).toLocaleDateString("pt-BR")}
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
        </Layout>
    );
};

export default AdminReports;