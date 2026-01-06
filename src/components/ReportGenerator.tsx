import { useState } from 'react';
import { FileSpreadsheet, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate, calculateTotals } from '@/lib/transactions';
import { useToast } from '@/hooks/use-toast';

interface ReportGeneratorProps {
  transactions: Transaction[];
}

export const ReportGenerator = ({ transactions }: ReportGeneratorProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      if (!startDate && !endDate) return true;
      const txDate = new Date(t.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      return txDate >= start && txDate <= end;
    });
  };

  const generateCSV = () => {
    const filtered = getFilteredTransactions();
    if (filtered.length === 0) {
      toast({
        title: 'No Data',
        description: 'No transactions found for the selected date range.',
        variant: 'destructive',
      });
      return;
    }

    const totals = calculateTotals(filtered);
    
    const headers = ['Date', 'Type', 'Party Name', 'Description', 'Category', 'Reference', 'Amount', 'Notes'];
    const rows = filtered.map(t => [
      formatDate(t.date),
      t.type.toUpperCase(),
      t.partyName,
      t.description,
      t.category,
      t.reference || '',
      t.type === 'debit' ? `-${t.amount}` : `+${t.amount}`,
      t.notes || '',
    ]);

    // Add summary rows
    rows.push([]);
    rows.push(['', '', '', '', '', 'Total Debits:', totals.totalDebit.toString(), '']);
    rows.push(['', '', '', '', '', 'Total Credits:', totals.totalCredit.toString(), '']);
    rows.push(['', '', '', '', '', 'Net Balance:', totals.balance.toString(), '']);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    const dateRange = startDate && endDate 
      ? `_${startDate}_to_${endDate}` 
      : startDate 
        ? `_from_${startDate}` 
        : endDate 
          ? `_until_${endDate}` 
          : '';
    
    link.download = `buffer_shipping_report${dateRange}.csv`;
    link.click();

    toast({
      title: 'Report Generated',
      description: `Successfully exported ${filtered.length} transactions.`,
    });
    
    setIsOpen(false);
  };

  const filteredCount = getFilteredTransactions().length;
  const filteredTotals = calculateTotals(getFilteredTransactions());

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Generate Transaction Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                From Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                To Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <Card className="bg-muted/50 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Report Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Transactions:</span>
                <span className="font-semibold">{filteredCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Debits:</span>
                <span className="font-semibold text-destructive">
                  {formatCurrency(filteredTotals.totalDebit)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Credits:</span>
                <span className="font-semibold text-success">
                  {formatCurrency(filteredTotals.totalCredit)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span>Net Balance:</span>
                <span className={`font-bold ${filteredTotals.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(filteredTotals.balance)}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={generateCSV} className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
