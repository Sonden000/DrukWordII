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

type Errors = { name?: string; email?: string; password?: string; confirm?: string };

export default function SignupScreen() {
  const { signUp } = useAuth();
  const emailRef = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const confirmRef = useRef<ComponentRef<typeof TextInput>>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async () => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Enter your name.';
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.';
    if (password.length < 6) next.password = 'Use at least 6 characters.';
    if (confirm !== password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await signUp(name, email, password);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Could not create your account.'
      );
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
          <Text style={styles.greeting}>GET STARTED</Text>
          <Text style={styles.heading}>Create your account</Text>
          <Text style={styles.subtitle}>
            Save words and keep your progress in one place.
          </Text>

          <View style={styles.card}>
            <AuthField
              label="Name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              placeholder="Your name"
              autoComplete="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            <AuthField
              ref={emailRef}
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
              placeholder="At least 6 characters"
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
            />
            <AuthField
              ref={confirmRef}
              label="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              error={errors.confirm}
              placeholder="Repeat your password"
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />

            {formError ? <Text style={styles.formError}>{formError}</Text> : null}

            <Pressable
              onPress={handleSignup}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="Create account"
              style={({ pressed }) => [
                styles.button,
                (pressed || submitting) && styles.buttonPressed,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Create account</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/login" replace style={styles.footerLink}>
              Log in
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
