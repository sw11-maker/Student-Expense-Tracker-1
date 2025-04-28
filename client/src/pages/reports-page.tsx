import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Expense, Income } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { getCategoryById } from "@/lib/expense-categories";
import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  format,
  isWithinInterval,
} from "date-fns";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define time range options
type TimeRange = "thisMonth" | "lastMonth" | "threeMonths" | "year";

export default function ReportsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>("thisMonth");
  
  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });
  
  const { data: incomes } = useQuery<Income[]>({
    queryKey: ["/api/incomes"],
  });
  
  // Define date ranges
  const now = new Date();
  const dateRanges = {
    thisMonth: {
      start: startOfMonth(now),
      end: endOfMonth(now),
      title: format(now, 'MMMM yyyy'),
    },
    lastMonth: {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
      title: format(subMonths(now, 1), 'MMMM yyyy'),
    },
    threeMonths: {
      start: startOfMonth(subMonths(now, 2)),
      end: endOfMonth(now),
      title: `Last 3 Months`,
    },
    year: {
      start: startOfYear(now),
      end: endOfYear(now),
      title: format(now, 'yyyy'),
    },
  };
  
  // Filter expenses and incomes based on selected time range
  const filteredExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isWithinInterval(expenseDate, {
      start: dateRanges[timeRange].start,
      end: dateRanges[timeRange].end,
    });
  }) || [];
  
  const filteredIncomes = incomes?.filter(income => {
    const incomeDate = new Date(income.date);
    return isWithinInterval(incomeDate, {
      start: dateRanges[timeRange].start,
      end: dateRanges[timeRange].end,
    });
  }) || [];
  
  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  
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
    color: getCategoryById(category).color,
  }));
  
  // Group expenses by date for line chart
  const expensesByDate: Record<string, number> = {};
  const incomesByDate: Record<string, number> = {};
  
  filteredExpenses.forEach(expense => {
    const dateStr = format(new Date(expense.date), 'MMM dd');
    if (!expensesByDate[dateStr]) {
      expensesByDate[dateStr] = 0;
    }
    expensesByDate[dateStr] += expense.amount;
  });
  
  filteredIncomes.forEach(income => {
    const dateStr = format(new Date(income.date), 'MMM dd');
    if (!incomesByDate[dateStr]) {
      incomesByDate[dateStr] = 0;
    }
    incomesByDate[dateStr] += income.amount;
  });
  
  // Combine dates for line chart
  const allDates = new Set([...Object.keys(expensesByDate), ...Object.keys(incomesByDate)]);
  const lineChartData = Array.from(allDates).map(date => ({
    date,
    expenses: expensesByDate[date] || 0,
    income: incomesByDate[date] || 0,
  }));
  
  // Sort the line chart data by date
  lineChartData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Top spending categories
  const topCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({
      name: getCategoryById(category).name,
      amount,
      icon: getCategoryById(category).icon,
      color: getCategoryById(category).color,
    }));
  
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <MobileNav />
      
      <main className="flex-1 overflow-y-auto bg-neutral-100 pb-16 md:pb-0">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-neutral-800 mb-4 sm:mb-0">Financial Reports</h1>
            
            <Tabs 
              value={timeRange} 
              onValueChange={(value) => setTimeRange(value as TimeRange)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="thisMonth">This Month</TabsTrigger>
                <TabsTrigger value="lastMonth">Last Month</TabsTrigger>
                <TabsTrigger value="threeMonths">3 Months</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <span className="material-icons text-blue-600">trending_down</span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800">Total Expenses</p>
                    <h2 className="text-2xl font-bold text-blue-700">${totalExpenses.toFixed(2)}</h2>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="material-icons text-green-600">trending_up</span>
                  </div>
                  <div>
                    <p className="text-sm text-green-800">Total Income</p>
                    <h2 className="text-2xl font-bold text-green-700">${totalIncome.toFixed(2)}</h2>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${netSavings >= 0 ? 'bg-purple-50 border-purple-100' : 'bg-red-50 border-red-100'}`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${netSavings >= 0 ? 'bg-purple-100' : 'bg-red-100'} rounded-full`}>
                    <span className={`material-icons ${netSavings >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                      {netSavings >= 0 ? 'savings' : 'warning'}
                    </span>
                  </div>
                  <div>
                    <p className={`text-sm ${netSavings >= 0 ? 'text-purple-800' : 'text-red-800'}`}>Net Savings</p>
                    <h2 className={`text-2xl font-bold ${netSavings >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
                      ${netSavings.toFixed(2)}
                    </h2>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <span className="material-icons text-yellow-600">percent</span>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-800">Savings Rate</p>
                    <h2 className="text-2xl font-bold text-yellow-700">
                      {savingsRate.toFixed(1)}%
                    </h2>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {filteredExpenses.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-neutral-500">No expense data for this period</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color.replace('bg-', '')} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            {/* Income vs Expenses Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {lineChartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-neutral-500">No data for this period</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lineChartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#4CAF50" 
                        activeDot={{ r: 8 }}
                        name="Income"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#F44336" 
                        name="Expenses"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Top Spending Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {topCategories.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-neutral-500">No expense data for this period</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {topCategories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center mr-4`}>
                        <span className="material-icons text-white">{category.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">{category.name}</h4>
                          <span className="font-medium">${category.amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full ${category.color}`}
                            style={{ width: `${(category.amount / totalExpenses) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-right mt-1">
                          {((category.amount / totalExpenses) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Monthly Comparison (Bar Chart) */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expense Comparison</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {timeRange === "year" && (
                filteredExpenses.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-neutral-500">No expense data for this year</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={(() => {
                        // Group expenses by month for the year
                        const months: Record<string, { month: string, expenses: number }> = {};
                        for (let i = 0; i < 12; i++) {
                          const monthDate = new Date(now.getFullYear(), i, 1);
                          months[format(monthDate, 'MMM')] = {
                            month: format(monthDate, 'MMM'),
                            expenses: 0,
                          };
                        }
                        
                        filteredExpenses.forEach(expense => {
                          const expenseDate = new Date(expense.date);
                          const monthKey = format(expenseDate, 'MMM');
                          if (months[monthKey]) {
                            months[monthKey].expenses += expense.amount;
                          }
                        });
                        
                        return Object.values(months);
                      })()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Expenses']} />
                      <Bar dataKey="expenses" fill="#1E88E5" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                )
              )}
              
              {timeRange !== "year" && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-neutral-500">Select 'Year' view to see monthly comparison</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
