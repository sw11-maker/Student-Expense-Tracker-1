import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBudgetSchema } from "@shared/schema";
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
import { expenseCategories } from "@/lib/expense-categories";
import { format, addMonths, addDays } from "date-fns";
import { useEffect } from "react";

// Budget periods
const budgetPeriods = [
  { id: "monthly", name: "Monthly", duration: 1 }, // 1 month
  { id: "semester", name: "Semester", duration: 4 }, // ~4 months
  { id: "yearly", name: "Yearly", duration: 12 }, // 12 months
];

// Extend the budget schema for the form
const budgetFormSchema = insertBudgetSchema.omit({ userId: true }).extend({
  amount: z.string().min(1, "Amount is required").transform(val => parseFloat(val)),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface AddBudgetFormProps {
  onSuccess?: () => void;
}

export default function AddBudgetForm({ onSuccess }: AddBudgetFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      amount: 0,
      category: "",
      period: "monthly",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addMonths(new Date(), 1), "yyyy-MM-dd"),
    },
  });
  
  // Update end date when period changes
  const updateEndDate = (period: string, startDate: string) => {
    if (!startDate) return;
    
    const start = new Date(startDate);
    const selectedPeriod = budgetPeriods.find(p => p.id === period);
    
    if (selectedPeriod) {
      let endDate;
      if (period === "semester") {
        // Roughly 4 months minus a day for semester
        endDate = addDays(addMonths(start, 4), -1);
      } else {
        endDate = addDays(addMonths(start, selectedPeriod.duration), -1);
      }
      
      form.setValue("endDate", format(endDate, "yyyy-MM-dd"));
    }
  };
  
  // Watch for changes in period and start date
  const watchPeriod = form.watch("period");
  const watchStartDate = form.watch("startDate");
  
  // Update end date when period or start date changes
  useEffect(() => {
    updateEndDate(watchPeriod, watchStartDate);
  }, [watchPeriod, watchStartDate]);
  
  const addBudgetMutation = useMutation({
    mutationFn: async (values: BudgetFormValues) => {
      const res = await apiRequest("POST", "/api/budgets", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Budget added",
        description: "Your budget has been created successfully.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Failed to add budget",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: BudgetFormValues) {
    if (!user) return;
    addBudgetMutation.mutate(values);
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-neutral-800">Create Budget</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Amount ($)</FormLabel>
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
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {budgetPeriods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name}
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
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} readOnly />
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
              disabled={addBudgetMutation.isPending}
            >
              {addBudgetMutation.isPending ? "Creating..." : "Create Budget"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
