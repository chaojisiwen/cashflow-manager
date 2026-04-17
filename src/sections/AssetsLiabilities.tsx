import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Wallet, TrendingUp, TrendingDown, Building2, CreditCard as CreditCardIcon, 
  Plus, Trash2, Landmark, PiggyBank, Briefcase, BarChart3,
  TrendingUp as StockIcon, Bitcoin, DollarSign,
  Calendar, Percent, Coins
} from 'lucide-react';
import type { 
  Asset, AssetType, Liability, LoanType, 
  CreditCard, CreditCardType, DebitCard, DebitCardType,
  RepaymentMethod, CompanyEquity, InvestmentAccount, InvestmentHolding,
  InvestmentAccountType
} from '@/types/finance';
import { InvestmentAccountTypeLabels } from '@/types/finance';
import { LOAN_TERMS } from '@/hooks/useFinance';
import { RepaymentMethodLabels } from '@/types/finance';

interface AssetsLiabilitiesProps {
  assetTypes: AssetType[];
  assets: Asset[];
  loanTypes: LoanType[];
  liabilities: Liability[];
  creditCardTypes: CreditCardType[];
  creditCards: CreditCard[];
  debitCardTypes: DebitCardType[];
  debitCards: DebitCard[];
  companyEquities: CompanyEquity[];
  investmentAccounts: InvestmentAccount[];
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  onAddAssetType: (type: Omit<AssetType, 'id'>) => void;
  onDeleteAssetType: (_id: string) => void;
  onAddAsset: (asset: Omit<Asset, 'id'>) => void;
  onUpdateAsset: (_id: string, _updates: Partial<Asset>) => void;
  onDeleteAsset: (id: string) => void;
  onAddLoanType: (type: Omit<LoanType, 'id'>) => void;
  onDeleteLoanType: (_id: string) => void;
  onAddLiability: (liability: Omit<Liability, 'id'>) => void;
  onUpdateLiability: (_id: string, _updates: Partial<Liability>) => void;
  onDeleteLiability: (id: string) => void;
  onAddCreditCardType: (type: Omit<CreditCardType, 'id'>) => void;
  onDeleteCreditCardType: (_id: string) => void;
  onAddCreditCard: (card: Omit<CreditCard, 'id'>) => void;
  onUpdateCreditCard: (_id: string, _updates: Partial<CreditCard>) => void;
  onDeleteCreditCard: (id: string) => void;
  onAddDebitCardType: (type: Omit<DebitCardType, 'id'>) => void;
  onDeleteDebitCardType: (_id: string) => void;
  onAddDebitCard: (card: Omit<DebitCard, 'id'>) => void;
  onUpdateDebitCard: (_id: string, _updates: Partial<DebitCard>) => void;
  onDeleteDebitCard: (id: string) => void;
  onAddCompanyEquity: (equity: Omit<CompanyEquity, 'id' | 'monthlyRecords'>) => void;
  onUpdateCompanyEquity: (_id: string, _updates: Partial<CompanyEquity>) => void;
  onDeleteCompanyEquity: (id: string) => void;
  onAddCompanyEquityMonthlyRecord: (equityId: string, record: { month: string; revenue: number; netProfit: number; myDividend: number; recordDate: string; notes?: string }) => void;
  onDeleteCompanyEquityMonthlyRecord: (equityId: string, recordId: string) => void;
  onAddInvestmentAccount: (account: Omit<InvestmentAccount, 'id' | 'holdings' | 'transactions'>) => void;
  onUpdateInvestmentAccount: (id: string, updates: Partial<InvestmentAccount>) => void;
  onDeleteInvestmentAccount: (id: string) => void;
  onAddInvestmentHolding: (accountId: string, holding: Omit<InvestmentHolding, 'id' | 'marketValue' | 'profitLoss' | 'profitLossRate'>) => void;
  onUpdateInvestmentHolding: (_accountId: string, _holdingId: string, _updates: Partial<InvestmentHolding>) => void;
  onDeleteInvestmentHolding: (accountId: string, holdingId: string) => void;
  onAddInvestmentTransaction: (accountId: string, transaction: Omit<import('@/types/finance').InvestmentTransaction, 'id'>) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Wallet, TrendingUp, TrendingDown, Building2, CreditCard: CreditCardIcon, 
  Landmark, PiggyBank, Briefcase, BarChart3, StockIcon, 
  Bitcoin, DollarSign, Calendar, Percent, Coins,
  Home: Building2,
  Car: () => null,
  BookOpen: () => null,
  User: () => null,
  Award: () => null,
  Zap: () => null,
  Gift: () => null,
  Utensils: () => null,
  Gamepad2: () => null,
  ShoppingBag: () => null,
  Lightbulb: () => null,
  Heart: () => null,
  Shield: () => null,
  MoreHorizontal: () => null,
  Banknote: DollarSign,
  FileText: () => null,
};

export function AssetsLiabilities({
  assetTypes,
  assets,
  loanTypes,
  liabilities,
  creditCardTypes,
  creditCards,
  debitCardTypes,
  debitCards,
  companyEquities,
  investmentAccounts,
  totalAssets,
  totalLiabilities,
  netWorth,
  onAddAssetType,
  onDeleteAssetType: _onDeleteAssetType,
  onAddAsset,
  onDeleteAsset,
  onAddLoanType,
  onDeleteLoanType: _onDeleteLoanType,
  onAddLiability,
  onDeleteLiability,
  onAddCreditCardType,
  onDeleteCreditCardType: _onDeleteCreditCardType,
  onAddCreditCard,
  onDeleteCreditCard,
  onAddDebitCardType,
  onDeleteDebitCardType: _onDeleteDebitCardType,
  onAddDebitCard,
  onDeleteDebitCard,
  onAddCompanyEquity,
  onUpdateCompanyEquity: _onUpdateCompanyEquity,
  onDeleteCompanyEquity,
  onAddCompanyEquityMonthlyRecord,
  onDeleteCompanyEquityMonthlyRecord,
  onAddInvestmentAccount,
  onDeleteInvestmentAccount,
  onAddInvestmentHolding,
  onUpdateInvestmentHolding: _onUpdateInvestmentHolding,
  onDeleteInvestmentHolding,
}: AssetsLiabilitiesProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // 表单状态
  const [newAssetType, setNewAssetType] = useState({ name: '', icon: 'Wallet', color: '#3b82f6' });
  const [newAsset, setNewAsset] = useState({ name: '', typeId: '', amount: '', returnRate: '', purchaseDate: '', notes: '' });
  const [newLoanType, setNewLoanType] = useState({ name: '', icon: 'Wallet', color: '#3b82f6' });
  const [newLiability, setNewLiability] = useState({
    name: '', typeId: '', totalAmount: '', remainingAmount: '', interestRate: '',
    repaymentMethod: 'equal_principal_interest' as RepaymentMethod,
    loanTerm: '12', monthlyPayment: '', dueDate: '1', startDate: '', notes: ''
  });
  const [newCreditCardType, setNewCreditCardType] = useState({ name: '', icon: 'CreditCard', color: '#3b82f6' });
  const [newCreditCard, setNewCreditCard] = useState({
    name: '', typeId: '', bank: '', limit: '', usedAmount: '0',
    billDate: '1', dueDate: '10', interestRate: '18', annualFee: '', notes: ''
  });
  const [newDebitCardType, setNewDebitCardType] = useState({ name: '', icon: 'Wallet', color: '#3b82f6' });
  const [newDebitCard, setNewDebitCard] = useState({ name: '', typeId: '', bank: '', balance: '', annualFee: '', notes: '' });
  const [newCompanyEquity, setNewCompanyEquity] = useState({
    name: '', myShareRatio: '', dividendDay: '1', notes: ''
  });
  const [newMonthlyRecord, setNewMonthlyRecord] = useState<Record<string, {
    month: string; revenue: string; netProfit: string; myDividend: string; notes: string
  }>>({});
  const [newInvestmentAccount, setNewInvestmentAccount] = useState({
    name: '', type: 'stock' as InvestmentAccountType, platform: '', accountNumber: '', cashBalance: '', notes: ''
  });
  const [newHolding, setNewHolding] = useState<Record<string, {
    code: string; name: string; type: 'stock' | 'fund' | 'bond' | 'other';
    quantity: string; avgCost: string; currentPrice: string; purchaseDate: string; notes: string
  }>>({});
  const [expandedEquity, setExpandedEquity] = useState<string | null>(null);
  const [expandedInvestment, setExpandedInvestment] = useState<string | null>(null);

  // 计算月供
  const calculateMonthlyPayment = () => {
    const principal = parseFloat(newLiability.totalAmount) || 0;
    const rate = parseFloat(newLiability.interestRate) || 0;
    const months = parseInt(newLiability.loanTerm) || 12;
    const method = newLiability.repaymentMethod;
    
    const monthlyRate = rate / 100 / 12;
    let payment = 0;
    
    if (method === 'equal_principal_interest') {
      if (monthlyRate === 0) {
        payment = principal / months;
      } else {
        const pow = Math.pow(1 + monthlyRate, months);
        payment = principal * monthlyRate * pow / (pow - 1);
      }
    } else if (method === 'interest_only') {
      payment = principal * monthlyRate;
    } else if (method === 'equal_principal') {
      payment = principal / months;
    }
    
    setNewLiability(prev => ({ ...prev, monthlyPayment: payment.toFixed(2) }));
  };

  // 处理添加资产
  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.typeId || !newAsset.amount) return;
    onAddAsset({
      name: newAsset.name,
      typeId: newAsset.typeId,
      amount: parseFloat(newAsset.amount),
      returnRate: newAsset.returnRate ? parseFloat(newAsset.returnRate) : undefined,
      purchaseDate: newAsset.purchaseDate || undefined,
      notes: newAsset.notes || undefined,
    });
    setNewAsset({ name: '', typeId: '', amount: '', returnRate: '', purchaseDate: '', notes: '' });
  };

  // 处理添加负债
  const handleAddLiability = () => {
    if (!newLiability.name || !newLiability.typeId || !newLiability.totalAmount) return;
    onAddLiability({
      name: newLiability.name,
      typeId: newLiability.typeId,
      totalAmount: parseFloat(newLiability.totalAmount),
      remainingAmount: parseFloat(newLiability.remainingAmount) || parseFloat(newLiability.totalAmount),
      interestRate: parseFloat(newLiability.interestRate) || 0,
      repaymentMethod: newLiability.repaymentMethod,
      loanTerm: parseInt(newLiability.loanTerm),
      monthlyPayment: parseFloat(newLiability.monthlyPayment) || 0,
      dueDate: parseInt(newLiability.dueDate),
      startDate: newLiability.startDate || new Date().toISOString().slice(0, 10),
      notes: newLiability.notes || undefined,
    });
    setNewLiability({
      name: '', typeId: '', totalAmount: '', remainingAmount: '', interestRate: '',
      repaymentMethod: 'equal_principal_interest', loanTerm: '12', monthlyPayment: '',
      dueDate: '1', startDate: '', notes: ''
    });
  };

  // 处理添加信用卡
  const handleAddCreditCard = () => {
    if (!newCreditCard.name || !newCreditCard.typeId || !newCreditCard.bank || !newCreditCard.limit) return;
    onAddCreditCard({
      name: newCreditCard.name,
      typeId: newCreditCard.typeId,
      bank: newCreditCard.bank,
      limit: parseFloat(newCreditCard.limit),
      usedAmount: parseFloat(newCreditCard.usedAmount) || 0,
      billDate: parseInt(newCreditCard.billDate),
      dueDate: parseInt(newCreditCard.dueDate),
      interestRate: parseFloat(newCreditCard.interestRate) || 18,
      annualFee: newCreditCard.annualFee ? parseFloat(newCreditCard.annualFee) : undefined,
      notes: newCreditCard.notes || undefined,
    });
    setNewCreditCard({ name: '', typeId: '', bank: '', limit: '', usedAmount: '0', billDate: '1', dueDate: '10', interestRate: '18', annualFee: '', notes: '' });
  };

  // 处理添加储蓄卡
  const handleAddDebitCard = () => {
    if (!newDebitCard.name || !newDebitCard.typeId || !newDebitCard.bank) return;
    onAddDebitCard({
      name: newDebitCard.name,
      typeId: newDebitCard.typeId,
      bank: newDebitCard.bank,
      balance: parseFloat(newDebitCard.balance) || 0,
      annualFee: newDebitCard.annualFee ? parseFloat(newDebitCard.annualFee) : undefined,
      notes: newDebitCard.notes || undefined,
    });
    setNewDebitCard({ name: '', typeId: '', bank: '', balance: '', annualFee: '', notes: '' });
  };

  // 处理添加公司股权
  const handleAddCompanyEquity = () => {
    if (!newCompanyEquity.name || !newCompanyEquity.myShareRatio) return;
    onAddCompanyEquity({
      name: newCompanyEquity.name,
      myShareRatio: parseFloat(newCompanyEquity.myShareRatio),
      dividendDay: parseInt(newCompanyEquity.dividendDay) || 1,
      notes: newCompanyEquity.notes || undefined,
    });
    setNewCompanyEquity({ name: '', myShareRatio: '', dividendDay: '1', notes: '' });
  };

  // 处理添加月度记录
  const handleAddMonthlyRecord = (equityId: string) => {
    const record = newMonthlyRecord[equityId];
    if (!record || !record.month || !record.revenue || !record.netProfit) return;
    
    onAddCompanyEquityMonthlyRecord(equityId, {
      month: record.month,
      revenue: parseFloat(record.revenue),
      netProfit: parseFloat(record.netProfit),
      myDividend: parseFloat(record.myDividend) || 0,
      recordDate: new Date().toISOString().slice(0, 10),
      notes: record.notes || undefined,
    });
    
    setNewMonthlyRecord(prev => ({
      ...prev,
      [equityId]: { month: '', revenue: '', netProfit: '', myDividend: '', notes: '' }
    }));
  };

  // 处理添加投资账户
  const handleAddInvestmentAccount = () => {
    if (!newInvestmentAccount.name) return;
    onAddInvestmentAccount({
      name: newInvestmentAccount.name,
      type: newInvestmentAccount.type,
      platform: newInvestmentAccount.platform || undefined,
      accountNumber: newInvestmentAccount.accountNumber || undefined,
      cashBalance: parseFloat(newInvestmentAccount.cashBalance) || 0,
      totalValue: parseFloat(newInvestmentAccount.cashBalance) || 0,
      totalCost: 0,
      totalProfitLoss: 0,
      notes: newInvestmentAccount.notes || undefined,
    });
    setNewInvestmentAccount({ name: '', type: 'stock', platform: '', accountNumber: '', cashBalance: '', notes: '' });
  };

  // 处理添加持仓
  const handleAddHolding = (accountId: string) => {
    const holding = newHolding[accountId];
    if (!holding || !holding.code || !holding.name || !holding.quantity || !holding.avgCost || !holding.currentPrice) return;
    
    onAddInvestmentHolding(accountId, {
      code: holding.code,
      name: holding.name,
      type: holding.type,
      quantity: parseFloat(holding.quantity),
      avgCost: parseFloat(holding.avgCost),
      currentPrice: parseFloat(holding.currentPrice),
      purchaseDate: holding.purchaseDate || undefined,
      notes: holding.notes || undefined,
    });
    
    setNewHolding(prev => ({
      ...prev,
      [accountId]: { code: '', name: '', type: 'stock', quantity: '', avgCost: '', currentPrice: '', purchaseDate: '', notes: '' }
    }));
  };

  // 获取资产类型名称
  const getAssetTypeName = (typeId: string) => {
    const type = assetTypes.find(t => t.id === typeId);
    return type?.name || '未知类型';
  };

  // 获取资产类型图标
  const getAssetTypeIcon = (typeId: string) => {
    const type = assetTypes.find(t => t.id === typeId);
    const Icon = type?.icon ? iconMap[type.icon] || Wallet : Wallet;
    return <Icon className="w-4 h-4" style={{ color: type?.color }} />;
  };

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总资产</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ¥{totalAssets.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总负债</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ¥{totalLiabilities.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">净资产</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ¥{netWorth.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="assets">资产</TabsTrigger>
          <TabsTrigger value="liabilities">贷款</TabsTrigger>
          <TabsTrigger value="credit">信用卡</TabsTrigger>
          <TabsTrigger value="debit">储蓄卡</TabsTrigger>
          <TabsTrigger value="investment">投资</TabsTrigger>
        </TabsList>

        {/* 概览 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* 资产分布 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  资产分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assetTypes.map(type => {
                    const typeAssets = assets.filter(a => a.typeId === type.id);
                    const typeTotal = typeAssets.reduce((sum, a) => sum + a.amount, 0);
                    const percentage = totalAssets > 0 ? (typeTotal / totalAssets) * 100 : 0;
                    const Icon = iconMap[type.icon || ''] || Wallet;
                    
                    if (typeTotal === 0) return null;
                    
                    return (
                      <div key={type.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: type.color }} />
                          <span className="text-sm">{type.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">¥{typeTotal.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground w-12 text-right">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* 投资账户 */}
                  {investmentAccounts.length > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">投资账户</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">
                          ¥{investmentAccounts.reduce((sum, a) => sum + a.totalValue, 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {totalAssets > 0 ? ((investmentAccounts.reduce((sum, a) => sum + a.totalValue, 0) / totalAssets) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 负债分布 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  负债分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loanTypes.map(type => {
                    const typeLiabilities = liabilities.filter(l => l.typeId === type.id);
                    const typeTotal = typeLiabilities.reduce((sum, l) => sum + l.remainingAmount, 0);
                    const percentage = totalLiabilities > 0 ? (typeTotal / totalLiabilities) * 100 : 0;
                    const Icon = iconMap[type.icon || ''] || Wallet;
                    
                    if (typeTotal === 0) return null;
                    
                    return (
                      <div key={type.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: type.color }} />
                          <span className="text-sm">{type.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">¥{typeTotal.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground w-12 text-right">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* 信用卡负债 */}
                  {creditCards.reduce((sum, c) => sum + c.usedAmount, 0) > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCardIcon className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">信用卡欠款</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">
                          ¥{creditCards.reduce((sum, c) => sum + c.usedAmount, 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {totalLiabilities > 0 ? ((creditCards.reduce((sum, c) => sum + c.usedAmount, 0) / totalLiabilities) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 资产管理 */}
        <TabsContent value="assets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">资产管理</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" />添加资产</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加资产</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>资产名称</Label>
                    <Input value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} placeholder="如：余额宝、股票账户" />
                  </div>
                  <div>
                    <Label>资产类型</Label>
                    <Select value={newAsset.typeId} onValueChange={value => setNewAsset({...newAsset, typeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>金额</Label>
                    <Input type="number" value={newAsset.amount} onChange={e => setNewAsset({...newAsset, amount: e.target.value})} placeholder="0.00" />
                  </div>
                  <div>
                    <Label>预期年化收益率 (%)</Label>
                    <Input type="number" value={newAsset.returnRate} onChange={e => setNewAsset({...newAsset, returnRate: e.target.value})} placeholder="可选" />
                  </div>
                  <div>
                    <Label>购买日期</Label>
                    <Input type="date" value={newAsset.purchaseDate} onChange={e => setNewAsset({...newAsset, purchaseDate: e.target.value})} />
                  </div>
                  <Button onClick={handleAddAsset} className="w-full">添加</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 自定义类型 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">自定义资产类型</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="类型名称" 
                  value={newAssetType.name}
                  onChange={e => setNewAssetType({...newAssetType, name: e.target.value})}
                  className="flex-1"
                />
                <Input 
                  type="color" 
                  value={newAssetType.color}
                  onChange={e => setNewAssetType({...newAssetType, color: e.target.value})}
                  className="w-16"
                />
                <Button onClick={() => {
                  if (newAssetType.name) {
                    onAddAssetType({ name: newAssetType.name, icon: 'Wallet', color: newAssetType.color });
                    setNewAssetType({ name: '', icon: 'Wallet', color: '#3b82f6' });
                  }
                }}>添加</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {assetTypes.filter(t => !t.isDefault).map(type => (
                  <Badge key={type.id} variant="secondary" className="gap-1">
                    {type.name}
                    <button onClick={() => _onDeleteAssetType(type.id)} className="ml-1 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 资产列表 */}
          <div className="grid gap-3">
            {assets.map(asset => (
              <Card key={asset.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getAssetTypeIcon(asset.typeId)}
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{getAssetTypeName(asset.typeId)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">¥{asset.amount.toLocaleString()}</p>
                        {asset.returnRate && (
                          <p className="text-xs text-emerald-500">+{asset.returnRate}%/年</p>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteAsset(asset.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 贷款管理 */}
        <TabsContent value="liabilities" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">贷款管理</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" />添加贷款</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>添加贷款</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>贷款名称</Label>
                    <Input value={newLiability.name} onChange={e => setNewLiability({...newLiability, name: e.target.value})} placeholder="如：房贷、车贷" />
                  </div>
                  <div>
                    <Label>贷款类型</Label>
                    <Select value={newLiability.typeId} onValueChange={value => setNewLiability({...newLiability, typeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {loanTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>贷款总额</Label>
                      <Input type="number" value={newLiability.totalAmount} onChange={e => setNewLiability({...newLiability, totalAmount: e.target.value})} placeholder="0.00" />
                    </div>
                    <div>
                      <Label>剩余本金</Label>
                      <Input type="number" value={newLiability.remainingAmount} onChange={e => setNewLiability({...newLiability, remainingAmount: e.target.value})} placeholder="默认等于总额" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>年利率 (%)</Label>
                      <Input type="number" step="0.01" value={newLiability.interestRate} onChange={e => setNewLiability({...newLiability, interestRate: e.target.value})} placeholder="4.5" />
                    </div>
                    <div>
                      <Label>还款方式</Label>
                      <Select value={newLiability.repaymentMethod} onValueChange={value => setNewLiability({...newLiability, repaymentMethod: value as RepaymentMethod})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interest_only">先息后本</SelectItem>
                          <SelectItem value="equal_principal_interest">等额本息</SelectItem>
                          <SelectItem value="equal_principal">等额本金</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>贷款期限</Label>
                      <Select value={newLiability.loanTerm} onValueChange={value => setNewLiability({...newLiability, loanTerm: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LOAN_TERMS.map(term => (
                            <SelectItem key={term} value={term.toString()}>{term}个月</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>每月还款日</Label>
                      <Select value={newLiability.dueDate} onValueChange={value => setNewLiability({...newLiability, dueDate: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 31}, (_, i) => (
                            <SelectItem key={i+1} value={(i+1).toString()}>{i+1}日</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label>月供金额</Label>
                      <Input type="number" value={newLiability.monthlyPayment} onChange={e => setNewLiability({...newLiability, monthlyPayment: e.target.value})} placeholder="点击计算" />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" onClick={calculateMonthlyPayment} type="button">计算</Button>
                    </div>
                  </div>
                  <Button onClick={handleAddLiability} className="w-full">添加</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 自定义类型 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">自定义贷款类型</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="类型名称" 
                  value={newLoanType.name}
                  onChange={e => setNewLoanType({...newLoanType, name: e.target.value})}
                  className="flex-1"
                />
                <Input 
                  type="color" 
                  value={newLoanType.color}
                  onChange={e => setNewLoanType({...newLoanType, color: e.target.value})}
                  className="w-16"
                />
                <Button onClick={() => {
                  if (newLoanType.name) {
                    onAddLoanType({ name: newLoanType.name, icon: 'Wallet', color: newLoanType.color });
                    setNewLoanType({ name: '', icon: 'Wallet', color: '#3b82f6' });
                  }
                }}>添加</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {loanTypes.filter(t => !t.isDefault).map(type => (
                  <Badge key={type.id} variant="secondary" className="gap-1">
                    {type.name}
                    <button onClick={() => _onDeleteLoanType(type.id)} className="ml-1 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 贷款列表 */}
          <div className="grid gap-3">
            {liabilities.map(liability => (
              <Card key={liability.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{liability.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {RepaymentMethodLabels[liability.repaymentMethod]} · {liability.loanTerm}个月 · 每月{liability.dueDate}日还款
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">¥{liability.remainingAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">月供 ¥{liability.monthlyPayment.toLocaleString()}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteLiability(liability.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 信用卡管理 */}
        <TabsContent value="credit" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">信用卡管理</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" />添加信用卡</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加信用卡</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>卡片名称</Label>
                    <Input value={newCreditCard.name} onChange={e => setNewCreditCard({...newCreditCard, name: e.target.value})} placeholder="如：招行经典白" />
                  </div>
                  <div>
                    <Label>卡片类型</Label>
                    <Select value={newCreditCard.typeId} onValueChange={value => setNewCreditCard({...newCreditCard, typeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {creditCardTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>发卡银行</Label>
                    <Input value={newCreditCard.bank} onChange={e => setNewCreditCard({...newCreditCard, bank: e.target.value})} placeholder="如：招商银行" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>信用额度</Label>
                      <Input type="number" value={newCreditCard.limit} onChange={e => setNewCreditCard({...newCreditCard, limit: e.target.value})} placeholder="0.00" />
                    </div>
                    <div>
                      <Label>已用额度</Label>
                      <Input type="number" value={newCreditCard.usedAmount} onChange={e => setNewCreditCard({...newCreditCard, usedAmount: e.target.value})} placeholder="0.00" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>账单日</Label>
                      <Select value={newCreditCard.billDate} onValueChange={value => setNewCreditCard({...newCreditCard, billDate: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 31}, (_, i) => (
                            <SelectItem key={i+1} value={(i+1).toString()}>{i+1}日</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>还款日</Label>
                      <Select value={newCreditCard.dueDate} onValueChange={value => setNewCreditCard({...newCreditCard, dueDate: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 31}, (_, i) => (
                            <SelectItem key={i+1} value={(i+1).toString()}>{i+1}日</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>年利率 (%)</Label>
                      <Input type="number" value={newCreditCard.interestRate} onChange={e => setNewCreditCard({...newCreditCard, interestRate: e.target.value})} placeholder="18" />
                    </div>
                    <div>
                      <Label>年费</Label>
                      <Input type="number" value={newCreditCard.annualFee} onChange={e => setNewCreditCard({...newCreditCard, annualFee: e.target.value})} placeholder="可选" />
                    </div>
                  </div>
                  <Button onClick={handleAddCreditCard} className="w-full">添加</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 自定义类型 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">自定义卡片类型</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="类型名称" 
                  value={newCreditCardType.name}
                  onChange={e => setNewCreditCardType({...newCreditCardType, name: e.target.value})}
                  className="flex-1"
                />
                <Input 
                  type="color" 
                  value={newCreditCardType.color}
                  onChange={e => setNewCreditCardType({...newCreditCardType, color: e.target.value})}
                  className="w-16"
                />
                <Button onClick={() => {
                  if (newCreditCardType.name) {
                    onAddCreditCardType({ name: newCreditCardType.name, icon: 'CreditCard', color: newCreditCardType.color });
                    setNewCreditCardType({ name: '', icon: 'CreditCard', color: '#3b82f6' });
                  }
                }}>添加</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {creditCardTypes.filter(t => !t.isDefault).map(type => (
                  <Badge key={type.id} variant="secondary" className="gap-1">
                    {type.name}
                    <button onClick={() => _onDeleteCreditCardType(type.id)} className="ml-1 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 信用卡列表 */}
          <div className="grid gap-3">
            {creditCards.map(card => {
              const utilization = card.limit > 0 ? (card.usedAmount / card.limit) * 100 : 0;
              return (
                <Card key={card.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{card.bank} · {card.name}</p>
                        <p className="text-sm text-muted-foreground">
                          账单日{card.billDate}日 · 还款日{card.dueDate}日
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">¥{card.usedAmount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">额度 ¥{card.limit.toLocaleString()}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteCreditCard(card.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>额度使用率</span>
                        <span className={utilization > 80 ? 'text-red-500' : 'text-muted-foreground'}>{utilization.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${utilization > 80 ? 'bg-red-500' : utilization > 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* 储蓄卡管理 */}
        <TabsContent value="debit" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">储蓄卡管理</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" />添加储蓄卡</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加储蓄卡</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>卡片名称</Label>
                    <Input value={newDebitCard.name} onChange={e => setNewDebitCard({...newDebitCard, name: e.target.value})} placeholder="如：工资卡" />
                  </div>
                  <div>
                    <Label>卡片类型</Label>
                    <Select value={newDebitCard.typeId} onValueChange={value => setNewDebitCard({...newDebitCard, typeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {debitCardTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>发卡银行</Label>
                    <Input value={newDebitCard.bank} onChange={e => setNewDebitCard({...newDebitCard, bank: e.target.value})} placeholder="如：工商银行" />
                  </div>
                  <div>
                    <Label>当前余额</Label>
                    <Input type="number" value={newDebitCard.balance} onChange={e => setNewDebitCard({...newDebitCard, balance: e.target.value})} placeholder="0.00" />
                  </div>
                  <div>
                    <Label>年费</Label>
                    <Input type="number" value={newDebitCard.annualFee} onChange={e => setNewDebitCard({...newDebitCard, annualFee: e.target.value})} placeholder="可选" />
                  </div>
                  <Button onClick={handleAddDebitCard} className="w-full">添加</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 自定义类型 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">自定义卡片类型</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="类型名称" 
                  value={newDebitCardType.name}
                  onChange={e => setNewDebitCardType({...newDebitCardType, name: e.target.value})}
                  className="flex-1"
                />
                <Input 
                  type="color" 
                  value={newDebitCardType.color}
                  onChange={e => setNewDebitCardType({...newDebitCardType, color: e.target.value})}
                  className="w-16"
                />
                <Button onClick={() => {
                  if (newDebitCardType.name) {
                    onAddDebitCardType({ name: newDebitCardType.name, icon: 'Wallet', color: newDebitCardType.color });
                    setNewDebitCardType({ name: '', icon: 'Wallet', color: '#3b82f6' });
                  }
                }}>添加</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {debitCardTypes.filter(t => !t.isDefault).map(type => (
                  <Badge key={type.id} variant="secondary" className="gap-1">
                    {type.name}
                    <button onClick={() => _onDeleteDebitCardType(type.id)} className="ml-1 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 储蓄卡列表 */}
          <div className="grid gap-3">
            {debitCards.map(card => (
              <Card key={card.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{card.bank} · {card.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {debitCardTypes.find(t => t.id === card.typeId)?.name || '储蓄卡'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">¥{card.balance.toLocaleString()}</p>
                        {card.annualFee && <p className="text-xs text-muted-foreground">年费 ¥{card.annualFee}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteDebitCard(card.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 投资管理 */}
        <TabsContent value="investment" className="space-y-4">
          <Tabs defaultValue="company">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="company">公司股权</TabsTrigger>
              <TabsTrigger value="stocks">股票基金</TabsTrigger>
            </TabsList>

            {/* 公司股权 */}
            <TabsContent value="company" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">公司股权管理</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-1" />添加公司</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>添加公司股权</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>公司名称</Label>
                        <Input value={newCompanyEquity.name} onChange={e => setNewCompanyEquity({...newCompanyEquity, name: e.target.value})} placeholder="如：XX科技有限公司" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>股份占比 (%)</Label>
                          <Input type="number" step="0.01" value={newCompanyEquity.myShareRatio} onChange={e => setNewCompanyEquity({...newCompanyEquity, myShareRatio: e.target.value})} placeholder="如：30" />
                        </div>
                        <div>
                          <Label>每月分红日</Label>
                          <Select value={newCompanyEquity.dividendDay} onValueChange={value => setNewCompanyEquity({...newCompanyEquity, dividendDay: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 31}, (_, i) => (
                                <SelectItem key={i+1} value={(i+1).toString()}>{i+1}日</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={handleAddCompanyEquity} className="w-full">添加</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* 公司股权列表 */}
              <div className="space-y-4">
                {companyEquities.map(equity => {
                  const totalDividend = equity.monthlyRecords.reduce((sum, r) => sum + r.myDividend, 0);
                  const latestRecord = equity.monthlyRecords[equity.monthlyRecords.length - 1];
                  
                  return (
                    <Card key={equity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-pink-500" />
                            <div>
                              <p className="font-medium">{equity.name}</p>
                              <p className="text-sm text-muted-foreground">持股 {equity.myShareRatio}% · 每月{equity.dividendDay}日分红</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-emerald-600">¥{totalDividend.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">累计分红</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onDeleteCompanyEquity(equity.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>

                        {/* 最新记录 */}
                        {latestRecord && (
                          <div className="bg-slate-50 rounded-lg p-3 mb-4">
                            <p className="text-sm font-medium mb-2">最新记录 ({latestRecord.month})</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">营业额</p>
                                <p className="font-medium">¥{latestRecord.revenue.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">净利润</p>
                                <p className="font-medium">¥{latestRecord.netProfit.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">我的分红</p>
                                <p className="font-medium text-emerald-600">¥{latestRecord.myDividend.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 月度记录手风琴 */}
                        <Accordion type="single" collapsible value={expandedEquity || ''} onValueChange={setExpandedEquity}>
                          <AccordionItem value={equity.id}>
                            <AccordionTrigger className="text-sm">
                              查看全部记录 ({equity.monthlyRecords.length}条)
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3">
                                {/* 添加新记录 */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-lg">
                                  <Input 
                                    type="month" 
                                    placeholder="月份"
                                    value={newMonthlyRecord[equity.id]?.month || ''}
                                    onChange={e => setNewMonthlyRecord(prev => ({
                                      ...prev,
                                      [equity.id]: { ...(prev[equity.id] || {}), month: e.target.value }
                                    }))}
                                  />
                                  <Input 
                                    type="number" 
                                    placeholder="营业额"
                                    value={newMonthlyRecord[equity.id]?.revenue || ''}
                                    onChange={e => setNewMonthlyRecord(prev => ({
                                      ...prev,
                                      [equity.id]: { ...(prev[equity.id] || {}), revenue: e.target.value }
                                    }))}
                                  />
                                  <Input 
                                    type="number" 
                                    placeholder="净利润"
                                    value={newMonthlyRecord[equity.id]?.netProfit || ''}
                                    onChange={e => setNewMonthlyRecord(prev => ({
                                      ...prev,
                                      [equity.id]: { ...(prev[equity.id] || {}), netProfit: e.target.value }
                                    }))}
                                  />
                                  <div className="flex gap-2">
                                    <Input 
                                      type="number" 
                                      placeholder="分红金额"
                                      value={newMonthlyRecord[equity.id]?.myDividend || ''}
                                      onChange={e => setNewMonthlyRecord(prev => ({
                                        ...prev,
                                        [equity.id]: { ...(prev[equity.id] || {}), myDividend: e.target.value }
                                      }))}
                                    />
                                    <Button size="icon" onClick={() => handleAddMonthlyRecord(equity.id)}><Plus className="w-4 h-4" /></Button>
                                  </div>
                                </div>

                                {/* 历史记录 */}
                                {equity.monthlyRecords.slice().reverse().map(record => (
                                  <div key={record.id} className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-3 border rounded-lg text-sm">
                                    <div>{record.month}</div>
                                    <div>¥{record.revenue.toLocaleString()}</div>
                                    <div>¥{record.netProfit.toLocaleString()}</div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-emerald-600">¥{record.myDividend.toLocaleString()}</span>
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDeleteCompanyEquityMonthlyRecord(equity.id, record.id)}>
                                        <Trash2 className="w-3 h-3 text-red-500" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* 股票基金 */}
            <TabsContent value="stocks" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">投资账户管理</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-1" />添加账户</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>添加投资账户</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>账户名称</Label>
                        <Input value={newInvestmentAccount.name} onChange={e => setNewInvestmentAccount({...newInvestmentAccount, name: e.target.value})} placeholder="如：华泰证券主账户" />
                      </div>
                      <div>
                        <Label>账户类型</Label>
                        <Select value={newInvestmentAccount.type} onValueChange={value => setNewInvestmentAccount({...newInvestmentAccount, type: value as InvestmentAccountType})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stock">股票</SelectItem>
                            <SelectItem value="fund">基金</SelectItem>
                            <SelectItem value="bond">债券</SelectItem>
                            <SelectItem value="crypto">加密货币</SelectItem>
                            <SelectItem value="forex">外汇</SelectItem>
                            <SelectItem value="other">其他</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>券商/平台</Label>
                        <Input value={newInvestmentAccount.platform} onChange={e => setNewInvestmentAccount({...newInvestmentAccount, platform: e.target.value})} placeholder="如：华泰证券、支付宝" />
                      </div>
                      <div>
                        <Label>账号（可选）</Label>
                        <Input value={newInvestmentAccount.accountNumber} onChange={e => setNewInvestmentAccount({...newInvestmentAccount, accountNumber: e.target.value})} placeholder="可选" />
                      </div>
                      <div>
                        <Label>现金余额</Label>
                        <Input type="number" value={newInvestmentAccount.cashBalance} onChange={e => setNewInvestmentAccount({...newInvestmentAccount, cashBalance: e.target.value})} placeholder="0.00" />
                      </div>
                      <Button onClick={handleAddInvestmentAccount} className="w-full">添加</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* 投资账户列表 */}
              <div className="space-y-4">
                {investmentAccounts.map(account => {
                  const totalMarketValue = account.holdings.reduce((sum, h) => sum + h.marketValue, 0);
                  const totalCost = account.holdings.reduce((sum, h) => sum + h.avgCost * h.quantity, 0);
                  const totalProfitLoss = totalMarketValue - totalCost;
                  
                  return (
                    <Card key={account.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {account.type === 'stock' && <StockIcon className="w-5 h-5 text-red-500" />}
                            {account.type === 'fund' && <BarChart3 className="w-5 h-5 text-blue-500" />}
                            {account.type === 'bond' && <Landmark className="w-5 h-5 text-green-500" />}
                            {account.type === 'crypto' && <Bitcoin className="w-5 h-5 text-orange-500" />}
                            {account.type === 'forex' && <DollarSign className="w-5 h-5 text-purple-500" />}
                            {account.type === 'other' && <Wallet className="w-5 h-5 text-gray-500" />}
                            <div>
                              <p className="font-medium">{account.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {InvestmentAccountTypeLabels[account.type]} · {account.platform}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold">¥{(totalMarketValue + account.cashBalance).toLocaleString()}</p>
                              <p className={`text-xs ${totalProfitLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {totalProfitLoss >= 0 ? '+' : ''}¥{totalProfitLoss.toLocaleString()}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onDeleteInvestmentAccount(account.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>

                        {/* 持仓概览 */}
                        {account.holdings.length > 0 && (
                          <div className="bg-slate-50 rounded-lg p-3 mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">持仓市值</span>
                              <span className="font-medium">¥{totalMarketValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">现金余额</span>
                              <span className="font-medium">¥{account.cashBalance.toLocaleString()}</span>
                            </div>
                          </div>
                        )}

                        {/* 持仓详情手风琴 */}
                        <Accordion type="single" collapsible value={expandedInvestment || ''} onValueChange={setExpandedInvestment}>
                          <AccordionItem value={account.id}>
                            <AccordionTrigger className="text-sm">
                              持仓详情 ({account.holdings.length}只)
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3">
                                {/* 添加新持仓 */}
                                <div className="grid grid-cols-6 gap-2 p-3 bg-slate-50 rounded-lg">
                                  <Input 
                                    placeholder="代码"
                                    value={newHolding[account.id]?.code || ''}
                                    onChange={e => setNewHolding(prev => ({
                                      ...prev,
                                      [account.id]: { ...(prev[account.id] || {}), code: e.target.value }
                                    }))}
                                  />
                                  <Input 
                                    placeholder="名称"
                                    value={newHolding[account.id]?.name || ''}
                                    onChange={e => setNewHolding(prev => ({
                                      ...prev,
                                      [account.id]: { ...(prev[account.id] || {}), name: e.target.value }
                                    }))}
                                  />
                                  <Select 
                                    value={newHolding[account.id]?.type || 'stock'}
                                    onValueChange={value => setNewHolding(prev => ({
                                      ...prev,
                                      [account.id]: { ...(prev[account.id] || {}), type: value as 'stock' | 'fund' | 'bond' | 'other' }
                                    }))}
                                  >
                                    <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="stock">股票</SelectItem>
                                      <SelectItem value="fund">基金</SelectItem>
                                      <SelectItem value="bond">债券</SelectItem>
                                      <SelectItem value="other">其他</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input 
                                    type="number" 
                                    placeholder="数量"
                                    value={newHolding[account.id]?.quantity || ''}
                                    onChange={e => setNewHolding(prev => ({
                                      ...prev,
                                      [account.id]: { ...(prev[account.id] || {}), quantity: e.target.value }
                                    }))}
                                  />
                                  <Input 
                                    type="number" 
                                    placeholder="成本价"
                                    value={newHolding[account.id]?.avgCost || ''}
                                    onChange={e => setNewHolding(prev => ({
                                      ...prev,
                                      [account.id]: { ...(prev[account.id] || {}), avgCost: e.target.value }
                                    }))}
                                  />
                                  <div className="flex gap-1">
                                    <Input 
                                      type="number" 
                                      placeholder="现价"
                                      value={newHolding[account.id]?.currentPrice || ''}
                                      onChange={e => setNewHolding(prev => ({
                                        ...prev,
                                        [account.id]: { ...(prev[account.id] || {}), currentPrice: e.target.value }
                                      }))}
                                    />
                                    <Button size="icon" className="shrink-0" onClick={() => handleAddHolding(account.id)}><Plus className="w-4 h-4" /></Button>
                                  </div>
                                </div>

                                {/* 持仓列表 */}
                                {account.holdings.map(holding => (
                                  <div key={holding.id} className="p-3 border rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <p className="font-medium">{holding.name} <span className="text-muted-foreground">({holding.code})</span></p>
                                        <p className="text-xs text-muted-foreground">
                                          {holding.quantity}股 · 成本¥{holding.avgCost} · 现价¥{holding.currentPrice}
                                        </p>
                                      </div>
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDeleteInvestmentHolding(account.id, holding.id)}>
                                        <Trash2 className="w-3 h-3 text-red-500" />
                                      </Button>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">市值 ¥{holding.marketValue.toLocaleString()}</span>
                                      <span className={holding.profitLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                        {holding.profitLoss >= 0 ? '+' : ''}¥{holding.profitLoss.toLocaleString()} ({holding.profitLossRate.toFixed(2)}%)
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
