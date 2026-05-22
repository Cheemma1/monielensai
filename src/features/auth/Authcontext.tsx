// context/AuthContext.tsx
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserDetails = {
  uid: string;
  displayName: string;
  email: string;
  currency: string;
} | null;

type AuthContextType = {
  user: User | null;
  userDetails: UserDetails;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userDetails: null,
  isLoading: true,
  refreshUser: async () => {},
});

export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;

    await auth.currentUser.reload();
    // Force a new reference so consumers re-render after profile changes.
    const latest = auth.currentUser;
    setUser(latest ? ({ ...latest } as User) : null);
  }, []);

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      if (firebaseUser) {
        unsubscribeUserDoc = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserDetails({
                uid: firebaseUser.uid,
                displayName: data.displayName || firebaseUser.displayName || '',
                email: data.email || firebaseUser.email || '',
                currency: data.currency || 'NGN',
              });
            } else {
              setUserDetails({
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || '',
                email: firebaseUser.email || '',
                currency: 'NGN',
              });
            }
            setIsLoading(false);
          },
          (error) => {
            console.error('Error listening to user document:', error);
            setUserDetails({
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              currency: 'NGN',
            });
            setIsLoading(false);
          }
        );
      } else {
        setUserDetails(null);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userDetails, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthUser() {
  return useContext(AuthContext);
}

export function useCurrency() {
  const { userDetails } = useAuthUser();
  const currencyCode = userDetails?.currency || 'NGN';
  const symbol = currencySymbols[currencyCode] || '$';

  const formatAmount = useCallback((amount: number, options?: { showDecimal?: boolean }) => {
    const showDecimal = options?.showDecimal ?? true;
    const formattedVal = amount.toLocaleString('en-US', {
      minimumFractionDigits: showDecimal ? 2 : 0,
      maximumFractionDigits: showDecimal ? 2 : 0,
    });
    return `${symbol}${formattedVal}`;
  }, [symbol]);

  return {
    currencyCode,
    symbol,
    formatAmount,
  };
}
