import React from 'react';
import { BudgetItem, Budget } from '../../types/budget';
import { Plus, Trash } from 'lucide-react';

interface BudgetFormProps {
    newBudget: Budget;
    setNewBudget: React.Dispatch<React.SetStateAction<Budget>>;
    currentItem: BudgetItem;
    setCurrentItem: React.Dispatch<React.SetStateAction<BudgetItem>>;
    addItem: () => void;
    removeItem: (id: string) => void;
    calculateTotal: (items: BudgetItem[]) => number;
    handleCreateBudget: () => void;
    setShowCreateModal: (show: boolean) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
    newBudget,
    setNewBudget,
    currentItem,
    setCurrentItem,
    addItem,
    removeItem,
    calculateTotal,
    handleCreateBudget,
    setShowCreateModal,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Novo Orçamento</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Dados do Cliente (Opcional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-2">Nome do Cliente</label>
                            <input type="text" value={newBudget.clientName || ''} onChange={(e) => setNewBudget({ ...newBudget, clientName: e.target.value })} className="input-field" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-2">Documento</label>
                            <input type="text" value={newBudget.clientDocument || ''} onChange={(e) => setNewBudget({ ...newBudget, clientDocument: e.target.value })} className="input-field" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-2">Email</label>
                            <input type="email" value={newBudget.clientEmail || ''} onChange={(e) => setNewBudget({ ...newBudget, clientEmail: e.target.value })} className="input-field" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-2">Telefone</label>
                            <input type="tel" value={newBudget.clientPhone || ''} onChange={(e) => setNewBudget({ ...newBudget, clientPhone: e.target.value })} className="input-field" />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-600 font-medium mb-2">Técnico Responsável</label>
                    <input type="text" value={newBudget.technician} onChange={(e) => setNewBudget({ ...newBudget, technician: e.target.value })} className="input-field" />
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Itens do Orçamento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input type="text" placeholder="Nome do Item" value={currentItem.name} onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Descrição" value={currentItem.description} onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })} className="input-field" />
                        <input type="number" placeholder="Valor" value={currentItem.value} onChange={(e) => setCurrentItem({ ...currentItem, value: parseFloat(e.target.value) })} className="input-field" />
                    </div>
                    <button onClick={addItem} className="btn-primary mb-4">
                        <Plus size={20} className="mr-1" /> Adicionar Item
                    </button>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {newBudget.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                        <td className="px-6 py-4">{item.description}</td>
                                        <td className="px-6 py-4 text-right">R$ {item.value.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800">
                                                <Trash size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-600 font-medium mb-2">Observações Técnicas</label>
                    <textarea value={newBudget.technicalNotes} onChange={(e) => setNewBudget({ ...newBudget, technicalNotes: e.target.value })} className="input-field" rows={4} />
                </div>

                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancelar</button>
                    <button type="button" onClick={handleCreateBudget} className="btn-primary">Criar Orçamento</button>
                </div>
            </div>
        </div>
    );
};

export default BudgetForm;