import { useQuery } from "@tanstack/react-query";
import { Expense, Income } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getCategoryById } from "@/lib/expense-categories";
import { format, formatDistanceToNow } from "date-fns";

interface Transaction {
  id: number;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export default function RecentTransactions() {
  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });
  
  const { data: incomes } = useQuery<Income[]>({
    queryKey: ["/api/incomes"],
  });
  
  // Combine expenses and incomes into a single transaction list
  const transactions: Transaction[] = [
    ...(expenses?.map(expense => ({
      id: expense.id,
      type: 'expense' as const,
      amount: expense.amount,
      category: expense.category,
      description: expense.description || getCategoryById(expense.category).name,
      date: new Date(expense.date)
    })) || []),
    ...(incomes?.map(income => ({
      id: income.id,
      type: 'income' as const,
      amount: income.amount,
      category: income.source,
      description: income.description || income.source,
      date: new Date(income.date)
    })) || [])
  ];
  
  // Sort transactions by date (most recent first)
  transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Only display the 4 most recent transactions
  const recentTransactions = transactions.slice(0, 4);
  
  // Function to determine icon based on category
  const getCategoryIcon = (transaction: Transaction) => {
    if (transaction.type === 'income') {
      return 'work';
    }
    return getCategoryById(transaction.category).icon;
  };
  
  // Function to format date relative to now
  const formatRelativeDate = (date: Date) => {
    const daysAgo = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysAgo === 0) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (daysAgo === 1) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else if (daysAgo < 7) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-neutral-800">Recent Transactions</CardTitle>
          <Button variant="link" asChild>
            <Link to="/expenses" className="text-primary text-sm font-medium flex items-center">
              View all
              <span className="material-icons text-sm ml-1">arrow_forward</span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction, index) => (
            <div 
              key={`${transaction.type}-${transaction.id}`}
              className={`border-b border-neutral-200 py-3 px-6 flex items-center justify-between ${
                index === recentTransactions.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-500/10' : 'bg-primary/10'
                } flex items-center justify-center mr-3`}>
                  <span className={`material-icons ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-primary'
                  }`}>
                    {getCategoryIcon(transaction)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{transaction.description}</p>
                  <p className="text-xs text-neutral-500">{formatRelativeDate(transaction.date)}</p>
                </div>
              </div>
              <p className={`text-sm font-medium ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-neutral-500">No recent transactions</p>
            <Button variant="outline" className="mt-2" asChild>
              <Link to="/expenses">Add your first transaction</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
