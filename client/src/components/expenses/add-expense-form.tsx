import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { expenseCategories } from "@/lib/expense-categories";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExpenseSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

// Extend the expense schema for the form
const expenseFormSchema = insertExpenseSchema.omit({ userId: true }).extend({
  amount: z.string().min(1, "Amount is required").transform(val => parseFloat(val)),
  date: z.string().min(1, "Date is required"),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface AddExpenseFormProps {
  onSuccess?: () => void;
}

export default function AddExpenseForm({ onSuccess }: AddExpenseFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: "",
      category: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });
  
  const addExpenseMutation = useMutation({
    mutationFn: async (values: ExpenseFormValues) => {
      const res = await apiRequest("POST", "/api/expenses", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({
        title: "Expense added",
        description: "Your expense has been recorded successfully.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Failed to add expense",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: ExpenseFormValues) {
    if (!user) return;
    addExpenseMutation.mutate(values);
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-neutral-800">Add Expense</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    min="0.01" 
                    step="0.01" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <span className="material-icons text-sm mr-2">
                            {category.icon}
                          </span>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="E.g., Lunch at Student Union" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onSuccess}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={addExpenseMutation.isPending}
            >
              {addExpenseMutation.isPending ? "Saving..." : "Save Expense"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
