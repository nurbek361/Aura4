import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { INITIAL_CALENDAR_EVENTS } from '../data/mockData';
import { ambientSound } from '../utils/audioSynth';

interface CalendarScreenProps {
  onBackToHome?: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onBackToHome }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('aura_calendar_events');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [selectedDate, setSelectedDate] = useState<string>('2026-09-12');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-09-15');
  const [newEventTime, setNewEventTime] = useState('18:00');
  const [newEventType, setNewEventType] = useState<CalendarEvent['type']>('birthday');
  const [newEventCountdown, setNewEventCountdown] = useState(true);
  const [newEventNotes, setNewEventNotes] = useState('');

  // Live timer tick for real-time countdown calculation
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const saveEvents = (updated: CalendarEvent[]) => {
    setEvents(updated);
    localStorage.setItem('aura_calendar_events', JSON.stringify(updated));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    let color = '#ec4899';
    if (newEventType === 'deadline') color = '#06b6d4';
    if (newEventType === 'holiday') color = '#10b981';
    if (newEventType === 'meeting') color = '#a078ff';
    if (newEventType === 'personal') color = '#eab308';

    const newEvent: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: newEventTitle.trim(),
      date: newEventDate,
      time: newEventTime,
      type: newEventType,
      isCountdown: newEventCountdown,
      color,
      notes: newEventNotes.trim() || undefined,
    };

    saveEvents([...events, newEvent]);
    ambientSound.playTone(600, 0.15);
    setNewEventTitle('');
    setNewEventNotes('');
    setIsAddModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    ambientSound.playTone(320, 0.1);
    saveEvents(events.filter((ev) => ev.id !== id));
  };

  // Helper to calculate countdown
  const getCountdownString = (dateStr: string, timeStr?: string) => {
    const target = new Date(`${dateStr}T${timeStr || '00:00'}:00`);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isPast: false };
  };

  // Simple Month Matrix for September 2026 (starts Tuesday, 30 days)
  const daysInMonth = 30;
  const startDayOffset = 2; // Tuesday is index 2 (Sun=0, Mon=1, Tue=2)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const countdownEvents = events.filter((e) => e.isCountdown);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#8b5cf6] uppercase tracking-wider">
            События & Отсчет
          </span>
          <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">
            Календарь
          </h1>
        </div>

        <button
          onClick={() => {
            ambientSound.playTone(520, 0.08);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#a078ff] text-[#1c004d] font-semibold text-xs shadow-[0_0_16px_rgba(160,120,255,0.35)] hover:bg-[#b794ff] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Новое событие</span>
        </button>
      </div>

      {/* Hero Live Countdowns Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-[#8690a2] px-1">
          <span>Обратный отсчет до важных дат</span>
          <span className="text-[#06b6d4]">{countdownEvents.length} активных</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {countdownEvents.map((ev) => {
            const cd = getCountdownString(ev.date, ev.time);
            return (
              <div
                key={ev.id}
                className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-[#181c26] to-[#12151e] border border-white/[0.08] shadow-lg"
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20"
                  style={{ backgroundColor: ev.color }}
                />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: ev.color, boxShadow: `0 0 10px ${ev.color}` }}
                    />
                    <h3 className="font-headline font-semibold text-sm text-[#e1e2ec] truncate max-w-[180px]">
                      {ev.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="text-[#697285] hover:text-[#f43f5e] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                {cd.isPast ? (
                  <div className="text-xs text-[#10b981] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Событие наступило!
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.04]">
                      <div className="text-lg font-bold font-headline text-[#e1e2ec]">{cd.days}</div>
                      <div className="text-[9px] text-[#8690a2] uppercase">Дней</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.04]">
                      <div className="text-lg font-bold font-headline text-[#e1e2ec]">{cd.hours}</div>
                      <div className="text-[9px] text-[#8690a2] uppercase">Часов</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.04]">
                      <div className="text-lg font-bold font-headline text-[#e1e2ec]">{cd.minutes}</div>
                      <div className="text-[9px] text-[#8690a2] uppercase">Мин</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.04]">
                      <div className="text-lg font-bold font-headline text-[#06b6d4]">{cd.seconds}</div>
                      <div className="text-[9px] text-[#8690a2] uppercase">Сек</div>
                    </div>
                  </div>
                )}

                <div className="mt-2 text-[11px] text-[#949db1] flex items-center justify-between">
                  <span>{ev.date} {ev.time && `в ${ev.time}`}</span>
                  {ev.notes && <span className="truncate max-w-[120px] text-[10px] text-[#8690a2]">{ev.notes}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Month Grid */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#151821] border border-white/[0.06] shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a078ff] text-[20px]">calendar_month</span>
            <span className="font-headline font-bold text-sm text-[#e1e2ec]">Сентябрь 2026</span>
          </div>
          <span className="text-xs text-[#8690a2]">Сегодня: 06 Сентября</span>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#697285] mb-2">
          <span>Вс</span>
          <span>Пн</span>
          <span>Вт</span>
          <span>Ср</span>
          <span>Чт</span>
          <span>Пт</span>
          <span>Сб</span>
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {/* Offset blanks */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`blank-${i}`} className="h-9"></div>
          ))}

          {daysArray.map((day) => {
            const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
            const isToday = day === 6;
            const isSelected = selectedDate === dateStr;
            const dayEvents = events.filter((e) => e.date === dateStr);
            const hasEvent = dayEvents.length > 0;

            return (
              <button
                key={day}
                onClick={() => {
                  ambientSound.playTone(480, 0.05);
                  setSelectedDate(dateStr);
                }}
                className={`h-9 sm:h-10 rounded-xl relative flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#a078ff] text-[#1c004d] font-bold shadow-[0_0_12px_rgba(160,120,255,0.4)]'
                    : isToday
                    ? 'bg-[#06b6d4]/20 text-[#22d3ee] font-bold border border-[#06b6d4]/40'
                    : 'text-[#cbc3d7] hover:bg-white/[0.06]'
                }`}
              >
                <span>{day}</span>
                {hasEvent && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((ev, idx) => (
                      <span
                        key={idx}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: ev.color }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events List */}
      <div className="p-4 rounded-2xl bg-[#151821] border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#e1e2ec]">События на {selectedDate}</span>
          <span className="text-[#8690a2]">
            {events.filter((e) => e.date === selectedDate).length} запланировано
          </span>
        </div>

        <div className="space-y-2">
          {events.filter((e) => e.date === selectedDate).length === 0 ? (
            <div className="py-6 text-center text-xs text-[#8690a2]">
              На эту дату пока нет запланированных событий.
            </div>
          ) : (
            events
              .filter((e) => e.date === selectedDate)
              .map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${ev.color}25`, color: ev.color }}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {ev.type === 'birthday'
                          ? 'cake'
                          : ev.type === 'deadline'
                          ? 'flag'
                          : ev.type === 'holiday'
                          ? 'landscape'
                          : 'event'}
                      </span>
                    </div>
                    <div>
                      <div className="font-headline text-xs font-semibold text-[#e1e2ec]">
                        {ev.title}
                      </div>
                      <div className="text-[10px] text-[#8690a2]">
                        {ev.time || 'Весь день'} {ev.notes && `• ${ev.notes}`}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="text-[#697285] hover:text-[#f43f5e] p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Add Event Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-[420px] rounded-3xl bg-[#161a24] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="font-headline text-base font-bold text-[#e1e2ec]">
                Добавить важное событие
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8690a2] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Название события</label>
                <input
                  type="text"
                  placeholder="Например: День рождения мамы, Дедлайн проекта..."
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-[#e1e2ec] focus:outline-none focus:border-[#a078ff]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8690a2] mb-1">Дата</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec] focus:outline-none focus:border-[#a078ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8690a2] mb-1">Время</label>
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec] focus:outline-none focus:border-[#a078ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Тип события</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { type: 'birthday', label: 'День рождения', icon: 'cake' },
                    { type: 'deadline', label: 'Дедлайн', icon: 'flag' },
                    { type: 'holiday', label: 'Праздник', icon: 'landscape' },
                  ].map((t) => (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => setNewEventType(t.type as any)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        newEventType === t.type
                          ? 'bg-[#a078ff]/20 border-[#a078ff] text-[#d0bcff]'
                          : 'border-white/[0.06] text-[#8690a2] hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                      <span className="text-[10px] font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <input
                  type="checkbox"
                  id="countdown-toggle"
                  checked={newEventCountdown}
                  onChange={(e) => setNewEventCountdown(e.target.checked)}
                  className="w-4 h-4 accent-[#06b6d4] rounded"
                />
                <label htmlFor="countdown-toggle" className="text-xs text-[#e1e2ec] cursor-pointer">
                  Включить живой обратный отсчет (дни, часы, минуты)
                </label>
              </div>

              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Заметка / Примечание</label>
                <input
                  type="text"
                  placeholder="Купить подарок, подготовить документы..."
                  value={newEventNotes}
                  onChange={(e) => setNewEventNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec] focus:outline-none focus:border-[#a078ff]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8690a2] hover:bg-white/[0.06]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#a078ff] text-[#1c004d] font-semibold text-xs shadow-md hover:bg-[#b794ff]"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
