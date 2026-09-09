import React from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';

// IMPORTANT: iOS 26 uses NativeTabs for native tabs with liquid glass support.
// NativeTabs intentionally does NOT use custom design tokens — liquid glass
// is a system-level appearance provided by iOS and cannot be overridden.
// Custom brand colors are applied only on the ClassicTabLayout path (older iOS / Android / web).
function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="planner">
        <NativeTabs.Trigger.Icon sf={{ default: 'checklist', selected: 'checklist' }} />
        <NativeTabs.Trigger.Label>План</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="money">
        <NativeTabs.Trigger.Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
        <NativeTabs.Trigger.Label>Деньги</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="more">
        <NativeTabs.Trigger.Icon sf={{ default: 'ellipsis', selected: 'ellipsis' }} />
        <NativeTabs.Trigger.Label>Ещё</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: true,
        headerStyle: { backgroundColor: '#0B0E15' },
        headerTintColor: colors.foreground,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(11,14,21,0.92)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(224,231,255,0.08)',
          elevation: 0,
          height: isWeb ? 82 : 72, borderRadius: 24, marginHorizontal: isWeb ? 18 : 10, marginBottom: isWeb ? 10 : 8, overflow: 'hidden', paddingTop: 7,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.background },
              ]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={24} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'План',
          tabBarIcon: ({ color }) => <Feather name="check-square" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="money"
        options={{
          title: 'Деньги',
          tabBarIcon: ({ color }) => <Feather name="pie-chart" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Ещё',
          tabBarIcon: ({ color }) => <Feather name="more-horizontal" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
