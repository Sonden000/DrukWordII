
import { useAuth } from '@/context/auth-context';
import { vocabulary } from '@/data/vocabulary';
import { savedWordsKey } from '@/lib/saved-words';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const COLORS = {
  cream: '#F8F3E9',
  maroon: '#7B263A',
  charcoal: '#292727',
  muted: '#77716C',
  white: '#FFFFFF',
  border: '#E9DFD2',
};

export default function SearchScreen() {
  const { user } = useAuth();
  const savedKey = savedWordsKey(user?.uid);
  const [query, setQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<string[]>([]);

  const loadSavedIds = useCallback(async () => {
    try {
      const storedIds = await AsyncStorage.getItem(savedKey);
      const ids: string[] = storedIds ? JSON.parse(storedIds) : [];
      setSavedIds(ids);
    } catch (error) {
      console.error('Could not load saved words:', error);
      Alert.alert('Error', 'Could not load your saved words.');
    } finally {
      setLoading(false);
    }
  }, [savedKey]);

  useEffect(() => {
    loadSavedIds();
  }, [loadSavedIds]);

  const results = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return vocabulary;

    return vocabulary.filter((word) =>
      `${word.dzongkha} ${word.transliteration} ${word.meaning}`
        .toLowerCase()
        .includes(searchText)
    );
  }, [query]);

  const toggleSaved = async (wordId: string) => {
    if (savingIds.includes(wordId)) return;

    setSavingIds((current) => [...current, wordId]);

    try {
      const storedIds = await AsyncStorage.getItem(savedKey);
      const currentIds: string[] = storedIds ? JSON.parse(storedIds) : [];

      let updatedIds: string[];

      if (currentIds.includes(wordId)) {
        updatedIds = currentIds.filter((id) => id !== wordId);
      } else {
        updatedIds = [...currentIds, wordId];
      }

      await AsyncStorage.setItem(
        savedKey,
        JSON.stringify(updatedIds)
      );

      setSavedIds(updatedIds);
    } catch (error) {
      console.error('Could not update saved words:', error);
      Alert.alert('Error', 'Could not update this saved word. Please try again.');
    } finally {
      setSavingIds((current) => current.filter((id) => id !== wordId));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Search Dzongkha</Text>
        <Text style={styles.subtitle}>
          Find words by Dzongkha or English
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search words or meanings..."
          placeholderTextColor={COLORS.muted}
          style={styles.input}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />

        <Text style={styles.resultHeading}>
          {query.trim() ? 'Search results' : 'Explore vocabulary'}
        </Text>

        {loading && (
          <ActivityIndicator
            size="small"
            color={COLORS.maroon}
            style={styles.loader}
          />
        )}

        {results.length > 0 ? (
          results.map((word) => {
            const isSaved = savedIds.includes(word.id);
            const isSaving = savingIds.includes(word.id);

            return (
              <View key={word.id} style={styles.wordCard}>
                <Text style={styles.dzongkha}>{word.dzongkha}</Text>
                <Text style={styles.transliteration}>
                  {word.transliteration}
                </Text>
                <Text style={styles.meaning}>{word.meaning}</Text>

                <Text style={styles.detail}>
                  Part of speech: {word.partOfSpeech}
                </Text>
                <Text style={styles.example}>{word.exampleDzongkha}</Text>
                <Text style={styles.meaning}>{word.exampleEnglish}</Text>

                <Text
                  style={[
                    styles.saveButton,
                    isSaved && styles.savedButton,
                    isSaving && styles.disabledButton,
                  ]}
                  onPress={() => toggleSaved(word.id)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isSaved
                      ? `Remove ${word.transliteration} from saved words`
                      : `Save ${word.transliteration}`
                  }
                >
                  {isSaving
                    ? 'Saving...'
                    : isSaved
                      ? '♥ Saved — tap to remove'
                      : '♡ Save word'}
                </Text>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No words found</Text>
            <Text style={styles.meaning}>
              Try another Dzongkha word or English meaning.
            </Text>
          </View>
        )}
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
    padding: 22,
    paddingTop: 25,
    paddingBottom: 35,
  },
  heading: {
    color: COLORS.charcoal,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 7,
    marginBottom: 22,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: COLORS.charcoal,
    marginBottom: 25,
  },
  resultHeading: {
    color: COLORS.charcoal,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 14,
  },
  loader: {
    marginBottom: 14,
  },
  wordCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 17,
    marginBottom: 12,
  },
  dzongkha: {
    color: COLORS.charcoal,
    fontSize: 27,
  },
  transliteration: {
    color: COLORS.maroon,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
  meaning: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 5,
  },
  detail: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 9,
  },
  example: {
    color: COLORS.charcoal,
    fontSize: 18,
    marginTop: 12,
  },
  saveButton: {
    alignSelf: 'flex-start',
    color: COLORS.maroon,
    fontWeight: '700',
    marginTop: 16,
    paddingVertical: 8,
  },
  savedButton: {
    color: '#34704A',
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    color: COLORS.charcoal,
    fontSize: 17,
    fontWeight: '700',
  },
});
