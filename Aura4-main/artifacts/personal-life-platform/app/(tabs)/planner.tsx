import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife } from '@/context/LifeContext';
import { AppButton, Card, Field, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';

export default function PlannerScreen() {
  const colors = useColors();
  const { tasks, addTask, toggleTask, habits, toggleHabit } = useLife();
  const [taskTitle, setTaskTitle] = useState('');
  const completed = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  return (
    <Screen>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>PRODUCTIVITY</Text>
      <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 32 }]}>План на день</Text>
      <Text style={{ color: colors.mutedForeground, marginTop: 6 }}>Маленькие шаги складываются в спокойный ритм.</Text>

      <SectionTitle title="Задачи" action={<Text style={{ color: colors.mutedForeground }}>{completed}/{tasks.length}</Text>} />
      <Card>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Field value={taskTitle} onChangeText={setTaskTitle} placeholder="Добавить задачу" onSubmitEditing={() => { addTask(taskTitle); setTaskTitle(''); }} returnKeyType="done" />
          <AppButton icon="plus" onPress={() => { addTask(taskTitle); setTaskTitle(''); }}>Добавить</AppButton>
        </View>
        {tasks.map((task) => (
          <Pressable key={task.id} onPress={() => toggleTask(task.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <View style={{ width: 24, height: 24, borderRadius: 8, borderWidth: 1.5, borderColor: task.done ? colors.primary : colors.border, backgroundColor: task.done ? colors.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              {task.done ? <Feather name="check" size={15} color={colors.primaryForeground} /> : null}
            </View>
            <Text style={{ color: colors.foreground, fontSize: 15, flex: 1, textDecorationLine: task.done ? 'line-through' : 'none', opacity: task.done ? 0.55 : 1 }}>{task.title}</Text>
          </Pressable>
        ))}
      </Card>

      <SectionTitle title="Привычки" action={<Feather name="activity" size={20} color={colors.primary} />} />
      {habits.map((habit) => (
        <Pressable key={habit.id} onPress={() => toggleHabit(habit.id)}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}>
            <IconBadge icon={habit.completedToday ? 'check-circle' : 'circle'} color={habit.completedToday ? colors.accent : colors.secondary} />
            <View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '600' }}>{habit.title}</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{habit.streak} дней подряд</Text></View>
            <Text style={{ color: habit.completedToday ? colors.primary : colors.mutedForeground, fontWeight: '700' }}>{habit.completedToday ? 'Готово' : 'Отметить'}</Text>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}
