import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBt3Y8-Lr8DJ5v1-KX2Bq8Dk7t9sgLEA8U",
  authDomain: "emotion-recognition-app-b4237.firebaseapp.com",
  projectId: "emotion-recognition-app-b4237",
  storageBucket: "emotion-recognition-app-b4237.appspot.com",
  messagingSenderId: "448337529196",
  appId: "1:448337529196:web:fbd829cb65413e09530b49",
  measurementId: "G-P6T58JG403"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
