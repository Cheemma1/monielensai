export interface AddTransactionPayload {
  type: 'expense' | 'income';
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  notes?: string;
}

export interface UpdateTransactionPayload {
  type?: 'expense' | 'income';
  amount?: number;
  category?: string;
  date?: string;
  merchant?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
