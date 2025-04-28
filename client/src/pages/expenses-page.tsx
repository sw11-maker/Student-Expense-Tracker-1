import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Expense } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getCategoryById } from "@/lib/expense-categories";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import AddExpenseForm from "@/components/expenses/add-expense-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExpensesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
  
  const { data: expenses, isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });
  
  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({
        title: "Expense deleted",
        description: "The expense has been successfully deleted.",
      });
      setExpenseToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete expense",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteExpense = (id: number) => {
    setExpenseToDelete(id);
  };
  
  const confirmDeleteExpense = () => {
    if (expenseToDelete) {
      deleteExpenseMutation.mutate(expenseToDelete);
    }
  };
  
  // Sort expenses by date (most recent first)
  const sortedExpenses = expenses 
    ? [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];
  
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <MobileNav />
      
      <main className="flex-1 overflow-y-auto bg-neutral-100 pb-16 md:pb-0">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-neutral-800">Expenses</h1>
            <Button onClick={() => setShowAddExpenseDialog(true)}>
              <span className="material-icons mr-2">add</span>
              Add Expense
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center">
                  <p className="text-neutral-500">Loading expenses...</p>
                </div>
              ) : sortedExpenses.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-neutral-500">No expenses recorded yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setShowAddExpenseDialog(true)}
                  >
                    Add your first expense
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>
                            {format(new Date(expense.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="material-icons text-sm mr-2">
                                {getCategoryById(expense.category).icon}
                              </span>
                              {getCategoryById(expense.category).name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {expense.description || '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${expense.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              <span className="material-icons text-sm">delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Add Expense Dialog */}
      <Dialog open={showAddExpenseDialog} onOpenChange={setShowAddExpenseDialog}>
        <DialogContent className="sm:max-w-md">
          <AddExpenseForm onSuccess={() => setShowAddExpenseDialog(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={expenseToDelete !== null} onOpenChange={(open) => !open && setExpenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense from your records.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteExpense}>
              {deleteExpenseMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
