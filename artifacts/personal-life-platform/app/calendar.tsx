import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife, type EventType } from '@/context/LifeContext';
import { AppButton, Card, Field, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';

const EVENT_LABELS: Record<EventType, string> = {
  event: 'Событие',
  meeting: 'Встреча',
  birthday: 'День рождения',
  payment: 'Платёж',
  goalDeadline: 'Дедлайн цели',
};
const EVENT_TYPES = Object.keys(EVENT_LABELS) as EventType[];

function daysUntil(dateStr: string) {
  const target = new Date(dateStr);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function CalendarScreen() {
  const colors = useColors();
  const { events, addEvent, removeEvent, birthdays, addBirthday, removeBirthday, countdowns, addCountdown, removeCountdown } = useLife();
  const [tab, setTab] = useState<'events' | 'birthdays' | 'countdowns'>('events');

  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState<EventType>('event');
  const [bdayName, setBdayName] = useState('');
  const [bdayDate, setBdayDate] = useState('');
  const [countdownTitle, setCountdownTitle] = useState('');
  const [countdownDate, setCountdownDate] = useState('');

  const sortedEvents = useMemo(() => [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [events]);
  const sortedBirthdays = useMemo(() => [...birthdays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [birthdays]);
  const sortedCountdowns = useMemo(() => [...countdowns].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()), [countdowns]);

  return (
    <>
      <Stack.Screen options={{ title: 'Календарь', headerTintColor: colors.foreground, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} />
      <Screen>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 30 }]}>Календарь</Text>
        <Text style={{ color: colors.mutedForeground, marginTop: 5 }}>События, встречи, дни рождения, платежи, дедлайны целей и обратный отсчёт — всё в одном месте.</Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 18 }}>
          <AppButton variant={tab === 'events' ? 'primary' : 'secondary'} onPress={() => setTab('events')}>События</AppButton>
          <AppButton variant={tab === 'birthdays' ? 'primary' : 'secondary'} onPress={() => setTab('birthdays')}>Дни рождения</AppButton>
          <AppButton variant={tab === 'countdowns' ? 'primary' : 'secondary'} onPress={() => setTab('countdowns')}>Обратный отсчёт</AppButton>
        </View>

        {tab === 'events' ? (
          <>
            <SectionTitle title="Новое событие" />
            <Card>
              <Field label="Название" value={eventTitle} onChangeText={setEventTitle} placeholder="Встреча, дедлайн, платёж…" />
              <Field label="Дата (ГГГГ-ММ-ДД)" value={eventDate} onChangeText={setEventDate} placeholder="2026-09-20" />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {EVENT_TYPES.map((t) => <AppButton key={t} variant={eventType === t ? 'primary' : 'secondary'} onPress={() => setEventType(t)}>{EVENT_LABELS[t]}</AppButton>)}
              </View>
              <AppButton icon="calendar" onPress={() => { const iso = eventDate ? new Date(eventDate).toISOString() : new Date().toISOString(); addEvent({ title: eventTitle, type: eventType, date: iso }); setEventTitle(''); setEventDate(''); }}>Добавить событие</AppButton>
            </Card>
            <SectionTitle title="Ближайшие" action={<Text style={{ color: colors.mutedForeground }}>{sortedEvents.length}</Text>} />
            {sortedEvents.length === 0 ? <Card><Text style={{ color: colors.mutedForeground }}>Событий пока нет.</Text></Card> : null}
            {sortedEvents.map((event) => (
              <Card key={event.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 }}>
                <IconBadge icon="calendar" color={colors.secondary} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontWeight: '600' }}>{event.title}</Text>
                  <Text style={{ color: colors.mutedForeground, marginTop: 3, fontSize: 12 }}>{EVENT_LABELS[event.type]} · {new Date(event.date).toLocaleDateString('ru-RU')}</Text>
                </View>
                <Pressable onPress={() => removeEvent(event.id)} hitSlop={8}><Feather name="trash-2" size={18} color={colors.destructive} /></Pressable>
              </Card>
            ))}
          </>
        ) : null}

        {tab === 'birthdays' ? (
          <>
            <SectionTitle title="Новый день рождения" />
            <Card>
              <Field label="Имя" value={bdayName} onChangeText={setBdayName} placeholder="Кого поздравить?" />
              <Field label="Дата (ГГГГ-ММ-ДД)" value={bdayDate} onChangeText={setBdayDate} placeholder="1994-05-12" />
              <AppButton icon="gift" onPress={() => { const iso = bdayDate ? new Date(bdayDate).toISOString() : new Date().toISOString(); addBirthday({ name: bdayName, date: iso }); setBdayName(''); setBdayDate(''); }}>Добавить</AppButton>
            </Card>
            <SectionTitle title="Список" action={<Text style={{ color: colors.mutedForeground }}>{sortedBirthdays.length}</Text>} />
            {sortedBirthdays.length === 0 ? <Card><Text style={{ color: colors.mutedForeground }}>Дней рождения пока нет.</Text></Card> : null}
            {sortedBirthdays.map((b) => (
              <Card key={b.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 }}>
                <IconBadge icon="gift" color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontWeight: '600' }}>{b.name}</Text>
                  <Text style={{ color: colors.mutedForeground, marginTop: 3, fontSize: 12 }}>{new Date(b.date).toLocaleDateString('ru-RU')}</Text>
                </View>
                <Pressable onPress={() => removeBirthday(b.id)} hitSlop={8}><Feather name="trash-2" size={18} color={colors.destructive} /></Pressable>
              </Card>
            ))}
          </>
        ) : null}

        {tab === 'countdowns' ? (
          <>
            <SectionTitle title="Новый отсчёт" />
            <Card>
              <Field label="Название" value={countdownTitle} onChangeText={setCountdownTitle} placeholder="До чего считаем?" />
              <Field label="Дата (ГГГГ-ММ-ДД)" value={countdownDate} onChangeText={setCountdownDate} placeholder="2026-12-31" />
              <AppButton icon="clock" onPress={() => { const iso = countdownDate ? new Date(countdownDate).toISOString() : new Date().toISOString(); addCountdown({ title: countdownTitle, targetDate: iso }); setCountdownTitle(''); setCountdownDate(''); }}>Добавить отсчёт</AppButton>
            </Card>
            <SectionTitle title="Отсчёты" action={<Text style={{ color: colors.mutedForeground }}>{sortedCountdowns.length}</Text>} />
            {sortedCountdowns.length === 0 ? <Card><Text style={{ color: colors.mutedForeground }}>Пока нет отсчётов.</Text></Card> : null}
            {sortedCountdowns.map((c) => {
              const days = daysUntil(c.targetDate);
              return (
                <Card key={c.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 }}>
                  <IconBadge icon="clock" color={colors.secondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.foreground, fontWeight: '600' }}>{c.title}</Text>
                    <Text style={{ color: colors.mutedForeground, marginTop: 3, fontSize: 12 }}>{new Date(c.targetDate).toLocaleDateString('ru-RU')}</Text>
                  </View>
                  <Text style={{ color: colors.primary, fontWeight: '700' }}>{days >= 0 ? `${days} дн.` : 'прошло'}</Text>
                  <Pressable onPress={() => removeCountdown(c.id)} hitSlop={8}><Feather name="trash-2" size={18} color={colors.destructive} /></Pressable>
                </Card>
              );
            })}
          </>
        ) : null}
      </Screen>
    </>
  );
}
