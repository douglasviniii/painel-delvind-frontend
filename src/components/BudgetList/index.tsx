import React from 'react';
import { Budget } from '../../types/budget'; // Assumindo que você tem um arquivo de tipos
import BudgetItemTable from '../BudgetItemTable';
import ClientInfoDisplay from '../ClientInfoDisplay';
import { ChevronDown, ChevronUp, Edit, Download, Send, Trash } from 'lucide-react';

interface BudgetListProps {
    budgets: Budget[];
    expandedBudgets: string[];
    toggleExpand: (id: string) => void;
    handleEditBudget: (budget: Budget) => void;
    downloadPDF: (budget: Budget, description: string) => void; // Atualiza a tipagem
    deleteBudget: (id: string) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({
    budgets,
    expandedBudgets,
    toggleExpand,
    handleEditBudget,
    downloadPDF,
    deleteBudget,
}) => {
    return (
        <div className="grid grid-cols-1 gap-6">
            {budgets.map((budget) => (
                <div key={budget.id} className="card">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-semibold">
                                {budget.clientName
                                    ? `Orçamento - ${budget.clientName}`
                                    : 'Orçamento Padrão'}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Criado em {new Date(budget.createdAt).toLocaleDateString('pt-BR')} por {budget.technician}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <span className="text-lg font-semibold">R$ {budget.total.toFixed(2)}</span>
                            <button onClick={() => toggleExpand(budget.id)} className="ml-2 text-gray-600 hover:text-gray-900">
                                {expandedBudgets.includes(budget.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            <button onClick={() => handleEditBudget(budget)} className="ml-2 text-blue-600 hover:text-blue-800">
                                <Edit size={20} />
                            </button>
                        </div>
                    </div>

                    {expandedBudgets.includes(budget.id) && (
                        <>
                            <ClientInfoDisplay budget={budget} />
                            <BudgetItemTable items={budget.items} total={budget.total} />

                            {budget.technicalNotes && (
                                <div>
                                    <h3 className="font-medium mb-2">Observações Técnicas</h3>
                                    <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">{budget.technicalNotes}</div>
                                </div>
                            )}

                            <div className="flex space-x-2 mt-4">
                            <button onClick={() => downloadPDF(budget, 'Descrição padrão')} className="btn-secondary flex items-center">
                            <Download size={18} className="mr-1" /> Baixar
                                </button>

                               
                                <button onClick={() => {
                                    const subject = 'Orçamento Delvind';
                                    const body = `Prezado cliente,\n\nSegue o orçamento solicitado.\n\nAtenciosamente,\n${budget.technician}`;
                                    window.location.href = `mailto:${budget.clientEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                }} className="btn-secondary flex items-center">
                                    <Send size={18} className="mr-1" /> Enviar
                                </button>
                                <button onClick={() => deleteBudget(budget._id)} className="btn-danger flex items-center">
                                    <Trash size={18} className="mr-1" /> Excluir
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BudgetList;