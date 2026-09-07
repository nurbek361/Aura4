import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife, type ReminderType } from '@/context/LifeContext';
import { AppButton, Card, Field, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';

const TYPE_LABELS: Record<ReminderType, string> = {
  personal: 'Личное',
  payment: 'Платёж',
  task: 'Задача',
  birthday: 'День рождения',
  event: 'Событие',
  health: 'Здоровье',
  inactivity: 'Неактивность',
};
const TYPES = Object.keys(TYPE_LABELS) as ReminderType[];

export default function RemindersScreen() {
  const colors = useColors();
  const { reminders, addReminder, toggleReminder, removeReminder } = useLife();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReminderType>('personal');
  const pending = reminders.filter((r) => !r.done);
  const done = reminders.filter((r) => r.done);

  const save = () => {
    addReminder({ title, type, date: new Date().toISOString() });
    setTitle('');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Напоминания', headerTintColor: colors.foreground, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} />
      <Screen>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 30 }]}>Напоминания</Text>
        <Text style={{ color: colors.mutedForeground, marginTop: 5 }}>Личные, платёжные, о задачах, днях рождения, событиях и здоровье — всё в одном месте, локально.</Text>

        <SectionTitle title="Новое напоминание" />
        <Card>
          <Field value={title} onChangeText={setTitle} placeholder="О чём напомнить?" onSubmitEditing={save} returnKeyType="done" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {TYPES.map((t) => (
              <AppButton key={t} variant={type === t ? 'primary' : 'secondary'} onPress={() => setType(t)}>{TYPE_LABELS[t]}</AppButton>
            ))}
          </View>
          <AppButton icon="bell" onPress={save}>Добавить напоминание</AppButton>
        </Card>

        <SectionTitle title="Активные" action={<Text style={{ color: colors.mutedForeground }}>{pending.length}</Text>} />
        {pending.length === 0 ? <Card><Text style={{ color: colors.mutedForeground }}>Нет активных напоминаний.</Text></Card> : null}
        {pending.map((reminder) => (
          <Card key={reminder.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 }}>
            <IconBadge icon="bell" color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>{reminder.title}</Text>
              <Text style={{ color: colors.mutedForeground, marginTop: 3, fontSize: 12 }}>{TYPE_LABELS[reminder.type]} · {new Date(reminder.date).toLocaleDateString('ru-RU')}</Text>
            </View>
            <Pressable onPress={() => toggleReminder(reminder.id)} hitSlop={8}><Feather name="check-circle" size={20} color={colors.primary} /></Pressable>
            <Pressable onPress={() => removeReminder(reminder.id)} hitSlop={8}><Feather name="trash-2" size={18} color={colors.destructive} /></Pressable>
          </Card>
        ))}

        {done.length > 0 ? (
          <>
            <SectionTitle title="Выполненные" action={<Text style={{ color: colors.mutedForeground }}>{done.length}</Text>} />
            {done.map((reminder) => (
              <Card key={reminder.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, opacity: 0.6 }}>
                <IconBadge icon="check" color={colors.accent} />
                <Text style={{ color: colors.foreground, flex: 1, textDecorationLine: 'line-through' }}>{reminder.title}</Text>
                <Pressable onPress={() => toggleReminder(reminder.id)} hitSlop={8}><Feather name="rotate-ccw" size={18} color={colors.mutedForeground} /></Pressable>
              </Card>
            ))}
          </>
        ) : null}
      </Screen>
    </>
  );
}
