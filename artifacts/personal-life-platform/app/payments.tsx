import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife, type PaymentCategory } from '@/context/LifeContext';
import { AppButton, Card, Field, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';

const CATEGORY_LABELS: Record<PaymentCategory, string> = {
  electricity: 'Электричество',
  water: 'Вода',
  gas: 'Газ',
  internet: 'Интернет',
  general: 'Общее',
  other: 'Другое',
};
const CATEGORIES = Object.keys(CATEGORY_LABELS) as PaymentCategory[];
const CATEGORY_ICONS: Record<PaymentCategory, keyof typeof Feather.glyphMap> = {
  electricity: 'zap',
  water: 'droplet',
  gas: 'wind',
  internet: 'wifi',
  general: 'credit-card',
  other: 'file-text',
};

export default function PaymentsScreen() {
  const colors = useColors();
  const { payments, addPayment, togglePaymentPaid, removePayment, primaryCurrency } = useLife();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<PaymentCategory>('general');
  const [dueDate, setDueDate] = useState('');

  const upcoming = useMemo(() => payments.filter((p) => !p.paid).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()), [payments]);
  const history = useMemo(() => payments.filter((p) => p.paid), [payments]);
  const upcomingTotal = useMemo(() => upcoming.reduce((s, p) => s + p.amountMinor, 0), [upcoming]);

  const save = () => {
    if (addPayment({ title, amount, category, dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString() })) {
      setTitle(''); setAmount(''); setDueDate('');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Платежи', headerTintColor: colors.foreground, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} />
      <Screen>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 30 }]}>Платежи</Text>
        <Text style={{ color: colors.mutedForeground, marginTop: 5 }}>Запланированные платежи и коммунальные услуги — электричество, вода, газ, интернет — с историей оплат.</Text>

        <Card style={{ marginTop: 18, backgroundColor: colors.cardStrong }}>
          <Text style={{ color: '#B7C0D2', fontSize: 13 }}>К оплате</Text>
          <Text style={{ color: colors.background, fontSize: 30, fontWeight: '700', marginTop: 6 }}>{(upcomingTotal / 100).toFixed(2)} {primaryCurrency}</Text>
          <Text style={{ color: '#B7C0D2', marginTop: 6 }}>{upcoming.length} запланировано</Text>
        </Card>

        <SectionTitle title="Новый платёж" />
        <Card>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field label="Название" value={title} onChangeText={setTitle} placeholder="Аренда, электричество…" />
            <Field label={`Сумма (${primaryCurrency})`} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="decimal-pad" />
          </View>
          <Field label="Срок оплаты (ГГГГ-ММ-ДД)" value={dueDate} onChangeText={setDueDate} placeholder="2026-09-25" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {CATEGORIES.map((c) => <AppButton key={c} icon={CATEGORY_ICONS[c]} variant={category === c ? 'primary' : 'secondary'} onPress={() => setCategory(c)}>{CATEGORY_LABELS[c]}</AppButton>)}
          </View>
          <AppButton icon="save" onPress={save}>Запланировать платёж</AppButton>
        </Card>

        <SectionTitle title="Запланированные" action={<Text style={{ color: colors.mutedForeground }}>{upcoming.length}</Text>} />
        {upcoming.length === 0 ? <Card><Text style={{ color: colors.mutedForeground }}>Все платежи закрыты.</Text></Card> : null}
        {upcoming.map((payment) => (
          <Card key={payment.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 }}>
            <IconBadge icon={CATEGORY_ICONS[payment.category]} color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>{payment.title}</Text>
              <Text style={{ color: colors.mutedForeground, marginTop: 3, fontSize: 12 }}>{CATEGORY_LABELS[payment.category]} · до {new Date(payment.dueDate).toLocaleDateString('ru-RU')}</Text>
            </View>
            <Text style={{ color: colors.foreground, fontWeight: '700' }}>{(payment.amountMinor / 100).toFixed(2)} {payment.currency}</Text>
            <Pressable onPress={() => togglePaymentPaid(payment.id)} hitSlop={8}><Feather name="check-circle" size={20} color={colors.primary} /></Pressable>
            <Pressable onPress={() => removePayment(payment.id)} hitSlop={8}><Feather name="trash-2" size={18} color={colors.destructive} /></Pressable>
          </Card>
        ))}

        {history.length > 0 ? (
          <>
            <SectionTitle title="История платежей" action={<Text style={{ color: colors.mutedForeground }}>{history.length}</Text>} />
            {history.map((payment) => (
              <Card key={payment.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, opacity: 0.6 }}>
                <IconBadge icon={CATEGORY_ICONS[payment.category]} color={colors.accent} />
                <View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontWeight: '600' }}>{payment.title}</Text><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 2 }}>Оплачено {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('ru-RU') : ''}</Text></View>
                <Text style={{ color: colors.mutedForeground, fontWeight: '700' }}>{(payment.amountMinor / 100).toFixed(2)} {payment.currency}</Text>
                <Pressable onPress={() => togglePaymentPaid(payment.id)} hitSlop={8}><Feather name="rotate-ccw" size={18} color={colors.mutedForeground} /></Pressable>
              </Card>
            ))}
          </>
        ) : null}
      </Screen>
    </>
  );
}
