import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertExpenseSchema, insertIncomeSchema, insertBudgetSchema, insertSavingsGoalSchema } from "@shared/schema";

// Helper to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Expenses routes
  app.get("/api/expenses", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const expenses = await storage.getExpenses(userId);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const validatedData = insertExpenseSchema.parse({
        ...req.body,
        userId,
        date: new Date(req.body.date)
      });
      
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid expense data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  app.put("/api/expenses/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Validate the expense belongs to the user
      const expenses = await storage.getExpenses(userId);
      const expense = expenses.find(e => e.id === id);
      
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }

      const validatedData = insertExpenseSchema.partial().parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
      });
      
      const updatedExpense = await storage.updateExpense(id, validatedData);
      if (!updatedExpense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      res.json(updatedExpense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid expense data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update expense" });
    }
  });

  app.delete("/api/expenses/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Validate the expense belongs to the user
      const expenses = await storage.getExpenses(userId);
      const expense = expenses.find(e => e.id === id);
      
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      const success = await storage.deleteExpense(id);
      if (!success) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Income routes
  app.get("/api/incomes", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const incomes = await storage.getIncomes(userId);
      res.json(incomes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incomes" });
    }
  });

  app.post("/api/incomes", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const validatedData = insertIncomeSchema.parse({
        ...req.body,
        userId,
        date: new Date(req.body.date)
      });
      
      const income = await storage.createIncome(validatedData);
      res.status(201).json(income);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid income data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create income" });
    }
  });

  // Budget routes
  app.get("/api/budgets", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const budgets = await storage.getBudgets(userId);
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  app.post("/api/budgets", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const validatedData = insertBudgetSchema.parse({
        ...req.body,
        userId,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
      });
      
      const budget = await storage.createBudget(validatedData);
      res.status(201).json(budget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid budget data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create budget" });
    }
  });

  // Savings goals routes
  app.get("/api/savings-goals", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const savingsGoals = await storage.getSavingsGoals(userId);
      res.json(savingsGoals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch savings goals" });
    }
  });

  app.post("/api/savings-goals", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const validatedData = insertSavingsGoalSchema.parse({
        ...req.body,
        userId,
        deadline: req.body.deadline ? new Date(req.body.deadline) : undefined
      });
      
      const savingsGoal = await storage.createSavingsGoal(validatedData);
      res.status(201).json(savingsGoal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid savings goal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create savings goal" });
    }
  });

  app.put("/api/savings-goals/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Validate the savings goal belongs to the user
      const savingsGoals = await storage.getSavingsGoals(userId);
      const savingsGoal = savingsGoals.find(g => g.id === id);
      
      if (!savingsGoal) {
        return res.status(404).json({ message: "Savings goal not found" });
      }

      const validatedData = insertSavingsGoalSchema.partial().parse({
        ...req.body,
        deadline: req.body.deadline ? new Date(req.body.deadline) : undefined
      });
      
      const updatedSavingsGoal = await storage.updateSavingsGoal(id, validatedData);
      if (!updatedSavingsGoal) {
        return res.status(404).json({ message: "Savings goal not found" });
      }
      
      res.json(updatedSavingsGoal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid savings goal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update savings goal" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
