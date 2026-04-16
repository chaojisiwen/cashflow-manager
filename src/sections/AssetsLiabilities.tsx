import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Trash2, Wallet, TrendingUp, Building2, Coins, 
  Landmark, CreditCard as CreditCardIcon, AlertCircle, PiggyBank, Home, CircleDollarSign,
  Wallet as WalletIcon, Settings, Banknote
} from 'lucide-react';
import type { 
  Asset, AssetType, Liability, LoanType, 
  CreditCard, CreditCardType, DebitCard, DebitCardType,
  RepaymentMethod
} from '@/types/finance';
import { RepaymentMethodLabels } from '@/types/finance';
import { LOAN_TERMS, calculateLoanPayment } from '@/hooks/useFinance';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Wallet, TrendingUp, Building2, Coins, Landmark, CreditCardIcon, 
  AlertCircle, PiggyBank, Home, CircleDollarSign, WalletIcon, Settings, Banknote,
};

interface AssetsLiabilitiesProps {
  assetTypes: AssetType[];
  assets: Asset[];
  loanTypes: LoanType[];
  liabilities: Liability[];
  creditCardTypes: CreditCardType[];
  creditCards: CreditCard[];
  debitCardTypes: DebitCardType[];
  debitCards: DebitCard[];
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
}

function formatMoney(amount: number): string {
  return '¥' + amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function AssetsLiabilities({
  assetTypes,
  assets,
  loanTypes,
  liabilities,
  creditCardTypes,
  creditCards,
  debitCardTypes,
  debitCards,
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
}: AssetsLiabilitiesProps) {
  const [activeTab, setActiveTab] = useState('assets');
  
  // 资产表单
  const [assetForm, setAssetForm] = useState({
    name: '',
    typeId: '',
    amount: '',
    returnRate: '',
    notes: '',
  });

  // 资产类型表单
  const [assetTypeForm, setAssetTypeForm] = useState({
    name: '',
    icon: 'Wallet',
    color: '#10b981',
  });

  // 贷款表单
  const [liabilityForm, setLiabilityForm] = useState({
    name: '',
    typeId: '',
    totalAmount: '',
    remainingAmount: '',
    interestRate: '',
    repaymentMethod: 'equal_principal_interest' as RepaymentMethod,
    loanTerm: '12',
    dueDate: '1',
    notes: '',
  });

  // 贷款类型表单
  const [loanTypeForm, setLoanTypeForm] = useState({
    name: '',
    icon: 'Landmark',
    color: '#3b82f6',
  });

  // 信用卡表单
  const [cardForm, setCardForm] = useState({
    name: '',
    typeId: '',
    bank: '',
    limit: '',
    usedAmount: '',
    billDate: '1',
    dueDate: '10',
    interestRate: '18.25',
    annualFee: '',
  });

  // 信用卡类型表单
  const [creditCardTypeForm, setCreditCardTypeForm] = useState({
    name: '',
    icon: 'CreditCardIcon',
    color: '#1a1f71',
  });

  // 储蓄卡表单
  const [debitCardForm, setDebitCardForm] = useState({
    name: '',
    typeId: '',
    bank: '',
    balance: '',
    annualFee: '',
    notes: '',
  });

  // 储蓄卡类型表单
  const [debitCardTypeForm, setDebitCardTypeForm] = useState({
    name: '',
    icon: 'Wallet',
    color: '#10b981',
  });

  // 计算贷款月供
  const calculatedPayment = (() => {
    if (!liabilityForm.totalAmount || !liabilityForm.interestRate || !liabilityForm.loanTerm) {
      return null;
    }
    return calculateLoanPayment(
      parseFloat(liabilityForm.totalAmount),
      parseFloat(liabilityForm.interestRate),
      parseInt(liabilityForm.loanTerm),
      liabilityForm.repaymentMethod
    );
  })();

  const handleAddAsset = () => {
    if (!assetForm.name || !assetForm.typeId || !assetForm.amount) return;
    onAddAsset({
      name: assetForm.name,
      typeId: assetForm.typeId,
      amount: parseFloat(assetForm.amount),
      returnRate: assetForm.returnRate ? parseFloat(assetForm.returnRate) : undefined,
      notes: assetForm.notes,
    });
    setAssetForm({ name: '', typeId: '', amount: '', returnRate: '', notes: '' });
  };

  const handleAddAssetType = () => {
    if (!assetTypeForm.name) return;
    onAddAssetType({
      name: assetTypeForm.name,
      icon: assetTypeForm.icon,
      color: assetTypeForm.color,
    });
    setAssetTypeForm({ name: '', icon: 'Wallet', color: '#10b981' });
  };

  const handleAddLiability = () => {
    if (!liabilityForm.name || !liabilityForm.typeId || !liabilityForm.totalAmount) return;
    
    const payment = calculatedPayment;
    
    onAddLiability({
      name: liabilityForm.name,
      typeId: liabilityForm.typeId,
      totalAmount: parseFloat(liabilityForm.totalAmount),
      remainingAmount: parseFloat(liabilityForm.remainingAmount) || parseFloat(liabilityForm.totalAmount),
      interestRate: parseFloat(liabilityForm.interestRate) || 0,
      repaymentMethod: liabilityForm.repaymentMethod,
      loanTerm: parseInt(liabilityForm.loanTerm),
      monthlyPayment: payment?.monthlyPayment || 0,
      firstMonthPayment: payment?.firstMonthPayment,
      dueDate: parseInt(liabilityForm.dueDate),
      startDate: new Date().toISOString().slice(0, 10),
      notes: liabilityForm.notes,
    });
    setLiabilityForm({
      name: '', typeId: '', totalAmount: '', remainingAmount: '',
      interestRate: '', repaymentMethod: 'equal_principal_interest', loanTerm: '12', dueDate: '1', notes: '',
    });
  };

  const handleAddLoanType = () => {
    if (!loanTypeForm.name) return;
    onAddLoanType({
      name: loanTypeForm.name,
      icon: loanTypeForm.icon,
      color: loanTypeForm.color,
    });
    setLoanTypeForm({ name: '', icon: 'Landmark', color: '#3b82f6' });
  };

  const handleAddCreditCard = () => {
    if (!cardForm.name || !cardForm.typeId || !cardForm.bank || !cardForm.limit) return;
    onAddCreditCard({
      name: cardForm.name,
      typeId: cardForm.typeId,
      bank: cardForm.bank,
      limit: parseFloat(cardForm.limit),
      usedAmount: parseFloat(cardForm.usedAmount) || 0,
      billDate: parseInt(cardForm.billDate),
      dueDate: parseInt(cardForm.dueDate),
      interestRate: parseFloat(cardForm.interestRate) || 18.25,
      annualFee: cardForm.annualFee ? parseFloat(cardForm.annualFee) : undefined,
    });
    setCardForm({
      name: '', typeId: '', bank: '', limit: '', usedAmount: '',
      billDate: '1', dueDate: '10', interestRate: '18.25', annualFee: '',
    });
  };

  const handleAddCreditCardType = () => {
    if (!creditCardTypeForm.name) return;
    onAddCreditCardType({
      name: creditCardTypeForm.name,
      icon: creditCardTypeForm.icon,
      color: creditCardTypeForm.color,
    });
    setCreditCardTypeForm({ name: '', icon: 'CreditCardIcon', color: '#1a1f71' });
  };

  const handleAddDebitCard = () => {
    if (!debitCardForm.name || !debitCardForm.typeId || !debitCardForm.bank) return;
    onAddDebitCard({
      name: debitCardForm.name,
      typeId: debitCardForm.typeId,
      bank: debitCardForm.bank,
      balance: parseFloat(debitCardForm.balance) || 0,
      annualFee: debitCardForm.annualFee ? parseFloat(debitCardForm.annualFee) : undefined,
      notes: debitCardForm.notes,
    });
    setDebitCardForm({
      name: '', typeId: '', bank: '', balance: '', annualFee: '', notes: '',
    });
  };

  const handleAddDebitCardType = () => {
    if (!debitCardTypeForm.name) return;
    onAddDebitCardType({
      name: debitCardTypeForm.name,
      icon: debitCardTypeForm.icon,
      color: debitCardTypeForm.color,
    });
    setDebitCardTypeForm({ name: '', icon: 'Wallet', color: '#10b981' });
  };

  // 按类型统计资产
  const assetsByType = assetTypes.map(type => {
    const typeAssets = assets.filter(a => a.typeId === type.id);
    const total = typeAssets.reduce((sum, a) => sum + a.amount, 0);
    const Icon = iconMap[type.icon || 'Wallet'] || Wallet;
    return { ...type, total, count: typeAssets.length, Icon };
  }).sort((a, b) => b.total - a.total);

  // 按类型统计贷款
  const loansByType = loanTypes.map(type => {
    const typeLoans = liabilities.filter(l => l.typeId === type.id);
    const total = typeLoans.reduce((sum, l) => sum + l.remainingAmount, 0);
    const Icon = iconMap[type.icon || 'Landmark'] || Landmark;
    return { ...type, total, count: typeLoans.length, Icon };
  }).sort((a, b) => b.total - a.total);

  // 信用卡总欠款
  const totalCreditCardDebt = creditCards.reduce((sum, c) => sum + c.usedAmount, 0);
  const totalCreditLimit = creditCards.reduce((sum, c) => sum + c.limit, 0);
  const creditUtilization = totalCreditLimit > 0 ? (totalCreditCardDebt / totalCreditLimit) * 100 : 0;

  // 储蓄卡总余额
  const totalDebitCardBalance = debitCards.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">总资产</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(totalAssets)}</div>
            <p className="text-sm text-emerald-100 mt-1">{assets.length} 项资产</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-100">总负债</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(totalLiabilities)}</div>
            <p className="text-sm text-rose-100 mt-1">
              {liabilities.length} 笔贷款 + {creditCards.length} 张信用卡
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">净资产</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(netWorth)}</div>
            <p className="text-sm text-blue-100 mt-1">
              资产负债率: {totalAssets > 0 ? ((totalLiabilities / totalAssets) * 100).toFixed(1) : '0'}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">储蓄卡余额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(totalDebitCardBalance)}</div>
            <p className="text-sm text-amber-100 mt-1">{debitCards.length} 张储蓄卡</p>
          </CardContent>
        </Card>
      </div>

      {/* 详细管理 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">资产</TabsTrigger>
          <TabsTrigger value="liabilities">贷款</TabsTrigger>
          <TabsTrigger value="creditcards">信用卡</TabsTrigger>
          <TabsTrigger value="debitcards">储蓄卡</TabsTrigger>
        </TabsList>

        {/* 资产 */}
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>资产分布</CardTitle>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> 类型</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>添加资产类型</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>类型名称</Label>
                        <Input 
                          value={assetTypeForm.name}
                          onChange={e => setAssetTypeForm({ ...assetTypeForm, name: e.target.value })}
                          placeholder="例如：黄金"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>图标颜色</Label>
                        <div className="flex gap-2">
                          {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'].map(color => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full ${assetTypeForm.color === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => setAssetTypeForm({ ...assetTypeForm, color })}
                            />
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleAddAssetType} className="w-full">添加</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-1" /> 添加资产</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>添加资产</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>资产名称</Label>
                        <Input 
                          value={assetForm.name}
                          onChange={e => setAssetForm({ ...assetForm, name: e.target.value })}
                          placeholder="例如：工商银行存款"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>资产类型</Label>
                        <Select 
                          value={assetForm.typeId} 
                          onValueChange={v => setAssetForm({ ...assetForm, typeId: v })}
                        >
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
                      <div className="space-y-2">
                        <Label>金额</Label>
                        <Input 
                          type="number"
                          value={assetForm.amount}
                          onChange={e => setAssetForm({ ...assetForm, amount: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>年化收益率（可选）</Label>
                        <Input 
                          type="number"
                          value={assetForm.returnRate}
                          onChange={e => setAssetForm({ ...assetForm, returnRate: e.target.value })}
                          placeholder="%"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>备注</Label>
                        <Input 
                          value={assetForm.notes}
                          onChange={e => setAssetForm({ ...assetForm, notes: e.target.value })}
                          placeholder="可选"
                        />
                      </div>
                      <Button onClick={handleAddAsset} className="w-full">添加</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {assetsByType.filter(a => a.total > 0).map(asset => {
                  const Icon = asset.Icon;
                  const percentage = totalAssets > 0 ? (asset.total / totalAssets) * 100 : 0;
                  return (
                    <div key={asset.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: (asset.color || '#ccc') + '20' }}>
                        <Icon className="w-5 h-5" style={{ color: asset.color || '#666' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{formatMoney(asset.total)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{percentage.toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">{asset.count}项</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>收益率</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        暂无资产记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    assets.map(asset => {
                      const type = assetTypes.find(t => t.id === asset.typeId);
                      const Icon = type?.icon ? iconMap[type.icon] || Wallet : Wallet;
                      return (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{asset.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              {type?.name || '未知类型'}
                            </div>
                          </TableCell>
                          <TableCell className="text-emerald-600">{formatMoney(asset.amount)}</TableCell>
                          <TableCell>{asset.returnRate ? `${asset.returnRate}%` : '-'}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => onDeleteAsset(asset.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 贷款 */}
        <TabsContent value="liabilities" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>贷款管理</CardTitle>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> 类型</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>添加贷款类型</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>类型名称</Label>
                        <Input 
                          value={loanTypeForm.name}
                          onChange={e => setLoanTypeForm({ ...loanTypeForm, name: e.target.value })}
                          placeholder="例如：装修贷"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>图标颜色</Label>
                        <div className="flex gap-2">
                          {['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'].map(color => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full ${loanTypeForm.color === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => setLoanTypeForm({ ...loanTypeForm, color })}
                            />
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleAddLoanType} className="w-full">添加</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-1" /> 添加贷款</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>添加贷款</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>贷款名称</Label>
                        <Input 
                          value={liabilityForm.name}
                          onChange={e => setLiabilityForm({ ...liabilityForm, name: e.target.value })}
                          placeholder="例如：车贷"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>贷款类型</Label>
                        <Select 
                          value={liabilityForm.typeId} 
                          onValueChange={v => setLiabilityForm({ ...liabilityForm, typeId: v })}
                        >
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
                        <div className="space-y-2">
                          <Label>贷款总额</Label>
                          <Input 
                            type="number"
                            value={liabilityForm.totalAmount}
                            onChange={e => setLiabilityForm({ ...liabilityForm, totalAmount: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>剩余本金</Label>
                          <Input 
                            type="number"
                            value={liabilityForm.remainingAmount}
                            onChange={e => setLiabilityForm({ ...liabilityForm, remainingAmount: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>年利率 (%)</Label>
                          <Input 
                            type="number"
                            step="0.01"
                            value={liabilityForm.interestRate}
                            onChange={e => setLiabilityForm({ ...liabilityForm, interestRate: e.target.value })}
                            placeholder="4.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>每月还款日</Label>
                          <Select 
                            value={liabilityForm.dueDate} 
                            onValueChange={v => setLiabilityForm({ ...liabilityForm, dueDate: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 31 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}日</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>还款方式</Label>
                        <Select 
                          value={liabilityForm.repaymentMethod} 
                          onValueChange={v => setLiabilityForm({ ...liabilityForm, repaymentMethod: v as RepaymentMethod })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="interest_only">{RepaymentMethodLabels.interest_only}</SelectItem>
                            <SelectItem value="equal_principal_interest">{RepaymentMethodLabels.equal_principal_interest}</SelectItem>
                            <SelectItem value="equal_principal">{RepaymentMethodLabels.equal_principal}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>贷款期限</Label>
                        <Select 
                          value={liabilityForm.loanTerm} 
                          onValueChange={v => setLiabilityForm({ ...liabilityForm, loanTerm: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LOAN_TERMS.map(term => (
                              <SelectItem key={term} value={String(term)}>{term} 个月</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* 计算结果预览 */}
                      {calculatedPayment && (
                        <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-slate-700">计算结果预览</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">月供：</span>
                              <span className="font-medium text-emerald-600">
                                {formatMoney(calculatedPayment.monthlyPayment)}
                                {calculatedPayment.firstMonthPayment && liabilityForm.repaymentMethod === 'equal_principal' && (
                                  <span className="text-xs text-muted-foreground block">
                                    首月 {formatMoney(calculatedPayment.firstMonthPayment)}
                                  </span>
                                )}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">总利息：</span>
                              <span className="font-medium text-rose-600">
                                {formatMoney(calculatedPayment.totalInterest)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button onClick={handleAddLiability} className="w-full">添加</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {loansByType.filter(l => l.total > 0).map(loan => {
                  const Icon = loan.Icon;
                  const percentage = totalLiabilities > 0 ? (loan.total / totalLiabilities) * 100 : 0;
                  return (
                    <div key={loan.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: (loan.color || '#ccc') + '20' }}>
                        <Icon className="w-5 h-5" style={{ color: loan.color || '#666' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{loan.name}</p>
                        <p className="text-xs text-muted-foreground">{formatMoney(loan.total)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{percentage.toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">{loan.count}笔</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>剩余本金</TableHead>
                    <TableHead>月还款</TableHead>
                    <TableHead>期限/方式</TableHead>
                    <TableHead>利率</TableHead>
                    <TableHead>还款日</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liabilities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        暂无贷款记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    liabilities.map(liability => {
                      const type = loanTypes.find(t => t.id === liability.typeId);
                      return (
                        <TableRow key={liability.id}>
                          <TableCell>
                            <div className="font-medium">{liability.name}</div>
                            <div className="text-xs text-muted-foreground">{type?.name || '未知类型'}</div>
                          </TableCell>
                          <TableCell className="text-rose-600">{formatMoney(liability.remainingAmount)}</TableCell>
                          <TableCell>
                            {formatMoney(liability.monthlyPayment)}
                            {liability.firstMonthPayment && liability.firstMonthPayment !== liability.monthlyPayment && (
                              <div className="text-xs text-muted-foreground">
                                首月 {formatMoney(liability.firstMonthPayment)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{liability.loanTerm} 个月</div>
                            <div className="text-xs text-muted-foreground">
                              {RepaymentMethodLabels[liability.repaymentMethod]}
                            </div>
                          </TableCell>
                          <TableCell>{liability.interestRate}%</TableCell>
                          <TableCell>每月{liability.dueDate}日</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => onDeleteLiability(liability.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 信用卡 */}
        <TabsContent value="creditcards" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>信用卡管理</CardTitle>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> 类型</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>添加信用卡类型</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>类型名称</Label>
                        <Input 
                          value={creditCardTypeForm.name}
                          onChange={e => setCreditCardTypeForm({ ...creditCardTypeForm, name: e.target.value })}
                          placeholder="例如：白金卡"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>图标颜色</Label>
                        <div className="flex gap-2">
                          {['#1a1f71', '#eb001b', '#016fd0', '#c00', '#6b7280'].map(color => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full ${creditCardTypeForm.color === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => setCreditCardTypeForm({ ...creditCardTypeForm, color })}
                            />
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleAddCreditCardType} className="w-full">添加</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-1" /> 添加信用卡</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>添加信用卡</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>卡片名称</Label>
                        <Input 
                          value={cardForm.name}
                          onChange={e => setCardForm({ ...cardForm, name: e.target.value })}
                          placeholder="例如：招行经典白"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>卡片类型</Label>
                        <Select 
                          value={cardForm.typeId} 
                          onValueChange={v => setCardForm({ ...cardForm, typeId: v })}
                        >
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
                      <div className="space-y-2">
                        <Label>发卡银行</Label>
                        <Input 
                          value={cardForm.bank}
                          onChange={e => setCardForm({ ...cardForm, bank: e.target.value })}
                          placeholder="例如：招商银行"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>信用额度</Label>
                          <Input 
                            type="number"
                            value={cardForm.limit}
                            onChange={e => setCardForm({ ...cardForm, limit: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>已用额度</Label>
                          <Input 
                            type="number"
                            value={cardForm.usedAmount}
                            onChange={e => setCardForm({ ...cardForm, usedAmount: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>账单日</Label>
                          <Select 
                            value={cardForm.billDate} 
                            onValueChange={v => setCardForm({ ...cardForm, billDate: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 31 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}日</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>还款日</Label>
                          <Select 
                            value={cardForm.dueDate} 
                            onValueChange={v => setCardForm({ ...cardForm, dueDate: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 31 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}日</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>逾期利率 (%)</Label>
                        <Input 
                          type="number"
                          value={cardForm.interestRate}
                          onChange={e => setCardForm({ ...cardForm, interestRate: e.target.value })}
                          placeholder="18.25"
                        />
                      </div>
                      <Button onClick={handleAddCreditCard} className="w-full">添加</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* 信用卡总览 */}
              <div className="grid gap-4 sm:grid-cols-3 mb-6">
                <div className="p-4 rounded-lg bg-slate-50">
                  <p className="text-sm text-muted-foreground">总信用额度</p>
                  <p className="text-xl font-bold">{formatMoney(totalCreditLimit)}</p>
                </div>
                <div className="p-4 rounded-lg bg-rose-50">
                  <p className="text-sm text-muted-foreground">已用额度</p>
                  <p className="text-xl font-bold text-rose-600">{formatMoney(totalCreditCardDebt)}</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50">
                  <p className="text-sm text-muted-foreground">可用额度</p>
                  <p className="text-xl font-bold text-blue-600">{formatMoney(totalCreditLimit - totalCreditCardDebt)}</p>
                </div>
              </div>

              {creditUtilization > 80 && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <p className="text-xs text-red-700">
                    信用卡使用率超过80%，可能影响信用评分，建议尽快还款。
                  </p>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>卡片</TableHead>
                    <TableHead>额度/已用</TableHead>
                    <TableHead>使用率</TableHead>
                    <TableHead>账单/还款日</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditCards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        暂无信用卡记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    creditCards.map(card => {
                      const type = creditCardTypes.find(t => t.id === card.typeId);
                      const utilization = (card.usedAmount / card.limit) * 100;
                      return (
                        <TableRow key={card.id}>
                          <TableCell>
                            <div className="font-medium">{card.name}</div>
                            <div className="text-xs text-muted-foreground">{card.bank} · {type?.name || '信用卡'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatMoney(card.limit)}</div>
                            <div className="text-xs text-rose-600">{formatMoney(card.usedAmount)}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={utilization > 80 ? 'destructive' : utilization > 50 ? 'secondary' : 'default'}>
                              {utilization.toFixed(0)}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">账单 {card.billDate}日</div>
                            <div className="text-xs text-muted-foreground">还款 {card.dueDate}日</div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => onDeleteCreditCard(card.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 储蓄卡 */}
        <TabsContent value="debitcards" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>储蓄卡管理</CardTitle>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> 类型</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>添加储蓄卡类型</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>类型名称</Label>
                        <Input 
                          value={debitCardTypeForm.name}
                          onChange={e => setDebitCardTypeForm({ ...debitCardTypeForm, name: e.target.value })}
                          placeholder="例如：工资卡"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>图标颜色</Label>
                        <div className="flex gap-2">
                          {['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'].map(color => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full ${debitCardTypeForm.color === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => setDebitCardTypeForm({ ...debitCardTypeForm, color })}
                            />
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleAddDebitCardType} className="w-full">添加</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-1" /> 添加储蓄卡</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>添加储蓄卡</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>卡片名称</Label>
                        <Input 
                          value={debitCardForm.name}
                          onChange={e => setDebitCardForm({ ...debitCardForm, name: e.target.value })}
                          placeholder="例如：工行储蓄卡"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>卡片类型</Label>
                        <Select 
                          value={debitCardForm.typeId} 
                          onValueChange={v => setDebitCardForm({ ...debitCardForm, typeId: v })}
                        >
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
                      <div className="space-y-2">
                        <Label>发卡银行</Label>
                        <Input 
                          value={debitCardForm.bank}
                          onChange={e => setDebitCardForm({ ...debitCardForm, bank: e.target.value })}
                          placeholder="例如：工商银行"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>当前余额</Label>
                        <Input 
                          type="number"
                          value={debitCardForm.balance}
                          onChange={e => setDebitCardForm({ ...debitCardForm, balance: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>年费（可选）</Label>
                        <Input 
                          type="number"
                          value={debitCardForm.annualFee}
                          onChange={e => setDebitCardForm({ ...debitCardForm, annualFee: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>备注</Label>
                        <Input 
                          value={debitCardForm.notes}
                          onChange={e => setDebitCardForm({ ...debitCardForm, notes: e.target.value })}
                          placeholder="可选"
                        />
                      </div>
                      <Button onClick={handleAddDebitCard} className="w-full">添加</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* 储蓄卡总览 */}
              <div className="grid gap-4 sm:grid-cols-3 mb-6">
                <div className="p-4 rounded-lg bg-emerald-50">
                  <p className="text-sm text-muted-foreground">总余额</p>
                  <p className="text-xl font-bold text-emerald-600">{formatMoney(totalDebitCardBalance)}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50">
                  <p className="text-sm text-muted-foreground">卡片数量</p>
                  <p className="text-xl font-bold">{debitCards.length} 张</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50">
                  <p className="text-sm text-muted-foreground">平均余额</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatMoney(debitCards.length > 0 ? totalDebitCardBalance / debitCards.length : 0)}
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>卡片</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>余额</TableHead>
                    <TableHead>年费</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debitCards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        暂无储蓄卡记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    debitCards.map(card => {
                      const type = debitCardTypes.find(t => t.id === card.typeId);
                      return (
                        <TableRow key={card.id}>
                          <TableCell>
                            <div className="font-medium">{card.name}</div>
                            <div className="text-xs text-muted-foreground">{card.bank}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{type?.name || '储蓄卡'}</Badge>
                          </TableCell>
                          <TableCell className="text-emerald-600 font-medium">
                            {formatMoney(card.balance)}
                          </TableCell>
                          <TableCell>{card.annualFee ? formatMoney(card.annualFee) : '-'}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => onDeleteDebitCard(card.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
