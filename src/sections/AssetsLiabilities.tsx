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
  Landmark, CreditCard as CreditCardIcon, AlertCircle, PiggyBank, Home, CircleDollarSign
} from 'lucide-react';
import type { Asset, Liability, CreditCard as CreditCardType, AssetType, LiabilityType } from '@/types/finance';

const assetTypeMap: Record<AssetType, { name: string; icon: React.ComponentType<{ className?: string }> }> = {
  cash: { name: '现金', icon: Wallet },
  stock: { name: '股票', icon: TrendingUp },
  fund: { name: '基金', icon: PiggyBank },
  bond: { name: '债券', icon: Landmark },
  property: { name: '房产', icon: Building2 },
  crypto: { name: '加密货币', icon: Coins },
  other: { name: '其他', icon: CircleDollarSign },
};

const liabilityTypeMap: Record<LiabilityType, { name: string; icon: React.ComponentType<{ className?: string }> }> = {
  credit_card: { name: '信用卡', icon: CreditCardIcon },
  loan: { name: '贷款', icon: Landmark },
  mortgage: { name: '房贷', icon: Home },
  debt: { name: '借款', icon: AlertCircle },
  other: { name: '其他', icon: CircleDollarSign },
};

interface AssetsLiabilitiesProps {
  assets: Asset[];
  liabilities: Liability[];
  creditCards: CreditCardType[];
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  onAddAsset: (asset: Omit<Asset, 'id'>) => void;
  onUpdateAsset: (id: string, updates: Partial<Asset>) => void;
  onDeleteAsset: (id: string) => void;
  onAddLiability: (liability: Omit<Liability, 'id'>) => void;
  onUpdateLiability: (id: string, updates: Partial<Liability>) => void;
  onDeleteLiability: (id: string) => void;
  onAddCreditCard: (card: Omit<CreditCardType, 'id'>) => void;
  onUpdateCreditCard: (id: string, updates: Partial<CreditCardType>) => void;
  onDeleteCreditCard: (id: string) => void;
}

function formatMoney(amount: number): string {
  return '¥' + amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function AssetsLiabilities({
  assets,
  liabilities,
  creditCards,
  totalAssets,
  totalLiabilities,
  netWorth,
  onAddAsset,
  onDeleteAsset,
  onAddLiability,
  onDeleteLiability,
  onAddCreditCard,
  onUpdateCreditCard: _onUpdateCreditCard,
  onDeleteCreditCard,
}: AssetsLiabilitiesProps) {
  const [activeTab, setActiveTab] = useState('assets');
  
  // 资产表单
  const [assetForm, setAssetForm] = useState({
    name: '',
    type: 'cash' as AssetType,
    amount: '',
    returnRate: '',
    notes: '',
  });

  // 负债表单
  const [liabilityForm, setLiabilityForm] = useState({
    name: '',
    type: 'loan' as LiabilityType,
    totalAmount: '',
    remainingAmount: '',
    interestRate: '',
    monthlyPayment: '',
    dueDate: '1',
    notes: '',
  });

  // 信用卡表单
  const [cardForm, setCardForm] = useState({
    name: '',
    bank: '',
    limit: '',
    usedAmount: '',
    billDate: '1',
    dueDate: '10',
    interestRate: '18.25',
    annualFee: '',
  });

  const handleAddAsset = () => {
    if (!assetForm.name || !assetForm.amount) return;
    onAddAsset({
      name: assetForm.name,
      type: assetForm.type,
      amount: parseFloat(assetForm.amount),
      returnRate: assetForm.returnRate ? parseFloat(assetForm.returnRate) : undefined,
      notes: assetForm.notes,
    });
    setAssetForm({ name: '', type: 'cash', amount: '', returnRate: '', notes: '' });
  };

  const handleAddLiability = () => {
    if (!liabilityForm.name || !liabilityForm.totalAmount) return;
    onAddLiability({
      name: liabilityForm.name,
      type: liabilityForm.type,
      totalAmount: parseFloat(liabilityForm.totalAmount),
      remainingAmount: parseFloat(liabilityForm.remainingAmount) || parseFloat(liabilityForm.totalAmount),
      interestRate: parseFloat(liabilityForm.interestRate) || 0,
      monthlyPayment: parseFloat(liabilityForm.monthlyPayment) || 0,
      dueDate: parseInt(liabilityForm.dueDate),
      startDate: new Date().toISOString().slice(0, 10),
      notes: liabilityForm.notes,
    });
    setLiabilityForm({
      name: '', type: 'loan', totalAmount: '', remainingAmount: '',
      interestRate: '', monthlyPayment: '', dueDate: '1', notes: '',
    });
  };

  const handleAddCreditCard = () => {
    if (!cardForm.name || !cardForm.bank || !cardForm.limit) return;
    onAddCreditCard({
      name: cardForm.name,
      bank: cardForm.bank,
      limit: parseFloat(cardForm.limit),
      usedAmount: parseFloat(cardForm.usedAmount) || 0,
      billDate: parseInt(cardForm.billDate),
      dueDate: parseInt(cardForm.dueDate),
      interestRate: parseFloat(cardForm.interestRate) || 18.25,
      annualFee: cardForm.annualFee ? parseFloat(cardForm.annualFee) : undefined,
    });
    setCardForm({
      name: '', bank: '', limit: '', usedAmount: '',
      billDate: '1', dueDate: '10', interestRate: '18.25', annualFee: '',
    });
  };

  // 按类型统计资产
  const assetsByType = Object.entries(assetTypeMap).map(([type, info]) => {
    const typeAssets = assets.filter(a => a.type === type);
    const total = typeAssets.reduce((sum, a) => sum + a.amount, 0);
    return { type: type as AssetType, ...info, total, count: typeAssets.length };
  }).sort((a, b) => b.total - a.total);

  // 按类型统计负债
  const liabilitiesByType = Object.entries(liabilityTypeMap).map(([type, info]) => {
    const typeLiabilities = liabilities.filter(l => l.type === type);
    const total = typeLiabilities.reduce((sum, l) => sum + l.remainingAmount, 0);
    return { type: type as LiabilityType, ...info, total, count: typeLiabilities.length };
  }).sort((a, b) => b.total - a.total);

  // 信用卡总欠款
  const totalCreditCardDebt = creditCards.reduce((sum, c) => sum + c.usedAmount, 0);
  const totalCreditLimit = creditCards.reduce((sum, c) => sum + c.limit, 0);
  const creditUtilization = totalCreditLimit > 0 ? (totalCreditCardDebt / totalCreditLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">总资产</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatMoney(totalAssets)}</div>
            <p className="text-sm text-emerald-100 mt-1">{assets.length} 项资产</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-100">总负债</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatMoney(totalLiabilities)}</div>
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
            <div className="text-3xl font-bold">{formatMoney(netWorth)}</div>
            <p className="text-sm text-blue-100 mt-1">
              资产负债率: {totalAssets > 0 ? ((totalLiabilities / totalAssets) * 100).toFixed(1) : '0'}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 详细管理 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assets">资产</TabsTrigger>
          <TabsTrigger value="liabilities">贷款</TabsTrigger>
          <TabsTrigger value="creditcards">信用卡</TabsTrigger>
        </TabsList>

        {/* 资产 */}
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>资产分布</CardTitle>
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
                        value={assetForm.type} 
                        onValueChange={v => setAssetForm({ ...assetForm, type: v as AssetType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(assetTypeMap).map(([key, info]) => (
                            <SelectItem key={key} value={key}>{info.name}</SelectItem>
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
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {assetsByType.filter(a => a.total > 0).map(asset => {
                  const Icon = asset.icon;
                  const percentage = totalAssets > 0 ? (asset.total / totalAssets) * 100 : 0;
                  return (
                    <div key={asset.type} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-600" />
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
                      const Icon = assetTypeMap[asset.type].icon;
                      return (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{asset.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              {assetTypeMap[asset.type].name}
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="w-4 h-4 mr-1" /> 添加贷款</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
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
                        value={liabilityForm.type} 
                        onValueChange={v => setLiabilityForm({ ...liabilityForm, type: v as LiabilityType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(liabilityTypeMap).map(([key, info]) => (
                            <SelectItem key={key} value={key}>{info.name}</SelectItem>
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
                          value={liabilityForm.interestRate}
                          onChange={e => setLiabilityForm({ ...liabilityForm, interestRate: e.target.value })}
                          placeholder="4.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>月还款额</Label>
                        <Input 
                          type="number"
                          value={liabilityForm.monthlyPayment}
                          onChange={e => setLiabilityForm({ ...liabilityForm, monthlyPayment: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
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
                    <Button onClick={handleAddLiability} className="w-full">添加</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {liabilitiesByType.filter(l => l.total > 0).map(liability => {
                  const Icon = liability.icon;
                  const percentage = totalLiabilities > 0 ? (liability.total / totalLiabilities) * 100 : 0;
                  return (
                    <div key={liability.type} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{liability.name}</p>
                        <p className="text-xs text-muted-foreground">{formatMoney(liability.total)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{percentage.toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">{liability.count}笔</p>
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
                    <TableHead>利率</TableHead>
                    <TableHead>还款日</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liabilities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        暂无贷款记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    liabilities.map(liability => (
                      <TableRow key={liability.id}>
                        <TableCell>
                          <div className="font-medium">{liability.name}</div>
                          <div className="text-xs text-muted-foreground">{liabilityTypeMap[liability.type].name}</div>
                        </TableCell>
                        <TableCell className="text-rose-600">{formatMoney(liability.remainingAmount)}</TableCell>
                        <TableCell>{formatMoney(liability.monthlyPayment)}</TableCell>
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
                    ))
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
                      const utilization = (card.usedAmount / card.limit) * 100;
                      return (
                        <TableRow key={card.id}>
                          <TableCell>
                            <div className="font-medium">{card.name}</div>
                            <div className="text-xs text-muted-foreground">{card.bank}</div>
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
      </Tabs>
    </div>
  );
}
