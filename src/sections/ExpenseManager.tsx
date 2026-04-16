import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, Trash2, Home, CreditCard, Car, Utensils, Gamepad2, 
  ShoppingBag, Lightbulb, Heart, BookOpen, Shield, MoreHorizontal,
  Wallet
} from 'lucide-react';
import type { Expense, ExpenseType } from '@/types/finance';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Home, CreditCard, Car, Utensils, Gamepad2, ShoppingBag, Lightbulb, Heart, BookOpen, Shield, MoreHorizontal, Wallet,
};

interface Account {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card';
}

interface ExpenseManagerProps {
  expenseTypes: ExpenseType[];
  expenses: Expense[];
  currentMonthIncome: number;
  allAccounts: Account[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onAddExpenseType: (type: Omit<ExpenseType, 'id'>) => void;
}

function formatMoney(amount: number): string {
  return '¥' + amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ExpenseManager({
  expenseTypes,
  expenses,
  currentMonthIncome,
  allAccounts,
  onAddExpense,
  onDeleteExpense,
  onAddExpenseType,
}: ExpenseManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    typeId: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    isFixed: false,
    accountId: '',
  });

  const [typeFormData, setTypeFormData] = useState({
    name: '',
    icon: 'ShoppingBag',
    color: '#ef4444',
    budget: '',
  });

  const handleSubmit = () => {
    if (!formData.typeId || !formData.amount) return;
    
    onAddExpense({
      typeId: formData.typeId,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description,
      isFixed: formData.isFixed,
      accountId: formData.accountId || undefined,
    });
    
    setFormData({
      typeId: '',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      description: '',
      isFixed: false,
      accountId: '',
    });
    setIsAddDialogOpen(false);
  };

  const handleAddType = () => {
    if (!typeFormData.name) return;
    onAddExpenseType({
      name: typeFormData.name,
      icon: typeFormData.icon,
      color: typeFormData.color,
      budget: typeFormData.budget ? parseFloat(typeFormData.budget) : undefined,
    });
    setTypeFormData({ name: '', icon: 'ShoppingBag', color: '#ef4444', budget: '' });
    setIsTypeDialogOpen(false);
  };

  // 按类型汇总
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  
  const expenseByType = expenseTypes.map(type => {
    const typeExpenses = currentMonthExpenses.filter(e => e.typeId === type.id);
    const total = typeExpenses.reduce((sum, e) => sum + e.amount, 0);
    const count = typeExpenses.length;
    const budget = type.budget || 0;
    const budgetUsed = budget > 0 ? (total / budget) * 100 : 0;
    return { ...type, total, count, budget, budgetUsed };
  }).sort((a, b) => b.total - a.total);

  const totalExpense = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const expenseRatio = currentMonthIncome > 0 ? (totalExpense / currentMonthIncome) * 100 : 0;

  // 固定支出
  const fixedExpenses = currentMonthExpenses.filter(e => e.isFixed);
  const fixedTotal = fixedExpenses.reduce((sum, e) => sum + e.amount, 0);

  // 获取账户名称
  const getAccountName = (accountId?: string) => {
    if (!accountId) return null;
    const account = allAccounts.find(a => a.id === accountId);
    return account?.name || null;
  };

  return (
    <div className="space-y-6">
      {/* 支出统计 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">本月支出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatMoney(totalExpense)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">支出占比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${expenseRatio > 80 ? 'text-red-500' : expenseRatio > 60 ? 'text-amber-500' : 'text-emerald-600'}`}>
              {expenseRatio.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">固定支出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(fixedTotal)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">本月结余</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentMonthIncome - totalExpense < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              {formatMoney(currentMonthIncome - totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 支出类型分布与预算 */}
      <Card>
        <CardHeader>
          <CardTitle>支出类型与预算</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseByType.filter(t => t.total > 0 || t.budget > 0).map(type => {
              const Icon = iconMap[type.icon || 'ShoppingBag'] || ShoppingBag;
              const percentage = totalExpense > 0 ? (type.total / totalExpense) * 100 : 0;
              const bgColor = type.color ? type.color + '20' : '#ccc' + '20';
              const textColor = type.color || '#ccc';
              return (
                <div key={type.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                        <Icon className="w-4 h-4" style={{ color: textColor }} />
                      </div>
                      <span className="font-medium">{type.name}</span>
                      {type.budget > 0 && (
                        <Badge variant="outline" className="text-xs">
                          预算 {formatMoney(type.budget)}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatMoney(type.total)}</p>
                      <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  {type.budget > 0 && (
                    <div className="space-y-1">
                      <Progress 
                        value={Math.min(type.budgetUsed, 100)} 
                        className={`h-2 ${type.budgetUsed > 100 ? 'bg-red-100' : ''}`}
                      />
                      <p className={`text-xs text-right ${type.budgetUsed > 100 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        已用 {type.budgetUsed.toFixed(0)}%
                        {type.budgetUsed > 100 && ' (超支!)'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 支出记录 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>支出记录</CardTitle>
          <div className="flex gap-2">
            <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  类型
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加支出类型</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>类型名称</Label>
                    <Input 
                      value={typeFormData.name}
                      onChange={e => setTypeFormData({ ...typeFormData, name: e.target.value })}
                      placeholder="例如：健身"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>月度预算（可选）</Label>
                    <Input 
                      type="number"
                      value={typeFormData.budget}
                      onChange={e => setTypeFormData({ ...typeFormData, budget: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>图标颜色</Label>
                    <div className="flex gap-2">
                      {['#ef4444', '#f97316', '#eab308', '#8b5cf6', '#ec4899', '#06b6d4'].map(color => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full ${typeFormData.color === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setTypeFormData({ ...typeFormData, color })}
                        />
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleAddType} className="w-full">添加</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  记支出
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>记录支出</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>支出类型</Label>
                    <Select 
                      value={formData.typeId} 
                      onValueChange={v => setFormData({ ...formData, typeId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择支出类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>金额</Label>
                    <Input 
                      type="number"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>支出来源</Label>
                    <Select 
                      value={formData.accountId} 
                      onValueChange={v => setFormData({ ...formData, accountId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择支付账户" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">未指定</SelectItem>
                        {allAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.type === 'credit_card' ? '💳 ' : '💳 '}
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>日期</Label>
                    <Input 
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>备注</Label>
                    <Input 
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="可选"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="isFixed"
                      checked={formData.isFixed}
                      onChange={e => setFormData({ ...formData, isFixed: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isFixed" className="text-sm">固定支出</Label>
                  </div>
                  <Button onClick={handleSubmit} className="w-full">保存</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>类型</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>日期</TableHead>
                <TableHead>备注</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    暂无支出记录，点击"记支出"添加
                  </TableCell>
                </TableRow>
              ) : (
                [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => {
                  const type = expenseTypes.find(t => t.id === expense.typeId);
                  const Icon = type?.icon ? iconMap[type.icon] || ShoppingBag : ShoppingBag;
                  const accountName = getAccountName(expense.accountId);
                  return (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {type && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: (type.color || '#ccc') + '20' }}>
                              <Icon className="w-4 h-4" style={{ color: type.color || '#ccc' }} />
                            </div>
                          )}
                          <span>{type?.name || '未知类型'}</span>
                          {expense.isFixed && (
                            <Badge variant="secondary" className="text-xs">固定</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-rose-600">{formatMoney(expense.amount)}</TableCell>
                      <TableCell>
                        {accountName ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Wallet className="w-3 h-3" />
                            {accountName}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell className="text-muted-foreground">{expense.description || '-'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => onDeleteExpense(expense.id)}
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
    </div>
  );
}
