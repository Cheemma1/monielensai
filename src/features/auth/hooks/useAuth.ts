// import { useMutation } from '@tanstack/react-query';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { logIn, logOut, resetPassword, signUp } from '../services/auth.service';

// //useSignUp
// export function useSignUp() {
//   const router = useRouter();

//   const mutation = useMutation({
//     mutationFn: ({
//       email,
//       password,
//       displayName,
//     }: {
//       email: string;
//       password: string;
//       displayName: string;
//     }) => signUp(email, password, displayName),

//     onSuccess: async (result) => {
//       if (!result.success) {
//         throw new Error(result.error);
//       }
//       await AsyncStorage.setItem('hasSeenOnboarding', 'true');
//       router.replace('/(tabs)/home');
//     },

//     onError: (err: Error) => {
//       // error is now in mutation.error.message
//       console.error('Signup failed:', err.message);
//     },
//   });

//   return {
//     signUp: mutation.mutate,
//     signUpAsync: mutation.mutateAsync,
//     isLoading: mutation.isPending,
//     error: mutation.error?.message ?? null,
//     isError: mutation.isError,
//     reset: mutation.reset, // clears error state
//   };
// }

// //useLogIn
// export function useLogIn() {
//   const router = useRouter();

//   const mutation = useMutation({
//     mutationFn: ({ email, password }: { email: string; password: string }) =>
//       logIn(email, password),

//     onSuccess: async (result) => {
//       if (!result.success) {
//         throw new Error(result.error);
//       }
//       await AsyncStorage.setItem('hasSeenOnboarding', 'true');
//       router.replace('/(tabs)/home');
//     },

//     onError: (err: Error) => {
//       console.error('Login failed:', err.message);
//     },
//   });

//   return {
//     logIn: mutation.mutate,
//     logInAsync: mutation.mutateAsync,
//     isLoading: mutation.isPending,
//     error: mutation.error?.message ?? null,
//     isError: mutation.isError,
//     reset: mutation.reset,
//   };
// }

// // useLogOut
// export function useLogOut() {
//   const router = useRouter();

//   const mutation = useMutation({
//     mutationFn: logOut,
//     onSuccess: () => {
//       router.replace('/login');
//     },
//   });

//   return {
//     logOut: mutation.mutate,
//     isLoading: mutation.isPending,
//   };
// }

// //useResetPassword
// export function useResetPassword() {
//   const mutation = useMutation({
//     mutationFn: (email: string) => resetPassword(email),

//     onSuccess: (result) => {
//       if (!result.success) {
//         throw new Error(result.error);
//       }
//       // mutation.isSuccess === true → show "check your email" in UI
//     },

//     onError: (err: Error) => {
//       console.error('Reset failed:', err.message);
//     },
//   });

//   return {
//     resetPassword: mutation.mutate,
//     isLoading: mutation.isPending,
//     error: mutation.error?.message ?? null,
//     isSuccess: mutation.isSuccess,
//     reset: mutation.reset,
//   };
// }

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logIn, logOut, resetPassword, signUp, updateUserDetails } from '../services/auth.service';

// useSignUp
export function useSignUp() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: ({
      email,
      password,
      displayName,
    }: {
      email: string;
      password: string;
      displayName: string;
    }) => signUp(email, password, displayName),

    onSuccess: async (result) => {
      if (!result.success) {
        throw new Error(result.error);
      }

      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(tabs)/home');
    },

    onError: (err: Error) => {
      console.error('Signup failed:', err.message);
    },
  });

  return {
    signUp: mutation.mutate,
    signUpAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}

// useLogIn
export function useLogIn() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      logIn(email, password),

    onSuccess: async (result) => {
      if (!result.success) {
        throw new Error(result.error);
      }

      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(tabs)/home');
    },

    onError: (err: Error) => {
      console.error('Login failed:', err.message);
    },
  });

  return {
    logIn: mutation.mutate,
    logInAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}

// useLogOut
export function useLogOut() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      router.replace('/login');
    },
  });

  return {
    logOut: mutation.mutate,
    isLoading: mutation.isPending,
  };
}

// useResetPassword
export function useResetPassword() {
  const mutation = useMutation({
    mutationFn: (email: string) => resetPassword(email),

    onSuccess: (result) => {
      if (!result.success) {
        throw new Error(result.error);
      }
    },

    onError: (err: Error) => {
      console.error('Reset failed:', err.message);
    },
  });

  return {
    resetPassword: mutation.mutate,
    resetPasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}

export function useUpdateUserDetails() {
  const mutation = useMutation({
    mutationFn: ({
      displayName,
      email,
      currency,
    }: {
      displayName: string;
      email: string;
      currency: string;
    }) => updateUserDetails({ displayName, email, currency }),
    onSuccess: (result) => {
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onError: (err: Error) => {
      console.error('Profile update failed:', err.message);
    },
  });

  return {
    updateUserDetails: mutation.mutate,
    updateUserDetailsAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}
