import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Budget, Expense } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import AddBudgetForm from "@/components/budgets/add-budget-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryById } from "@/lib/expense-categories";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip
} from "recharts";

// Map Tailwind bg-* classes used in categories to hex colors for charts
const TAILWIND_BG_TO_HEX: Record<string, string> = {
  "bg-blue-500": "#3B82F6",
  "bg-purple-500": "#A855F7",
  "bg-green-500": "#22C55E",
  "bg-yellow-500": "#EAB308",
  "bg-pink-500": "#EC4899",
  "bg-indigo-500": "#6366F1",
  "bg-red-500": "#EF4444",
  "bg-amber-500": "#F59E0B",
  "bg-cyan-500": "#06B6D4",
  "bg-teal-500": "#14B8A6",
  "bg-gray-500": "#6B7280",
};

export default function BudgetsPage() {
  const { user } = useAuth();
  const [showAddBudgetDialog, setShowAddBudgetDialog] = useState(false);
  
  const { data: budgets, isLoading: isLoadingBudgets } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });
  
  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });
  
  // Function to calculate the spending percentage for a budget
  const calculateBudgetProgress = (budget: Budget) => {
    if (!expenses) return 0;
    
    // Filter expenses by category and date range
    const budgetExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const budgetStartDate = new Date(budget.startDate);
      const budgetEndDate = new Date(budget.endDate);
      
      return expense.category === budget.category && 
             expenseDate >= budgetStartDate && 
             expenseDate <= budgetEndDate;
    });
    
    // Sum up the expenses
    const totalSpent = budgetExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate the percentage
    return Math.min(100, (totalSpent / budget.amount) * 100);
  };
  
  // Function to get the total spent for a budget
  const getBudgetSpent = (budget: Budget) => {
    if (!expenses) return 0;
    
    const budgetExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const budgetStartDate = new Date(budget.startDate);
      const budgetEndDate = new Date(budget.endDate);
      
      return expense.category === budget.category && 
             expenseDate >= budgetStartDate && 
             expenseDate <= budgetEndDate;
    });
    
    return budgetExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };
  
  // Group budgets by period for the pie chart
  const currentBudgets = budgets?.filter(budget => {
    const now = new Date();
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
    return now >= startDate && now <= endDate;
  }) || [];
  
  // Prepare data for the pie chart
  const pieChartData = currentBudgets.map(budget => ({
    name: getCategoryById(budget.category).name,
    value: budget.amount,
    color: getCategoryById(budget.category).color,
    hexColor: TAILWIND_BG_TO_HEX[getCategoryById(budget.category).color] || "#8884d8",
  }));
  
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <MobileNav />
      
      <main className="flex-1 overflow-y-auto bg-neutral-100 pb-16 md:pb-0">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-neutral-800">Budgets</h1>
            <Button onClick={() => setShowAddBudgetDialog(true)}>
              <span className="material-icons mr-2">add</span>
              Create Budget
            </Button>
          </div>
          
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Budget Allocation Chart */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingBudgets ? (
                  <div className="h-[250px] flex items-center justify-center">
                    <p className="text-neutral-500">Loading...</p>
                  </div>
                ) : pieChartData.length > 0 ? (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.hexColor} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Budget']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {pieChartData.map((entry, index) => (
                        <div key={index} className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${entry.color}`}></span>
                          <span className="text-xs text-neutral-700">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[250px] flex flex-col items-center justify-center">
                    <p className="text-neutral-500 mb-4">No active budgets</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddBudgetDialog(true)}
                    >
                      Create your first budget
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Current Budgets */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Current Budgets</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingBudgets ? (
                  <div className="py-8 text-center">
                    <p className="text-neutral-500">Loading budgets...</p>
                  </div>
                ) : currentBudgets.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-neutral-500">No active budgets</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setShowAddBudgetDialog(true)}
                    >
                      Create your first budget
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentBudgets.map((budget) => {
                      const progress = calculateBudgetProgress(budget);
                      const spent = getBudgetSpent(budget);
                      const remaining = budget.amount - spent;
                      const category = getCategoryById(budget.category);
                      
                      return (
                        <div key={budget.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <span className={`material-icons mr-2 ${category.color.replace('bg-', 'text-')}`}>
                                {category.icon}
                              </span>
                              <h3 className="font-medium">{category.name}</h3>
                            </div>
                            <div className="text-sm text-neutral-500">
                              {format(new Date(budget.startDate), 'MMM d')} - {format(new Date(budget.endDate), 'MMM d, yyyy')}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-neutral-500">Spent</p>
                            <p className="text-sm font-medium">
                              ${spent.toFixed(2)} <span className="text-xs text-neutral-500">/ ${budget.amount.toFixed(2)}</span>
                            </p>
                          </div>
                          
                          <Progress value={progress} className="h-2 mb-2" />
                          
                          <div className="flex justify-between items-center">
                            <p className={`text-xs ${remaining > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                              ${Math.abs(remaining).toFixed(2)} {remaining > 0 ? 'remaining' : 'overbudget'}
                            </p>
                            <p className="text-xs text-neutral-500">{progress.toFixed(0)}% spent</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Past Budgets */}
          <Card>
            <CardHeader>
              <CardTitle>Past Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBudgets ? (
                <div className="py-8 text-center">
                  <p className="text-neutral-500">Loading past budgets...</p>
                </div>
              ) : budgets?.filter(budget => new Date(budget.endDate) < new Date()).length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-neutral-500">No past budgets</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {budgets?.filter(budget => new Date(budget.endDate) < new Date())
                    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
                    .map((budget) => {
                      const progress = calculateBudgetProgress(budget);
                      const spent = getBudgetSpent(budget);
                      const category = getCategoryById(budget.category);
                      
                      return (
                        <div key={budget.id} className="p-4 border rounded-lg bg-neutral-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <span className={`material-icons mr-2 ${category.color.replace('bg-', 'text-')}`}>
                                {category.icon}
                              </span>
                              <h3 className="font-medium">{category.name}</h3>
                            </div>
                          </div>
                          
                          <p className="text-sm text-neutral-500 mb-2">
                            {format(new Date(budget.startDate), 'MMM d')} - {format(new Date(budget.endDate), 'MMM d, yyyy')}
                          </p>
                          
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm">Budget: ${budget.amount.toFixed(2)}</p>
                            <p className="text-sm">Spent: ${spent.toFixed(2)}</p>
                          </div>
                          
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Add Budget Dialog */}
      <Dialog open={showAddBudgetDialog} onOpenChange={setShowAddBudgetDialog}>
        <DialogContent className="sm:max-w-md">
          <AddBudgetForm onSuccess={() => setShowAddBudgetDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
