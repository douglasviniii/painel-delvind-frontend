import React from 'react';
import { BudgetItem } from '../../types/budget';

interface BudgetItemTableProps {
    items: BudgetItem[];
    total: number;
}

const BudgetItemTable: React.FC<BudgetItemTableProps> = ({ items, total }) => {
    return (
        <div className="mb-4">
            <h3 className="font-medium mb-2">Itens do Orçamento</h3>
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
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4">{item.description}</td>
                                <td className="px-6 py-4 text-right">R$ {item.value.toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2} className="px-6 py-4 text-right font-semibold">Total:</td>
                            <td className="px-6 py-4 text-right font-semibold">R$ {total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BudgetItemTable;