import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/transactions';

interface SummaryCardsProps {
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export const SummaryCards = ({ totalDebit, totalCredit, balance }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Debits */}
      <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 animate-slide-up">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Payments Made
              </p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {formatCurrency(totalDebit)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Money paid out
              </p>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10">
              <ArrowUpRight className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Credits */}
      <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-success/10" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Money Received
              </p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {formatCurrency(totalCredit)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Money received
              </p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <ArrowDownRight className="h-6 w-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Balance */}
      <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Net Balance
              </p>
              <p className={`text-2xl font-heading font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(balance)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {balance >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
