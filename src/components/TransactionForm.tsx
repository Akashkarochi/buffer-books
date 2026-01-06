import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Transaction, TransactionFormData, TransactionType } from '@/types/transaction';
import { categories } from '@/lib/transactions';
import { useToast } from '@/hooks/use-toast';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  editingTransaction?: Transaction | null;
}

const defaultFormData: TransactionFormData = {
  date: new Date().toISOString().split('T')[0],
  type: 'debit',
  description: '',
  amount: 0,
  partyName: '',
  category: '',
  reference: '',
  notes: '',
};

export const TransactionForm = ({
  open,
  onClose,
  onSubmit,
  editingTransaction,
}: TransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>(defaultFormData);
  const { toast } = useToast();

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        date: editingTransaction.date,
        type: editingTransaction.type,
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        partyName: editingTransaction.partyName,
        category: editingTransaction.category,
        reference: editingTransaction.reference || '',
        notes: editingTransaction.notes || '',
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editingTransaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a description',
        variant: 'destructive',
      });
      return;
    }

    if (formData.amount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Amount must be greater than zero',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.partyName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter the party name',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please select a category',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(formData);
    setFormData(defaultFormData);
  };

  const handleChange = (field: keyof TransactionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <DialogTitle className="text-xl font-heading">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={e => handleChange('date', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TransactionType) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">
                    <span className="text-destructive font-medium">Debit (Payment Made)</span>
                  </SelectItem>
                  <SelectItem value="credit">
                    <span className="text-success font-medium">Credit (Money Received)</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partyName">Party Name (Company/Vendor)</Label>
            <Input
              id="partyName"
              placeholder="Enter company or vendor name"
              value={formData.partyName}
              onChange={e => handleChange('partyName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of the transaction"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={e => handleChange('amount', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={value => handleChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference Number (Optional)</Label>
            <Input
              id="reference"
              placeholder="Invoice/Receipt number"
              value={formData.reference}
              onChange={e => handleChange('reference', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              rows={2}
              value={formData.notes}
              onChange={e => handleChange('notes', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant={formData.type === 'credit' ? 'success' : 'default'} className="flex-1">
              {editingTransaction ? 'Update' : 'Add'} Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
