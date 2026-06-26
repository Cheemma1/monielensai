# MonielensAI

MonielensAI is a personal finance app that helps users understand and manage their money. It lets users track income and expenses, create budgets, view spending insights, and scan receipts so transaction details can be extracted automatically with AI.

![MonielensAI screen 1](assets/screen1.jpeg)
![](<assets/Screenshot_20260626_132719_Expo Go.jpg>)
![](<assets/Screenshot_20260626_132726_Expo Go.jpg>)
![](<assets/Screenshot_20260626_134857_Expo Go.jpg>)

## What The App Does

- Tracks income and expense transactions
- Helps users create and manage budgets
- Shows spending insights from user activity
- Lets users scan receipts with the camera
- Uses AI to extract receipt details like merchant, amount, date, category, and items
- Stores user data securely with Firebase
- Supports user accounts, login, signup, and profile management

## Main Screens

- **Home**: Overview of the user's money activity
- **Budget**: Create and manage budgets
- **Insights**: View spending insights
- **Scan**: Capture receipts and analyze them with AI
- **Profile**: Manage user account details

## Built With

- Expo
- React Native
- TypeScript
- Firebase Authentication
- Firestore
- Firebase Storage
- Firebase Cloud Functions
- Gemini AI

## Running The App

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

Run on web:

```bash
npm run web
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

## Environment Setup

The app needs Firebase configuration values in a `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Receipt scanning also needs a Gemini API key set as a Firebase Functions secret:

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

## Summary

MonielensAI is built to make money tracking easier by combining budgeting, transaction management, and AI-powered receipt scanning in one simple finance app.
