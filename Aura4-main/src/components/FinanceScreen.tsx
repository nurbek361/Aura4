import React, { useState } from 'react';
import {
  CurrencyType,
  DebtItem,
  ExpenseRecord,
  ShoppingItem,
  SubscriptionItem,
  UtilityBillItem,
} from '../types';
import {
  INITIAL_DEBTS,
  INITIAL_EXPENSES,
  INITIAL_SHOPPING_LIST,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_UTILITIES,
} from '../data/mockData';
import { ambientSound } from '../utils/audioSynth';
import { askGroq } from '../utils/groqClient';

export const FinanceScreen: React.FC = () => {
  const [currency, setCurrency] = useState<CurrencyType>('KGS');
  const [income, setIncome] = useState<number>(() => {
    const saved = localStorage.getItem('aura_finance_income');
    return saved ? Number(saved) : 0;
  });

  const [monthlyLimit, setMonthlyLimit] = useState<number>(() => {
    const saved = localStorage.getItem('aura_finance_limit');
    return saved ? Number(saved) : 0;
  });

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'shopping' | 'debts' | 'subscriptions' | 'utilities'
  >('overview');

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('aura_finance_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('aura_finance_shopping');
    return saved ? JSON.parse(saved) : INITIAL_SHOPPING_LIST;
  });

  const [debts, setDebts] = useState<DebtItem[]>(() => {
    const saved = localStorage.getItem('aura_finance_debts');
    return saved ? JSON.parse(saved) : INITIAL_DEBTS;
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() => {
    const saved = localStorage.getItem('aura_finance_subs');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [utilities, setUtilities] = useState<UtilityBillItem[]>(() => {
    const saved = localStorage.getItem('aura_finance_utilities');
    return saved ? JSON.parse(saved) : INITIAL_UTILITIES;
  });

  // Modal states
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(income.toString());
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [tempLimit, setTempLimit] = useState(monthlyLimit.toString());
  const [groqAdvice, setGroqAdvice] = useState<string | null>(null);
  const [isGroqLoading, setIsGroqLoading] = useState(false);

  // New Shopping item
  const [newShopName, setNewShopName] = useState('');
  const [newShopPrice, setNewShopPrice] = useState('');

  // New Expense
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpCategory, setNewExpCategory] = useState('Продукты');

  // New Debt
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [newDebtPerson, setNewDebtPerson] = useState('');
  const [newDebtAmount, setNewDebtAmount] = useState('');
  const [newDebtType, setNewDebtType] = useState<'owed_to_me' | 'i_owe'>('owed_to_me');
  const [newDebtDueDate, setNewDebtDueDate] = useState('');

  // Calculations
  const currencySymbol =
    currency === 'KGS' ? 'сом' : currency === 'USD' ? '$' : currency === 'KZT' ? '₸' : '₽';

  const totalSpentExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSubCost = subscriptions.filter((s) => s.active).reduce((sum, s) => sum + s.cost, 0);
  const totalUnpaidUtilities = utilities.filter((u) => !u.isPaid).reduce((sum, u) => sum + u.amount, 0);

  const grandTotalSpent = totalSpentExpenses + totalSubCost;
  const remainingBudget = monthlyLimit - grandTotalSpent;
  const budgetUsagePercent = Math.min(100, Math.round((grandTotalSpent / monthlyLimit) * 100));

  const totalOwedToMe = debts.filter((d) => d.type === 'owed_to_me' && !d.settled).reduce((sum, d) => sum + d.amount, 0);
  const totalIOwe = debts.filter((d) => d.type === 'i_owe' && !d.settled).reduce((sum, d) => sum + d.amount, 0);

  // Shopping receipt sum
  const shoppingReceiptSum = shoppingList.reduce((sum, item) => sum + item.price, 0);
  const shoppingCheckedSum = shoppingList.filter((item) => item.completed).reduce((sum, item) => sum + item.price, 0);

  // Save helpers
  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(tempIncome) || 0;
    setIncome(val);
    localStorage.setItem('aura_finance_income', val.toString());
    setIsEditingIncome(false);
    ambientSound.playTone(620, 0.1);
  };

  const handleSaveLimit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(tempLimit) || 0;
    setMonthlyLimit(val);
    localStorage.setItem('aura_finance_limit', val.toString());
    setIsEditingLimit(false);
    ambientSound.playTone(620, 0.1);
  };

  const handleAddShoppingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName.trim()) return;
    const price = Number(newShopPrice) || 0;
    const item: ShoppingItem = {
      id: `sh-${Date.now()}`,
      name: newShopName.trim(),
      price,
      completed: false,
      category: 'Покупки',
    };
    const updated = [...shoppingList, item];
    setShoppingList(updated);
    localStorage.setItem('aura_finance_shopping', JSON.stringify(updated));
    setNewShopName('');
    setNewShopPrice('');
    ambientSound.playTone(520, 0.1);
  };

  const handleToggleShopItem = (id: string) => {
    ambientSound.playTone(680, 0.08);
    const updated = shoppingList.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setShoppingList(updated);
    localStorage.setItem('aura_finance_shopping', JSON.stringify(updated));
  };

  const handleDeleteShopItem = (id: string) => {
    const updated = shoppingList.filter((item) => item.id !== id);
    setShoppingList(updated);
    localStorage.setItem('aura_finance_shopping', JSON.stringify(updated));
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(newExpAmount) || 0;
    if (!newExpTitle.trim() || amount <= 0) return;

    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      title: newExpTitle.trim(),
      amount,
      category: newExpCategory,
      date: 'Сегодня',
    };
    const updated = [newExp, ...expenses];
    setExpenses(updated);
    localStorage.setItem('aura_finance_expenses', JSON.stringify(updated));
    setNewExpTitle('');
    setNewExpAmount('');
    setIsAddExpenseOpen(false);
    ambientSound.playTone(580, 0.12);
  };

  const handleToggleDebt = (id: string) => {
    ambientSound.playTone(700, 0.1);
    const updated = debts.map((d) => (d.id === id ? { ...d, settled: !d.settled } : d));
    setDebts(updated);
    localStorage.setItem('aura_finance_debts', JSON.stringify(updated));
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(newDebtAmount) || 0;
    if (!newDebtPerson.trim() || amount <= 0) return;

    const newD: DebtItem = {
      id: `debt-${Date.now()}`,
      person: newDebtPerson.trim(),
      amount,
      type: newDebtType,
      dueDate: newDebtDueDate || 'Конец месяца',
      settled: false,
    };
    const updated = [newD, ...debts];
    setDebts(updated);
    localStorage.setItem('aura_finance_debts', JSON.stringify(updated));
    setNewDebtPerson('');
    setNewDebtAmount('');
    setIsAddDebtOpen(false);
    ambientSound.playTone(600, 0.1);
  };

  const handleToggleUtility = (id: string) => {
    ambientSound.playTone(680, 0.08);
    const updated = utilities.map((u) => (u.id === id ? { ...u, isPaid: !u.isPaid } : u));
    setUtilities(updated);
    localStorage.setItem('aura_finance_utilities', JSON.stringify(updated));
  };

  const handleToggleSubscription = (id: string) => {
    ambientSound.playTone(640, 0.08);
    const updated = subscriptions.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    setSubscriptions(updated);
    localStorage.setItem('aura_finance_subs', JSON.stringify(updated));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#10b981] uppercase tracking-wider">
            Капитал & Учет Расходов
          </span>
          <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">
            Финансы
          </h1>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#151821] border border-white/[0.06]">
          {(['KGS', 'USD', 'KZT', 'RUB'] as CurrencyType[]).map((c) => (
            <button
              key={c}
              onClick={() => {
                ambientSound.playTone(500, 0.05);
                setCurrency(c);
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                currency === c
                  ? 'bg-[#10b981] text-[#00391d] shadow-sm'
                  : 'text-[#8690a2] hover:text-[#e1e2ec]'
              }`}
            >
              {c === 'KGS' ? 'сом' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Income & Limit Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Income Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#12231b] via-[#141a22] to-[#12151e] border border-[#10b981]/30 shadow-lg relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-[#34d399]">Мой доход</span>
            <button
              onClick={() => {
                setTempIncome(income.toString());
                setIsEditingIncome(true);
              }}
              className="text-[#697285] hover:text-[#34d399] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <div className="font-headline text-xl sm:text-2xl font-extrabold text-[#e1e2ec] tracking-tight">
            {income.toLocaleString()} <span className="text-xs font-semibold text-[#34d399]">{currencySymbol}</span>
          </div>
          <div className="text-[10px] text-[#949db1] mt-0.5">Ежемесячный бюджет</div>
        </div>

        {/* Limit Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c1d29] via-[#151824] to-[#12151e] border border-[#a078ff]/30 shadow-lg relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-[#d0bcff]">Лимит расходов</span>
            <button
              onClick={() => {
                setTempLimit(monthlyLimit.toString());
                setIsEditingLimit(true);
              }}
              className="text-[#697285] hover:text-[#d0bcff] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
            </button>
          </div>
          <div className="font-headline text-xl sm:text-2xl font-extrabold text-[#e1e2ec] tracking-tight">
            {monthlyLimit.toLocaleString()} <span className="text-xs font-semibold text-[#d0bcff]">{currencySymbol}</span>
          </div>
          <div className="text-[10px] text-[#949db1] mt-0.5">
            Осталось: <span className={remainingBudget > 0 ? 'text-[#10b981] font-bold' : 'text-rose-400 font-bold'}>
              {remainingBudget.toLocaleString()} {currencySymbol}
            </span>
          </div>
        </div>
      </div>

      {/* AI Financial Advisor Card (Встроенный ИИ) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17202e] to-[#141b27] border border-[#06b6d4]/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#06b6d4]/20 flex items-center justify-center text-[#22d3ee]">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <span className="font-headline text-xs font-bold text-[#e1e2ec]">
              Aura AI • Финансовый советник
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#06b6d4]/20 text-[#22d3ee] text-[10px] font-bold">
            {budgetUsagePercent}% от лимита
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              budgetUsagePercent > 85
                ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                : budgetUsagePercent > 65
                ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]'
                : 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
            }`}
            style={{ width: `${budgetUsagePercent}%` }}
          />
        </div>

        {/* AI Insight Text */}
        <div className="text-xs text-[#cbc3d7] leading-relaxed">
          {budgetUsagePercent > 90 ? (
            <span className="text-rose-300 font-medium">
              ⚠️ <strong>Внимание от ИИ:</strong> Вы израсходовали {budgetUsagePercent}% от установленного лимита в {monthlyLimit.toLocaleString()} {currencySymbol}! Рекомендуем заморозить необязательные траты до конца месяца.
            </span>
          ) : budgetUsagePercent > 70 ? (
            <span>
              💡 <strong>Совет ИИ:</strong> Расходы подходят к 70% лимита. Доступный безопасный бюджет составляет{' '}
              <strong className="text-amber-300">{Math.round(remainingBudget / 24).toLocaleString()} {currencySymbol}/день</strong>. Рекомендуем отслеживать чеки из супермаркетов.
            </span>
          ) : (
            <span>
              ✨ <strong>Оценка ИИ:</strong> Отличный баланс! Вы потратили всего {grandTotalSpent.toLocaleString()} {currencySymbol}. Сохраняя такой темп, вы сможете направить{' '}
              <strong className="text-[#34d399]">{Math.round(income - monthlyLimit).toLocaleString()} {currencySymbol}</strong> в инвестиции или накопления.
            </span>
          )}
        </div>

        {/* Live Aura AI Financial Consultation */}
        {groqAdvice && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed animate-in fade-in duration-300">
            <div className="flex items-center gap-1.5 font-bold text-cyan-400 mb-1">
              <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
              <span>Aura AI Персональный Совет:</span>
            </div>
            {groqAdvice}
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={async () => {
              ambientSound.playTone(680, 0.12);
              setIsGroqLoading(true);
              try {
                const prompt = `Пользователь ввел ежемесячный доход ${income} ${currencySymbol}, лимит расходов ${monthlyLimit} ${currencySymbol}, уже потратил ${grandTotalSpent} ${currencySymbol} (использовано ${budgetUsagePercent}% лимита), долги: мне должны ${totalOwedToMe} ${currencySymbol}, я должен ${totalIOwe} ${currencySymbol}.
Дай 2 кратких, умных и точных финансовых совета, как оптимально распределить бюджет и не превышать лимит. До 3 предложений.`;
                const res = await askGroq(prompt, 'Ты — персональный финансовый ИИ-консультант в Aura OS. Отвечай емко, практично, дружелюбно.');
                setGroqAdvice(res);
              } catch (e) {
                setGroqAdvice('Связь с Aura AI временно восстанавливается. Ваш баланс находится под контролем локальных алгоритмов.');
              } finally {
                setIsGroqLoading(false);
              }
            }}
            disabled={isGroqLoading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#06b6d4]/20 hover:bg-[#06b6d4]/30 text-[#22d3ee] text-[11px] font-bold border border-[#06b6d4]/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[15px]">psychology</span>
            <span>{isGroqLoading ? 'Aura анализирует...' : 'Совет от Aura AI'}</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs for Finance Categories */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#151821] border border-white/[0.05] overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Расходы' },
          { id: 'shopping', label: 'Покупки & Чек' },
          { id: 'debts', label: 'Долги' },
          { id: 'subscriptions', label: 'Подписки' },
          { id: 'utilities', label: 'Ком. услуги' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              ambientSound.playTone(480, 0.05);
              setActiveSubTab(tab.id as any);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSubTab === tab.id
                ? 'bg-[#10b981] text-[#00391d] shadow-sm'
                : 'text-[#8690a2] hover:text-[#e1e2ec]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================
          SUB-TAB 1: OVERVIEW & EXPENSES
          ======================================================== */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8690a2]">История расходов</span>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-[#e1e2ec]"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Добавить расход</span>
            </button>
          </div>

          <div className="space-y-2">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-xl bg-[#151821] border border-white/[0.05] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  </div>
                  <div>
                    <div className="font-headline text-xs font-semibold text-[#e1e2ec]">
                      {exp.title}
                    </div>
                    <div className="text-[10px] text-[#8690a2]">
                      {exp.category} • {exp.date}
                    </div>
                  </div>
                </div>
                <div className="font-headline text-xs font-bold text-rose-300">
                  -{exp.amount.toLocaleString()} {currencySymbol}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: SHOPPING LIST & RECEIPT (СПИСКИ ПОКУПОК И ЧЕК)
          ======================================================== */}
      {activeSubTab === 'shopping' && (
        <div className="space-y-4">
          {/* Total Receipt Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1b1c2b] to-[#12141e] border border-[#a078ff]/30 shadow-md flex items-center justify-between">
            <div>
              <div className="text-[11px] text-[#8690a2]">Общий чек на сумму покупки</div>
              <div className="font-headline text-xl font-extrabold text-[#d0bcff]">
                {shoppingReceiptSum.toLocaleString()} {currencySymbol}
              </div>
              <div className="text-[10px] text-[#34d399] mt-0.5">
                Оплачено / в корзине: {shoppingCheckedSum.toLocaleString()} {currencySymbol}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#a078ff]/20 flex items-center justify-center text-[#d0bcff]">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
          </div>

          {/* Add Shopping Item Form */}
          <form onSubmit={handleAddShoppingItem} className="flex gap-2">
            <input
              type="text"
              placeholder="Товар (например: Овсяное молоко)"
              value={newShopName}
              onChange={(e) => setNewShopName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec] focus:outline-none focus:border-[#10b981]"
            />
            <input
              type="number"
              placeholder="Цена (сом)"
              value={newShopPrice}
              onChange={(e) => setNewShopPrice(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec] focus:outline-none focus:border-[#10b981]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[#10b981] text-[#00391d] font-bold text-xs hover:bg-[#34d399]"
            >
              В чек
            </button>
          </form>

          {/* Shopping Items List */}
          <div className="space-y-2">
            {shoppingList.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  item.completed
                    ? 'bg-white/[0.02] border-white/[0.04] opacity-60'
                    : 'bg-[#151821] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleShopItem(item.id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      item.completed
                        ? 'bg-[#10b981] border-[#10b981] text-black font-bold'
                        : 'border-white/[0.2]'
                    }`}
                  >
                    {item.completed && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                  <span
                    className={`text-xs ${
                      item.completed ? 'line-through text-[#8690a2]' : 'text-[#e1e2ec]'
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-headline text-xs font-bold text-[#e1e2ec]">
                    {item.price.toLocaleString()} {currencySymbol}
                  </span>
                  <button
                    onClick={() => handleDeleteShopItem(item.id)}
                    className="text-[#697285] hover:text-rose-400 p-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: DEBTS (ДОЛГИ: КТО МНЕ ДОЛЖЕН / КОМУ Я ДОЛЖЕН)
          ======================================================== */}
      {activeSubTab === 'debts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8690a2]">Учет долгов</span>
            <button
              onClick={() => setIsAddDebtOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-[#e1e2ec]"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Добавить долг</span>
            </button>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400 font-semibold">Мне должны</div>
              <div className="font-headline text-lg font-bold text-emerald-300">
                +{totalOwedToMe.toLocaleString()} {currencySymbol}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <div className="text-[10px] text-rose-400 font-semibold">Я должен</div>
              <div className="font-headline text-lg font-bold text-rose-300">
                -{totalIOwe.toLocaleString()} {currencySymbol}
              </div>
            </div>
          </div>

          {/* Debts List */}
          <div className="space-y-2">
            {debts.map((d) => (
              <div
                key={d.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  d.settled
                    ? 'bg-white/[0.02] border-white/[0.04] opacity-50'
                    : 'bg-[#151821] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      d.type === 'owed_to_me'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {d.type === 'owed_to_me' ? 'ВХ' : 'ИС'}
                  </div>
                  <div>
                    <div className="font-headline text-xs font-semibold text-[#e1e2ec]">
                      {d.person}
                    </div>
                    <div className="text-[10px] text-[#8690a2]">
                      {d.type === 'owed_to_me' ? 'Мне должен' : 'Кому я должен'} • До {d.dueDate}
                      {d.note && ` (${d.note})`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className={`font-headline text-xs font-bold ${
                      d.type === 'owed_to_me' ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {d.amount.toLocaleString()} {currencySymbol}
                  </div>
                  <button
                    onClick={() => handleToggleDebt(d.id)}
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${
                      d.settled
                        ? 'bg-white/[0.06] border-white/[0.1] text-[#949db1]'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {d.settled ? 'Закрыт' : 'Закрыть'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: SUBSCRIPTIONS (ПОДПИСКИ ЕЖЕМЕСЯЧНЫЕ)
          ======================================================== */}
      {activeSubTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div>
              <div className="text-[10px] text-purple-300">Итого подписок в месяц</div>
              <div className="font-headline text-lg font-bold text-purple-200">
                {totalSubCost.toLocaleString()} {currencySymbol} / мес
              </div>
            </div>
            <span className="material-symbols-outlined text-purple-400 text-[24px]">subscriptions</span>
          </div>

          <div className="space-y-2">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl bg-[#151821] border border-white/[0.06] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] text-[#d0bcff] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">{sub.icon}</span>
                  </div>
                  <div>
                    <div className="font-headline text-xs font-semibold text-[#e1e2ec]">
                      {sub.name}
                    </div>
                    <div className="text-[10px] text-[#8690a2]">
                      Списание: {sub.billingDay}-го числа каждого месяца
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-headline text-xs font-bold text-[#e1e2ec]">
                    {sub.cost.toLocaleString()} {currencySymbol}
                  </span>
                  <button
                    onClick={() => handleToggleSubscription(sub.id)}
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
                      sub.active ? 'bg-[#10b981]' : 'bg-white/[0.15]'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        sub.active ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: UTILITY BILLS (ПЛАТЕЖИ КОМ. УСЛУГИ)
          ======================================================== */}
      {activeSubTab === 'utilities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div>
              <div className="text-[10px] text-amber-300">К оплате за ком. услуги</div>
              <div className="font-headline text-lg font-bold text-amber-200">
                {totalUnpaidUtilities.toLocaleString()} {currencySymbol}
              </div>
            </div>
            <span className="material-symbols-outlined text-amber-400 text-[24px]">home_repair_service</span>
          </div>

          <div className="space-y-2">
            {utilities.map((ut) => (
              <div
                key={ut.id}
                className="p-3.5 rounded-xl bg-[#151821] border border-white/[0.06] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      ut.isPaid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {ut.isPaid ? 'check_circle' : 'pending'}
                    </span>
                  </div>
                  <div>
                    <div className="font-headline text-xs font-semibold text-[#e1e2ec]">
                      {ut.title}
                    </div>
                    <div className="text-[10px] text-[#8690a2]">
                      {ut.period} • До {ut.dueDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-headline text-xs font-bold text-[#e1e2ec]">
                      {ut.amount.toLocaleString()} {currencySymbol}
                    </div>
                    <span
                      className={`text-[9px] font-bold ${
                        ut.isPaid ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {ut.isPaid ? 'Оплачено' : 'К оплате'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleUtility(ut.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      ut.isPaid
                        ? 'border-white/[0.1] text-[#949db1] hover:bg-white/[0.04]'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                    }`}
                  >
                    {ut.isPaid ? 'Сброс' : 'Оплатить'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Income Modal */}
      {isEditingIncome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsEditingIncome(false)} />
          <div className="relative z-10 w-full max-w-[360px] rounded-3xl bg-[#161a24] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <h3 className="font-headline font-bold text-sm text-[#e1e2ec]">Изменить сумму дохода</h3>
            <form onSubmit={handleSaveIncome} className="space-y-3">
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Сумма в {currencySymbol}</label>
                <input
                  type="number"
                  value={tempIncome}
                  onChange={(e) => setTempIncome(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-[#e1e2ec]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditingIncome(false)} className="px-3 py-1.5 text-xs text-[#8690a2]">Отмена</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-[#10b981] text-[#00391d] text-xs font-bold">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Limit Modal */}
      {isEditingLimit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsEditingLimit(false)} />
          <div className="relative z-10 w-full max-w-[360px] rounded-3xl bg-[#161a24] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <h3 className="font-headline font-bold text-sm text-[#e1e2ec]">Установить лимит расходов</h3>
            <form onSubmit={handleSaveLimit} className="space-y-3">
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Месячный лимит ({currencySymbol})</label>
                <input
                  type="number"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-[#e1e2ec]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditingLimit(false)} className="px-3 py-1.5 text-xs text-[#8690a2]">Отмена</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-[#a078ff] text-[#1c004d] text-xs font-bold">Установить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsAddExpenseOpen(false)} />
          <div className="relative z-10 w-full max-w-[380px] rounded-3xl bg-[#161a24] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <h3 className="font-headline font-bold text-sm text-[#e1e2ec]">Добавить расход</h3>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">На что потрачено</label>
                <input
                  type="text"
                  placeholder="Супермаркет, бензин, кафе..."
                  value={newExpTitle}
                  onChange={(e) => setNewExpTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Сумма ({currencySymbol})</label>
                <input
                  type="number"
                  value={newExpAmount}
                  onChange={(e) => setNewExpAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Категория</label>
                <select
                  value={newExpCategory}
                  onChange={(e) => setNewExpCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1e29] border border-white/[0.08] text-xs text-[#e1e2ec]"
                >
                  <option value="Продукты">Продукты</option>
                  <option value="Транспорт">Транспорт</option>
                  <option value="Кафе">Кафе</option>
                  <option value="Здоровье">Здоровье</option>
                  <option value="Дом">Дом</option>
                  <option value="Развлечения">Развлечения</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddExpenseOpen(false)} className="px-3 py-1.5 text-xs text-[#8690a2]">Отмена</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-[#10b981] text-[#00391d] text-xs font-bold">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Debt Modal */}
      {isAddDebtOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsAddDebtOpen(false)} />
          <div className="relative z-10 w-full max-w-[380px] rounded-3xl bg-[#161a24] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <h3 className="font-headline font-bold text-sm text-[#e1e2ec]">Добавить запись о долге</h3>
            <form onSubmit={handleAddDebt} className="space-y-3">
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Тип записи</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDebtType('owed_to_me')}
                    className={`py-1.5 rounded-xl border text-xs font-semibold ${
                      newDebtType === 'owed_to_me'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'border-white/[0.06] text-[#8690a2]'
                    }`}
                  >
                    Мне должны
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDebtType('i_owe')}
                    className={`py-1.5 rounded-xl border text-xs font-semibold ${
                      newDebtType === 'i_owe'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'border-white/[0.06] text-[#8690a2]'
                    }`}
                  >
                    Я должен
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Имя / Организация</label>
                <input
                  type="text"
                  placeholder="Имя друга или компания..."
                  value={newDebtPerson}
                  onChange={(e) => setNewDebtPerson(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Сумма ({currencySymbol})</label>
                <input
                  type="number"
                  value={newDebtAmount}
                  onChange={(e) => setNewDebtAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Срок возврата</label>
                <input
                  type="text"
                  placeholder="Например: 25 сентября"
                  value={newDebtDueDate}
                  onChange={(e) => setNewDebtDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddDebtOpen(false)} className="px-3 py-1.5 text-xs text-[#8690a2]">Отмена</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-[#10b981] text-[#00391d] text-xs font-bold">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
