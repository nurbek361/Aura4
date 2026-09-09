import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useLife, type Currency } from '@/context/LifeContext';
import { AppButton, Card, Field, Screen, SectionTitle, styles } from '@/components/ui';

const currencies: Currency[] = ['KGS', 'USD', 'RUB', 'EUR', 'KZT', 'UZS', 'TJS'];

export default function SettingsScreen() {
  const colors = useColors();
  const { profile, setProfileName, primaryCurrency, setPrimaryCurrency, createBackup } = useLife();
  const [name, setName] = useState(profile.name);
  return <><Stack.Screen options={{ title: 'Настройки', headerTintColor: colors.foreground, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} /><Screen><Text style={[styles.eyebrow, { color: colors.primary }]}>НАСТРОЙКИ</Text><Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 32 }]}>Ваши правила</Text><Text style={{ color: colors.mutedForeground, marginTop: 6 }}>Приватность включена по умолчанию. Вы решаете, что синхронизировать.</Text><SectionTitle title="Профиль" /><Card><Field label="Имя" value={name} onChangeText={setName} placeholder="Как к вам обращаться?" /><AppButton icon="check" onPress={() => { setProfileName(name); Alert.alert('Сохранено', 'Профиль обновлён локально.'); }}>Сохранить профиль</AppButton></Card><SectionTitle title="Основная валюта" /><Card><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{currencies.map((currency) => <AppButton key={currency} variant={currency === primaryCurrency ? 'primary' : 'secondary'} onPress={() => setPrimaryCurrency(currency)}>{currency}</AppButton>)}</View></Card><SectionTitle title="Резервная копия" /><Card><Text style={{ color: colors.foreground, lineHeight: 21 }}>Создайте версионированный JSON-снимок локальных данных. Перед восстановлением приложение проверяет структуру и версию.</Text><View style={{ height: 12 }} /><AppButton variant="secondary" icon="download" onPress={async () => { const raw = await createBackup(); Alert.alert('Резервная копия готова', `JSON создан (${raw.length} символов). Подключение к системному выбору файла будет добавлено в Android-сборке.`); }}>Создать JSON-копию</AppButton></Card><SectionTitle title="Приватность" /><Card><Text style={{ color: colors.foreground, lineHeight: 22 }}>Финансы, здоровье, профиль, история и духовный прогресс остаются на устройстве. Нет скрытых upload-операций. Health Connect подключается только по отдельному действию.</Text></Card><Text style={{ color: colors.mutedForeground, textAlign: 'center', fontSize: 12, marginTop: 10 }}>Personal Life Platform · локальный режим</Text></Screen></>;
}
