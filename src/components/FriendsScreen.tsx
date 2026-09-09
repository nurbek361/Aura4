import React, { useState } from 'react';
import { FriendItem } from '../types';
import { INITIAL_FRIENDS } from '../data/mockData';
import { ambientSound } from '../utils/audioSynth';

export const FriendsScreen: React.FC = () => {
  const [friends, setFriends] = useState<FriendItem[]>(() => {
    const saved = localStorage.getItem('aura_friends');
    return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<FriendItem | null>(null);

  const saveFriends = (updated: FriendItem[]) => {
    setFriends(updated);
    localStorage.setItem('aura_friends', JSON.stringify(updated));
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    const newF: FriendItem = {
      id: `fr-${Date.now()}`,
      name: newFriendName.trim(),
      username: newFriendUsername.trim().startsWith('@')
        ? newFriendUsername.trim()
        : `@${newFriendUsername.trim() || 'user'}`,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      auraStatus: 'Новый исследователь',
      level: 1,
      unlockedAchievements: 3,
      totalAchievements: 15,
      streakDays: 1,
      recentAchievement: '✨ Начало пути: подключение к Aura OS',
      isOnline: true,
      achievements: [
        {
          id: 'ach-welcome',
          title: 'Первое знакомство',
          description: 'Успешное подключение к Aura OS и добавление в друзья',
          icon: 'stars',
          unlocked: true,
          date: 'Только что',
        },
      ],
    };

    saveFriends([newF, ...friends]);
    ambientSound.playTone(620, 0.12);
    setNewFriendName('');
    setNewFriendUsername('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#06b6d4] uppercase tracking-wider">
            Сообщество & Совместный рост
          </span>
          <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">
            Друзья & Ачивки
          </h1>
        </div>

        <button
          onClick={() => {
            ambientSound.playTone(520, 0.08);
            setIsAddOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#06b6d4] text-[#002f37] font-semibold text-xs shadow-[0_0_16px_rgba(6,182,212,0.35)] hover:bg-[#22d3ee] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Добавить друга</span>
        </button>
      </div>

      {/* Hero Social Feed */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#12232b] via-[#131b23] to-[#12151e] border border-[#06b6d4]/30 shadow-md">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#22d3ee]">
          <span className="material-symbols-outlined text-[18px]">stream</span>
          <span>Лента достижений ваших друзей</span>
        </div>
        <div className="space-y-2 text-xs text-[#cbc3d7]">
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-between">
            <div>
              <strong className="text-white">Айбек</strong> открыл ачивку: <span className="text-[#fde047]">«🏃 10 000 шагов 7 дней подряд»</span>
            </div>
            <span className="text-[10px] text-[#8690a2]">15 мин назад</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-between">
            <div>
              <strong className="text-white">Нурлан</strong> открыл ачивку: <span className="text-[#34d399]">«💰 Инвестор: доход учтен»</span>
            </div>
            <span className="text-[10px] text-[#8690a2]">2 часа назад</span>
          </div>
        </div>
      </div>

      {/* Friends List */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-[#8690a2] px-1">
          Ваш круг ({friends.length})
        </div>

        <div className="space-y-2">
          {friends.map((friend) => (
            <div
              key={friend.id}
              onClick={() => {
                ambientSound.playTone(480, 0.06);
                setSelectedFriend(friend);
              }}
              className="p-3.5 rounded-2xl bg-[#151821] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white/[0.05] border border-white/[0.08] shrink-0">
                  <img
                    src={friend.avatarUrl}
                    alt={friend.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-xs font-bold text-[#e1e2ec]">
                      {friend.name}
                    </span>
                    <span className="text-[10px] text-[#8690a2]">{friend.username}</span>
                  </div>
                  <div className="text-[11px] text-[#fde047] flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">military_tech</span>
                    <span>{friend.achievementsCount} ачивок</span>
                    <span className="text-[#8690a2]">•</span>
                    <span className="text-[#22d3ee]">Стрик {friend.streakDays} дн.</span>
                  </div>
                  {friend.recentAchievement && (
                    <div className="text-[10px] text-[#949db1] truncate max-w-[220px] mt-0.5">
                      Недавняя: {friend.recentAchievement}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-[#8690a2]">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Friend Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsAddOpen(false)} />
          <div className="relative z-10 w-full max-w-[380px] rounded-3xl bg-[#161a24] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="font-headline text-base font-bold text-[#e1e2ec]">Добавить друга</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-[#8690a2] hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddFriend} className="space-y-3">
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Имя друга</label>
                <input
                  type="text"
                  placeholder="Например: Азамат, Элина..."
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Никнейм / Aura ID</label>
                <input
                  type="text"
                  placeholder="@azamat_kg"
                  value={newFriendUsername}
                  onChange={(e) => setNewFriendUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 text-xs text-[#8690a2]">Отмена</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-[#06b6d4] text-[#002f37] text-xs font-bold">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Friend Achievements Modal */}
      {selectedFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setSelectedFriend(null)} />
          <div className="relative z-10 w-full max-w-[400px] rounded-3xl bg-[#161a24] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src={selectedFriend.avatarUrl} alt={selectedFriend.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm text-[#e1e2ec]">{selectedFriend.name}</h3>
                  <div className="text-[10px] text-[#8690a2]">{selectedFriend.username} • Уровень {selectedFriend.level}</div>
                </div>
              </div>
              <button onClick={() => setSelectedFriend(null)} className="text-[#8690a2] hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#e1e2ec]">Ачивки друга ({selectedFriend.achievementsCount}):</div>
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#eab308] text-[20px]">water_drop</span>
                  <div>
                    <div className="text-xs font-semibold text-[#e1e2ec]">Гидратация 10 дней</div>
                    <div className="text-[10px] text-[#8690a2]">Выпивал от 2.5 л воды каждый день</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#10b981] text-[20px]">savings</span>
                  <div>
                    <div className="text-xs font-semibold text-[#e1e2ec]">Бюджет в норме</div>
                    <div className="text-[10px] text-[#8690a2]">Не превысил лимит за прошлый месяц</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#06b6d4] text-[20px]">menu_book</span>
                  <div>
                    <div className="text-xs font-semibold text-[#e1e2ec]">Книжный клуб</div>
                    <div className="text-[10px] text-[#8690a2]">Прочитал книгу «Атомные привычки»</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFriend(null)}
                className="px-4 py-1.5 rounded-xl bg-white/[0.06] text-xs font-semibold text-[#e1e2ec]"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
