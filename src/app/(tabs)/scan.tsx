import Text from '@/components/Text';
import { auth, db } from '@/lib/firebase';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

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

const CLOUD_FUNCTION_REGION = 'us-central1';
const PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const ANALYZE_RECEIPT_URL = `https://${CLOUD_FUNCTION_REGION}-${PROJECT_ID}.cloudfunctions.net/analyzeReceipt`;

const Scan = () => {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ReceiptAIResult | null>(null);

  const isBusy = isCapturing || isAnalyzing;

  const canUseCloudFunction = useMemo(() => {
    return Boolean(PROJECT_ID);
  }, []);

  const uploadReceiptAndAnalyze = useCallback(async (localUri: string) => {
    if (!canUseCloudFunction) {
      throw new Error('Missing Firebase project configuration.');
    }

    const user = auth.currentUser;
    if (!user) {
      throw new Error('You must be logged in to scan receipts.');
    }

    const storage = getStorage();
    const receiptRef = await addDoc(collection(db, 'receipts'), {
      userId: user.uid,
      imageUrl: '',
      status: 'uploaded',
      merchant: '',
      amount: 0,
      date: '',
      category: 'Other',
      rawText: '',
      items: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const response = await fetch(localUri);
    const blob = await response.blob();
    const fileRef = ref(storage, `receipts/${user.uid}/${receiptRef.id}.jpg`);
    await uploadBytes(fileRef, blob, { contentType: 'image/jpeg' });
    const imageUrl = await getDownloadURL(fileRef);

    await updateDoc(receiptRef, {
      imageUrl,
      updatedAt: serverTimestamp(),
    });

    const idToken = await user.getIdToken();

    const apiResponse = await fetch(ANALYZE_RECEIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        receiptId: receiptRef.id,
        imageUrl,
      }),
    });

    const body = await apiResponse.json();

    if (!apiResponse.ok) {
      const message = body?.error || 'Cloud function failed to analyze receipt.';
      throw new Error(message);
    }

    return body as ReceiptAIResult;
  }, [canUseCloudFunction]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isBusy) {
      return;
    }

    try {
      setAnalysisResult(null);
      setIsCapturing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (!photo?.uri) {
        throw new Error('Could not capture receipt image.');
      }

      setCapturedUri(photo.uri);
      setIsCapturing(false);
      setIsAnalyzing(true);

      const result = await uploadReceiptAndAnalyze(photo.uri);
      setAnalysisResult(result);
    } catch (error) {
      Alert.alert(
        'Scan failed',
        error instanceof Error ? error.message : 'We could not scan this receipt.'
      );
    } finally {
      setIsCapturing(false);
      setIsAnalyzing(false);
    }
  }, [isBusy, uploadReceiptAndAnalyze]);

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-slate-600">Preparing camera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center bg-slate-50 px-6">
        <View className="rounded-2xl bg-white p-5 shadow-sm">
          <Text className="text-xl font-bold text-slate-900">Camera access required</Text>
          <Text className="mt-2 text-slate-600">
            Enable camera permission to scan receipts and extract transaction details.
          </Text>
          <Pressable
            onPress={requestPermission}
            className="mt-4 rounded-xl bg-primary px-4 py-3">
            <Text className="text-center font-semibold text-white">Allow camera access</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView contentContainerClassName="px-4 pb-8 pt-4">
        <Text className="text-2xl font-bold text-slate-900">Scan Receipt</Text>
        <Text className="mt-1 text-slate-600">
          Capture a receipt and let the cloud function extract merchant, amount, date, and category.
        </Text>

        <View className="mt-4 overflow-hidden rounded-2xl bg-black">
          <CameraView ref={cameraRef} facing={facing} style={{ height: 420 }} />
        </View>

        <View className="mt-4 flex-row gap-3">
          <Pressable
            onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3">
            <Ionicons name="camera-reverse-outline" size={18} color="#0F172A" />
            <Text className="font-semibold text-slate-900">Flip</Text>
          </Pressable>

          <Pressable
            onPress={handleCapture}
            disabled={isBusy}
            className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl px-4 py-3 ${
              isBusy ? 'bg-slate-400' : 'bg-primary'
            }`}>
            {isBusy ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="scan-outline" size={18} color="#FFFFFF" />
            )}
            <Text className="font-semibold text-white">
              {isAnalyzing ? 'Analyzing...' : isCapturing ? 'Capturing...' : 'Scan now'}
            </Text>
          </Pressable>
        </View>

        {capturedUri ? (
          <View className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
            <Text className="text-base font-semibold text-slate-900">Last capture</Text>
            <Image source={{ uri: capturedUri }} className="mt-3 h-52 w-full rounded-xl" />
          </View>
        ) : null}

        {analysisResult ? (
          <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <Text className="text-base font-semibold text-slate-900">Extracted details</Text>
            <Text className="mt-3 text-slate-700">Merchant: {analysisResult.merchant || '-'}</Text>
            <Text className="mt-1 text-slate-700">Amount: {analysisResult.amount || 0}</Text>
            <Text className="mt-1 text-slate-700">Date: {analysisResult.date || '-'}</Text>
            <Text className="mt-1 text-slate-700">Category: {analysisResult.category || 'Other'}</Text>
            <Text className="mt-3 text-xs text-slate-500" numberOfLines={4}>
              {analysisResult.rawText || 'No OCR text returned.'}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Scan;
