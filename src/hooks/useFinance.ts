import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Income, IncomeType, Expense, ExpenseType,
  Asset, AssetType, Liability, LoanType, CreditCard, CreditCardType,
  DebitCard, DebitCardType, SavingsGoal, PaymentReminder, FinancialAnalysis,
  RepaymentMethod
} from '@/types/finance';

// 本地存储键名
const STORAGE_KEYS = {
  incomeTypes: 'cf_income_types',
  incomes: 'cf_incomes',
  expenseTypes: 'cf_expense_types',
  expenses: 'cf_expenses',
  assetTypes: 'cf_asset_types',
  assets: 'cf_assets',
  loanTypes: 'cf_loan_types',
  liabilities: 'cf_liabilities',
  creditCardTypes: 'cf_credit_card_types',
  creditCards: 'cf_credit_cards',
  debitCardTypes: 'cf_debit_card_types',
  debitCards: 'cf_debit_cards',
  savingsGoals: 'cf_savings_goals',
};

// 默认收入类型
const defaultIncomeTypes: IncomeType[] = [
  { id: 'salary', name: '工资收入', icon: 'Briefcase', color: '#10b981', isDefault: true },
  { id: 'stock', name: '股票收入', icon: 'TrendingUp', color: '#3b82f6', isDefault: true },
  { id: 'dividend', name: '分红收入', icon: 'Gift', color: '#8b5cf6', isDefault: true },
  { id: 'bonus', name: '奖金', icon: 'Award', color: '#f59e0b', isDefault: true },
  { id: 'side', name: '副业收入', icon: 'Zap', color: '#ec4899', isDefault: true },
  { id: 'rental', name: '租金收入', icon: 'Home', color: '#06b6d4', isDefault: true },
  { id: 'interest', name: '利息收入', icon: 'Percent', color: '#84cc16', isDefault: true },
  { id: 'other', name: '其他收入', icon: 'MoreHorizontal', color: '#6b7280', isDefault: true },
];

// 默认支出类型
const defaultExpenseTypes: ExpenseType[] = [
  { id: 'housing', name: '房贷/房租', icon: 'Home', color: '#ef4444', isDefault: true },
  { id: 'loan', name: '贷款还款', icon: 'CreditCard', color: '#dc2626', isDefault: true },
  { id: 'transport', name: '交通', icon: 'Car', color: '#f97316', isDefault: true },
  { id: 'food', name: '餐饮', icon: 'Utensils', color: '#eab308', isDefault: true },
  { id: 'entertainment', name: '娱乐', icon: 'Gamepad2', color: '#8b5cf6', isDefault: true },
  { id: 'shopping', name: '购物', icon: 'ShoppingBag', color: '#ec4899', isDefault: true },
  { id: 'utilities', name: '水电煤', icon: 'Lightbulb', color: '#06b6d4', isDefault: true },
  { id: 'medical', name: '医疗', icon: 'Heart', color: '#10b981', isDefault: true },
  { id: 'education', name: '教育', icon: 'BookOpen', color: '#3b82f6', isDefault: true },
  { id: 'insurance', name: '保险', icon: 'Shield', color: '#6366f1', isDefault: true },
  { id: 'misc', name: '杂项', icon: 'MoreHorizontal', color: '#6b7280', isDefault: true },
];

// 默认资产类型
const defaultAssetTypes: AssetType[] = [
  { id: 'cash', name: '现金', icon: 'Banknote', color: '#10b981', isDefault: true },
  { id: 'stock', name: '股票', icon: 'TrendingUp', color: '#3b82f6', isDefault: true },
  { id: 'fund', name: '基金', icon: 'BarChart3', color: '#8b5cf6', isDefault: true },
  { id: 'bond', name: '债券', icon: 'FileText', color: '#f59e0b', isDefault: true },
  { id: 'property', name: '房产', icon: 'Home', color: '#06b6d4', isDefault: true },
  { id: 'crypto', name: '加密货币', icon: 'Bitcoin', color: '#f97316', isDefault: true },
  { id: 'other', name: '其他', icon: 'MoreHorizontal', color: '#6b7280', isDefault: true },
];

// 默认贷款类型
const defaultLoanTypes: LoanType[] = [
  { id: 'personal', name: '个人贷款', icon: 'User', color: '#3b82f6', isDefault: true },
  { id: 'mortgage', name: '房贷', icon: 'Home', color: '#10b981', isDefault: true },
  { id: 'car', name: '车贷', icon: 'Car', color: '#f59e0b', isDefault: true },
  { id: 'education', name: '助学贷款', icon: 'BookOpen', color: '#8b5cf6', isDefault: true },
  { id: 'business', name: '经营贷款', icon: 'Briefcase', color: '#ec4899', isDefault: true },
  { id: 'other', name: '其他贷款', icon: 'MoreHorizontal', color: '#6b7280', isDefault: true },
];

// 默认信用卡类型
const defaultCreditCardTypes: CreditCardType[] = [
  { id: 'visa', name: 'Visa', icon: 'CreditCard', color: '#1a1f71', isDefault: true },
  { id: 'mastercard', name: 'Mastercard', icon: 'CreditCard', color: '#eb001b', isDefault: true },
  { id: 'amex', name: 'American Express', icon: 'CreditCard', color: '#016fd0', isDefault: true },
  { id: 'unionpay', name: '银联', icon: 'CreditCard', color: '#c00', isDefault: true },
  { id: 'other', name: '其他', icon: 'CreditCard', color: '#6b7280', isDefault: true },
];

// 默认储蓄卡类型
const defaultDebitCardTypes: DebitCardType[] = [
  { id: 'checking', name: '借记卡', icon: 'Wallet', color: '#10b981', isDefault: true },
  { id: 'savings', name: '储蓄卡', icon: 'PiggyBank', color: '#3b82f6', isDefault: true },
  { id: 'other', name: '其他', icon: 'MoreHorizontal', color: '#6b7280', isDefault: true },
];

// 贷款期限选项（月）
export const LOAN_TERMS = [3, 6, 12, 24, 36, 48, 60, 72, 84, 96, 120];

// 计算贷款月供
export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  months: number,
  method: RepaymentMethod
): { monthlyPayment: number; firstMonthPayment?: number; totalInterest: number } {
  const monthlyRate = annualRate / 100 / 12;

  switch (method) {
    case 'interest_only': {
      // 先息后本：每月只还利息，到期还本金
      const monthlyInterest = principal * monthlyRate;
      const totalInterest = monthlyInterest * months;
      return {
        monthlyPayment: monthlyInterest,
        totalInterest,
      };
    }

    case 'equal_principal_interest': {
      // 等额本息：每月还款额固定
      // 月供 = 本金 × 月利率 × (1+月利率)^还款月数 / [(1+月利率)^还款月数 - 1]
      if (monthlyRate === 0) {
        const monthlyPayment = principal / months;
        return { monthlyPayment, totalInterest: 0 };
      }
      const pow = Math.pow(1 + monthlyRate, months);
      const monthlyPayment = principal * monthlyRate * pow / (pow - 1);
      const totalInterest = monthlyPayment * months - principal;
      return {
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
      };
    }

    case 'equal_principal': {
      // 等额本金：每月还固定本金+递减利息
      // 首月还款 = 本金/期数 + 本金×月利率
      // 每月递减 = 本金/期数 × 月利率
      const principalPerMonth = principal / months;
      const firstMonthInterest = principal * monthlyRate;
      const firstMonthPayment = principalPerMonth + firstMonthInterest;
      
      // 总利息 = (期数 + 1) × 本金 × 月利率 / 2
      const totalInterest = (months + 1) * principal * monthlyRate / 2;
      
      return {
        monthlyPayment: Math.round(principalPerMonth * 100) / 100, // 平均月供（用于显示）
        firstMonthPayment: Math.round(firstMonthPayment * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
      };
    }

    default:
      return { monthlyPayment: 0, totalInterest: 0 };
  }
}

// 从本地存储加载数据
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// 保存到本地存储
function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function useFinance() {
  // 收入类型
  const [incomeTypes, setIncomeTypes] = useState<IncomeType[]>(() =>
    loadFromStorage(STORAGE_KEYS.incomeTypes, defaultIncomeTypes)
  );

  // 收入记录
  const [incomes, setIncomes] = useState<Income[]>(() =>
    loadFromStorage(STORAGE_KEYS.incomes, [])
  );

  // 支出类型
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>(() =>
    loadFromStorage(STORAGE_KEYS.expenseTypes, defaultExpenseTypes)
  );

  // 支出记录
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadFromStorage(STORAGE_KEYS.expenses, [])
  );

  // 资产类型
  const [assetTypes, setAssetTypes] = useState<AssetType[]>(() =>
    loadFromStorage(STORAGE_KEYS.assetTypes, defaultAssetTypes)
  );

  // 资产
  const [assets, setAssets] = useState<Asset[]>(() =>
    loadFromStorage(STORAGE_KEYS.assets, [])
  );

  // 贷款类型
  const [loanTypes, setLoanTypes] = useState<LoanType[]>(() =>
    loadFromStorage(STORAGE_KEYS.loanTypes, defaultLoanTypes)
  );

  // 负债（贷款）
  const [liabilities, setLiabilities] = useState<Liability[]>(() =>
    loadFromStorage(STORAGE_KEYS.liabilities, [])
  );

  // 信用卡类型
  const [creditCardTypes, setCreditCardTypes] = useState<CreditCardType[]>(() =>
    loadFromStorage(STORAGE_KEYS.creditCardTypes, defaultCreditCardTypes)
  );

  // 信用卡
  const [creditCards, setCreditCards] = useState<CreditCard[]>(() =>
    loadFromStorage(STORAGE_KEYS.creditCards, [])
  );

  // 储蓄卡类型
  const [debitCardTypes, setDebitCardTypes] = useState<DebitCardType[]>(() =>
    loadFromStorage(STORAGE_KEYS.debitCardTypes, defaultDebitCardTypes)
  );

  // 储蓄卡
  const [debitCards, setDebitCards] = useState<DebitCard[]>(() =>
    loadFromStorage(STORAGE_KEYS.debitCards, [])
  );

  // 储蓄目标
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() =>
    loadFromStorage(STORAGE_KEYS.savingsGoals, [])
  );

  // 保存数据到本地存储
  useEffect(() => saveToStorage(STORAGE_KEYS.incomeTypes, incomeTypes), [incomeTypes]);
  useEffect(() => saveToStorage(STORAGE_KEYS.incomes, incomes), [incomes]);
  useEffect(() => saveToStorage(STORAGE_KEYS.expenseTypes, expenseTypes), [expenseTypes]);
  useEffect(() => saveToStorage(STORAGE_KEYS.expenses, expenses), [expenses]);
  useEffect(() => saveToStorage(STORAGE_KEYS.assetTypes, assetTypes), [assetTypes]);
  useEffect(() => saveToStorage(STORAGE_KEYS.assets, assets), [assets]);
  useEffect(() => saveToStorage(STORAGE_KEYS.loanTypes, loanTypes), [loanTypes]);
  useEffect(() => saveToStorage(STORAGE_KEYS.liabilities, liabilities), [liabilities]);
  useEffect(() => saveToStorage(STORAGE_KEYS.creditCardTypes, creditCardTypes), [creditCardTypes]);
  useEffect(() => saveToStorage(STORAGE_KEYS.creditCards, creditCards), [creditCards]);
  useEffect(() => saveToStorage(STORAGE_KEYS.debitCardTypes, debitCardTypes), [debitCardTypes]);
  useEffect(() => saveToStorage(STORAGE_KEYS.debitCards, debitCards), [debitCards]);
  useEffect(() => saveToStorage(STORAGE_KEYS.savingsGoals, savingsGoals), [savingsGoals]);

  // ========== 收入管理 ==========
  const addIncome = useCallback((income: Omit<Income, 'id'>) => {
    const newIncome: Income = { ...income, id: Date.now().toString() };
    setIncomes(prev => [...prev, newIncome]);
    return newIncome.id;
  }, []);

  const updateIncome = useCallback((id: string, updates: Partial<Income>) => {
    setIncomes(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const deleteIncome = useCallback((id: string) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  }, []);

  const addIncomeType = useCallback((type: Omit<IncomeType, 'id'>) => {
    const newType: IncomeType = { ...type, id: Date.now().toString() };
    setIncomeTypes(prev => [...prev, newType]);
    return newType.id;
  }, []);

  const deleteIncomeType = useCallback((id: string) => {
    setIncomeTypes(prev => prev.filter(t => t.id !== id && !t.isDefault));
  }, []);

  // ========== 支出管理 ==========
  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: Date.now().toString() };
    setExpenses(prev => [...prev, newExpense]);
    return newExpense.id;
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const addExpenseType = useCallback((type: Omit<ExpenseType, 'id'>) => {
    const newType: ExpenseType = { ...type, id: Date.now().toString() };
    setExpenseTypes(prev => [...prev, newType]);
    return newType.id;
  }, []);

  const deleteExpenseType = useCallback((id: string) => {
    setExpenseTypes(prev => prev.filter(t => t.id !== id && !t.isDefault));
  }, []);

  // ========== 资产类型管理 ==========
  const addAssetType = useCallback((type: Omit<AssetType, 'id'>) => {
    const newType: AssetType = { ...type, id: Date.now().toString() };
    setAssetTypes(prev => [...prev, newType]);
    return newType.id;
  }, []);

  const deleteAssetType = useCallback((id: string) => {
    setAssetTypes(prev => prev.filter(t => t.id !== id && !t.isDefault));
  }, []);

  // ========== 资产管理 ==========
  const addAsset = useCallback((asset: Omit<Asset, 'id'>) => {
    const newAsset: Asset = { ...asset, id: Date.now().toString() };
    setAssets(prev => [...prev, newAsset]);
    return newAsset.id;
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  // ========== 贷款类型管理 ==========
  const addLoanType = useCallback((type: Omit<LoanType, 'id'>) => {
    const newType: LoanType = { ...type, id: Date.now().toString() };
    setLoanTypes(prev => [...prev, newType]);
    return newType.id;
  }, []);

  const deleteLoanType = useCallback((id: string) => {
    setLoanTypes(prev => prev.filter(t => t.id !== id && !t.isDefault));
  }, []);

  // ========== 负债（贷款）管理 ==========
  const addLiability = useCallback((liability: Omit<Liability, 'id'>) => {
    const newLiability: Liability = { ...liability, id: Date.now().toString() };
    setLiabilities(prev => [...prev, newLiability]);
    return newLiability.id;
  }, []);

  const updateLiability = useCallback((id: string, updates: Partial<Liability>) => {
    setLiabilities(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  const deleteLiability = useCallback((id: string) => {
    setLiabilities(prev => prev.filter(l => l.id !== id));
  }, []);

  // ========== 信用卡类型管理 ==========
  const addCreditCardType = useCallback((type: Omit<CreditCardType, 'id'>) => {
    const newType: CreditCardType = { ...type, id: Date.now().toString() };
    setCreditCardTypes(prev => [...prev, newType]);
    return newType.id;
  }, []);

  const deleteCreditCardType = useCallback((id: string) => {
    setCreditCardTypes(prev => prev.filter(t => t.id !== id && !t.isDefault));
  }, []);

  // ========== 信用卡管理 ==========
  const addCreditCard = useCallback((card: Omit<CreditCard, 'id'>) => {
    const newCard: CreditCard = { ...card, id: Date.now().toString() };
    setCreditCards(prev => [...prev, newCard]);
    return newCard.id;
  }, []);

  const updateCreditCard = useCallback((id: string, updates: Partial<CreditCard>) => {
    setCreditCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards(prev => prev.filter(c => c.id !== id));
  }, []);

  // ========== 储蓄卡类型管理 ==========
  const addDebitCardType = useCallback((type: Omit<DebitCardType, 'id'>) => {
    const newType: DebitCardType = { ...type, id: Date.now().toString() };
    setDebitCardTypes(prev => [...prev, newType]);
    return newType.id;
  }, []);

  const deleteDebitCardType = useCallback((id: string) => {
    setDebitCardTypes(prev => prev.filter(t => t.id !== id && !t.isDefault));
  }, []);

  // ========== 储蓄卡管理 ==========
  const addDebitCard = useCallback((card: Omit<DebitCard, 'id'>) => {
    const newCard: DebitCard = { ...card, id: Date.now().toString() };
    setDebitCards(prev => [...prev, newCard]);
    return newCard.id;
  }, []);

  const updateDebitCard = useCallback((id: string, updates: Partial<DebitCard>) => {
    setDebitCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteDebitCard = useCallback((id: string) => {
    setDebitCards(prev => prev.filter(c => c.id !== id));
  }, []);

  // ========== 储蓄目标管理 ==========
  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = { ...goal, id: Date.now().toString() };
    setSavingsGoals(prev => [...prev, newGoal]);
    return newGoal.id;
  }, []);

  const updateSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  // ========== 计算数据 ==========
  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);

  // 本月收入
  const currentMonthIncome = useMemo(() => {
    return incomes
      .filter(i => i.date.startsWith(currentMonth))
      .reduce((sum, i) => sum + i.amount, 0);
  }, [incomes, currentMonth]);

  // 本月支出
  const currentMonthExpense = useMemo(() => {
    return expenses
      .filter(e => e.date.startsWith(currentMonth))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, currentMonth]);

  // 可支配收入 = 现金 + 信用卡可用额度 + 储蓄卡余额
  const disposableAmount = useMemo(() => {
    const cashAssets = assets
      .filter(a => {
        const type = assetTypes.find(t => t.id === a.typeId);
        return type?.id === 'cash';
      })
      .reduce((sum, a) => sum + a.amount, 0);
    const availableCredit = creditCards
      .reduce((sum, c) => sum + (c.limit - c.usedAmount), 0);
    const debitCardBalance = debitCards
      .reduce((sum, c) => sum + c.balance, 0);
    return cashAssets + availableCredit + debitCardBalance;
  }, [assets, assetTypes, creditCards, debitCards]);

  // 总资产
  const totalAssets = useMemo(() =>
    assets.reduce((sum, a) => sum + a.amount, 0) +
    debitCards.reduce((sum, c) => sum + c.balance, 0),
  [assets, debitCards]);

  // 总负债
  const totalLiabilities = useMemo(() =>
    liabilities.reduce((sum, l) => sum + l.remainingAmount, 0) +
    creditCards.reduce((sum, c) => sum + c.usedAmount, 0),
  [liabilities, creditCards]);

  // 净资产
  const netWorth = useMemo(() => totalAssets - totalLiabilities, [totalAssets, totalLiabilities]);

  // 还款提醒
  const paymentReminders = useMemo<PaymentReminder[]>(() => {
    const reminders: PaymentReminder[] = [];
    const today = new Date();
    const currentMonthStr = today.toISOString().slice(0, 7);

    // 贷款还款提醒
    liabilities.forEach(liability => {
      const dueDate = new Date(currentMonthStr + '-' + String(liability.dueDate).padStart(2, '0'));
      if (dueDate < today) {
        dueDate.setMonth(dueDate.getMonth() + 1);
      }
      
      // 计算逾期利息
      const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      const interestAccrued = daysOverdue > 0 
        ? liability.remainingAmount * (liability.interestRate / 100 / 365) * daysOverdue 
        : 0;

      reminders.push({
        id: `loan-${liability.id}`,
        type: 'loan',
        itemId: liability.id,
        name: liability.name,
        amount: liability.monthlyPayment,
        dueDate: dueDate.toISOString().slice(0, 10),
        isPaid: false,
        interestAccrued: Math.round(interestAccrued * 100) / 100,
      });
    });

    // 信用卡还款提醒
    creditCards.forEach(card => {
      const dueDate = new Date(currentMonthStr + '-' + String(card.dueDate).padStart(2, '0'));
      if (dueDate < today) {
        dueDate.setMonth(dueDate.getMonth() + 1);
      }

      // 计算逾期利息
      const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      const interestAccrued = daysOverdue > 0 && card.usedAmount > 0
        ? card.usedAmount * (card.interestRate / 100 / 365) * daysOverdue
        : 0;

      if (card.usedAmount > 0) {
        reminders.push({
          id: `cc-${card.id}`,
          type: 'credit_card',
          itemId: card.id,
          name: `${card.bank} - ${card.name}`,
          amount: card.usedAmount,
          dueDate: dueDate.toISOString().slice(0, 10),
          isPaid: false,
          interestAccrued: Math.round(interestAccrued * 100) / 100,
        });
      }
    });

    return reminders.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [liabilities, creditCards]);

  // 财务分析
  const financialAnalysis = useMemo<FinancialAnalysis>(() => {
    const now = new Date();
    const monthlyTrend = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toISOString().slice(0, 7);
      
      const income = incomes
        .filter(item => item.date.startsWith(monthStr))
        .reduce((sum, item) => sum + item.amount, 0);
      
      const expense = expenses
        .filter(item => item.date.startsWith(monthStr))
        .reduce((sum, item) => sum + item.amount, 0);
      
      monthlyTrend.push({
        month: monthStr,
        income,
        expense,
        savings: income - expense,
      });
    }

    const totalIncome = monthlyTrend.reduce((sum, m) => sum + m.income, 0);
    const totalExpense = monthlyTrend.reduce((sum, m) => sum + m.expense, 0);
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    const debtToIncomeRatio = totalIncome > 0 ? (totalLiabilities / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      totalAssets,
      totalLiabilities,
      netWorth,
      debtToIncomeRatio,
      monthlyTrend,
    };
  }, [incomes, expenses, totalAssets, totalLiabilities, netWorth]);

  // 获取所有账户（用于支出来源选择）
  const allAccounts = useMemo(() => {
    const accounts = [
      ...creditCards.map(c => ({ id: c.id, name: `${c.bank} ${c.name}`, type: 'credit_card' as const })),
      ...debitCards.map(c => ({ id: c.id, name: `${c.bank} ${c.name}`, type: 'debit_card' as const })),
    ];
    return accounts;
  }, [creditCards, debitCards]);

  return {
    // 数据
    incomeTypes,
    incomes,
    expenseTypes,
    expenses,
    assetTypes,
    assets,
    loanTypes,
    liabilities,
    creditCardTypes,
    creditCards,
    debitCardTypes,
    debitCards,
    savingsGoals,
    allAccounts,
    
    // 计算值
    currentMonthIncome,
    currentMonthExpense,
    disposableAmount,
    totalAssets,
    totalLiabilities,
    netWorth,
    paymentReminders,
    financialAnalysis,
    
    // 收入操作
    addIncome,
    updateIncome,
    deleteIncome,
    addIncomeType,
    deleteIncomeType,
    
    // 支出操作
    addExpense,
    updateExpense,
    deleteExpense,
    addExpenseType,
    deleteExpenseType,
    
    // 资产类型操作
    addAssetType,
    deleteAssetType,
    
    // 资产操作
    addAsset,
    updateAsset,
    deleteAsset,
    
    // 贷款类型操作
    addLoanType,
    deleteLoanType,
    
    // 负债（贷款）操作
    addLiability,
    updateLiability,
    deleteLiability,
    
    // 信用卡类型操作
    addCreditCardType,
    deleteCreditCardType,
    
    // 信用卡操作
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    
    // 储蓄卡类型操作
    addDebitCardType,
    deleteDebitCardType,
    
    // 储蓄卡操作
    addDebitCard,
    updateDebitCard,
    deleteDebitCard,
    
    // 储蓄目标操作
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
  };
}
