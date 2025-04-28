import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SavingsGoal } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SavingsGoalCard() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState("");

  const { data: savingsGoals } = useQuery<SavingsGoal[]>({
    queryKey: ["/api/savings-goals"],
  });

  const updateSavingsMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: number; amount: number }) => {
      const goal = savingsGoals?.find(g => g.id === id);
      if (!goal) throw new Error("Savings goal not found");
      
      const newAmount = goal.currentAmount + amount;
      const res = await apiRequest("PUT", `/api/savings-goals/${id}`, {
        currentAmount: newAmount
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
      toast({
        title: "Savings updated",
        description: "Your contribution has been added to your savings goal.",
      });
      setOpenDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update savings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Use the first savings goal or create a default one for demo
  const savingsGoal = savingsGoals && savingsGoals.length > 0 
    ? savingsGoals[0] 
    : {
        id: 0,
        name: "Spring Break Trip",
        targetAmount: 1200,
        currentAmount: 480,
        userId: 0,
        deadline: new Date(),
        createdAt: new Date()
      };

  const percentComplete = Math.min(100, (savingsGoal.currentAmount / savingsGoal.targetAmount) * 100);

  const handleAddToSavings = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive",
      });
      return;
    }

    updateSavingsMutation.mutate({
      id: savingsGoal.id,
      amount: parseFloat(amount)
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-green-500">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-semibold">Savings Goal</h3>
          <span className="material-icons text-white">savings</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-center text-lg font-bold">${savingsGoal.targetAmount.toFixed(2)}</p>
        <p className="text-center text-xs text-neutral-500 mt-1">{savingsGoal.name}</p>
        <div className="mt-3">
          <Progress value={percentComplete} className="h-2" />
        </div>
        <div className="mt-3 flex justify-between items-center">
          <p className="text-xs text-neutral-500 font-medium">${savingsGoal.currentAmount.toFixed(2)} saved</p>
          <p className="text-xs text-neutral-500">{percentComplete.toFixed(0)}% complete</p>
        </div>
        <div className="mt-4 flex justify-center">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <button className="px-3 py-1.5 bg-green-500/10 text-green-500 text-xs font-medium rounded-full">
                Add to savings
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add to your savings</DialogTitle>
                <DialogDescription>
                  Enter the amount you'd like to add to your {savingsGoal.name} savings goal.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount ($)
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={handleAddToSavings}
                  disabled={updateSavingsMutation.isPending}
                >
                  {updateSavingsMutation.isPending ? "Saving..." : "Add to Savings"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
