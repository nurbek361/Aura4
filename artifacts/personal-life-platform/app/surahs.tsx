import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife } from '@/context/LifeContext';
import { Card, Field, Screen, styles } from '@/components/ui';
import { surahs } from '@/data/surahs';

export default function SurahsScreen() {
  const colors = useColors();
  const { learnedSurahs, toggleSurah } = useLife();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => surahs.filter((item) => `${item.number} ${item.name}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <><Stack.Screen options={{ title: '114 сур', headerTintColor: colors.foreground, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} /><Screen><Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 30 }]}>114 сур</Text><Text style={{ color: colors.mutedForeground, marginTop: 5, marginBottom: 18 }}>{learnedSurahs.length} изучено · отметки сохраняются локально</Text><Field value={query} onChangeText={setQuery} placeholder="Поиск по названию" />{filtered.map((surah) => { const learned = learnedSurahs.includes(surah.number); return <Pressable key={surah.number} onPress={() => toggleSurah(surah.number)}><Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 }}><View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: learned ? colors.primary : colors.secondary, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: learned ? colors.primaryForeground : colors.foreground, fontWeight: '700' }}>{surah.number}</Text></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontWeight: '700' }}>{surah.name}</Text><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 3 }}>{surah.transcription}</Text></View><Feather name={learned ? 'check-circle' : 'circle'} size={22} color={learned ? colors.primary : colors.mutedForeground} /></Card></Pressable>; })}</Screen></>;
}
