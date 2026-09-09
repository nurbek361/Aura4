import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useLife } from '@/context/LifeContext';
import { AppButton, Card, Field, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';

export default function MoneyScreen() {
  const colors = useColors();
  const { transactions, addTransaction, primaryCurrency } = useLife();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [kind, setKind] = useState<'expense' | 'income'>('expense');
  const totals = useMemo(() => transactions.reduce((sum, item) => sum + (item.kind === 'income' ? item.amountMinor : -item.amountMinor), 0), [transactions]);
  const save = () => { if (addTransaction({ amount, category, description, kind })) { setAmount(''); setCategory(''); setDescription(''); } };
  return (
    <Screen>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>ЛИЧНЫЙ БУХГАЛТЕР</Text>
      <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 32 }]}>Деньги без шума</Text>
      <Text style={{ color: colors.mutedForeground, marginTop: 6 }}>Все суммы хранятся локально и сохраняют исходную валюту.</Text>
      <Card style={{ marginTop: 22, backgroundColor: colors.cardStrong }}>
        <Text style={{ color: '#B7C0D2', fontSize: 13 }}>Текущий баланс</Text>
        <Text style={{ color: colors.background, fontSize: 34, fontWeight: '700', marginTop: 8 }}>{(totals / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} {primaryCurrency}</Text>
        <View style={{ flexDirection: 'row', gap: 18, marginTop: 14 }}><Text style={{ color: '#B7C0D2' }}>Поступления {transactions.filter((item) => item.kind === 'income').length}</Text><Text style={{ color: '#E5A35B' }}>Расходы {transactions.filter((item) => item.kind === 'expense').length}</Text></View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={() => router.push('/debts')} style={{ flex: 1 }}><Card style={{ paddingVertical: 16, alignItems: 'center' }}><IconBadge icon="users" color={colors.accent} /><Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 8, fontSize: 13 }}>Долги</Text></Card></Pressable>
        <Pressable onPress={() => router.push('/subscriptions')} style={{ flex: 1 }}><Card style={{ paddingVertical: 16, alignItems: 'center' }}><IconBadge icon="repeat" color={colors.secondary} /><Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 8, fontSize: 13 }}>Подписки</Text></Card></Pressable>
        <Pressable onPress={() => router.push('/payments')} style={{ flex: 1 }}><Card style={{ paddingVertical: 16, alignItems: 'center' }}><IconBadge icon="credit-card" color={colors.accent} /><Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 8, fontSize: 13 }}>Платежи</Text></Card></Pressable>
      </View>

      <SectionTitle title="Новая операция" />
      <Card>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}><AppButton variant={kind === 'expense' ? 'primary' : 'secondary'} onPress={() => setKind('expense')} icon="arrow-down-left">Расход</AppButton><AppButton variant={kind === 'income' ? 'primary' : 'secondary'} onPress={() => setKind('income')} icon="arrow-up-right">Доход</AppButton></View>
        <View style={{ flexDirection: 'row', gap: 10 }}><Field label={`Сумма (${primaryCurrency})`} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="decimal-pad" /><Field label="Категория" value={category} onChangeText={setCategory} placeholder="Еда" /></View>
        <Field label="Описание" value={description} onChangeText={setDescription} placeholder="Например, продукты" />
        <AppButton onPress={save} icon="save">Сохранить операцию</AppButton>
      </Card>
      <SectionTitle title="Последние операции" />
      {transactions.slice(0, 6).map((item) => (
        <Card key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}>
          <IconBadge icon={item.kind === 'income' ? 'arrow-up-right' : 'arrow-down-left'} color={item.kind === 'income' ? colors.accent : colors.secondary} />
          <View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontWeight: '600' }}>{item.description}</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{item.category} · {new Date(item.date).toLocaleDateString('ru-RU')}</Text></View>
          <Text style={{ color: item.kind === 'income' ? colors.primary : colors.foreground, fontWeight: '700' }}>{item.kind === 'income' ? '+' : '-'}{(item.amountMinor / 100).toFixed(2)} {item.currency}</Text>
        </Card>
      ))}
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', paddingVertical: 12 }}><Feather name="lock" size={14} color={colors.mutedForeground} /><Text style={{ color: colors.mutedForeground, fontSize: 12, flex: 1 }}>Финансы остаются локальными и приватными по умолчанию.</Text></View>
    </Screen>
  );
}
