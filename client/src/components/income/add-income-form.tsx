import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIncomeSchema } from "@shared/schema";
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
import { format } from "date-fns";

// Income sources
const incomeSources = [
  { id: "job", name: "Part-time Job", icon: "work" },
  { id: "scholarship", name: "Scholarship", icon: "school" },
  { id: "family", name: "Family Support", icon: "family_restroom" },
  { id: "grants", name: "Grants", icon: "payments" },
  { id: "loans", name: "Student Loans", icon: "account_balance" },
  { id: "refund", name: "Refund", icon: "assignment_return" },
  { id: "other", name: "Other", icon: "more_horiz" },
];

// Extend the income schema for the form
const incomeFormSchema = insertIncomeSchema.omit({ userId: true }).extend({
  amount: z.string().min(1, "Amount is required").transform(val => parseFloat(val)),
  date: z.string().min(1, "Date is required"),
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

interface AddIncomeFormProps {
  onSuccess?: () => void;
}

export default function AddIncomeForm({ onSuccess }: AddIncomeFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      amount: "",
      source: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });
  
  const addIncomeMutation = useMutation({
    mutationFn: async (values: IncomeFormValues) => {
      const res = await apiRequest("POST", "/api/incomes", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incomes"] });
      toast({
        title: "Income added",
        description: "Your income has been recorded successfully.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Failed to add income",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: IncomeFormValues) {
    if (!user) return;
    addIncomeMutation.mutate(values);
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-neutral-800">Add Income</h2>
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
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select a source</option>
                    {incomeSources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
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
                    placeholder="E.g., Campus part-time job payment" 
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
              disabled={addIncomeMutation.isPending}
            >
              {addIncomeMutation.isPending ? "Saving..." : "Save Income"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
