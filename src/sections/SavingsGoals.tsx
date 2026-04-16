import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Target, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import type { SavingsGoal } from '@/types/finance';

interface SavingsGoalsProps {
  savingsGoals: SavingsGoal[];
  currentMonthIncome: number;
  onAddSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  onDeleteSavingsGoal: (id: string) => void;
}

function formatMoney(amount: number): string {
  return '¥' + amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function SavingsGoalsManager({
  savingsGoals,
  currentMonthIncome,
  onAddSavingsGoal,
  onUpdateSavingsGoal,
  onDeleteSavingsGoal,
}: SavingsGoalsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: 'medium' as const,
    notes: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.targetAmount) return;
    
    onAddSavingsGoal({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline || undefined,
      priority: formData.priority,
      notes: formData.notes,
    });
    
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      priority: 'medium',
      notes: '',
    });
    setIsAddDialogOpen(false);
  };

  // 计算统计数据
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  
  const completedGoals = savingsGoals.filter(g => g.currentAmount >= g.targetAmount);
  
  // 计算达成目标所需月数（基于当前储蓄率）
  const avgMonthlySavings = currentMonthIncome * 0.2; // 假设20%储蓄率
  const monthsToComplete = avgMonthlySavings > 0 && totalTarget > totalCurrent
    ? Math.ceil((totalTarget - totalCurrent) / avgMonthlySavings)
    : 0;

  // 紧急基金建议
  const emergencyFundTarget = currentMonthIncome * 6; // 6个月支出
  const hasEmergencyFund = savingsGoals.some(g => 
    g.name.includes('紧急') || g.name.includes('应急') || g.name.includes('备用金')
  );

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">总目标金额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(totalTarget)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">已储蓄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(totalCurrent)}</div>
            <p className="text-xs text-emerald-100 mt-1">{overallProgress.toFixed(1)}% 完成</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">目标数量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsGoals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{completedGoals.length} 个已完成</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">预计完成</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthsToComplete} 个月</div>
            <p className="text-xs text-muted-foreground mt-1">按20%储蓄率计算</p>
          </CardContent>
        </Card>
      </div>

      {/* 紧急基金建议 */}
      {!hasEmergencyFund && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">建议建立紧急备用金</h4>
                <p className="text-sm text-amber-700 mt-1">
                  建议优先建立相当于6个月收入的紧急备用金（约 {formatMoney(emergencyFundTarget)}），
                  以应对突发情况。这是财务自由的第一步。
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={() => {
                    onAddSavingsGoal({
                      name: '紧急备用金',
                      targetAmount: emergencyFundTarget,
                      currentAmount: 0,
                      priority: 'high',
                    });
                  }}
                >
                  一键创建
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 储蓄目标列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            储蓄目标
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                新建目标
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>新建储蓄目标</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>目标名称</Label>
                  <Input 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：买房首付"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>目标金额</Label>
                    <Input 
                      type="number"
                      value={formData.targetAmount}
                      onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>当前金额</Label>
                    <Input 
                      type="number"
                      value={formData.currentAmount}
                      onChange={e => setFormData({ ...formData, currentAmount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>优先级</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={v => setFormData({ ...formData, priority: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">高优先级</SelectItem>
                      <SelectItem value="medium">中优先级</SelectItem>
                      <SelectItem value="low">低优先级</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>目标日期（可选）</Label>
                  <Input 
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>备注</Label>
                  <Input 
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="可选"
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">创建目标</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {savingsGoals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">暂无储蓄目标</p>
              <p className="text-sm text-muted-foreground mt-1">创建目标，开始你的储蓄计划</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savingsGoals
                .sort((a, b) => {
                  // 按完成状态、优先级、进度排序
                  const aCompleted = a.currentAmount >= a.targetAmount;
                  const bCompleted = b.currentAmount >= b.targetAmount;
                  if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
                  
                  const priorityOrder = { high: 0, medium: 1, low: 2 };
                  if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
                  
                  const aProgress = a.targetAmount > 0 ? a.currentAmount / a.targetAmount : 0;
                  const bProgress = b.targetAmount > 0 ? b.currentAmount / b.targetAmount : 0;
                  return bProgress - aProgress;
                })
                .map(goal => {
                  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                  const isCompleted = progress >= 100;
                  const remaining = goal.targetAmount - goal.currentAmount;
                  
                  // 计算剩余天数
                  let daysRemaining: number | null = null;
                  if (goal.deadline) {
                    daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  }

                  return (
                    <div 
                      key={goal.id} 
                      className={`p-4 rounded-lg border ${isCompleted ? 'bg-emerald-50 border-emerald-200' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-emerald-100' : 'bg-purple-100'
                          }`}>
                            {isCompleted ? (
                              <TrendingUp className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Target className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{goal.name}</h4>
                              <Badge variant={
                                goal.priority === 'high' ? 'destructive' : 
                                goal.priority === 'medium' ? 'secondary' : 'outline'
                              }>
                                {goal.priority === 'high' ? '高' : goal.priority === 'medium' ? '中' : '低'}
                              </Badge>
                              {isCompleted && (
                                <Badge className="bg-emerald-500">已完成</Badge>
                              )}
                            </div>
                            {goal.notes && (
                              <p className="text-xs text-muted-foreground">{goal.notes}</p>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => onDeleteSavingsGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            已存 {formatMoney(goal.currentAmount)}
                          </span>
                          <span className="font-medium">
                            目标 {formatMoney(goal.targetAmount)}
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(progress, 100)} 
                          className={`h-2 ${isCompleted ? 'bg-emerald-100' : ''}`}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{progress.toFixed(1)}% 完成</span>
                          <span>
                            {isCompleted ? '恭喜达成目标！' : `还差 ${formatMoney(remaining)}`}
                          </span>
                        </div>
                      </div>

                      {goal.deadline && !isCompleted && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>
                            目标日期: {goal.deadline}
                            {daysRemaining !== null && (
                              <span className={daysRemaining < 30 ? 'text-red-500 ml-1' : 'ml-1'}>
                                ({daysRemaining > 0 ? `还剩 ${daysRemaining} 天` : '已逾期'})
                              </span>
                            )}
                          </span>
                        </div>
                      )}

                      {/* 快速调整金额 */}
                      {!isCompleted && (
                        <div className="flex gap-2 mt-3">
                          <Input 
                            type="number"
                            placeholder="增加金额"
                            className="h-8 text-sm"
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                const val = parseFloat((e.target as HTMLInputElement).value);
                                if (val > 0) {
                                  onUpdateSavingsGoal(goal.id, { 
                                    currentAmount: goal.currentAmount + val 
                                  });
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8"
                            onClick={(e) => {
                              const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                              const val = parseFloat(input.value);
                              if (val > 0) {
                                onUpdateSavingsGoal(goal.id, { 
                                  currentAmount: goal.currentAmount + val 
                                });
                                input.value = '';
                              }
                            }}
                          >
                            存入
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 储蓄建议 */}
      <Card>
        <CardHeader>
          <CardTitle>储蓄策略建议</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-slate-50">
              <h4 className="font-medium mb-2">50/30/20 法则</h4>
              <p className="text-sm text-muted-foreground">
                将收入的50%用于必需支出，30%用于个人消费，20%用于储蓄和还债。
                你的当前储蓄率应达到20%以上。
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <h4 className="font-medium mb-2">先储蓄后消费</h4>
              <p className="text-sm text-muted-foreground">
                收到收入后，首先将计划储蓄的金额转入储蓄账户，
                剩余部分用于支出，避免月底无钱可存。
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <h4 className="font-medium mb-2">自动化储蓄</h4>
              <p className="text-sm text-muted-foreground">
                设置自动转账，每月固定日期自动将设定金额转入储蓄账户，
                减少手动操作和冲动消费的机会。
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <h4 className="font-medium mb-2">目标分解</h4>
              <p className="text-sm text-muted-foreground">
                将大目标分解为月度小目标，例如年存6万的目标分解为每月存5000，
                更容易执行和追踪进度。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
