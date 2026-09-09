import React, { useState } from 'react';
import { ASSETS, INITIAL_HABITS, INITIAL_QURAN, INITIAL_TASKS } from '../data/mockData';
import { useLiveWeather } from '../utils/weather';
import { CurrencyType, HabitItem, NavigationTab, QuranState, TaskItem } from '../types';
import { ambientSound } from '../utils/audioSynth';

interface HubScreenProps {
  onSelectTab?: (tab: NavigationTab) => void;
}

export const HubScreen: React.FC<HubScreenProps> = ({ onSelectTab }) => {
  const { weather } = useLiveWeather();
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
  const [currency, setCurrency] = useState<CurrencyType>('KGS');
  const [quran, setQuran] = useState<QuranState>(INITIAL_QURAN);
  const [activeFilter, setActiveFilter] = useState('Все сферы');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocusAudioPlaying, setIsFocusAudioPlaying] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [insightModalOpen, setInsightModalOpen] = useState(false);

  // Financial amounts by currency
  const balanceValues = {
    USD: { amount: '2 750', symbol: '$' },
    KZT: { amount: '1 248 500', symbol: '₸' },
    RUB: { amount: '249 700', symbol: '₽' },
    KGS: { amount: '23 770', symbol: 'сом' },
  };

  const toggleCheck = (id: string) => {
    ambientSound.playTone(520, 0.1);
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleCurrencyChange = (curr: CurrencyType) => {
    ambientSound.playTone(600, 0.1);
    setCurrency(curr);
  };

  const toggleQuranAudio = () => {
    if (quran.isPlaying) {
      ambientSound.stop();
      setQuran({ ...quran, isPlaying: false });
    } else {
      ambientSound.playAmbientChord([196, 246.94, 293.66, 392]);
      setQuran({ ...quran, isPlaying: true });
    }
  };

  const toggleFocusAudio = () => {
    if (isFocusAudioPlaying) {
      ambientSound.stop();
      setIsFocusAudioPlaying(false);
    } else {
      ambientSound.playAmbientChord([220, 330, 440, 550]);
      setIsFocusAudioPlaying(true);
    }
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    ambientSound.playTone(700, 0.15);
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      tag: 'Приоритет',
      tagType: 'critical',
      dueTime: 'Сегодня',
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setIsQuickAddOpen(false);
  };

  const handleAddExpense = () => {
    if (!newExpenseAmount.trim()) return;
    ambientSound.playTone(450, 0.15);
    setNewExpenseAmount('');
    setIsQuickAddOpen(false);
  };

  const filterDomains = ['Все сферы', 'Дела', 'Финансы', 'Привычки', 'Духовность', 'Инсайты'];

  return (
    <div className="flex flex-col w-full space-y-4 relative pb-28 select-none">
      {/* Dynamic Ambient Glow Leaks */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#a078ff]/20 rounded-full blur-[90px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 -right-16 w-60 h-60 bg-[#03b5d3]/15 rounded-full blur-[80px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#00a572]/15 rounded-full blur-[85px] pointer-events-none -z-10"></div>

      {/* Header Section with Offline Status */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#d0bcff] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard_customize
            </span>
            <h2 className="text-[22px] font-bold text-[#e1e2ec]">Модули</h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#272a32]/80 border border-white/[0.05]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] shadow-[0_0_8px_#4edea3]"></span>
            <span className="text-[10px] font-semibold text-[#4edea3]">Локально синхронизировано</span>
          </div>
        </div>

        {/* Quick Search & Domain Filter */}
        <div className="relative w-full mt-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#cbc3d7] text-[20px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="module-search"
            placeholder="Поиск модулей, задач, транзакций..."
            type="text"
            className="w-full bg-[#191b23]/90 border border-white/[0.06] text-[#e1e2ec] text-[13px] pl-10 pr-10 py-2.5 rounded-xl outline-none placeholder-[#cbc3d7]/60 focus:bg-[#1d1f27] focus:border-[#4cd7f6]/40 shadow-sm"
          />
          <button
            onClick={() => ambientSound.playTone(500, 0.1)}
            aria-label="Фильтры"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg bg-[#32353d]/60 text-[#cbc3d7] active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </button>
        </div>

        {/* Domain Pills Strip */}
        <div className="flex gap-1.5 overflow-x-auto py-1 no-scrollbar -mx-4 px-4">
          {filterDomains.map((domain) => {
            const isActive = activeFilter === domain;
            return (
              <button
                key={domain}
                onClick={() => setActiveFilter(domain)}
                className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-[#d0bcff]/20 text-[#d0bcff] border border-[#d0bcff]/30'
                    : 'bg-[#272a32] text-[#cbc3d7] hover:text-[#e1e2ec]'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-ping"></span>}
                <span>{domain}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Access to Dedicated Modules */}
        {onSelectTab && (
          <div className="grid grid-cols-4 gap-2 pt-1 pb-1">
            <button
              onClick={() => onSelectTab('finance')}
              className="flex flex-col items-center p-2 rounded-xl bg-[#191b23]/90 border border-emerald-500/20 hover:border-emerald-400/40 text-center active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-emerald-400 text-[20px]">account_balance_wallet</span>
              <span className="text-[10px] font-semibold text-[#e1e2ec] mt-1">Финансы</span>
              <span className="text-[8px] text-[#cbc3d7]">50k сом</span>
            </button>
            <button
              onClick={() => onSelectTab('calendar')}
              className="flex flex-col items-center p-2 rounded-xl bg-[#191b23]/90 border border-pink-500/20 hover:border-pink-400/40 text-center active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-pink-400 text-[20px]">calendar_month</span>
              <span className="text-[10px] font-semibold text-[#e1e2ec] mt-1">Календарь</span>
              <span className="text-[8px] text-[#cbc3d7]">Отсчет</span>
            </button>
            <button
              onClick={() => onSelectTab('reminders')}
              className="flex flex-col items-center p-2 rounded-xl bg-[#191b23]/90 border border-amber-500/20 hover:border-amber-400/40 text-center active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-amber-400 text-[20px]">alarm</span>
              <span className="text-[10px] font-semibold text-[#e1e2ec] mt-1">Напоминания</span>
              <span className="text-[8px] text-[#cbc3d7]">В 15:00</span>
            </button>
            <button
              onClick={() => onSelectTab('health')}
              className="flex flex-col items-center p-2 rounded-xl bg-[#191b23]/90 border border-cyan-500/20 hover:border-cyan-400/40 text-center active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-cyan-400 text-[20px]">fitness_center</span>
              <span className="text-[10px] font-semibold text-[#e1e2ec] mt-1">Здоровье</span>
              <span className="text-[8px] text-[#cbc3d7]">ИИ план</span>
            </button>
          </div>
        )}
      </div>

      {/* MODULE 1: Задачи и Фокус */}
      {(activeFilter === 'Все сферы' || activeFilter === 'Дела') && (
        <div className="relative rounded-2xl bg-[#191b23]/80 border border-white/[0.08] backdrop-blur-xl p-4 overflow-hidden shadow-md">
          <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-[#03b5d3]/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#4cd7f6]/20 flex items-center justify-center text-[#4cd7f6]">
                <span className="material-symbols-outlined text-[18px]">checklist</span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#e1e2ec]">Задачи и Напоминания</h3>
                <span className="text-[10px] text-[#cbc3d7]">
                  {tasks.filter((t) => !t.completed).length} приоритетных сегодня
                </span>
              </div>
            </div>
            {onSelectTab && (
              <button
                onClick={() => onSelectTab('reminders')}
                className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg hover:bg-amber-500/20 font-medium"
              >
                Все напоминания →
              </button>
            )}
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleCheck(task.id)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#1d1f27]/70 border border-white/[0.04] group active:scale-[0.99] transition-all cursor-pointer hover:bg-[#272a32]/70"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    aria-label="Отметить выполненным"
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      task.completed ? 'bg-[#4cd7f6] text-[#003640]' : 'bg-[#32353d] text-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-[13px] truncate ${
                        task.completed ? 'text-[#e1e2ec]/50 line-through' : 'text-[#e1e2ec]'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          task.tagType === 'critical'
                            ? 'bg-[#93000a]/60 text-[#ffb4ab]'
                            : task.tagType === 'release'
                            ? 'bg-[#00a572]/40 text-[#4edea3]'
                            : 'bg-[#32353d] text-[#cbc3d7]'
                        }`}
                      >
                        {task.tag}
                      </span>
                      <span className="text-[10px] text-[#cbc3d7]/80">{task.dueTime}</span>
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#cbc3d7]/40 text-[18px]">
                  drag_indicator
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 2: Финансы и Бюджет */}
      {(activeFilter === 'Все сферы' || activeFilter === 'Финансы') && (
        <div className="relative rounded-2xl bg-[#191b23]/80 border border-white/[0.08] backdrop-blur-xl p-4 overflow-hidden shadow-md">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#00a572]/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3]">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <h3 className="text-[16px] font-bold text-[#e1e2ec]">Финансы &amp; Капитал</h3>
            </div>

            {/* Currency Switcher */}
            <div className="flex bg-[#272a32] rounded-full p-0.5 border border-white/[0.05]">
              {(['KGS', 'USD', 'KZT', 'RUB'] as CurrencyType[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => handleCurrencyChange(curr)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                    currency === curr
                      ? 'bg-[#4edea3] text-[#003824] shadow-sm'
                      : 'text-[#cbc3d7] hover:text-[#e1e2ec]'
                  }`}
                >
                  {curr === 'KGS' ? 'сом' : curr === 'USD' ? '$' : curr === 'KZT' ? '₸' : '₽'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="flex flex-col justify-center">
              <span className="text-[11px] text-[#cbc3d7]">Доступно к расходу</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-[24px] font-bold text-[#e1e2ec] tracking-tight">
                  {balanceValues[currency].amount}
                </span>
                <span className="text-[16px] font-bold text-[#4edea3]">
                  {balanceValues[currency].symbol}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#4edea3]">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                <span className="text-[10px] font-semibold">+18.4% к плану месяца</span>
              </div>
              <div className="flex gap-1.5 mt-3">
                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-[#272a32] text-[#e1e2ec] hover:bg-[#32353d] active:scale-95 transition-all border border-white/[0.05]"
                >
                  <span className="material-symbols-outlined text-[#4edea3] text-[16px]">
                    add_circle
                  </span>
                  <span className="text-[11px] font-semibold">Расход</span>
                </button>
                {onSelectTab && (
                  <button
                    onClick={() => onSelectTab('finance')}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 active:scale-95 transition-all border border-emerald-500/30"
                  >
                    <span className="text-[11px] font-semibold">Учет & Долги →</span>
                  </button>
                )}
              </div>
            </div>

            {/* Monthly Budget Ring SVG */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#1d1f27]/50 border border-white/[0.04]">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#32353d]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-[#4edea3]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="68, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[18px] font-bold text-[#e1e2ec]">68%</span>
                  <span className="text-[10px] text-[#cbc3d7]">Лимит</span>
                </div>
              </div>
              <span className="text-[10px] text-[#cbc3d7] mt-1.5 text-center">Осталось: 21 день</span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: Трекер Привычек */}
      {(activeFilter === 'Все сферы' || activeFilter === 'Привычки') && (
        <div className="relative rounded-2xl bg-[#191b23]/80 border border-white/[0.08] backdrop-blur-xl p-4 overflow-hidden shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#d0bcff]/20 flex items-center justify-center text-[#d0bcff]">
                <span className="material-symbols-outlined text-[18px]">vital_signs</span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#e1e2ec]">Ритм и Привычки</h3>
                <span className="text-[10px] text-[#cbc3d7]">Стрик: 12 дней без сбоев</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#d0bcff] bg-[#d0bcff]/10 px-2.5 py-0.5 rounded-full">
              3 из 4 сегодня
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {habits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => {
                  ambientSound.playTone(550, 0.1);
                  setHabits(
                    habits.map((h) =>
                      h.id === habit.id ? { ...h, percentage: h.percentage >= 100 ? 50 : 100 } : h
                    )
                  );
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1d1f27]/70 border border-white/[0.04] text-center hover:bg-[#272a32] cursor-pointer transition-colors"
              >
                <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#32353d]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={habit.color}
                      strokeDasharray={`${habit.percentage}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                  <span
                    className="material-symbols-outlined text-[18px] absolute"
                    style={{ color: habit.color }}
                  >
                    {habit.icon}
                  </span>
                </div>
                <span className="text-[12px] font-semibold text-[#e1e2ec]">{habit.title}</span>
                <span className="text-[10px] text-[#cbc3d7]">{habit.subtitle}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: Коран и Духовное развитие */}
      {(activeFilter === 'Все сферы' || activeFilter === 'Духовность') && (
        <div className="relative rounded-2xl bg-[#191b23]/80 border border-white/[0.08] backdrop-blur-xl p-4 overflow-hidden shadow-md">
          <div className="absolute -right-8 bottom-0 w-32 h-32 bg-[#a078ff]/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#a078ff]/30 flex items-center justify-center text-[#e9ddff]">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  menu_book
                </span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#e1e2ec]">Коран и Изучение</h3>
                <span className="text-[10px] text-[#d0bcff]">14 из 114 сур освоено</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#272a32] text-[#cbc3d7] text-[10px] font-medium">
              Закладка: 18:46
            </span>
          </div>

          {/* Active Bookmark & Audio Preview Card */}
          <div className="p-3 rounded-xl bg-[#1d1f27]/70 border border-white/[0.04] flex flex-col space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#32353d] flex items-center justify-center text-[#d0bcff] text-[16px] font-bold">
                  {quran.surahNumber}
                </div>
                <div>
                  <span className="text-[15px] font-bold text-[#e1e2ec]">{quran.surahName}</span>
                  <p className="text-[11px] text-[#cbc3d7]">{quran.ayah}</p>
                </div>
              </div>

              <button
                onClick={toggleQuranAudio}
                aria-label="Воспроизвести чтение суры"
                className="w-10 h-10 rounded-full bg-[#d0bcff] text-[#3c0091] flex items-center justify-center shadow-[0_0_16px_rgba(208,188,255,0.4)] active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[22px] font-bold">
                  {quran.isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            {/* Mini Waveform / Progress Slider */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-[#cbc3d7]">{quran.currentTime}</span>
              <div className="flex-1 h-1.5 bg-[#32353d] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d0bcff] to-[#4cd7f6] rounded-full"
                  style={{ width: `${quran.isPlaying ? '65%' : `${quran.progressPercent}%`}` }}
                ></div>
              </div>
              <span className="text-[10px] text-[#cbc3d7]">{quran.totalTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: Мультимедиа & Инсайты (Open-Meteo & Music) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Weather Widget */}
        <div className="p-3.5 rounded-2xl bg-[#191b23]/80 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#cbc3d7]">
              {weather.city} • {weather.source}
            </span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              cloudy_snowing
            </span>
          </div>
          <div className="my-2">
            <span className="text-[30px] font-bold text-[#e1e2ec] tracking-tight">
              {weather.temperature}
            </span>
            <p className="text-[11px] text-[#cbc3d7]">{weather.condition}</p>
          </div>
          <div className="flex items-center justify-between text-[#cbc3d7] pt-1 text-[10px]">
            <span>Влажность: {weather.humidity}</span>
            <span>AQI: {weather.aqi}</span>
          </div>
        </div>

        {/* Media Player Widget */}
        <div className="p-3.5 rounded-2xl bg-[#191b23]/80 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#cbc3d7]">Фокус-поток</span>
            <span className="material-symbols-outlined text-[#d0bcff] text-[18px]">graphic_eq</span>
          </div>
          <div className="my-1.5 min-w-0">
            <p className="text-[14px] font-bold text-[#e1e2ec] truncate">Deep Ambient Echoes</p>
            <p className="text-[11px] text-[#cbc3d7] truncate">Aura Soundscapes</p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => ambientSound.playTone(400, 0.1)}
              aria-label="Предыдущий"
              className="w-8 h-8 rounded-full bg-[#272a32] flex items-center justify-center text-[#cbc3d7] active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">skip_previous</span>
            </button>
            <button
              onClick={toggleFocusAudio}
              aria-label="Пауза/Воспроизведение"
              className="w-9 h-9 rounded-full bg-[#a078ff] text-[#340080] flex items-center justify-center active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">
                {isFocusAudioPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button
              onClick={() => ambientSound.playTone(500, 0.1)}
              aria-label="Следующий"
              className="w-8 h-8 rounded-full bg-[#272a32] flex items-center justify-center text-[#cbc3d7] active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">skip_next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ambient Photo Memory Teaser */}
      <div className="relative w-full h-32 rounded-2xl overflow-hidden shadow-md flex items-end p-4 bg-[#191b23] border border-white/[0.08]">
        <img
          alt="Meditative garden"
          className="absolute inset-0 w-full h-full object-cover"
          src={ASSETS.zenInsight}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e15] via-[#0b0e15]/50 to-transparent"></div>
        <div className="relative z-10 flex items-center justify-between w-full">
          <div>
            <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wider">
              Инсайт дня
            </span>
            <p className="text-[13px] font-medium text-[#e1e2ec]">
              «Спокойствие мысли открывает ясность действий»
            </p>
          </div>
          <button
            onClick={() => setInsightModalOpen(true)}
            className="shrink-0 px-3 py-1 rounded-full bg-[#272a32]/90 backdrop-blur-md text-[#e1e2ec] text-[11px] font-semibold border border-white/[0.08] hover:bg-[#32353d]"
          >
            Читать
          </button>
        </div>
      </div>

      {/* Floating Glowing Quick Add Action Trigger */}
      <div className="fixed right-5 bottom-24 z-30">
        <button
          onClick={() => setIsQuickAddOpen(true)}
          aria-label="Быстрое добавление"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#a078ff] via-[#4cd7f6] to-[#4edea3] text-[#3c0091] shadow-[0_0_28px_rgba(208,188,255,0.45)] flex items-center justify-center active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-[28px] font-bold">add</span>
        </button>
      </div>

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e15]/85 backdrop-blur-2xl">
          <div className="relative w-full max-w-[380px] rounded-3xl bg-[#191b23] border border-white/[0.12] p-5 shadow-2xl flex flex-col space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#e1e2ec]">Быстрое добавление</h3>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] text-[#cbc3d7] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Add Task Input */}
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-semibold text-[#4cd7f6]">Новая задача</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder="Название задачи..."
                  className="flex-1 bg-[#0b0e15]/80 border border-white/[0.08] rounded-xl px-3 py-2 text-[13px] text-[#e1e2ec] outline-none focus:border-[#4cd7f6]"
                />
                <button
                  onClick={handleAddTask}
                  className="px-3 py-2 rounded-xl bg-[#4cd7f6] text-[#003640] font-bold text-[12px]"
                >
                  Добавить
                </button>
              </div>
            </div>

            {/* Quick Expense Input */}
            <div className="flex flex-col space-y-1 pt-2 border-t border-white/[0.05]">
              <label className="text-[11px] font-semibold text-[#4edea3]">Расход ({balanceValues[currency].symbol})</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddExpense()}
                  placeholder="Сумма расхода..."
                  className="flex-1 bg-[#0b0e15]/80 border border-white/[0.08] rounded-xl px-3 py-2 text-[13px] text-[#e1e2ec] outline-none focus:border-[#4edea3]"
                />
                <button
                  onClick={handleAddExpense}
                  className="px-3 py-2 rounded-xl bg-[#4edea3] text-[#003824] font-bold text-[12px]"
                >
                  Записать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insight Modal */}
      {insightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e15]/85 backdrop-blur-2xl">
          <div className="relative w-full max-w-[400px] rounded-3xl bg-[#191b23] border border-white/[0.12] p-5 shadow-2xl flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#4edea3] uppercase tracking-wider">
                Инсайт дня
              </span>
              <button
                onClick={() => setInsightModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] text-[#cbc3d7] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <h3 className="text-[18px] font-bold text-[#e1e2ec]">
              «Спокойствие мысли открывает ясность действий»
            </h3>
            <p className="text-[13px] text-[#cbc3d7] leading-relaxed">
              Когда внимание рассеивается на сотни уведомлений, продуктивность падает. Aura AI Life
              OS организует ваши дела, финансы и внутренний баланс в единый гармоничный поток.
              Уделите 10 минут тишине перед сложными задачами.
            </p>
            <button
              onClick={() => setInsightModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#d0bcff] text-[#3c0091] font-bold text-[13px]"
            >
              Принять инсайт
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
