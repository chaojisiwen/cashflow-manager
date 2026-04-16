import { useState } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { Dashboard } from '@/sections/Dashboard';
import { IncomeManager } from '@/sections/IncomeManager';
import { ExpenseManager } from '@/sections/ExpenseManager';
import { AssetsLiabilities } from '@/sections/AssetsLiabilities';
import { SavingsGoalsManager } from '@/sections/SavingsGoals';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  PiggyBank,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function App() {
  const [activeTab, setActiveTab] = useState('expense');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const {
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
    companyEquities,
    investmentAccounts,
    allAccounts,
    currentMonthIncome,
    currentMonthExpense,
    disposableAmount,
    totalAssets,
    totalLiabilities,
    netWorth,
    paymentReminders,
    financialAnalysis,
    addIncome,
    deleteIncome,
    addIncomeType,
    deleteIncomeType,
    addExpense,
    deleteExpense,
    addExpenseType,
    deleteExpenseType: _deleteExpenseType,
    addAssetType,
    deleteAssetType,
    addAsset,
    deleteAsset,
    addLoanType,
    deleteLoanType,
    addLiability,
    deleteLiability,
    addCreditCardType,
    deleteCreditCardType,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    addDebitCardType,
    deleteDebitCardType,
    addDebitCard,
    deleteDebitCard,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addCompanyEquity,
    updateCompanyEquity,
    deleteCompanyEquity,
    addCompanyEquityMonthlyRecord,
    deleteCompanyEquityMonthlyRecord,
    addInvestmentAccount,
    updateInvestmentAccount,
    deleteInvestmentAccount,
    addInvestmentHolding,
    updateInvestmentHolding,
    deleteInvestmentHolding,
    addInvestmentTransaction,
  } = useFinance();

  const navItems = [
    { id: 'dashboard', label: '总览', icon: LayoutDashboard },
    { id: 'income', label: '收入', icon: TrendingUp },
    { id: 'expense', label: '支出', icon: TrendingDown },
    { id: 'assets', label: '资产负债', icon: Wallet },
    { id: 'goals', label: '储蓄目标', icon: Target },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            currentMonthIncome={currentMonthIncome}
            currentMonthExpense={currentMonthExpense}
            disposableAmount={disposableAmount}
            totalAssets={totalAssets}
            totalLiabilities={totalLiabilities}
            netWorth={netWorth}
            financialAnalysis={financialAnalysis}
            paymentReminders={paymentReminders}
            savingsGoals={savingsGoals}
          />
        );
      case 'income':
        return (
          <IncomeManager
            incomeTypes={incomeTypes}
            incomes={incomes}
            onAddIncome={addIncome}
            onDeleteIncome={deleteIncome}
            onAddIncomeType={addIncomeType}
            onDeleteIncomeType={deleteIncomeType}
          />
        );
      case 'expense':
        return (
          <ExpenseManager
            expenseTypes={expenseTypes}
            expenses={expenses}
            currentMonthIncome={currentMonthIncome}
            allAccounts={allAccounts}
            onAddExpense={addExpense}
            onDeleteExpense={deleteExpense}
            onAddExpenseType={addExpenseType}
          />
        );
      case 'assets':
        return (
          <AssetsLiabilities
            assetTypes={assetTypes}
            assets={assets}
            loanTypes={loanTypes}
            liabilities={liabilities}
            creditCardTypes={creditCardTypes}
            creditCards={creditCards}
            debitCardTypes={debitCardTypes}
            debitCards={debitCards}
            companyEquities={companyEquities}
            investmentAccounts={investmentAccounts}
            totalAssets={totalAssets}
            totalLiabilities={totalLiabilities}
            netWorth={netWorth}
            onAddAssetType={addAssetType}
            onDeleteAssetType={deleteAssetType}
            onAddAsset={addAsset}
            onUpdateAsset={() => {}}
            onDeleteAsset={deleteAsset}
            onAddLoanType={addLoanType}
            onDeleteLoanType={deleteLoanType}
            onAddLiability={addLiability}
            onUpdateLiability={() => {}}
            onDeleteLiability={deleteLiability}
            onAddCreditCardType={addCreditCardType}
            onDeleteCreditCardType={deleteCreditCardType}
            onAddCreditCard={addCreditCard}
            onUpdateCreditCard={updateCreditCard}
            onDeleteCreditCard={deleteCreditCard}
            onAddDebitCardType={addDebitCardType}
            onDeleteDebitCardType={deleteDebitCardType}
            onAddDebitCard={addDebitCard}
            onUpdateDebitCard={() => {}}
            onDeleteDebitCard={deleteDebitCard}
            onAddCompanyEquity={addCompanyEquity}
            onUpdateCompanyEquity={updateCompanyEquity}
            onDeleteCompanyEquity={deleteCompanyEquity}
            onAddCompanyEquityMonthlyRecord={addCompanyEquityMonthlyRecord}
            onDeleteCompanyEquityMonthlyRecord={deleteCompanyEquityMonthlyRecord}
            onAddInvestmentAccount={addInvestmentAccount}
            onUpdateInvestmentAccount={updateInvestmentAccount}
            onDeleteInvestmentAccount={deleteInvestmentAccount}
            onAddInvestmentHolding={addInvestmentHolding}
            onUpdateInvestmentHolding={updateInvestmentHolding}
            onDeleteInvestmentHolding={deleteInvestmentHolding}
            onAddInvestmentTransaction={addInvestmentTransaction}
          />
        );
      case 'goals':
        return (
          <SavingsGoalsManager
            savingsGoals={savingsGoals}
            currentMonthIncome={currentMonthIncome}
            onAddSavingsGoal={addSavingsGoal}
            onUpdateSavingsGoal={updateSavingsGoal}
            onDeleteSavingsGoal={deleteSavingsGoal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              现金流管理
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-2 mt-8">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? 'default' : 'ghost'}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start gap-3"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>数据仅存储在本地浏览器中，请定期备份重要数据</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
