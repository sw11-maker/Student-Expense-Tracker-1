export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const expenseCategories: ExpenseCategory[] = [
  {
    id: "food",
    name: "Food",
    icon: "fastfood",
    color: "bg-blue-500",
  },
  {
    id: "rent",
    name: "Rent",
    icon: "home",
    color: "bg-purple-500",
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: "directions_bus",
    color: "bg-green-500",
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: "power",
    color: "bg-yellow-500",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "sports_esports",
    color: "bg-pink-500",
  },
  {
    id: "education",
    name: "Education",
    icon: "school",
    color: "bg-indigo-500",
  },
  {
    id: "tuition",
    name: "Tuition",
    icon: "account_balance",
    color: "bg-red-500",
  },
  {
    id: "books",
    name: "Books",
    icon: "book",
    color: "bg-amber-500",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "shopping_cart",
    color: "bg-cyan-500",
  },
  {
    id: "health",
    name: "Health",
    icon: "local_hospital",
    color: "bg-teal-500",
  },
  {
    id: "other",
    name: "Other",
    icon: "more_horiz",
    color: "bg-gray-500",
  },
];

export function getCategoryById(id: string): ExpenseCategory {
  return expenseCategories.find(cat => cat.id === id) || expenseCategories[expenseCategories.length - 1];
}
