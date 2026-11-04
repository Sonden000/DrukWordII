
import { useAuth } from '@/context/auth-context';
import { vocabulary, VocabularyWord } from '@/data/vocabulary';
import { savedWordsKey } from '@/lib/saved-words';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function SavedScreen() {
  const { user } = useAuth();
  const savedKey = savedWordsKey(user?.uid);
  const [savedWords, setSavedWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedWords = useCallback(async () => {
    try {
      const storedIds = await AsyncStorage.getItem(savedKey);
      const ids: string[] = storedIds ? JSON.parse(storedIds) : [];

      const words = ids
        .map((id) => vocabulary.find((word) => word.id === id))
        .filter((word): word is VocabularyWord => word !== undefined);

      setSavedWords(words);
    } catch (error) {
      console.error('Could not load saved words:', error);
      Alert.alert('Error', 'Could not load your saved words.');
    } finally {
      setLoading(false);
    }
  }, [savedKey]);

  useFocusEffect(
    useCallback(() => {
      loadSavedWords();
    }, [loadSavedWords])
  );

  const removeWord = async (wordId: string) => {
    try {
      const storedIds = await AsyncStorage.getItem(savedKey);
      const ids: string[] = storedIds ? JSON.parse(storedIds) : [];
      const updatedIds = ids.filter((id) => id !== wordId);

      await AsyncStorage.setItem(
        savedKey,
        JSON.stringify(updatedIds)
      );

      setSavedWords((currentWords) =>
        currentWords.filter((word) => word.id !== wordId)
      );
    } catch (error) {
      console.error('Could not remove saved word:', error);
      Alert.alert('Error', 'Could not remove this word. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7B263A" />
        <Text style={styles.loadingText}>Loading saved words...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Words</Text>
      <Text style={styles.subtitle}>
        Your personal collection of Dzongkha vocabulary
      </Text>

      {savedWords.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No saved words yet</Text>
          <Text style={styles.emptyText}>
            Words you save will appear here so you can practise them anytime.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedWords}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.wordCard}>
              <View style={styles.wordInfo}>
                <Text style={styles.dzongkha}>{item.dzongkha}</Text>
                <Text style={styles.transliteration}>
                  {item.transliteration}
                </Text>
                <Text style={styles.meaning}>{item.meaning}</Text>
                <Text style={styles.partOfSpeech}>
                  {item.partOfSpeech}
                </Text>
                <Text style={styles.example}>{item.exampleDzongkha}</Text>
                <Text style={styles.exampleEnglish}>
                  {item.exampleEnglish}
                </Text>
              </View>

              <Text
                style={styles.removeButton}
                onPress={() => removeWord(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.transliteration} from saved words`}
              >
                Remove
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3E9',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    backgroundColor: '#F8F3E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#77716C',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#292727',
  },
  subtitle: {
    fontSize: 14,
    color: '#77716C',
    marginTop: 8,
    marginBottom: 22,
  },
  list: {
    paddingBottom: 30,
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E9DFD2',
  },
  wordInfo: {
    flex: 1,
  },
  dzongkha: {
    fontSize: 27,
    color: '#7B263A',
    fontWeight: 'bold',
  },
  transliteration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#292727',
    marginTop: 5,
  },
  meaning: {
    fontSize: 15,
    color: '#292727',
    marginTop: 5,
  },
  partOfSpeech: {
    fontSize: 12,
    color: '#77716C',
    marginTop: 6,
  },
  example: {
    fontSize: 18,
    color: '#292727',
    marginTop: 12,
  },
  exampleEnglish: {
    fontSize: 13,
    color: '#77716C',
    marginTop: 4,
  },
  removeButton: {
    alignSelf: 'flex-start',
    color: '#7B263A',
    fontWeight: 'bold',
    marginTop: 14,
    paddingVertical: 5,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9DFD2',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#292727',
  },
  emptyText: {
    fontSize: 14,
    color: '#77716C',
    marginTop: 8,
    lineHeight: 21,
  },
});
