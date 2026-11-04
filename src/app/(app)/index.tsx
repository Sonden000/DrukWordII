
import { useState } from 'react';
import * as Speech from 'expo-speech';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { vocabulary } from '@/data/vocabulary';

const COLORS = {
  cream: '#F8F3E9',
  maroon: '#7B263A',
  charcoal: '#292727',
  muted: '#77716C',
  white: '#FFFFFF',
  border: '#E9DFD2',
};

const today = new Date();
const dayNumber =
  Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) /
  86_400_000;
const wordOfTheDay =
  vocabulary[Math.floor(dayNumber) % vocabulary.length] ?? vocabulary[0];

export default function HomeScreen() {
  const [wordsLearned] = useState(5);
  const [streakDays] = useState(7);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const playPronunciation = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);

      let voices: Speech.Voice[] = [];
      try {
        voices = await Speech.getAvailableVoicesAsync();
      } catch {
        // Use the English transliteration if the device cannot list its voices.
      }

      const dzongkhaVoice = voices.find(
        (voice) => voice.language.toLowerCase().split(/[-_]/)[0] === 'dz'
      );
      const englishVoice = voices.find((voice) =>
        /^en([_-]|$)/i.test(voice.language)
      );
      const hasDzongkhaVoice = Boolean(dzongkhaVoice);

      Speech.speak(
        hasDzongkhaVoice
          ? wordOfTheDay.dzongkha
          : wordOfTheDay.transliteration,
        {
          language: dzongkhaVoice?.language ?? englishVoice?.language ?? 'en-US',
          ...(dzongkhaVoice ?? englishVoice
            ? { voice: (dzongkhaVoice ?? englishVoice)?.identifier }
            : {}),
          onStart: () => setIsSpeaking(true),
          onDone: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
          onError: (error) => {
            setIsSpeaking(false);
            Alert.alert('Pronunciation failed', error.message);
          },
        }
      );
    } catch (error) {
      setIsSpeaking(false);
      Alert.alert(
        'Pronunciation unavailable',
        error instanceof Error
          ? error.message
          : 'Could not access the device text-to-speech voices.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>KUZUZANGPO</Text>
        <Text style={styles.heading}>Learn Dzongkha</Text>
        <Text style={styles.subtitle}>
          Build your vocabulary, one word at a time.
        </Text>

        <View style={styles.dailyCard}>
          <Text style={styles.cardLabel}>WORD OF THE DAY</Text>

          <View style={styles.wordRow}>
            <View style={styles.wordInfo}>
              <Text style={styles.dzongkha}>{wordOfTheDay.dzongkha}</Text>
              <Text style={styles.transliteration}>
                {wordOfTheDay.transliteration}
              </Text>
              <Text style={styles.meaning}>{wordOfTheDay.meaning}</Text>
            </View>

            <Pressable
              onPress={playPronunciation}
              accessibilityRole="button"
              accessibilityLabel={`Play ${wordOfTheDay.transliteration} pronunciation`}
              accessibilityState={{ busy: isSpeaking }}
              style={styles.speakerButton}
            >
              <Text style={styles.speakerIcon}>{isSpeaking ? '🔈' : '🔊'}</Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          <Text style={styles.detailLabel}>EXAMPLE SENTENCE</Text>
          <Text style={styles.exampleDzongkha}>
            {wordOfTheDay.exampleDzongkha}
          </Text>
          <Text style={styles.exampleEnglish}>
            {wordOfTheDay.exampleEnglish}
          </Text>

          <View style={styles.audioNote}>
            <Text style={styles.audioNoteText}>
              🔊 Uses Dzongkha voice if available; otherwise it speaks “
              {wordOfTheDay.transliteration}”
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Your learning progress</Text>

        <View style={styles.progressRow}>
          <View style={styles.progressCard}>
            <Text style={styles.progressIcon}>📚</Text>
            <Text style={styles.progressNumber}>{wordsLearned}</Text>
            <Text style={styles.progressLabel}>Words learned</Text>
          </View>

          <View style={styles.progressCard}>
            <Text style={styles.progressIcon}>🔥</Text>
            <Text style={styles.progressNumber}>{streakDays}</Text>
            <Text style={styles.progressLabel}>Day streak</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Keep learning</Text>

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Explore vocabulary</Text>
          <Text style={styles.actionDescription}>
            Discover Dzongkha words and their meanings.
          </Text>
          <Text style={styles.actionHint}>
            Tap Search in the bottom navigation to explore words.
          </Text>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Test your knowledge</Text>
          <Text style={styles.actionDescription}>
            Practise with multiple-choice questions.
          </Text>
          <Text style={styles.actionHint}>
            Tap Quiz in the bottom navigation to begin.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  container: {
    padding: 20,
    paddingBottom: 36,
  },
  greeting: {
    color: COLORS.maroon,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 12,
  },
  heading: {
    color: COLORS.charcoal,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 6,
    marginBottom: 24,
  },
  dailyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardLabel: {
    color: COLORS.maroon,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 18,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordInfo: {
    flex: 1,
    paddingRight: 12,
  },
  dzongkha: {
    color: COLORS.charcoal,
    fontSize: 32,
    fontWeight: '700',
  },
  transliteration: {
    color: COLORS.maroon,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  meaning: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 5,
  },
  speakerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerIcon: {
    fontSize: 23,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  detailLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  exampleDzongkha: {
    color: COLORS.charcoal,
    fontSize: 18,
    lineHeight: 30,
  },
  exampleEnglish: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 5,
  },
  audioNote: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 12,
    marginTop: 18,
  },
  audioNoteText: {
    color: COLORS.maroon,
    fontSize: 13,
  },
  sectionHeading: {
    color: COLORS.charcoal,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 26,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressIcon: {
    fontSize: 24,
  },
  progressNumber: {
    color: COLORS.maroon,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 10,
  },
  progressLabel: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 12,
  },
  actionTitle: {
    color: COLORS.charcoal,
    fontSize: 17,
    fontWeight: '700',
  },
  actionDescription: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  actionHint: {
    color: COLORS.maroon,
    fontSize: 13,
    marginTop: 10,
  },
});
