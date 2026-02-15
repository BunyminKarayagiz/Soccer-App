import { auth, db } from "../firebase/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

// 🔥 REGISTER
export const registerUser = async (email, password, username) => {
  try {
    // 1️⃣ kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;
    const uid = user.uid;

    // 2️⃣ firestore users içine oluştur
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      email: email,
      username: username,
      photoURL: "",
      createdAt: new Date(),

      favorites: {
        teams: [],
        leagues: [],
        players: [],
        matches: [],
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 🔥 LOGIN
export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 🔥 LOGOUT
export const logoutUser = async () => {
  await signOut(auth);
};
