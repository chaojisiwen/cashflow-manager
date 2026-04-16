// 财务管理系统类型定义

// 收入类型
export interface IncomeType {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

// 收入记录
export interface Income {
  id: string;
  typeId: string;
  amount: number;
  date: string;
  description?: string;
  isRecurring?: boolean;
  recurringCycle?: 'monthly' | 'weekly' | 'yearly';
}

// 支出类型
export interface ExpenseType {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  budget?: number;
  isDefault?: boolean;
}

// 支出记录
export interface Expense {
  id: string;
  typeId: string;
  amount: number;
  date: string;
  description?: string;
  isFixed?: boolean;
}

// 资产类型
export type AssetType = 'cash' | 'stock' | 'fund' | 'bond' | 'property' | 'crypto' | 'other';

// 资产
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  amount: number;
  returnRate?: number;
  purchaseDate?: string;
  notes?: string;
}

// 负债类型
export type LiabilityType = 'credit_card' | 'loan' | 'mortgage' | 'debt' | 'other';

// 负债
export interface Liability {
  id: string;
  name: string;
  type: LiabilityType;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  monthlyPayment: number;
  dueDate: number; // 每月还款日
  startDate: string;
  endDate?: string;
  notes?: string;
}

// 信用卡
export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  limit: number;
  usedAmount: number;
  billDate: number; // 账单日
  dueDate: number; // 还款日
  interestRate: number;
  annualFee?: number;
  notes?: string;
}

// 还款提醒
export interface PaymentReminder {
  id: string;
  type: 'loan' | 'credit_card';
  itemId: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  interestAccrued: number;
}

// 储蓄目标
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

// 月度预算
export interface MonthlyBudget {
  month: string;
  totalBudget: number;
  categoryBudgets: Record<string, number>;
}

// 财务分析
export interface FinancialAnalysis {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToIncomeRatio: number;
  monthlyTrend: {
    month: string;
    income: number;
    expense: number;
    savings: number;
  }[];
}

// 用户设置
export interface UserSettings {
  currency: string;
  theme: 'light' | 'dark';
  savingsTarget: number;
  emergencyFundMonths: number;
}
