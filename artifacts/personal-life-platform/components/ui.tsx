import React from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type PressableProps, type TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const colors = useColors();
  const { useSafeAreaInsets } = require('react-native-safe-area-context') as typeof import('react-native-safe-area-context');
  const insets = useSafeAreaInsets();
  const Container = scroll ? ScrollView : View;
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.aura, styles.auraViolet, { backgroundColor: colors.primary }]} />
        <View style={[styles.aura, styles.auraCyan, { backgroundColor: colors.secondaryContainer }]} />
        <View style={[styles.aura, styles.auraGreen, { backgroundColor: colors.tertiaryContainer }]} />
      </View>
      <Container
        style={[styles.screen, { backgroundColor: 'transparent' }]}
        contentContainerStyle={scroll ? { paddingTop: insets.top + (Platform.OS === 'web' ? 72 : 18), paddingBottom: insets.bottom + 112 } : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </View>
  );
}

export function AppButton({ children, icon, variant = 'primary', onPress, ...props }: PressableProps & { children: React.ReactNode; icon?: keyof typeof Feather.glyphMap; variant?: 'primary' | 'secondary' | 'ghost' }) {
  const colors = useColors();
  const primary = variant === 'primary';
  return (
    <Pressable {...props} onPress={(event) => { Haptics.selectionAsync().catch(() => undefined); onPress?.(event); }}
      style={({ pressed }) => [styles.button, { borderColor: primary ? 'rgba(208,188,255,0.12)' : colors.border, opacity: pressed ? 0.72 : 1 }, variant === 'ghost' && styles.ghostButton]}>
      {primary ? <LinearGradient colors={[colors.primaryContainer, colors.secondaryContainer]} start={{x:0,y:0}} end={{x:1,y:1}} style={StyleSheet.absoluteFill} /> : null}
      {icon ? <Feather name={icon} size={16} color={primary ? colors.primaryForeground : colors.foreground} /> : null}
      <Text style={[styles.buttonText, { color: primary ? colors.primaryForeground : colors.foreground }]}>{children}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  const colors = useColors();
  return <View style={[styles.card, { backgroundColor: 'rgba(25,27,35,0.82)', borderColor: 'rgba(224,231,255,0.08)' }, style]}>{children}</View>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  const colors = useColors();
  return <View style={styles.sectionHeader}><View>{eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text> : null}<Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text></View>{action}</View>;
}

export function Field({ label, ...props }: TextInputProps & { label?: string }) {
  const colors = useColors();
  return <View style={styles.fieldWrap}>{label ? <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text> : null}<TextInput {...props} placeholderTextColor={colors.mutedForeground} style={[styles.field, { color: colors.foreground, backgroundColor: 'rgba(14,19,31,0.82)', borderColor: colors.border }]} /></View>;
}

export function IconBadge({ icon, color }: { icon: keyof typeof Feather.glyphMap; color?: string }) {
  const colors = useColors();
  const bg = color ?? colors.accent;
  return <View style={[styles.iconBadge, { backgroundColor: bg }]}><Feather name={icon} size={18} color={colors.accentForeground} /></View>;
}

export function LoadingState() {
  const colors = useColors();
  return <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={{ color: colors.mutedForeground }}>Загружаем ваше пространство…</Text></View>;
}

export const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  screen: { flex: 1, paddingHorizontal: 20 },
  aura: { position: 'absolute', width: 240, height: 240, borderRadius: 120, opacity: 0.11 },
  auraViolet: { top: -70, left: -60 },
  auraCyan: { top: 260, right: -90, opacity: 0.08 },
  auraGreen: { bottom: 80, left: -100, opacity: 0.06 },
  card: { borderRadius: 20, borderWidth: 1, padding: 18, marginBottom: 14, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 22, marginBottom: 12 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 },
  sectionTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  button: { minHeight: 46, borderRadius: 16, paddingHorizontal: 17, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, overflow: 'hidden', position: 'relative' },
  ghostButton: { paddingHorizontal: 8, borderWidth: 0 },
  buttonText: { fontSize: 14, fontWeight: '700' },
  fieldWrap: { gap: 6, marginBottom: 10, flex: 1 },
  fieldLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
  field: { minHeight: 48, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, fontSize: 15 },
  iconBadge: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  loading: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
});
