import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife } from '@/context/LifeContext';
import { Card, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';
import { getWeather, weatherDescription, type WeatherData } from '@/services/liveApi';

export default function HomeScreen() {
  const colors = useColors();
  const { profile, tasks, habits, transactions, goals, reminders, payments } = useLife();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  useEffect(() => { getWeather().then(setWeather).catch(() => setWeather(null)); }, []);
  const open = (path: '/planner' | '/money' | '/more') => router.push(path);
  const balance = transactions.reduce((sum, item) => sum + (item.kind === 'income' ? item.amountMinor : -item.amountMinor), 0);
  const done = tasks.filter((task) => task.done).length;
  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View><Text style={[styles.eyebrow, { color: colors.primary }]}>ПЯТНИЦА, 4 СЕНТЯБРЯ</Text><Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 32 }]}>Добрый день, {profile.name}</Text><Text style={{ color: colors.mutedForeground, marginTop: 6 }}>Соберите день вокруг главного.</Text></View>
        <Pressable onPress={() => router.push('/settings')} style={{ width: 42, height: 42, borderRadius: 15, backgroundColor: colors.cardStrong, alignItems: 'center', justifyContent: 'center' }}><Feather name="user" size={18} color={colors.background} /></Pressable>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 235, marginTop: 8, marginBottom: 2 }}>
        <View style={{ position: 'absolute', width: 210, height: 210, borderRadius: 105, borderWidth: 1, borderColor: 'rgba(76,215,246,0.45)', transform: [{ rotate: '-12deg' }] }} />
        <View style={{ position: 'absolute', width: 184, height: 184, borderRadius: 92, borderWidth: 1, borderColor: 'rgba(160,120,255,0.45)', transform: [{ rotate: '24deg' }] }} />
        <View style={{ position: 'absolute', width: 155, height: 155, borderRadius: 78, backgroundColor: 'rgba(160,120,255,0.10)' }} />
        <Image source={require('../../assets/images/aura-assistant.png')} style={{ width: 168, height: 168, borderRadius: 84 }} />
      </View>
      <Card style={{ marginTop: 0, backgroundColor: colors.cardStrong, minHeight: 162 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><View><Text style={{ color: '#B7C0D2', fontSize: 13 }}>Сейчас в Бишкеке</Text><Text style={{ color: colors.background, fontSize: 42, fontWeight: '700', marginTop: 4 }}>{weather ? `${Math.round(weather.temperature)}°` : '—'}</Text><Text style={{ color: '#B7C0D2', marginTop: 2 }}>{weather ? `${weatherDescription(weather.code)} · ощущается как ${Math.round(weather.feelsLike)}°` : 'Загрузка погоды…'}</Text></View><View style={{ alignItems: 'flex-end' }}><Feather name="cloud" size={34} color="#E5A35B" /><Text style={{ color: '#B7C0D2', fontSize: 12, marginTop: 12 }}>{weather ? 'REAL API · OPEN-METEO' : 'API недоступен'}</Text></View></View>
      </Card>
      <SectionTitle title="Фокус дня" action={<Pressable onPress={() => open('/planner')}><Text style={{ color: colors.primary, fontWeight: '700' }}>Открыть</Text></Pressable>} />
      <Pressable onPress={() => open('/planner')}><Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><IconBadge icon="check-square" color={colors.accent} /><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '700' }}>{done} из {tasks.length} задач выполнено</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{tasks.find((task) => !task.done)?.title ?? 'День завершён — можно выдохнуть'}</Text></View><Feather name="chevron-right" size={18} color={colors.mutedForeground} /></Card></Pressable>
      <View style={{ flexDirection: 'row', gap: 12 }}><Pressable onPress={() => open('/money')} style={{ flex: 1 }}><Card style={{ minHeight: 128 }}><IconBadge icon="trending-up" color={colors.secondary} /><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 14 }}>БАЛАНС</Text><Text style={{ color: colors.foreground, fontSize: 21, fontWeight: '700', marginTop: 5 }}>{(balance / 100).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} сом</Text></Card></Pressable><Pressable onPress={() => open('/planner')} style={{ flex: 1 }}><Card style={{ minHeight: 128 }}><IconBadge icon="activity" color={colors.accent} /><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 14 }}>ПРИВЫЧКИ</Text><Text style={{ color: colors.foreground, fontSize: 21, fontWeight: '700', marginTop: 5 }}>{habits.filter((habit) => habit.completedToday).length} / {habits.length}</Text></Card></Pressable></View>
      {(() => {
        const pendingReminders = reminders.filter((r) => !r.done).length;
        const duePayments = payments.filter((p) => !p.paid).length;
        if (pendingReminders === 0 && duePayments === 0) return null;
        return (
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
            {pendingReminders > 0 ? <Pressable onPress={() => router.push('/reminders')} style={{ flex: 1 }}><Card style={{ paddingVertical: 14 }}><IconBadge icon="bell" color={colors.secondary} /><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 10 }}>НАПОМИНАНИЯ</Text><Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '700', marginTop: 3 }}>{pendingReminders}</Text></Card></Pressable> : null}
            {duePayments > 0 ? <Pressable onPress={() => router.push('/payments')} style={{ flex: 1 }}><Card style={{ paddingVertical: 14 }}><IconBadge icon="credit-card" color={colors.accent} /><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 10 }}>ПЛАТЕЖИ</Text><Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '700', marginTop: 3 }}>{duePayments}</Text></Card></Pressable> : null}
          </View>
        );
      })()}
      <SectionTitle title="Ваши цели" action={<Pressable onPress={() => open('/more')}><Text style={{ color: colors.primary, fontWeight: '700' }}>Все</Text></Pressable>} />
      {goals.map((goal) => <Card key={goal.id} style={{ paddingVertical: 14 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: colors.foreground, fontWeight: '600' }}>{goal.title}</Text><Text style={{ color: colors.primary, fontWeight: '700' }}>{Math.round(goal.progress * 100)}%</Text></View><View style={{ height: 7, borderRadius: 5, backgroundColor: colors.secondary, overflow: 'hidden', marginTop: 12 }}><View style={{ width: `${goal.progress * 100}%`, height: '100%', backgroundColor: colors.primary }} /></View><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 8 }}>До {goal.deadline}</Text></Card>)}
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 }}><Feather name="shield" size={14} color={colors.primary} /><Text style={{ color: colors.mutedForeground, fontSize: 12, flex: 1 }}>Ваши личные данные хранятся на устройстве.</Text></View>
    </Screen>
  );
}
