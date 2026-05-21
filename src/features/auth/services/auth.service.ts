// services/authService.ts — unchanged, pure async functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AuthResult } from '../types';

export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      createdAt: serverTimestamp(),
    });
    return { success: true, uid: user.uid };
  } catch (err) {
    return { success: false, error: parseAuthError(err as AuthError) };
  }
}

export async function logIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, uid: user.uid };
  } catch (err) {
    return { success: false, error: parseAuthError(err as AuthError) };
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, uid: '' };
  } catch (err) {
    return { success: false, error: parseAuthError(err as AuthError) };
  }
}

function parseAuthError(err: AuthError): string {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
