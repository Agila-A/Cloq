import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPVjm63F3JyHAeu1CnAYpHxqu-s4ZWL-8",
  authDomain: "cloq-c6300.firebaseapp.com",
  projectId: "cloq-c6300",
  storageBucket: "cloq-c6300.firebasestorage.app",
  messagingSenderId: "691277711444",
  appId: "1:691277711444:web:07b867e0e514c33d4b45c1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
