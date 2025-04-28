import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Income } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import AddIncomeForm from "@/components/income/add-income-form";
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

// Income sources with icons
const incomeSources: Record<string, { name: string, icon: string }> = {
  job: { name: "Part-time Job", icon: "work" },
  scholarship: { name: "Scholarship", icon: "school" },
  family: { name: "Family Support", icon: "family_restroom" },
  grants: { name: "Grants", icon: "payments" },
  loans: { name: "Student Loans", icon: "account_balance" },
  refund: { name: "Refund", icon: "assignment_return" },
  other: { name: "Other", icon: "more_horiz" },
};

export default function IncomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddIncomeDialog, setShowAddIncomeDialog] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<number | null>(null);
  
  const { data: incomes, isLoading } = useQuery<Income[]>({
    queryKey: ["/api/incomes"],
  });
  
  const deleteIncomeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/incomes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incomes"] });
      toast({
        title: "Income deleted",
        description: "The income record has been successfully deleted.",
      });
      setIncomeToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete income",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteIncome = (id: number) => {
    setIncomeToDelete(id);
  };
  
  const confirmDeleteIncome = () => {
    if (incomeToDelete) {
      deleteIncomeMutation.mutate(incomeToDelete);
    }
  };
  
  // Calculate total income
  const totalIncome = incomes?.reduce((sum, income) => sum + income.amount, 0) || 0;
  
  // Sort incomes by date (most recent first)
  const sortedIncomes = incomes 
    ? [...incomes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];
  
  // Helper function to get source name and icon
  const getSourceInfo = (source: string) => {
    return incomeSources[source] || { name: source, icon: "more_horiz" };
  };
  
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <MobileNav />
      
      <main className="flex-1 overflow-y-auto bg-neutral-100 pb-16 md:pb-0">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-neutral-800">Income</h1>
            <Button onClick={() => setShowAddIncomeDialog(true)}>
              <span className="material-icons mr-2">add</span>
              Add Income
            </Button>
          </div>
          
          {/* Income Summary Card */}
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="material-icons text-green-600">savings</span>
                </div>
                <div>
                  <p className="text-sm text-green-800">Total Income</p>
                  <h2 className="text-3xl font-bold text-green-700">${totalIncome.toFixed(2)}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Income Records Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Income Records</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center">
                  <p className="text-neutral-500">Loading income records...</p>
                </div>
              ) : sortedIncomes.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-neutral-500">No income records yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setShowAddIncomeDialog(true)}
                  >
                    Add your first income
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedIncomes.map((income) => (
                        <TableRow key={income.id}>
                          <TableCell>
                            {format(new Date(income.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="material-icons text-sm mr-2">
                                {getSourceInfo(income.source).icon}
                              </span>
                              {getSourceInfo(income.source).name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {income.description || '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            ${income.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteIncome(income.id)}
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
      
      {/* Add Income Dialog */}
      <Dialog open={showAddIncomeDialog} onOpenChange={setShowAddIncomeDialog}>
        <DialogContent className="sm:max-w-md">
          <AddIncomeForm onSuccess={() => setShowAddIncomeDialog(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={incomeToDelete !== null} onOpenChange={(open) => !open && setIncomeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this income record from your records.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteIncome}>
              {deleteIncomeMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
