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

// 账户类型
export type AccountType = 'credit_card' | 'debit_card' | 'cash' | 'alipay' | 'wechat' | 'other';

// 账户（银行卡、信用卡、储蓄卡等）
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number; // 当前余额/可用额度
  limit?: number; // 额度（信用卡用）
  usedAmount?: number; // 已用额度（信用卡用）
  bank?: string;
  billDate?: number; // 账单日（信用卡用）
  dueDate?: number; // 还款日（信用卡用）
  interestRate?: number; // 利率（信用卡用）
  annualFee?: number; // 年费（信用卡用）
  notes?: string;
}

// 支出记录
export interface Expense {
  id: string;
  typeId: string;
  amount: number;
  date: string;
  description?: string;
  isFixed?: boolean;
  accountId?: string; // 支出来源账户ID
}

// 资产类型
export interface AssetType {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

// 资产
export interface Asset {
  id: string;
  name: string;
  typeId: string; // 改为引用自定义类型ID
  amount: number;
  returnRate?: number;
  purchaseDate?: string;
  notes?: string;
}

// 还款方式
export type RepaymentMethod = 'interest_only' | 'equal_principal_interest' | 'equal_principal';

// 还款方式显示名称
export const RepaymentMethodLabels: Record<RepaymentMethod, string> = {
  interest_only: '先息后本',
  equal_principal_interest: '等额本息',
  equal_principal: '等额本金',
};

// 贷款类型
export interface LoanType {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

// 负债
export interface Liability {
  id: string;
  name: string;
  typeId: string; // 改为引用自定义贷款类型ID
  totalAmount: number;
  remainingAmount: number;
  interestRate: number; // 年利率，如 4.5 表示 4.5%
  repaymentMethod: RepaymentMethod; // 还款方式
  loanTerm: number; // 贷款时长（月）
  monthlyPayment: number; // 计算得出的月供
  firstMonthPayment?: number; // 等额本金首月还款额
  dueDate: number; // 每月还款日
  startDate: string;
  endDate?: string;
  notes?: string;
}

// 信用卡类型
export interface CreditCardType {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

// 信用卡
export interface CreditCard {
  id: string;
  name: string;
  typeId: string; // 改为引用自定义类型ID
  bank: string;
  limit: number;
  usedAmount: number;
  billDate: number; // 账单日
  dueDate: number; // 还款日
  interestRate: number;
  annualFee?: number;
  notes?: string;
}

// 储蓄卡类型
export interface DebitCardType {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

// 储蓄卡
export interface DebitCard {
  id: string;
  name: string;
  typeId: string; // 改为引用自定义类型ID
  bank: string;
  balance: number;
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
