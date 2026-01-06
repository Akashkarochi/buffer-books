import { Transaction, TransactionFormData } from '@/types/transaction';

const STORAGE_KEY = 'buffer_shipping_transactions';

export const generateId = (): string => {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const addTransaction = (data: TransactionFormData): Transaction => {
  const transactions = getTransactions();
  const now = new Date().toISOString();
  
  const newTransaction: Transaction = {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  
  transactions.unshift(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
};

export const updateTransaction = (id: string, data: TransactionFormData): Transaction | null => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  const updated: Transaction = {
    ...transactions[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  transactions[index] = updated;
  saveTransactions(transactions);
  return updated;
};

export const deleteTransaction = (id: string): boolean => {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  
  if (filtered.length === transactions.length) return false;
  
  saveTransactions(filtered);
  return true;
};

export const getTransactionById = (id: string): Transaction | null => {
  const transactions = getTransactions();
  return transactions.find(t => t.id === id) || null;
};

export const calculateTotals = (transactions: Transaction[]) => {
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'debit') {
        acc.totalDebit += t.amount;
      } else {
        acc.totalCredit += t.amount;
      }
      return acc;
    },
    { totalDebit: 0, totalCredit: 0 }
  );
  
  return {
    ...totals,
    balance: totals.totalCredit - totals.totalDebit,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const categories = [
  'Freight Charges',
  'Port Charges',
  'Agency Fees',
  'Customs Duty',
  'Handling Charges',
  'Documentation',
  'Insurance',
  'Vessel Expenses',
  'Crew Wages',
  'Fuel & Supplies',
  'Repairs & Maintenance',
  'Office Expenses',
  'Travel & Lodging',
  'Commission',
  'Miscellaneous',
];
