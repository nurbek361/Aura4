import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useLife } from '@/context/LifeContext';
import { AppButton, Card, Field, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';
import { surahs, validateSurahs } from '@/data/surahs';

const QUICK_LINKS: Array<{ icon: keyof typeof Feather.glyphMap; title: string; subtitle: string; path: '/calendar' | '/reminders' | '/shopping' | '/debts' | '/subscriptions' | '/payments' | '/achievements' | '/online' | '/music' | '/movies' }> = [
  { icon: 'calendar', title: 'Календарь', subtitle: 'События, дни рождения, обратный отсчёт', path: '/calendar' },
  { icon: 'bell', title: 'Напоминания', subtitle: 'Личные, о платежах, задачах и здоровье', path: '/reminders' },
  { icon: 'shopping-cart', title: 'Списки покупок', subtitle: 'Несколько списков, работает офлайн', path: '/shopping' },
  { icon: 'users', title: 'Долги', subtitle: 'Мне должны и я должен', path: '/debts' },
  { icon: 'repeat', title: 'Подписки', subtitle: 'Стоимость и следующая дата оплаты', path: '/subscriptions' },
  { icon: 'credit-card', title: 'Платежи', subtitle: 'Запланированные и коммунальные платежи', path: '/payments' },
  { icon: 'award', title: 'Достижения', subtitle: 'Открыты автоматически, делитесь вручную', path: '/achievements' },
  { icon: 'music', title: 'Музыка', subtitle: 'Поиск, preview-плеер, избранное и история', path: '/music' },
  { icon: 'film', title: 'Кино', subtitle: 'Поиск, карточки, детали, трейлеры, избранное и история', path: '/movies' },
  { icon: 'globe', title: 'Онлайн API', subtitle: 'Погода, воздух, валюты, книги, шоу, музыка и новости', path: '/online' },
];

export default function MoreScreen() {
  const colors = useColors();
  const { learnedSurahs, toggleSurah, searchAll, goals, addGoal, updateGoalProgress, removeGoal } = useLife();
  const [query, setQuery] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const results = searchAll(query);
  const progress = Math.round((learnedSurahs.length / 114) * 100);

  return (
    <Screen>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>ВАШЕ ПРОСТРАНСТВО</Text>
      <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 32 }]}>Ещё</Text>
      <Text style={{ color: colors.mutedForeground, marginTop: 6 }}>Соберите личную систему вокруг того, что важно именно вам.</Text>
      <SectionTitle title="Поиск" />
      <Field value={query} onChangeText={setQuery} placeholder="Задачи, операции, цели, покупки…" />
      {query ? <Card>{results.length ? results.map((result, index) => <View key={`${result.title}-${index}`} style={{ paddingVertical: 10, borderBottomWidth: index === results.length - 1 ? 0 : 1, borderBottomColor: colors.border }}><Text style={{ color: colors.foreground, fontWeight: '600' }}>{result.title}</Text><Text style={{ color: colors.mutedForeground, marginTop: 3 }}>{result.type} · {result.detail}</Text></View>) : <Text style={{ color: colors.mutedForeground }}>Ничего не найдено офлайн.</Text>}</Card> : null}

      <SectionTitle title="Цели" action={<Feather name="target" size={20} color={colors.primary} />} />
      <Card>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Field value={goalTitle} onChangeText={setGoalTitle} placeholder="Новая цель" />
          <Field value={goalDeadline} onChangeText={setGoalDeadline} placeholder="Срок" style={{ maxWidth: 110 }} />
        </View>
        <AppButton icon="plus" onPress={() => { addGoal({ title: goalTitle, deadline: goalDeadline }); setGoalTitle(''); setGoalDeadline(''); }}>Добавить цель</AppButton>
      </Card>
      {goals.map((goal) => (
        <Card key={goal.id} style={{ paddingVertical: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.foreground, fontWeight: '600', flex: 1, textDecorationLine: goal.done ? 'line-through' : 'none' }}>{goal.title}</Text>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>{Math.round(goal.progress * 100)}%</Text>
          </View>
          <View style={{ height: 7, borderRadius: 5, backgroundColor: colors.secondary, overflow: 'hidden', marginTop: 12 }}><View style={{ width: `${goal.progress * 100}%`, height: '100%', backgroundColor: colors.primary }} /></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>До {goal.deadline}</Text>
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
              <Pressable onPress={() => updateGoalProgress(goal.id, Math.max(0, goal.progress - 0.1))} hitSlop={8}><Feather name="minus-circle" size={20} color={colors.mutedForeground} /></Pressable>
              <Pressable onPress={() => updateGoalProgress(goal.id, Math.min(1, goal.progress + 0.1))} hitSlop={8}><Feather name="plus-circle" size={20} color={colors.primary} /></Pressable>
              <Pressable onPress={() => removeGoal(goal.id)} hitSlop={8}><Feather name="trash-2" size={18} color={colors.destructive} /></Pressable>
            </View>
          </View>
        </Card>
      ))}

      <SectionTitle title="Духовность" action={<Feather name="bookmark" size={20} color={colors.primary} />} />
      <Card style={{ backgroundColor: colors.cardStrong }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}><View><Text style={{ color: '#B7C0D2', fontSize: 13 }}>Изученные суры</Text><Text style={{ color: colors.background, fontSize: 34, fontWeight: '700', marginTop: 8 }}>{learnedSurahs.length}<Text style={{ color: '#B7C0D2', fontSize: 18 }}> / 114</Text></Text></View><IconBadge icon="book-open" color="#29463E" /></View>
        <View style={{ height: 8, borderRadius: 5, backgroundColor: '#29344D', marginTop: 18, overflow: 'hidden' }}><View style={{ height: '100%', width: `${progress}%`, backgroundColor: '#E5A35B', borderRadius: 5 }} /></View>
        <Text style={{ color: '#B7C0D2', marginTop: 9 }}>{progress}% пути пройдено</Text>
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
        {surahs.slice(0, 12).map((surah) => <Pressable key={surah.number} onPress={() => toggleSurah(surah.number)} style={{ width: '22%', aspectRatio: 1, borderRadius: 16, borderWidth: 1, borderColor: learnedSurahs.includes(surah.number) ? colors.primary : colors.border, backgroundColor: learnedSurahs.includes(surah.number) ? colors.primary : colors.card, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: learnedSurahs.includes(surah.number) ? colors.primaryForeground : colors.foreground, fontWeight: '700' }}>{surah.number}</Text><Text numberOfLines={1} style={{ color: learnedSurahs.includes(surah.number) ? colors.primaryForeground : colors.mutedForeground, fontSize: 10, marginTop: 3, maxWidth: 50 }}>{surah.name}</Text></Pressable>)}
      </View>
      <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 10 }}>{validateSurahs(surahs) ? 'Каталог проверен: 114 записей, без пропусков и дублей.' : 'Каталог требует проверки.'}</Text>
      <AppButton variant="secondary" icon="list" onPress={() => router.push('/surahs')}>Открыть весь каталог</AppButton>

      <SectionTitle title="Быстрый доступ" />
      <Card>
        {QUICK_LINKS.map((link, index) => (
          <Pressable key={link.title} onPress={() => router.push(link.path)}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 11, borderBottomWidth: index === QUICK_LINKS.length - 1 ? 0 : 1, borderBottomColor: colors.border }}>
              <IconBadge icon={link.icon} color={colors.secondary} />
              <View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontWeight: '600' }}>{link.title}</Text><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 3 }}>{link.subtitle}</Text></View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </View>
          </Pressable>
        ))}
      </Card>
      <AppButton variant="secondary" icon="settings" onPress={() => router.push('/settings')}>Настройки и приватность</AppButton>
    </Screen>
  );
}
