

import {
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function signUp(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    await updateProfile(user, {
      displayName,
    });

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName,
      email: user.email,
      currency: 'NGN',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      user,
    };
  } catch (error: any) {
    const rawMessage =
      typeof error?.message === 'string' ? error.message : 'Unable to create account';
    const message = rawMessage.includes('Missing or insufficient permissions')
      ? 'Account created, but profile setup failed due to Firestore permissions. Update your Firestore rules for users/{uid} create.'
      : rawMessage;

    return {
      success: false,
      error: message,
    };
  }
}

export async function logIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unable to log in',
    };
  }
}

export async function logOut() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unable to reset password',
    };
  }
}

export async function updateUserDetails({
  displayName,
  email,
  currency,
}: {
  displayName: string;
  email: string;
  currency: string;
}) {
  try {
    const user = auth.currentUser;

    if (!user) {
      return {
        success: false,
        error: 'You need to be logged in to update your profile.',
      };
    }

    const nextName = displayName.trim();
    const nextEmail = email.trim().toLowerCase();
    const nextCurrency = currency.trim().toUpperCase();

    if (!nextName || !nextEmail || !nextCurrency) {
      return {
        success: false,
        error: 'All fields are required.',
      };
    }

    if (user.displayName !== nextName) {
      await updateProfile(user, { displayName: nextName });
    }

    if (user.email !== nextEmail) {
      await updateEmail(user, nextEmail);
    }

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const payload = {
      displayName: nextName,
      email: nextEmail,
      currency: nextCurrency,
      updatedAt: serverTimestamp(),
    };

    if (snap.exists()) {
      await updateDoc(userRef, payload);
    } else {
      await setDoc(userRef, {
        uid: user.uid,
        createdAt: serverTimestamp(),
        ...payload,
      });
    }

    return {
      success: true,
    };
  } catch (error: any) {
    const code = typeof error?.code === 'string' ? error.code : '';
    let message = error?.message || 'Unable to update profile';

    if (code === 'auth/requires-recent-login') {
      message =
        'For security, please log out and log back in before changing your email address.';
    }

    return {
      success: false,
      error: message,
    };
  }
}
