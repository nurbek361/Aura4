import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife, type DebtDirection } from '@/context/LifeContext';
import { AppButton, Card, Field, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';

export default function DebtsScreen() {
  const colors = useColors();
  const { debts, addDebt, toggleDebtSettled, removeDebt, primaryCurrency } = useLife();
  const [direction, setDirection] = useState<DebtDirection>('owedToMe');
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const owedToMe = useMemo(() => debts.filter((d) => d.direction === 'owedToMe' && !d.settled).reduce((s, d) => s + d.amountMinor, 0), [debts]);
  const iOwe = useMemo(() => debts.filter((d) => d.direction === 'iOwe' && !d.settled).reduce((s, d) => s + d.amountMinor, 0), [debts]);

  const save = () => {
    if (addDebt({ direction, person, amount, description })) {
      setPerson(''); setAmount(''); setDescription('');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Долги', headerTintColor: colors.foreground, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} />
      <Screen>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 30 }]}>Долги</Text>
        <Text style={{ color: colors.mutedForeground, marginTop: 5 }}>Кто должен вам и кому должны вы — с суммой, валютой, датой и статусом погашения.</Text>

        <Card style={{ marginTop: 18, backgroundColor: colors.cardStrong, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View><Text style={{ color: '#B7C0D2', fontSize: 12 }}>МНЕ ДОЛЖНЫ</Text><Text style={{ color: '#8FE0B4', fontSize: 22, fontWeight: '700', marginTop: 4 }}>{(owedToMe / 100).toFixed(2)} {primaryCurrency}</Text></View>
          <View><Text style={{ color: '#B7C0D2', fontSize: 12 }}>Я ДОЛЖЕН</Text><Text style={{ color: '#E5A35B', fontSize: 22, fontWeight: '700', marginTop: 4 }}>{(iOwe / 100).toFixed(2)} {primaryCurrency}</Text></View>
        </Card>

        <SectionTitle title="Новая запись" />
        <Card>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
            <AppButton variant={direction === 'owedToMe' ? 'primary' : 'secondary'} onPress={() => setDirection('owedToMe')}>Мне должны</AppButton>
            <AppButton variant={direction === 'iOwe' ? 'primary' : 'secondary'} onPress={() => setDirection('iOwe')}>Я должен</AppButton>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field label="Кто" value={person} onChangeText={setPerson} placeholder="Имя" />
            <Field label={`Сумма (${primaryCurrency})`} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="decimal-pad" />
          </View>
          <Field label="Описание" value={description} onChangeText={setDescription} placeholder="За что" />
          <AppButton icon="save" onPress={save}>Сохранить</AppButton>
        </Card>

        <SectionTitle title="Все записи" action={<Text style={{ color: colors.mutedForeground }}>{debts.length}</Text>} />
        {debts.length === 0 ? <Card><Text style={{ color: colors.mutedForeground }}>Долгов пока нет.</Text></Card> : null}
        {debts.map((debt) => (
          <Card key={debt.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, opacity: debt.settled ? 0.55 : 1 }}>
            <IconBadge icon={debt.direction === 'owedToMe' ? 'arrow-down-left' : 'arrow-up-right'} color={debt.direction === 'owedToMe' ? colors.accent : colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontWeight: '600', textDecorationLine: debt.settled ? 'line-through' : 'none' }}>{debt.person}</Text>
              <Text style={{ color: colors.mutedForeground, marginTop: 3, fontSize: 12 }}>{debt.description || (debt.direction === 'owedToMe' ? 'Мне должны' : 'Я должен')} · {new Date(debt.date).toLocaleDateString('ru-RU')}</Text>
            </View>
            <Text style={{ color: colors.foreground, fontWeight: '700' }}>{(debt.amountMinor / 100).toFixed(2)} {debt.currency}</Text>
            <Pressable onPress={() => toggleDebtSettled(debt.id)} hitSlop={8}><Feather name={debt.settled ? 'rotate-ccw' : 'check-circle'} size={20} color={colors.primary} /></Pressable>
            <Pressable onPress={() => removeDebt(debt.id)} hitSlop={8}><Feather name="trash-2" size={18} color={colors.destructive} /></Pressable>
          </Card>
        ))}
      </Screen>
    </>
  );
}
