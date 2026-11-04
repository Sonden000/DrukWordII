import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { auth } from '@/lib/firebase';

export type User = {
  uid: string;
  name: string;
  email: string;
  /** ISO-ish date string from Firebase, e.g. 'Tue, 03 Nov 2026 ...' */
  createdAt?: string;
};

type AuthContextValue = {
  user: User | null;
  /** True until Firebase has restored (or ruled out) a saved session on app start. */
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const toUser = (u: FirebaseUser): User => ({
  uid: u.uid,
  name: u.displayName ?? u.email?.split('@')[0] ?? 'Learner',
  email: u.email ?? '',
  createdAt: u.metadata.creationTime,
});

/** Turns Firebase error codes into messages that are safe to show to people. */
function friendlyError(error: unknown): Error {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return new Error('Incorrect email or password.');
    case 'auth/invalid-email':
      return new Error('Enter a valid email address.');
    case 'auth/email-already-in-use':
      return new Error('An account with this email already exists.');
    case 'auth/weak-password':
      return new Error('Choose a stronger password (at least 6 characters).');
    case 'auth/user-disabled':
      return new Error('This account has been disabled.');
    case 'auth/too-many-requests':
      return new Error('Too many attempts. Please wait a moment and try again.');
    case 'auth/network-request-failed':
      return new Error('Network error. Check your connection and try again.');
    default:
      return new Error('Something went wrong. Please try again.');
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Firebase calls this once on launch with the restored user (or null),
  // and again on every login/logout.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? toUser(firebaseUser) : null);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        // The auth listener fires before the name is saved, so set it
        // explicitly afterwards to show the right name straight away.
        await updateProfile(credential.user, { displayName: name.trim() });
        setUser(toUser(credential.user));
      } catch (error) {
        throw friendlyError(error);
      }
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      throw friendlyError(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      // Don't reveal whether an email has an account: treat "no such user" as success.
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? String((error as { code: unknown }).code)
          : '';
      if (code === 'auth/user-not-found') return;
      throw friendlyError(error);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, signIn, signUp, signOut, resetPassword }),
    [user, isLoading, signIn, signUp, signOut, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return context;
}
