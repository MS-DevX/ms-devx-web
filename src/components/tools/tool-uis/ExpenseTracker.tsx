"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExpenseItem, ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
] as const;

export default function ExpenseTracker({ className }: ToolUiProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: "1", title: "Coffee", amount: 4.5, category: "Food" },
    { id: "2", title: "Bus pass", amount: 28, category: "Transport" },
  ]);

  const total = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses]
  );

  const handleAdd = () => {
    const parsed = parseFloat(amount);
    if (!title.trim() || Number.isNaN(parsed) || parsed <= 0) return;

    setExpenses((prev) => [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        amount: parsed,
        category,
      },
      ...prev,
    ]);
    setTitle("");
    setAmount("");
  };

  const handleRemove = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <p className="text-sm text-muted-foreground">Total expenses</p>
        <p className="text-3xl font-bold text-electric">
          ${total.toFixed(2)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-1">
          <label htmlFor="expense-title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="expense-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Groceries"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="expense-amount" className="text-sm font-medium">
            Amount
          </label>
          <Input
            id="expense-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="expense-category" className="text-sm font-medium">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="expense-category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleAdd}
        className="bg-electric text-white hover:bg-electric/90"
      >
        <Plus />
        Add expense
      </Button>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No expenses yet. Add your first entry above.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {expense.title}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{expense.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-electric">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemove(expense.id)}
                      aria-label={`Remove ${expense.title}`}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
