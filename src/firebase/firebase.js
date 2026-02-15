import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDb70tr4Fj_qfGUNP--134-Ys0Oslm_jds",
  authDomain: "soccerball-app.firebaseapp.com",
  projectId: "soccerball-app",
  storageBucket: "soccerball-app.firebasestorage.app",
  messagingSenderId: "427501157845",
  appId: "1:427501157845:web:4c430405218734943f115c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
