import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife } from '@/context/LifeContext';
import { AppButton, Card, Field, IconBadge, Screen, SectionTitle, styles } from '@/components/ui';

export default function ShoppingScreen() {
  const colors = useColors();
  const { shoppingLists, addShoppingList, removeShoppingList, addShoppingItem, toggleShoppingItem, removeShoppingItem } = useLife();
  const [newListTitle, setNewListTitle] = useState('');
  const [activeListId, setActiveListId] = useState<string | null>(shoppingLists[0]?.id ?? null);
  const [itemName, setItemName] = useState('');
  const activeList = shoppingLists.find((l) => l.id === activeListId) ?? shoppingLists[0];

  return (
    <>
      <Stack.Screen options={{ title: 'Списки покупок', headerTintColor: colors.foreground, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} />
      <Screen>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 30 }]}>Списки покупок</Text>
        <Text style={{ color: colors.mutedForeground, marginTop: 5 }}>Несколько списков, отметки купленного, всё работает офлайн.</Text>

        <SectionTitle title="Новый список" />
        <Card>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Field value={newListTitle} onChangeText={setNewListTitle} placeholder="Например, Аптека" />
            <AppButton icon="plus" onPress={() => { addShoppingList(newListTitle); setNewListTitle(''); }}>Создать</AppButton>
          </View>
        </Card>

        <SectionTitle title="Списки" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
          {shoppingLists.map((list) => (
            <Pressable key={list.id} onPress={() => setActiveListId(list.id)}>
              <View style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: list.id === activeList?.id ? colors.primary : colors.secondary }}>
                <Text style={{ color: list.id === activeList?.id ? colors.primaryForeground : colors.foreground, fontWeight: '700' }}>{list.title} ({list.items.filter((i) => !i.bought).length})</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {activeList ? (
          <>
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '700' }}>{activeList.title}</Text>
                <Pressable onPress={() => { removeShoppingList(activeList.id); setActiveListId(shoppingLists.find((l) => l.id !== activeList.id)?.id ?? null); }} hitSlop={8}><Feather name="trash-2" size={18} color={colors.destructive} /></Pressable>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 10 }}>
                <Field value={itemName} onChangeText={setItemName} placeholder="Добавить товар" onSubmitEditing={() => { addShoppingItem(activeList.id, itemName); setItemName(''); }} returnKeyType="done" />
                <AppButton icon="plus" onPress={() => { addShoppingItem(activeList.id, itemName); setItemName(''); }}>Добавить</AppButton>
              </View>
              {activeList.items.length === 0 ? <Text style={{ color: colors.mutedForeground, marginTop: 6 }}>Список пуст.</Text> : null}
              {activeList.items.map((item) => (
                <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <Pressable onPress={() => toggleShoppingItem(activeList.id, item.id)} style={{ width: 24, height: 24, borderRadius: 8, borderWidth: 1.5, borderColor: item.bought ? colors.primary : colors.border, backgroundColor: item.bought ? colors.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    {item.bought ? <Feather name="check" size={15} color={colors.primaryForeground} /> : null}
                  </Pressable>
                  <Text style={{ color: colors.foreground, flex: 1, textDecorationLine: item.bought ? 'line-through' : 'none', opacity: item.bought ? 0.55 : 1 }}>{item.name}</Text>
                  <Pressable onPress={() => removeShoppingItem(activeList.id, item.id)} hitSlop={8}><Feather name="x" size={16} color={colors.mutedForeground} /></Pressable>
                </View>
              ))}
            </Card>
          </>
        ) : (
          <Card><Text style={{ color: colors.mutedForeground }}>Создайте первый список покупок.</Text></Card>
        )}
      </Screen>
    </>
  );
}
