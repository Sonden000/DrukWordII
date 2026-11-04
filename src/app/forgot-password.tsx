import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthField } from '@/components/auth-field';
import { useAuth } from '@/context/auth-context';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async () => {
    setError('');
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send the reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.greeting}>RESET PASSWORD</Text>
          <Text style={styles.heading}>Forgot your password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we’ll send you a link to choose a new one.
          </Text>

          <View style={styles.card}>
            {sent ? (
              <Text style={styles.success}>
                If an account exists for {email.trim()}, a reset link is on its way.
                Check your inbox (and spam folder).
              </Text>
            ) : (
              <>
                <AuthField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  error={error}
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  returnKeyType="done"
                  onSubmitEditing={handleReset}
                />
                <Pressable
                  onPress={handleReset}
                  disabled={submitting}
                  accessibilityRole="button"
                  accessibilityLabel="Send reset link"
                  style={({ pressed }) => [
                    styles.button,
                    (pressed || submitting) && styles.buttonPressed,
                  ]}
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Send reset link</Text>
                  )}
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.footer}>
            <Link href="/login" replace style={styles.footerLink}>
              Back to log in
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#F8F3E9' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  greeting: {
    color: '#7B263A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heading: { color: '#292727', fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#77716C', fontSize: 15, marginTop: 6, marginBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E9DFD2',
  },
  success: { color: '#292727', fontSize: 15, lineHeight: 22 },
  button: {
    backgroundColor: '#7B263A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerLink: { color: '#7B263A', fontSize: 14, fontWeight: '700' },
});
