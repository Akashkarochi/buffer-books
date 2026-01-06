import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { ReportGenerator } from '@/components/ReportGenerator';
import { Transaction, TransactionFormData } from '@/types/transaction';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  calculateTotals,
} from '@/lib/transactions';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const handleAddTransaction = (data: TransactionFormData) => {
    const newTransaction = addTransaction(data);
    setTransactions(prev => [newTransaction, ...prev]);
    setIsFormOpen(false);
    toast({
      title: 'Transaction Added',
      description: `Successfully recorded ${data.type === 'debit' ? 'payment' : 'receipt'} of ₹${data.amount.toLocaleString()}`,
    });
  };

  const handleEditTransaction = (data: TransactionFormData) => {
    if (!editingTransaction) return;
    
    const updated = updateTransaction(editingTransaction.id, data);
    if (updated) {
      setTransactions(prev =>
        prev.map(t => (t.id === updated.id ? updated : t))
      );
      toast({
        title: 'Transaction Updated',
        description: 'The transaction has been successfully updated.',
      });
    }
    setEditingTransaction(null);
    setIsFormOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const success = deleteTransaction(id);
    if (success) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: 'Transaction Deleted',
        description: 'The transaction has been removed.',
      });
    }
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const totals = calculateTotals(transactions);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Summary Section */}
          <SummaryCards
            totalDebit={totals.totalDebit}
            totalCredit={totals.totalCredit}
            balance={totals.balance}
          />

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="gap-2"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Add Transaction
              </Button>
            </div>
            
            <ReportGenerator transactions={transactions} />
          </div>

          {/* Transaction List */}
          <TransactionList
            transactions={transactions}
            onEdit={openEditForm}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </main>

      {/* Transaction Form Modal */}
      <TransactionForm
        open={isFormOpen}
        onClose={closeForm}
        onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        editingTransaction={editingTransaction}
      />

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Buffer Shipping Agency. All rights reserved.</p>
            <p className="mt-1">Secure Financial Transaction Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
