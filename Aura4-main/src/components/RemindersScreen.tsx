import React, { useState } from 'react';
import { ReminderItem } from '../types';
import { INITIAL_REMINDERS } from '../data/mockData';
import { ambientSound } from '../utils/audioSynth';

export const RemindersScreen: React.FC = () => {
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('aura_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [filter, setFilter] = useState<'all' | 'today' | 'completed'>('today');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('15:00');
  const [newDate, setNewDate] = useState('Сегодня');
  const [newCategory, setNewCategory] = useState<ReminderItem['category']>('health');
  const [newPriority, setNewPriority] = useState<ReminderItem['priority']>('high');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const saveReminders = (updated: ReminderItem[]) => {
    setReminders(updated);
    localStorage.setItem('aura_reminders', JSON.stringify(updated));
  };

  const handleToggleReminder = (id: string) => {
    ambientSound.playTone(720, 0.12);
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    saveReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    ambientSound.playTone(300, 0.1);
    setRemovingId(id);
    // Let the dissolve animation play before actually removing the item.
    window.setTimeout(() => {
      saveReminders(reminders.filter((r) => r.id !== id));
      setRemovingId(null);
    }, 420);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: ReminderItem = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime,
      date: newDate,
      category: newCategory,
      completed: false,
      priority: newPriority,
    };

    saveReminders([item, ...reminders]);
    ambientSound.playTone(580, 0.15);
    setNewTitle('');
    setIsAddOpen(false);
  };

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'today') return r.date === 'Сегодня' && !r.completed;
    if (filter === 'completed') return r.completed;
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#eab308] uppercase tracking-wider">
            Тайм-менеджмент & Уведомления
          </span>
          <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">
            Напоминания
          </h1>
        </div>

        <button
          onClick={() => {
            ambientSound.playTone(520, 0.08);
            setIsAddOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#eab308] text-[#332200] font-semibold text-xs shadow-[0_0_16px_rgba(234,179,8,0.35)] hover:bg-[#facc15] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_alert</span>
          <span>Напомнить</span>
        </button>
      </div>

      {/* Quick Example Card (e.g. Визит к врачу в 15:00) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#241f14] via-[#191612] to-[#12141a] border border-[#eab308]/30 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eab308]/20 border border-[#eab308]/40 flex items-center justify-center text-[#fde047] shadow-[0_0_14px_rgba(234,179,8,0.3)]">
            <span className="material-symbols-outlined text-[22px]">medical_services</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#fde047]">Ближайшее важное</span>
              <span className="px-1.5 py-0.5 rounded bg-[#eab308]/20 text-[10px] font-bold text-[#fef08a]">
                в 15:00
              </span>
            </div>
            <div className="font-headline text-sm font-semibold text-[#e1e2ec]">
              Визит к врачу (стоматолог)
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[#949db1]">Сегодня</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#151821] border border-white/[0.05]">
        {[
          { id: 'today', label: 'Сегодня' },
          { id: 'all', label: 'Все напоминания' },
          { id: 'completed', label: 'Выполненные' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              ambientSound.playTone(450, 0.05);
              setFilter(tab.id as any);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === tab.id
                ? 'bg-[#eab308] text-[#332200] shadow-sm'
                : 'text-[#8690a2] hover:text-[#e1e2ec]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-2.5">
        {filteredReminders.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#151821] border border-white/[0.05] text-[#8690a2] text-xs">
            Нет напоминаний в этой категории.
          </div>
        ) : (
          filteredReminders.map((rem) => {
            const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
              health: { bg: 'bg-[#10b981]/20', text: 'text-[#34d399]', icon: 'health_and_safety' },
              work: { bg: 'bg-[#06b6d4]/20', text: 'text-[#22d3ee]', icon: 'work' },
              finance: { bg: 'bg-[#eab308]/20', text: 'text-[#fde047]', icon: 'payments' },
              personal: { bg: 'bg-[#a078ff]/20', text: 'text-[#d0bcff]', icon: 'person' },
            };

            const cat = categoryColors[rem.category] || categoryColors.personal;

            return (
              <div
                key={rem.id}
                className={`hover-lift p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  removingId === rem.id
                    ? 'animate-dissolve-out'
                    : rem.completed
                    ? 'bg-white/[0.02] border-white/[0.04] opacity-55'
                    : 'bg-[#151821] border-white/[0.06] hover:border-white/[0.12] shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleReminder(rem.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      rem.completed
                        ? 'bg-[#10b981] border-[#10b981] text-black font-bold'
                        : 'border-white/[0.2] hover:border-[#eab308]'
                    }`}
                  >
                    {rem.completed && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                  </button>

                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cat.bg} ${cat.text}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  </div>

                  <div>
                    <div
                      className={`font-headline text-xs font-semibold ${
                        rem.completed ? 'line-through text-[#8690a2]' : 'text-[#e1e2ec]'
                      }`}
                    >
                      {rem.title}
                    </div>
                    <div className="text-[11px] text-[#8690a2] flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-0.5 text-[#fde047] font-medium">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {rem.time}
                      </span>
                      <span>•</span>
                      <span>{rem.date}</span>
                      {rem.priority === 'high' && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                          Важно
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="tap-ripple text-[#697285] hover:text-[#f43f5e] p-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Reminder Modal Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsAddOpen(false)}
          />

          <div className="relative z-10 w-full max-w-[400px] rounded-3xl bg-[#161a24] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="font-headline text-base font-bold text-[#e1e2ec]">
                Создать напоминание
              </h2>
              <button onClick={() => setIsAddOpen(false)} className="text-[#8690a2] hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-3">
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Что напомнить?</label>
                <input
                  type="text"
                  placeholder="Например: Сегодня в 15:00 визит к врачу"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-[#e1e2ec] focus:outline-none focus:border-[#eab308]"
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'В 15:00 к врачу', time: '15:00', title: 'Визит к врачу' },
                  { label: 'В 18:30 созвон', time: '18:30', title: 'Рабочий созвон' },
                  { label: 'В 20:00 тренировка', time: '20:00', title: 'Вечерняя тренировка' },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewTitle(preset.title);
                      setNewTime(preset.time);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-[#cbc3d7] border border-white/[0.05]"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8690a2] mb-1">Время</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec] focus:outline-none focus:border-[#eab308]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8690a2] mb-1">День</label>
                  <select
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1e29] border border-white/[0.08] text-xs text-[#e1e2ec] focus:outline-none focus:border-[#eab308]"
                  >
                    <option value="Сегодня">Сегодня</option>
                    <option value="Завтра">Завтра</option>
                    <option value="На выходных">На выходных</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Категория</label>
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  {[
                    { id: 'health', label: 'Здоровье' },
                    { id: 'work', label: 'Работа' },
                    { id: 'finance', label: 'Финансы' },
                    { id: 'personal', label: 'Личное' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewCategory(cat.id as any)}
                      className={`py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                        newCategory === cat.id
                          ? 'bg-[#eab308]/20 border-[#eab308] text-[#fde047]'
                          : 'border-white/[0.06] text-[#8690a2]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8690a2] hover:bg-white/[0.06]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#eab308] text-[#332200] font-semibold text-xs shadow-md hover:bg-[#facc15]"
                >
                  Установить напоминание
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
