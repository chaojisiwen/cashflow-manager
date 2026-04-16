import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, TrendingUp, Briefcase, Gift, Award, Zap, Home, Percent, MoreHorizontal } from 'lucide-react';
import type { Income, IncomeType } from '@/types/finance';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Briefcase, TrendingUp, Gift, Award, Zap, Home, Percent, MoreHorizontal,
};

interface IncomeManagerProps {
  incomeTypes: IncomeType[];
  incomes: Income[];
  onAddIncome: (income: Omit<Income, 'id'>) => void;
  onDeleteIncome: (id: string) => void;
  onAddIncomeType: (type: Omit<IncomeType, 'id'>) => void;
  onDeleteIncomeType?: (_id: string) => void;
}

function formatMoney(amount: number): string {
  return '¥' + amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function IncomeManager({
  incomeTypes,
  incomes,
  onAddIncome,
  onDeleteIncome,
  onAddIncomeType,
  onDeleteIncomeType: _onDeleteIncomeType,
}: IncomeManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    typeId: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    isRecurring: false,
    recurringCycle: 'monthly' as const,
  });

  const [typeFormData, setTypeFormData] = useState({
    name: '',
    icon: 'Briefcase',
    color: '#10b981',
  });

  const handleSubmit = () => {
    if (!formData.typeId || !formData.amount) return;
    
    onAddIncome({
      typeId: formData.typeId,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description,
      isRecurring: formData.isRecurring,
      recurringCycle: formData.recurringCycle,
    });
    
    setFormData({
      typeId: '',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      description: '',
      isRecurring: false,
      recurringCycle: 'monthly',
    });
    setIsAddDialogOpen(false);
  };

  const handleAddType = () => {
    if (!typeFormData.name) return;
    onAddIncomeType(typeFormData);
    setTypeFormData({ name: '', icon: 'Briefcase', color: '#10b981' });
    setIsTypeDialogOpen(false);
  };

  // 按类型汇总
  const incomeByType = incomeTypes.map(type => {
    const typeIncomes = incomes.filter(i => i.typeId === type.id);
    const total = typeIncomes.reduce((sum, i) => sum + i.amount, 0);
    const count = typeIncomes.length;
    return { ...type, total, count };
  }).sort((a, b) => b.total - a.total);

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* 收入统计 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总收入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatMoney(totalIncome)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">收入笔数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incomes.length} 笔</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">收入类型</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incomeTypes.length} 种</div>
          </CardContent>
        </Card>
      </div>

      {/* 收入类型分布 */}
      <Card>
        <CardHeader>
          <CardTitle>收入类型分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {incomeByType.map(type => {
              const Icon = iconMap[type.icon || 'Briefcase'] || Briefcase;
              const percentage = totalIncome > 0 ? (type.total / totalIncome) * 100 : 0;
              const bgColor = type.color ? type.color + '20' : '#ccc' + '20';
              const textColor = type.color || '#ccc';
              return (
                <div key={type.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                    <Icon className="w-5 h-5" style={{ color: textColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{type.name}</p>
                    <p className="text-xs text-muted-foreground">{formatMoney(type.total)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{percentage.toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">{type.count}笔</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 收入记录 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>收入记录</CardTitle>
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
                  <DialogTitle>添加收入类型</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>类型名称</Label>
                    <Input 
                      value={typeFormData.name}
                      onChange={e => setTypeFormData({ ...typeFormData, name: e.target.value })}
                      placeholder="例如：兼职收入"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>图标颜色</Label>
                    <div className="flex gap-2">
                      {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'].map(color => (
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
                  记收入
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>记录收入</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>收入类型</Label>
                    <Select 
                      value={formData.typeId} 
                      onValueChange={v => setFormData({ ...formData, typeId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择收入类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeTypes.map(type => (
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
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onChange={e => setFormData({ ...formData, isRecurring: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isRecurring" className="text-sm">周期性收入</Label>
                  </div>
                  {formData.isRecurring && (
                    <div className="space-y-2">
                      <Label>周期</Label>
                      <Select 
                        value={formData.recurringCycle} 
                        onValueChange={v => setFormData({ ...formData, recurringCycle: v as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">每周</SelectItem>
                          <SelectItem value="monthly">每月</SelectItem>
                          <SelectItem value="yearly">每年</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
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
                <TableHead>日期</TableHead>
                <TableHead>备注</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    暂无收入记录，点击"记收入"添加
                  </TableCell>
                </TableRow>
              ) : (
                [...incomes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(income => {
                  const type = incomeTypes.find(t => t.id === income.typeId);
                  const Icon = type?.icon ? iconMap[type.icon] || Briefcase : Briefcase;
                  return (
                    <TableRow key={income.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {type && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: (type.color || '#ccc') + '20' }}>
                              <Icon className="w-4 h-4" style={{ color: type.color || '#ccc' }} />
                            </div>
                          )}
                          <span>{type?.name || '未知类型'}</span>
                          {income.isRecurring && (
                            <Badge variant="secondary" className="text-xs">
                              {income.recurringCycle === 'weekly' ? '每周' : income.recurringCycle === 'monthly' ? '每月' : '每年'}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-emerald-600">{formatMoney(income.amount)}</TableCell>
                      <TableCell>{income.date}</TableCell>
                      <TableCell className="text-muted-foreground">{income.description || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => onDeleteIncome(income.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
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
