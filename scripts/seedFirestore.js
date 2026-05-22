const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedFirestore() {
  const userId = 'testUser123';

  const userRef = db.collection('users').doc(userId);

  await userRef.set({
    fullName: 'Jeshurun Ezeobi',
    email: 'jeshurun@example.com',
    currency: 'NGN',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('transactions').add({
    type: 'income',
    amount: 300000,
    category: 'Salary',
    date: '2026-05-20',
    month: '2026-05',
    source: 'May salary',
    paymentMethod: 'transfer',
    note: 'Main monthly salary',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('transactions').add({
    type: 'income',
    amount: 70000,
    category: 'Freelance',
    date: '2026-05-22',
    month: '2026-05',
    source: 'Freelance project',
    paymentMethod: 'transfer',
    note: 'Website project payment',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('transactions').add({
    type: 'expense',
    amount: 80000,
    category: 'Food',
    date: '2026-05-21',
    month: '2026-05',
    merchant: 'Market',
    paymentMethod: 'cash',
    note: 'Monthly food shopping',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('transactions').add({
    type: 'expense',
    amount: 40000,
    category: 'Transport',
    date: '2026-05-23',
    month: '2026-05',
    merchant: 'Uber / Bus',
    paymentMethod: 'card',
    note: 'Transport for the month',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('transactions').add({
    type: 'expense',
    amount: 50000,
    category: 'Shopping',
    date: '2026-05-24',
    month: '2026-05',
    merchant: 'Clothing store',
    paymentMethod: 'transfer',
    note: 'Clothes and personal items',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('transactions').add({
    type: 'expense',
    amount: 20000,
    category: 'Subscriptions',
    date: '2026-05-25',
    month: '2026-05',
    merchant: 'Netflix / Internet',
    paymentMethod: 'card',
    note: 'Subscriptions',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('budgets').add({
    category: 'Food',
    month: '2026-05',
    limit: 100000,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('budgets').add({
    category: 'Transport',
    month: '2026-05',
    limit: 50000,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('budgets').add({
    category: 'Shopping',
    month: '2026-05',
    limit: 60000,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('budgets').add({
    category: 'Subscriptions',
    month: '2026-05',
    limit: 20000,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await userRef.collection('aiInsights').add({
    month: '2026-05',
    title: 'Food is your top spending category',
    message: 'You spent ₦80,000 on Food, which is 42% of your total expenses this month.',
    type: 'info',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log('Firestore seed data created successfully.');
}

seedFirestore().catch((error) => {
  console.error('Error seeding Firestore:', error);
});
