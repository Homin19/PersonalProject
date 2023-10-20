import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzhOqeo2FziJqgwtMzxyaG1c7HXQT0F08",
  authDomain: "cardiy-f1748.firebaseapp.com",
  projectId: "cardiy-f1748",
  storageBucket: "cardiy-f1748.appspot.com",
  messagingSenderId: "658194630618",
  appId: "1:658194630618:web:be06bf6d26c529267262e3",
  measurementId: "G-DLKDCN08FH",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
