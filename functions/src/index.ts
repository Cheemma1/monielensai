import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

admin.initializeApp();

const geminiApiKey = defineSecret('GEMINI_API_KEY');
const corsHandler = cors({ origin: true });

type ReceiptAIResult = {
  merchant: string;
  amount: number;
  date: string;
  category: string;
  rawText: string;
  items: {
    name: string;
    price?: number;
    quantity?: number;
  }[];
};

const allowedCategories = [
  'Groceries',
  'Food & Dining',
  'Transport',
  'Shopping',
  'Bills & Utilities',
  'Health',
  'Entertainment',
  'Education',
  'Travel',
  'Rent',
  'Income',
  'Other',
];

export const analyzeReceipt = onRequest(
  {
    region: 'us-central1',
    secrets: [geminiApiKey],
    timeoutSeconds: 120,
    memory: '1GiB',
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.status(401).json({ error: 'Missing authorization token' });
          return;
        }

        const idToken = authHeader.split('Bearer ')[1];

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const { receiptId, imageUrl } = req.body as {
          receiptId?: string;
          imageUrl?: string;
        };

        if (!receiptId || !imageUrl) {
          res.status(400).json({
            error: 'receiptId and imageUrl are required',
          });
          return;
        }

        const receiptRef = admin.firestore().collection('receipts').doc(receiptId);

        const receiptSnap = await receiptRef.get();

        if (!receiptSnap.exists) {
          res.status(404).json({ error: 'Receipt not found' });
          return;
        }

        const receiptData = receiptSnap.data();

        if (receiptData?.userId !== userId) {
          res.status(403).json({ error: 'You do not own this receipt' });
          return;
        }

        await receiptRef.update({
          status: 'analyzing',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const ai = new GoogleGenAI({
          apiKey: geminiApiKey.value(),
        });

        const prompt = `
You are an OCR and receipt parsing assistant for a finance app called MoneyLens.

Analyze this receipt image and return ONLY valid JSON.

Rules:
- Extract merchant/store name.
- Extract the final total amount paid.
- Extract transaction date if visible.
- Choose exactly one category from:
${allowedCategories.join(', ')}
- If unsure, use "Other".
- rawText should contain important text you can read from the receipt.
- Do not include markdown.
- Do not include explanations.

Return JSON in this exact shape:
{
  "merchant": "",
  "amount": 0,
  "date": "YYYY-MM-DD",
  "category": "Other",
  "rawText": "",
  "items": [
    {
      "name": "",
      "price": 0,
      "quantity": 1
    }
  ]
}
        `.trim();

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt,
                },
                {
                  fileData: {
                    mimeType: 'image/jpeg',
                    fileUri: imageUrl,
                  },
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const outputText = geminiResponse.text;

        if (!outputText) {
          throw new Error('Gemini returned empty response');
        }

        let parsed: ReceiptAIResult;

        try {
          parsed = JSON.parse(outputText) as ReceiptAIResult;
        } catch (error) {
          logger.error('Could not parse Gemini JSON', {
            outputText,
            error,
          });

          throw new Error('Gemini returned invalid JSON');
        }

        const safeCategory = allowedCategories.includes(parsed.category)
          ? parsed.category
          : 'Other';

        const finalResult: ReceiptAIResult = {
          merchant: parsed.merchant || '',
          amount: Number(parsed.amount || 0),
          date: parsed.date || '',
          category: safeCategory,
          rawText: parsed.rawText || '',
          items: Array.isArray(parsed.items) ? parsed.items : [],
        };

        await receiptRef.update({
          status: 'analyzed',
          merchant: finalResult.merchant,
          amount: finalResult.amount,
          date: finalResult.date,
          category: finalResult.category,
          rawText: finalResult.rawText,
          items: finalResult.items,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).json(finalResult);
      } catch (error) {
        logger.error('Receipt analysis failed', error);

        res.status(500).json({
          error: 'Could not analyze receipt',
        });
      }
    });
  }
);