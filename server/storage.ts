import { 
  users, type User, type InsertUser,
  expenses, type Expense, type InsertExpense,
  incomes, type Income, type InsertIncome,
  budgets, type Budget, type InsertBudget,
  savingsGoals, type SavingsGoal, type InsertSavingsGoal
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Expense methods
  getExpenses(userId: number): Promise<Expense[]>;
  getExpensesByCategory(userId: number, category: string): Promise<Expense[]>;
  getExpensesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;
  
  // Income methods
  getIncomes(userId: number): Promise<Income[]>;
  getIncomesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Income[]>;
  createIncome(income: InsertIncome): Promise<Income>;
  updateIncome(id: number, income: Partial<InsertIncome>): Promise<Income | undefined>;
  deleteIncome(id: number): Promise<boolean>;
  
  // Budget methods
  getBudgets(userId: number): Promise<Budget[]>;
  getBudgetsByPeriod(userId: number, period: string): Promise<Budget[]>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: number, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(id: number): Promise<boolean>;
  
  // Savings goal methods
  getSavingsGoals(userId: number): Promise<SavingsGoal[]>;
  createSavingsGoal(savingsGoal: InsertSavingsGoal): Promise<SavingsGoal>;
  updateSavingsGoal(id: number, savingsGoal: Partial<InsertSavingsGoal>): Promise<SavingsGoal | undefined>;
  deleteSavingsGoal(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private expenses: Map<number, Expense>;
  private incomes: Map<number, Income>;
  private budgets: Map<number, Budget>;
  private savingsGoals: Map<number, SavingsGoal>;
  
  currentUserId: number;
  currentExpenseId: number;
  currentIncomeId: number;
  currentBudgetId: number;
  currentSavingsGoalId: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.expenses = new Map();
    this.incomes = new Map();
    this.budgets = new Map();
    this.savingsGoals = new Map();
    
    this.currentUserId = 1;
    this.currentExpenseId = 1;
    this.currentIncomeId = 1;
    this.currentBudgetId = 1;
    this.currentSavingsGoalId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Expense methods
  async getExpenses(userId: number): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      (expense) => expense.userId === userId,
    );
  }
  
  async getExpensesByCategory(userId: number, category: string): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      (expense) => expense.userId === userId && expense.category === category,
    );
  }
  
  async getExpensesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      (expense) => expense.userId === userId &&
                   expense.date >= startDate &&
                   expense.date <= endDate,
    );
  }
  
  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentExpenseId++;
    const now = new Date();
    const expense: Expense = { ...insertExpense, id, createdAt: now };
    this.expenses.set(id, expense);
    return expense;
  }
  
  async updateExpense(id: number, expenseUpdate: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;
    
    const updatedExpense: Expense = { ...expense, ...expenseUpdate };
    this.expenses.set(id, updatedExpense);
    return updatedExpense;
  }
  
  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }
  
  // Income methods
  async getIncomes(userId: number): Promise<Income[]> {
    return Array.from(this.incomes.values()).filter(
      (income) => income.userId === userId,
    );
  }
  
  async getIncomesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Income[]> {
    return Array.from(this.incomes.values()).filter(
      (income) => income.userId === userId &&
                  income.date >= startDate &&
                  income.date <= endDate,
    );
  }
  
  async createIncome(insertIncome: InsertIncome): Promise<Income> {
    const id = this.currentIncomeId++;
    const now = new Date();
    const income: Income = { ...insertIncome, id, createdAt: now };
    this.incomes.set(id, income);
    return income;
  }
  
  async updateIncome(id: number, incomeUpdate: Partial<InsertIncome>): Promise<Income | undefined> {
    const income = this.incomes.get(id);
    if (!income) return undefined;
    
    const updatedIncome: Income = { ...income, ...incomeUpdate };
    this.incomes.set(id, updatedIncome);
    return updatedIncome;
  }
  
  async deleteIncome(id: number): Promise<boolean> {
    return this.incomes.delete(id);
  }
  
  // Budget methods
  async getBudgets(userId: number): Promise<Budget[]> {
    return Array.from(this.budgets.values()).filter(
      (budget) => budget.userId === userId,
    );
  }
  
  async getBudgetsByPeriod(userId: number, period: string): Promise<Budget[]> {
    return Array.from(this.budgets.values()).filter(
      (budget) => budget.userId === userId && budget.period === period,
    );
  }
  
  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = this.currentBudgetId++;
    const now = new Date();
    const budget: Budget = { ...insertBudget, id, createdAt: now };
    this.budgets.set(id, budget);
    return budget;
  }
  
  async updateBudget(id: number, budgetUpdate: Partial<InsertBudget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    
    const updatedBudget: Budget = { ...budget, ...budgetUpdate };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }
  
  async deleteBudget(id: number): Promise<boolean> {
    return this.budgets.delete(id);
  }
  
  // Savings Goal methods
  async getSavingsGoals(userId: number): Promise<SavingsGoal[]> {
    return Array.from(this.savingsGoals.values()).filter(
      (goal) => goal.userId === userId,
    );
  }
  
  async createSavingsGoal(insertSavingsGoal: InsertSavingsGoal): Promise<SavingsGoal> {
    const id = this.currentSavingsGoalId++;
    const now = new Date();
    const savingsGoal: SavingsGoal = { ...insertSavingsGoal, id, createdAt: now };
    this.savingsGoals.set(id, savingsGoal);
    return savingsGoal;
  }
  
  async updateSavingsGoal(id: number, savingsGoalUpdate: Partial<InsertSavingsGoal>): Promise<SavingsGoal | undefined> {
    const savingsGoal = this.savingsGoals.get(id);
    if (!savingsGoal) return undefined;
    
    const updatedSavingsGoal: SavingsGoal = { ...savingsGoal, ...savingsGoalUpdate };
    this.savingsGoals.set(id, updatedSavingsGoal);
    return updatedSavingsGoal;
  }
  
  async deleteSavingsGoal(id: number): Promise<boolean> {
    return this.savingsGoals.delete(id);
  }
}

export const storage = new MemStorage();
