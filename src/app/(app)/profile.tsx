import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';
import { vocabulary } from '@/data/vocabulary';
import { savedWordsKey } from '@/lib/saved-words';

const COLORS = {
  cream: '#F8F3E9',
  maroon: '#7B263A',
  charcoal: '#292727',
  dark: '#212121',
  muted: '#77716C',
  white: '#FFFFFF',
  border: '#E9DFD2',
  gold: '#E8C877',
};

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [savedCount, setSavedCount] = useState(0);

  // Refresh the count every time this tab is opened.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const raw = await AsyncStorage.getItem(savedWordsKey(user?.uid));
          const ids: string[] = raw ? JSON.parse(raw) : [];
          if (active) setSavedCount(ids.length);
        } catch (error) {
          console.error('Could not load saved count:', error);
        }
      })();
      return () => {
        active = false;
      };
    }, [user?.uid])
  );

  const confirmLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          signOut().catch(() =>
            Alert.alert('Error', 'Could not log out. Please try again.')
          );
        },
      },
    ]);
  };

  const progress = vocabulary.length
    ? Math.min(savedCount / vocabulary.length, 1)
    : 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 28 }]}>
        <View style={styles.avatarRing}>
          <View style={styles.avatarClip}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.avatarImage}
              contentFit="cover"
            />
          </View>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Dzongkha learner</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{savedCount}</Text>
          <Text style={styles.statLabel}>Saved words</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{vocabulary.length}</Text>
          <Text style={styles.statLabel}>Words to learn</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.card}>
        <View style={styles.progressHeader}>
          <Text style={styles.cardTitle}>Your collection</Text>
          <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.cardHint}>
          {savedCount === 0
            ? 'Save words from Search to start your collection.'
            : `You’ve saved ${savedCount} of ${vocabulary.length} words. Keep going!`}
        </Text>
      </View>

      {/* Account details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Name</Text>
          <Text style={styles.rowValue}>{user?.name}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Email</Text>
          <Text style={styles.rowValue} numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Member since</Text>
          <Text style={styles.rowValue}>{formatDate(user?.createdAt)}</Text>
        </View>
      </View>

      <Pressable
        onPress={confirmLogout}
        accessibilityRole="button"
        accessibilityLabel="Log out"
        style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.cream },
  content: { paddingBottom: 40 },
  header: {
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  avatarRing: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 3,
    borderColor: COLORS.gold,
    padding: 4,
    backgroundColor: COLORS.dark,
  },
  avatarClip: { flex: 1, borderRadius: 55, overflow: 'hidden' },
  // Zoom into the character's head and book inside the full icon image.
  avatarImage: {
    width: '100%',
    height: '100%',
    transform: [{ translateY: 14 }, { scale: 1.6 }],
  },
  name: { color: COLORS.white, fontSize: 24, fontWeight: '800', marginTop: 16 },
  email: { color: '#C9C2B8', fontSize: 14, marginTop: 4 },
  badge: {
    marginTop: 14,
    backgroundColor: COLORS.maroon,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: { color: COLORS.white, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statNumber: { color: COLORS.maroon, fontSize: 28, fontWeight: '800' },
  statLabel: { color: COLORS.muted, fontSize: 12, fontWeight: '600', marginTop: 2 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { color: COLORS.charcoal, fontSize: 16, fontWeight: '800' },
  cardHint: { color: COLORS.muted, fontSize: 13, marginTop: 10, lineHeight: 19 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressPercent: { color: COLORS.maroon, fontSize: 16, fontWeight: '800' },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EFE6D8',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 5, backgroundColor: COLORS.maroon },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  rowLabel: { color: COLORS.muted, fontSize: 14 },
  rowValue: {
    color: COLORS.charcoal,
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  divider: { height: 1, backgroundColor: COLORS.border },

  logoutButton: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: COLORS.maroon,
    paddingVertical: 16,
    alignItems: 'center',
  },
  pressed: { opacity: 0.8 },
  logoutText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
