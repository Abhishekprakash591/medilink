import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "f2c0f0c597b32a56dc269cac3a6b3f47f4afeb89",
  authDomain: "medi-46732.firebaseapp.com",
  databaseURL: "https://medi-46732-default-rtdb.firebaseio.com",
  projectId: "medi-46732",
  storageBucket: "medi-46732.firebasestorage.app",
  messagingSenderId: "506702987471",
  appId: "1:506702987471:web:0d1f3d1a1663f9200c77ba"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const storage = getStorage(app);
