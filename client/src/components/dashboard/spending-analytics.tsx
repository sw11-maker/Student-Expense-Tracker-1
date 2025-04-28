import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Expense } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend 
} from "recharts";
import { expenseCategories, getCategoryById } from "@/lib/expense-categories";
import { startOfMonth, endOfMonth, format, subMonths, isWithinInterval } from "date-fns";

type TimeRange = "thisMonth" | "lastMonth" | "semester";

export default function SpendingAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("thisMonth");
  
  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  // Time range filters
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  const semesterStart = new Date('2025-08-21');
  const semesterEnd = new Date('2025-12-18');

  // Filter expenses based on selected time range
  const filteredExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    
    if (timeRange === "thisMonth") {
      return isWithinInterval(expenseDate, { start: thisMonthStart, end: thisMonthEnd });
    } else if (timeRange === "lastMonth") {
      return isWithinInterval(expenseDate, { start: lastMonthStart, end: lastMonthEnd });
    } else { // semester
      return isWithinInterval(expenseDate, { start: semesterStart, end: semesterEnd });
    }
  }) || [];

  // Group expenses by category for pie chart
  const expensesByCategory: Record<string, number> = {};
  filteredExpenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = 0;
    }
    expensesByCategory[expense.category] += expense.amount;
  });

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: getCategoryById(category).name,
    value: amount,
    category
  }));

  // Total expenses for the period
  const totalExpenses = pieChartData.reduce((sum, item) => sum + item.value, 0);

  // Group expenses by date for line chart
  const expensesByDate: Record<string, number> = {};
  filteredExpenses.forEach(expense => {
    const dateStr = format(new Date(expense.date), 'MMM dd');
    if (!expensesByDate[dateStr]) {
      expensesByDate[dateStr] = 0;
    }
    expensesByDate[dateStr] += expense.amount;
  });

  const lineChartData = Object.entries(expensesByDate).map(([date, amount]) => ({
    date,
    amount
  }));

  // If we don't have enough data points, add some placeholders for line chart
  if (lineChartData.length < 5) {
    const dateFormat = 'MMM dd';
    if (timeRange === "thisMonth") {
      for (let i = 1; i <= 5; i++) {
        const date = format(new Date(now.getFullYear(), now.getMonth(), i * 5), dateFormat);
        if (!expensesByDate[date]) {
          lineChartData.push({ date, amount: 0 });
        }
      }
    } else if (timeRange === "lastMonth") {
      const lastMonth = subMonths(now, 1);
      for (let i = 1; i <= 5; i++) {
        const date = format(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), i * 5), dateFormat);
        if (!expensesByDate[date]) {
          lineChartData.push({ date, amount: 0 });
        }
      }
    }
    // Sort the line chart data by date
    lineChartData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }

  // Colors for the pie chart based on category
  const COLORS = ['#1E88E5', '#FFC107', '#F44336', '#4CAF50', '#9C27B0', '#FF9800', '#795548'];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-bold text-neutral-800">Spending Analytics</CardTitle>
          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <Button 
              size="sm"
              variant={timeRange === "thisMonth" ? "default" : "outline"}
              onClick={() => setTimeRange("thisMonth")}
            >
              This Month
            </Button>
            <Button 
              size="sm"
              variant={timeRange === "lastMonth" ? "default" : "outline"}
              onClick={() => setTimeRange("lastMonth")}
            >
              Last Month
            </Button>
            <Button 
              size="sm"
              variant={timeRange === "semester" ? "default" : "outline"}
              onClick={() => setTimeRange("semester")}
            >
              Semester
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">Spending Over Time</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#1E88E5" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-3">Spending by Category</h3>
            <div className="h-[200px] w-full">
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {pieChartData.map((entry, index) => (
                <div key={entry.category} className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="text-xs text-neutral-700">
                    {entry.name} ({((entry.value / totalExpenses) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
