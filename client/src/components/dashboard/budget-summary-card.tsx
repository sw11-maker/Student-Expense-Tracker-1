import { useQuery } from "@tanstack/react-query";
import { Budget, Expense } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

export default function BudgetSummaryCard() {
  const { data: budget } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });
  
  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });
  
  // For demonstration, use a fixed monthly budget
  const totalBudget = 2000;
  const totalExpenses = expenses?.reduce((sum, expense) => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    
    // Only include expenses from the current month
    if (expenseDate.getMonth() === now.getMonth() && 
        expenseDate.getFullYear() === now.getFullYear()) {
      return sum + expense.amount;
    }
    return sum;
  }, 0) || 0;
  
  const remaining = totalBudget - totalExpenses;
  const percentSpent = Math.min(100, (totalExpenses / totalBudget) * 100);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-primary">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-semibold">Monthly Budget</h3>
          <span className="material-icons text-white">date_range</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-neutral-500">Spent</p>
          <p className="text-sm font-medium">
            ${totalExpenses.toFixed(2)} <span className="text-xs text-neutral-500">/ ${totalBudget.toFixed(2)}</span>
          </p>
        </div>
        <div className="mt-2">
          <Progress value={percentSpent} className="h-2" />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className={`text-xs ${remaining > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
            ${Math.abs(remaining).toFixed(2)} {remaining > 0 ? 'remaining' : 'overbudget'}
          </p>
          <p className="text-xs text-neutral-500">{percentSpent.toFixed(0)}% spent</p>
        </div>
      </div>
    </div>
  );
}
