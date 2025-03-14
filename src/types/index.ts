export interface Report {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  created_at?: string; // For Supabase compatibility
  createdBy: string;
  created_by?: string; // For Supabase compatibility
  authorName: string;
  author_name?: string; // For Supabase compatibility
  sentToAdmin?: boolean; // <-- Adiciona esta linha
}


export interface Customer {
  id: string;
  name: string;
  email: string;
  document: string;
  created_at: string;
  updated_at: string;
  // ... outros campos que você precisa usar
  last_transaction: {
    created_at: string;
    // ... outros campos da última transação
  };
}


export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string[];
  assigned_to?: string[]; // For Supabase compatibility
  dueDate: string;
  due_date?: string; // For Supabase compatibility
  createdAt: string;
  created_at?: string; // For Supabase compatibility
  createdBy: string;
  created_by?: string; // For Supabase compatibility
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'closed';
  createdAt: string;
  created_at?: string; // For Supabase compatibility
  createdBy: string;
  created_by?: string; // For Supabase compatibility
  authorName: string;
  author_name?: string; // For Supabase compatibility
}

export interface Team {
  id: string;
  name: string;
  members: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  displayName: string;
  role: 'admin' | 'user';
  team?: string;

}

export interface Alert {
  id: string;
  message: string;
  userId: string;
  user_id?: string; // For Supabase compatibility
  read: boolean;
  createdAt: string;
  created_at?: string; // For Supabase compatibility
  user: User;
}

