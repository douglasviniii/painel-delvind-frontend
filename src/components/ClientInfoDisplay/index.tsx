import React from 'react';
import { Budget } from '../../types/budget';

interface ClientInfoDisplayProps {
    budget: Budget;
}

const ClientInfoDisplay: React.FC<ClientInfoDisplayProps> = ({ budget }) => {
    return (
        (budget.clientName || budget.clientDocument || budget.clientEmail || budget.clientPhone) && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Dados do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budget.clientName && (
                        <div key="clientName">
                            <span className="font-semibold">Nome:</span> {budget.clientName}
                        </div>
                    )}
                    {budget.clientDocument && (
                        <div key="clientDocument">
                            <span className="font-semibold">Documento:</span> {budget.clientDocument}
                        </div>
                    )}
                    {budget.clientEmail && (
                        <div key="clientEmail">
                            <span className="font-semibold">Email:</span> {budget.clientEmail}
                        </div>
                    )}
                    {budget.clientPhone && (
                        <div key="clientPhone">
                            <span className="font-semibold">Telefone:</span> {budget.clientPhone}
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default ClientInfoDisplay;