import { useState } from "react";
import BudgetSummaryCard from "./budget-summary-card";
import SemesterExpensesCard from "./semester-expenses-card";
import SavingsGoalCard from "./savings-goal-card";
import SpendingAnalytics from "./spending-analytics";
import RecentTransactions from "./recent-transactions";
import CampusDeals from "./campus-deals";
import FinancialTip from "./financial-tip";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import AddExpenseForm from "../expenses/add-expense-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  
  console.log("Dashboard: User data:", user);
  console.log("Dashboard: isLoading:", isLoading);
  
  const firstName = user?.fullName?.split(' ')[0] || 'Student';
  const today = new Date();
  
  return (
    <>
      <div className="p-4 md:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-neutral-800">
                Welcome back, {firstName}
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Let's manage your finances for Fall 2025
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-lg">
                <span className="material-icons text-primary mr-2">calendar_today</span>
                <span className="text-sm font-medium text-primary">
                  {format(today, 'MMMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <BudgetSummaryCard />
          <SemesterExpensesCard />
          <SavingsGoalCard />
        </div>

        {/* Spending Analytics Section */}
        <SpendingAnalytics />

        {/* Recent Transactions & Local Deals Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTransactions />
          </div>
          <CampusDeals />
        </div>

        {/* Financial Tip Section */}
        <FinancialTip />
      </div>
      
      {/* Quick Add Button */}
      <button 
        onClick={() => setShowAddExpenseDialog(true)}
        className="fixed right-4 bottom-20 md:bottom-4 bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-10"
      >
        <span className="material-icons">add</span>
      </button>
      
      {/* Add Expense Dialog */}
      <Dialog open={showAddExpenseDialog} onOpenChange={setShowAddExpenseDialog}>
        <DialogContent className="sm:max-w-md">
          <AddExpenseForm onSuccess={() => setShowAddExpenseDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
