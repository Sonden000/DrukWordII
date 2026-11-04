import { Link } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AuthField } from '@/components/auth-field';
import { useAuth } from '@/context/auth-context';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await signIn(email, password);
      // The protected routes in the root layout redirect to the app automatically.
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not log in.');
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
          <Text style={styles.greeting}>KUZUZANGPO</Text>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to continue learning Dzongkha.</Text>

          <View style={styles.card}>
            <AuthField
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <AuthField
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              placeholder="Your password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <Link href="/forgot-password" style={styles.forgotLink}>
              Forgot password?
            </Link>

            {formError ? <Text style={styles.formError}>{formError}</Text> : null}

            <Pressable
              onPress={handleLogin}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="Log in"
              style={({ pressed }) => [
                styles.button,
                (pressed || submitting) && styles.buttonPressed,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Log in</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to DrukWord? </Text>
            <Link href="/signup" style={styles.footerLink}>
              Create an account
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
  forgotLink: {
    alignSelf: 'flex-end',
    color: '#7B263A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: -4,
  },
  formError: {
    backgroundColor: '#F5DEDF',
    color: '#B3261E',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#7B263A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#77716C', fontSize: 14 },
  footerLink: { color: '#7B263A', fontSize: 14, fontWeight: '700' },
});
