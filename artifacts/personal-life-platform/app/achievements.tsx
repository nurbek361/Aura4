import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife } from '@/context/LifeContext';
import { AppButton, Card, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';

export default function AchievementsScreen() {
  const colors = useColors();
  const { achievements, unlockedAchievementList, shareText } = useLife();
  const unlockedIds = new Set(unlockedAchievementList.map((a) => a.id));

  return (
    <>
      <Stack.Screen options={{ title: 'Достижения', headerTintColor: colors.foreground, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} />
      <Screen>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 30 }]}>Достижения</Text>
        <Text style={{ color: colors.mutedForeground, marginTop: 5 }}>Открываются автоматически за задачи, привычки, накопления и прогресс в сурах — каждое засчитывается только один раз. Делиться можно вручную.</Text>

        <Card style={{ marginTop: 18, backgroundColor: colors.cardStrong }}>
          <Text style={{ color: '#B7C0D2', fontSize: 13 }}>Открыто</Text>
          <Text style={{ color: colors.background, fontSize: 34, fontWeight: '700', marginTop: 6 }}>{unlockedAchievementList.length}<Text style={{ color: '#B7C0D2', fontSize: 18 }}> / {achievements.length}</Text></Text>
        </Card>

        <SectionTitle title="Все достижения" />
        {achievements.map((a) => {
          const unlocked = unlockedIds.has(a.id);
          const entry = unlockedAchievementList.find((u) => u.id === a.id);
          return (
            <Card key={a.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, opacity: unlocked ? 1 : 0.5 }}>
              <IconBadge icon={unlocked ? 'award' : 'lock'} color={unlocked ? colors.accent : colors.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontWeight: '700' }}>{a.title}</Text>
                <Text style={{ color: colors.mutedForeground, marginTop: 3, fontSize: 12 }}>{a.description}{unlocked && entry ? ` · ${new Date(entry.unlockedAt).toLocaleDateString('ru-RU')}` : ''}</Text>
              </View>
              {unlocked ? (
                <Pressable onPress={() => shareText(`Я открыл(а) достижение «${a.title}» в Personal Life Platform!`)} hitSlop={8}>
                  <Feather name="share-2" size={18} color={colors.primary} />
                </Pressable>
              ) : null}
            </Card>
          );
        })}
      </Screen>
    </>
  );
}
