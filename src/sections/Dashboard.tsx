import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, TrendingUp, TrendingDown, PiggyBank,
  CreditCard, AlertCircle, Target, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import type { FinancialAnalysis, PaymentReminder, SavingsGoal } from '@/types/finance';

interface DashboardProps {
  currentMonthIncome: number;
  currentMonthExpense: number;
  disposableAmount: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  financialAnalysis: FinancialAnalysis;
  paymentReminders: PaymentReminder[];
  savingsGoals: SavingsGoal[];
}

function formatMoney(amount: number): string {
  return '¥' + amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function Dashboard({
  currentMonthIncome,
  currentMonthExpense,
  disposableAmount,
  totalAssets,
  totalLiabilities,
  netWorth,
  financialAnalysis,
  paymentReminders,
  savingsGoals,
}: DashboardProps) {
  const savingsRate = financialAnalysis.savingsRate;
  const debtToIncomeRatio = financialAnalysis.debtToIncomeRatio;
  
  // 获取即将到期的还款（7天内）
  const upcomingPayments = paymentReminders.filter(p => {
    const daysUntil = Math.ceil((new Date(p.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0;
  });

  // 储蓄目标进度
  const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavingsCurrent = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallSavingsProgress = totalSavingsTarget > 0 ? (totalSavingsCurrent / totalSavingsTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* 核心指标卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">本月收入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(currentMonthIncome)}</div>
            <div className="flex items-center mt-1 text-xs text-emerald-100">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              可支配收入: {formatMoney(disposableAmount)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-100">本月支出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(currentMonthExpense)}</div>
            <div className="flex items-center mt-1 text-xs text-rose-100">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              结余: {formatMoney(currentMonthIncome - currentMonthExpense)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">净资产</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(netWorth)}</div>
            <div className="flex items-center mt-1 text-xs text-blue-100">
              <Wallet className="w-3 h-3 mr-1" />
              资产 {formatMoney(totalAssets)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">储蓄率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
            <div className="flex items-center mt-1 text-xs text-amber-100">
              <PiggyBank className="w-3 h-3 mr-1" />
              6个月平均
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细数据 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 资产负债详情 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-500" />
              资产负债概览
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">总资产</span>
                <span className="font-medium text-emerald-600">{formatMoney(totalAssets)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">总负债</span>
                <span className="font-medium text-rose-600">{formatMoney(totalLiabilities)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">负债收入比</span>
                <span className={`font-medium ${debtToIncomeRatio > 50 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {debtToIncomeRatio.toFixed(1)}%
                </span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">净资产</span>
                <span className="font-bold text-blue-600">{formatMoney(netWorth)}</span>
              </div>
            </div>
            
            {/* 负债健康度提示 */}
            {debtToIncomeRatio > 50 && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <p className="text-xs text-red-700">
                  负债收入比超过50%，建议优先偿还高息债务，控制新增负债。
                </p>
              </div>
            )}
            {debtToIncomeRatio <= 30 && totalLiabilities > 0 && (
              <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg">
                <TrendingDown className="w-4 h-4 text-emerald-500 mt-0.5" />
                <p className="text-xs text-emerald-700">
                  负债水平健康！继续保持良好的财务习惯。
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 还款提醒 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              还款提醒
              {upcomingPayments.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                  {upcomingPayments.length} 笔待还
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentReminders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">暂无待还款项</p>
            ) : (
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {paymentReminders.slice(0, 5).map(payment => {
                  const daysUntil = Math.ceil((new Date(payment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={payment.id} className={`flex items-center justify-between p-3 rounded-lg ${
                      daysUntil <= 3 ? 'bg-red-50 border border-red-100' : 'bg-slate-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        {payment.type === 'credit_card' ? (
                          <CreditCard className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Wallet className="w-4 h-4 text-amber-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{payment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {daysUntil === 0 ? '今天到期' : daysUntil < 0 ? `逾期 ${Math.abs(daysUntil)} 天` : `${daysUntil} 天后到期`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatMoney(payment.amount)}</p>
                        {payment.interestAccrued > 0 && (
                          <p className="text-xs text-red-500">+利息 {formatMoney(payment.interestAccrued)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 储蓄目标 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              储蓄目标
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savingsGoals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">暂无储蓄目标</p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">总进度</span>
                    <span className="font-medium">{overallSavingsProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={overallSavingsProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">
                    {formatMoney(totalSavingsCurrent)} / {formatMoney(totalSavingsTarget)}
                  </p>
                </div>
                
                <div className="space-y-3 max-h-[150px] overflow-y-auto">
                  {savingsGoals.slice(0, 3).map(goal => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    return (
                      <div key={goal.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{goal.name}</span>
                          <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 财务健康建议 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              财务健康建议
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savingsRate < 20 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                  <div className="text-xs text-amber-700">
                    <p className="font-medium">储蓄率偏低</p>
                    <p>建议将储蓄率提升至20%以上，可通过减少非必要支出或增加收入实现。</p>
                  </div>
                </div>
              )}
              {currentMonthExpense > currentMonthIncome * 0.8 && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div className="text-xs text-red-700">
                    <p className="font-medium">支出过高</p>
                    <p>本月支出占收入比例过高，建议审查支出明细，找出可削减的项目。</p>
                  </div>
                </div>
              )}
              {totalLiabilities > totalAssets * 0.5 && (
                <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div className="text-xs text-orange-700">
                    <p className="font-medium">负债比例较高</p>
                    <p>负债超过资产50%，建议制定还债计划，优先偿还高息债务。</p>
                  </div>
                </div>
              )}
              {savingsRate >= 30 && debtToIncomeRatio < 30 && (
                <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div className="text-xs text-emerald-700">
                    <p className="font-medium">财务状况优秀！</p>
                    <p>储蓄率高且负债低，可以考虑增加投资，让财富更快增值。</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
