export interface BudgetItem {
    id: string;
    name: string;
    description: string;
    value: number;
}

export interface Budget {
    id: string;
    clientName?: string;
    clientDocument?: string;
    clientEmail?: string;
    clientPhone?: string;
    technician: string;
    items: BudgetItem[];
    technicalNotes: string;
    total: number;
    createdAt: string;
    // recipientId: string; // Add recipientId
    
    
}

