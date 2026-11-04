
import { useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const COLORS = {
  cream: '#F8F3E9',
  maroon: '#7B263A',
  charcoal: '#292727',
  muted: '#77716C',
  white: '#FFFFFF',
  border: '#E9DFD2',
  correct: '#DDEBDD',
  incorrect: '#F5DEDF',
};

const questions = [
  { word: 'བཀྲ་ཤིས', transliteration: 'Tashi', meaning: 'Good luck • Blessing', options: ['Water', 'Good luck • Blessing', 'House', 'Mother'] },
  { word: 'ཆུ', transliteration: 'Chu', meaning: 'Water', options: ['Water', 'Father', 'Book', 'Friend'] },
  { word: 'ཨ་མ', transliteration: 'Ama', meaning: 'Mother', options: ['House', 'Mother', 'Water', 'Good luck'] },
  { word: 'ཨ་པ', transliteration: 'Apa', meaning: 'Father', options: ['Mother', 'Friend', 'Father', 'Water'] },
  { word: 'ཁྱིམ', transliteration: 'Khim', meaning: 'House • Home', options: ['House • Home', 'Father', 'Mother', 'Water'] },
  { word: 'བཀྲ་ཤིས', transliteration: 'Tashi', meaning: 'Good luck • Blessing', options: ['Good luck • Blessing', 'Book', 'House', 'Mother'] },
  { word: 'ཆུ', transliteration: 'Chu', meaning: 'Water', options: ['Father', 'Water', 'House', 'Friend'] },
  { word: 'ཨ་མ', transliteration: 'Ama', meaning: 'Mother', options: ['Water', 'House', 'Mother', 'Father'] },
  { word: 'ཨ་པ', transliteration: 'Apa', meaning: 'Father', options: ['Mother', 'Father', 'Good luck', 'Water'] },
  { word: 'ཁྱིམ', transliteration: 'Khim', meaning: 'House • Home', options: ['Friend', 'Mother', 'Water', 'House • Home'] },
];

export default function QuizScreen() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const question = questions[questionIndex];

  function answerQuestion(option: string) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(option);

    if (option === question.meaning) {
      setScore((current) => current + 1);
    }
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  }

  function restartQuiz() {
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setFinished(false);
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultIcon}>{percentage >= 70 ? '🎉' : '📚'}</Text>
          <Text style={styles.heading}>Quiz completed!</Text>
          <Text style={styles.subtitle}>Great work practising Dzongkha.</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>YOUR FINAL SCORE</Text>
            <Text style={styles.finalScore}>{score}/{questions.length}</Text>
            <Text style={styles.percentage}>{percentage}% correct</Text>
          </View>

          <Pressable style={styles.primaryButton} onPress={restartQuiz}>
            <Text style={styles.primaryButtonText}>Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Dzongkha Quiz</Text>
        <Text style={styles.subtitle}>Test your vocabulary knowledge.</Text>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            Question {questionIndex + 1} of {questions.length}
          </Text>
          <Text style={styles.progressLabel}>Score: {score}</Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${((questionIndex + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>WHAT DOES THIS WORD MEAN?</Text>
          <Text style={styles.dzongkha}>{question.word}</Text>
          <Text style={styles.transliteration}>{question.transliteration}</Text>
        </View>

        <Text style={styles.optionsTitle}>Choose the correct meaning</Text>

        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.meaning;

          return (
            <Pressable
              key={`${questionIndex}-${index}`}
              disabled={selectedAnswer !== null}
              onPress={() => answerQuestion(option)}
              style={[
                styles.option,
                isSelected && (isCorrect ? styles.correctOption : styles.incorrectOption),
                selectedAnswer !== null && isCorrect && styles.correctOption,
              ]}
            >
              <Text style={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </Text>
              <Text style={styles.optionText}>{option}</Text>
              {selectedAnswer !== null && isCorrect && (
                <Text style={styles.feedbackIcon}>✓</Text>
              )}
              {isSelected && !isCorrect && (
                <Text style={styles.feedbackIcon}>✕</Text>
              )}
            </Pressable>
          );
        })}

        {selectedAnswer !== null && (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>
              {selectedAnswer === question.meaning ? 'Correct! Well done!' : 'Not quite!'}
            </Text>
            <Text style={styles.feedbackText}>
              {selectedAnswer === question.meaning
                ? 'You selected the right meaning.'
                : `The correct answer is: ${question.meaning}`}
            </Text>

            <Pressable style={styles.primaryButton} onPress={nextQuestion}>
              <Text style={styles.primaryButtonText}>
                {questionIndex === questions.length - 1
                  ? 'See final score'
                  : 'Next question →'}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.cream },
  container: { padding: 22, paddingTop: 25, paddingBottom: 40 },
  heading: { color: COLORS.charcoal, fontSize: 28, fontWeight: '800' },
  subtitle: { color: COLORS.muted, fontSize: 14, marginTop: 7, marginBottom: 24 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { color: COLORS.maroon, fontSize: 13, fontWeight: '700' },
  progressTrack: { height: 7, backgroundColor: COLORS.border, borderRadius: 5, overflow: 'hidden', marginBottom: 25 },
  progressFill: { height: '100%', backgroundColor: COLORS.maroon, borderRadius: 5 },
  questionCard: { backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 25, alignItems: 'center', marginBottom: 25 },
  questionLabel: { color: COLORS.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1, textAlign: 'center' },
  dzongkha: { color: COLORS.charcoal, fontSize: 43, marginTop: 20 },
  transliteration: { color: COLORS.maroon, fontSize: 20, fontWeight: '700', marginTop: 6 },
  optionsTitle: { color: COLORS.charcoal, fontSize: 17, fontWeight: '800', marginBottom: 14 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 15, marginBottom: 11 },
  optionLetter: { color: COLORS.maroon, fontWeight: '800', fontSize: 14, marginRight: 13 },
  optionText: { color: COLORS.charcoal, fontSize: 14, flex: 1 },
  correctOption: { backgroundColor: COLORS.correct, borderColor: '#6A986A' },
  incorrectOption: { backgroundColor: COLORS.incorrect, borderColor: '#C06B73' },
  feedbackIcon: { color: COLORS.charcoal, fontWeight: '800', fontSize: 18, marginLeft: 8 },
  feedbackCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 18, marginTop: 8, borderWidth: 1, borderColor: COLORS.border },
  feedbackTitle: { color: COLORS.maroon, fontSize: 18, fontWeight: '800' },
  feedbackText: { color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 6, marginBottom: 16 },
  primaryButton: { backgroundColor: COLORS.maroon, paddingVertical: 15, borderRadius: 13, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  resultContainer: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  resultIcon: { fontSize: 52, marginBottom: 18 },
  scoreCard: { width: '100%', backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 25, alignItems: 'center', marginVertical: 25 },
  scoreLabel: { color: COLORS.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  finalScore: { color: COLORS.maroon, fontSize: 48, fontWeight: '800', marginTop: 12 },
  percentage: { color: COLORS.charcoal, fontSize: 16, marginTop: 5 },
});
