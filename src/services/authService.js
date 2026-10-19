import { auth, db } from "../firebase/firebase.js";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

export const ensureUserProfile = async (user) => {
  if (!user?.emailVerified) {
    throw new Error("Profil oluşturmak için e-posta adresinizi doğrulayın.");
  }

  const userRef = doc(db, "users", user.uid);
  const deletedProfileRef = doc(db, "deletedUserProfiles", user.uid);
  const [userSnapshot, deletedProfileSnapshot] = await Promise.all([
    getDoc(userRef),
    getDoc(deletedProfileRef),
  ]);

  if (!userSnapshot.exists()) {
    const profile = {
      uid: user.uid,
      email: user.email,
      username: user.displayName || user.email?.split("@")[0] || "Kullanıcı",
      photoURL: user.photoURL || "",
      role: "user",
      emailVerified: user.emailVerified,
      createdAt: new Date(),
      favorites: {
        teams: [],
        leagues: [],
        players: [],
        matches: [],
      },
    };
    const batch = writeBatch(db);
    batch.set(userRef, profile);
    if (deletedProfileSnapshot.exists()) batch.delete(deletedProfileRef);
    await batch.commit();
  } else {
    const profile = userSnapshot.data();
    const updates = {};
    if (!profile.role) updates.role = "user";
    if (typeof profile.emailVerified !== "boolean") {
      updates.emailVerified = user.emailVerified;
    } else if (profile.emailVerified !== user.emailVerified) {
      updates.emailVerified = user.emailVerified;
    }
    if (Object.keys(updates).length) {
      await updateDoc(userRef, updates);
    }
    if (deletedProfileSnapshot.exists()) {
      await deleteDoc(deletedProfileRef);
    }
  }
};

// 🔥 REGISTER
export const registerUser = async (email, password, username) => {
  let userCredential;
  try {
    userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
  } catch (error) {
    return { success: false, error: error.message };
  }

  let warning;
  try {
    await updateProfile(userCredential.user, { displayName: username });
  } catch (error) {
    warning = error.message;
  }

  try {
    await sendEmailVerification(userCredential.user);
    return { success: true, emailSent: true, warning };
  } catch (error) {
    return { success: true, emailSent: false, warning: error.message || warning };
  }
};

// 🔥 LOGIN
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (userCredential.user.emailVerified) {
      await ensureUserProfile(userCredential.user);
    }
    return {
      success: true,
      emailVerified: userCredential.user.emailVerified,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const resendVerificationEmail = async (user = auth.currentUser) => {
  if (!user) {
    throw new Error("Doğrulama e-postası göndermek için tekrar giriş yapın.");
  }
  if (user.emailVerified) {
    throw new Error("E-posta adresiniz zaten doğrulanmış.");
  }

  await sendEmailVerification(user);
};

export const requestPasswordReset = async (email) => {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) {
    throw new Error("Önce e-posta adresinizi girin.");
  }

  await sendPasswordResetEmail(auth, normalizedEmail);
};

// 🔥 LOGOUT
export const logoutUser = async () => {
  await signOut(auth);
};
