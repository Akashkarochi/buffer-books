export type TransactionType = 'debit' | 'credit';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  partyName: string;
  category: string;
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  partyName: string;
  category: string;
  reference?: string;
  notes?: string;
}
