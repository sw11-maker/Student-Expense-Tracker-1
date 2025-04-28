import { useQuery } from "@tanstack/react-query";
import { Expense } from "@shared/schema";
import { Link } from "wouter";

// Hardcoded semester start and end dates for Fall 2025
const semesterStart = new Date('2025-08-21');
const semesterEnd = new Date('2025-12-18');

export default function SemesterExpensesCard() {
  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });
  
  // Filter expenses for the current semester and sort them by category
  const semesterExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= semesterStart && expenseDate <= semesterEnd;
  }) || [];
  
  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  semesterExpenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = 0;
    }
    expensesByCategory[expense.category] += expense.amount;
  });
  
  // Format the semester expense data for display
  const tuitionAmount = expensesByCategory['tuition'] || 3800;
  const booksAmount = expensesByCategory['books'] || 350;
  const labFeesAmount = expensesByCategory['education'] || 150;
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-secondary">
        <div className="flex justify-between items-center">
          <h3 className="text-neutral-800 font-semibold">Semester Expenses</h3>
          <span className="material-icons text-neutral-800">school</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-neutral-500">Tuition</p>
          <p className="text-sm font-medium">
            ${tuitionAmount.toFixed(2)} <span className="text-xs text-green-500">paid</span>
          </p>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-neutral-500">Books</p>
          <p className="text-sm font-medium">
            ${booksAmount.toFixed(2)} <span className="text-xs text-green-500">paid</span>
          </p>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-neutral-500">Lab fees</p>
          <p className="text-sm font-medium">
            ${labFeesAmount.toFixed(2)} <span className="text-xs text-red-500">due 10/30</span>
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <Link to="/expenses" className="text-xs text-primary flex items-center">
            View all expenses
            <span className="material-icons text-xs ml-1">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
