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

// 贷款还款计划明细
export interface LoanRepaymentSchedule {
  id: string;
  period: number; // 期数（第几期）
  dueDate: string; // 还款日期（YYYY-MM-DD）
  totalAmount: number; // 月供总额
  principal: number; // 本金部分
  interest: number; // 利息部分
  remainingPrincipal: number; // 剩余本金
  isPaid: boolean; // 是否已还
  paidDate?: string; // 实际还款日期
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
  repaymentSchedule?: LoanRepaymentSchedule[]; // 还款计划明细（从截图导入）
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

// ========== 公司股权管理 ==========

// 公司股权月度记录
export interface CompanyEquityMonthlyRecord {
  id: string;
  month: string; // 格式：YYYY-MM
  revenue: number; // 营业额
  netProfit: number; // 净利润
  myDividend: number; // 实际分红金额
  recordDate: string; // 记录日期
  notes?: string;
}

// 公司股权
export interface CompanyEquity {
  id: string;
  name: string; // 公司名称
  myShareRatio: number; // 股份占比（如 30 表示 30%）
  dividendDay: number; // 每月分红日期（1-31）
  monthlyRecords: CompanyEquityMonthlyRecord[]; // 月度记录
  notes?: string;
}

// ========== 投资账户（股票、基金等） ==========

// 投资账户类型
export type InvestmentAccountType = 'stock' | 'fund' | 'bond' | 'crypto' | 'forex' | 'other';

export const InvestmentAccountTypeLabels: Record<InvestmentAccountType, string> = {
  stock: '股票',
  fund: '基金',
  bond: '债券',
  crypto: '加密货币',
  forex: '外汇',
  other: '其他',
};

// 投资持仓记录
export interface InvestmentHolding {
  id: string;
  code: string; // 代码（如：000001.SZ）
  name: string; // 名称（如：平安银行）
  type: 'stock' | 'fund' | 'bond' | 'other';
  quantity: number; // 持仓数量
  avgCost: number; // 平均成本价
  currentPrice: number; // 当前价格
  marketValue: number; // 市值（自动计算）
  profitLoss: number; // 盈亏金额（自动计算）
  profitLossRate: number; // 盈亏率（自动计算）
  purchaseDate?: string; // 买入日期
  notes?: string;
}

// 投资交易记录
export interface InvestmentTransaction {
  id: string;
  holdingId: string; // 关联持仓ID
  type: 'buy' | 'sell';
  date: string;
  price: number;
  quantity: number;
  amount: number; // 交易金额
  fee: number; // 手续费
  notes?: string;
}

// 投资账户
export interface InvestmentAccount {
  id: string;
  name: string;
  type: InvestmentAccountType;
  platform?: string; // 券商/平台名称（如：华泰证券、支付宝）
  accountNumber?: string; // 账号（可选）
  totalValue: number; // 总市值
  cashBalance: number; // 现金余额
  totalCost: number; // 总成本
  totalProfitLoss: number; // 总盈亏
  holdings: InvestmentHolding[]; // 持仓列表
  transactions: InvestmentTransaction[]; // 交易记录
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
