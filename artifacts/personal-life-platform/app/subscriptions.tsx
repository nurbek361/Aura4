import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife, type SubscriptionPeriod } from '@/context/LifeContext';
import { AppButton, Card, Field, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';

const PERIOD_LABELS: Record<SubscriptionPeriod, string> = { weekly: 'Еженедельно', monthly: 'Ежемесячно', yearly: 'Ежегодно' };
const PERIODS = Object.keys(PERIOD_LABELS) as SubscriptionPeriod[];

export default function SubscriptionsScreen() {
  const colors = useColors();
  const { subscriptions, addSubscription, removeSubscription, primaryCurrency } = useLife();
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [period, setPeriod] = useState<SubscriptionPeriod>('monthly');
  const [nextPaymentDate, setNextPaymentDate] = useState('');

  const monthlyTotal = useMemo(() => subscriptions.reduce((sum, s) => {
    const factor = s.period === 'monthly' ? 1 : s.period === 'yearly' ? 1 / 12 : 4.33;
    return sum + s.costMinor * factor;
  }, 0), [subscriptions]);

  const save = () => {
    if (addSubscription({ name, cost, period, nextPaymentDate: nextPaymentDate ? new Date(nextPaymentDate).toISOString() : new Date().toISOString() })) {
      setName(''); setCost(''); setNextPaymentDate('');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Подписки', headerTintColor: colors.foreground, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} />
      <Screen>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 30 }]}>Подписки</Text>
        <Text style={{ color: colors.mutedForeground, marginTop: 5 }}>Стоимость, периодичность, дата следующего платежа и общие расходы на подписки.</Text>

        <Card style={{ marginTop: 18, backgroundColor: colors.cardStrong }}>
          <Text style={{ color: '#B7C0D2', fontSize: 13 }}>Оценка расходов в месяц</Text>
          <Text style={{ color: colors.background, fontSize: 30, fontWeight: '700', marginTop: 6 }}>{(monthlyTotal / 100).toFixed(2)} {primaryCurrency}</Text>
        </Card>

        <SectionTitle title="Новая подписка" />
        <Card>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field label="Название" value={name} onChangeText={setName} placeholder="Netflix, Spotify…" />
            <Field label={`Стоимость (${primaryCurrency})`} value={cost} onChangeText={setCost} placeholder="0.00" keyboardType="decimal-pad" />
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
            {PERIODS.map((p) => <AppButton key={p} variant={period === p ? 'primary' : 'secondary'} onPress={() => setPeriod(p)}>{PERIOD_LABELS[p]}</AppButton>)}
          </View>
          <Field label="Следующая оплата (ГГГГ-ММ-ДД)" value={nextPaymentDate} onChangeText={setNextPaymentDate} placeholder="2026-10-01" />
          <AppButton icon="save" onPress={save}>Добавить подписку</AppButton>
        </Card>

        <SectionTitle title="Активные подписки" action={<Text style={{ color: colors.mutedForeground }}>{subscriptions.length}</Text>} />
        {subscriptions.length === 0 ? <Card><Text style={{ color: colors.mutedForeground }}>Подписок пока нет.</Text></Card> : null}
        {subscriptions.map((sub) => (
          <Card key={sub.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 }}>
            <IconBadge icon="repeat" color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>{sub.name}</Text>
              <Text style={{ color: colors.mutedForeground, marginTop: 3, fontSize: 12 }}>{PERIOD_LABELS[sub.period]} · след. оплата {new Date(sub.nextPaymentDate).toLocaleDateString('ru-RU')}</Text>
            </View>
            <Text style={{ color: colors.foreground, fontWeight: '700' }}>{(sub.costMinor / 100).toFixed(2)} {sub.currency}</Text>
            <Pressable onPress={() => removeSubscription(sub.id)} hitSlop={8}><Feather name="trash-2" size={18} color={colors.destructive} /></Pressable>
          </Card>
        ))}
      </Screen>
    </>
  );
}
