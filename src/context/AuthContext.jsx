import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import {
  getIdToken,
  onAuthStateChanged,
  reload,
} from "firebase/auth";
import { logoutUser } from "../services/authService.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setEmailVerified(Boolean(user?.emailVerified));
      setIsAdmin(false);
      try {
        if (user?.emailVerified) {
          const profile = await getDoc(doc(db, "users", user.uid));
          setIsAdmin(profile.data()?.role === "admin");
        }
      } catch (error) {
        console.error("Kullanıcı yetkisi doğrulanamadı:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const syncCurrentUser = async () => {
    const user = auth.currentUser;
    setCurrentUser(user);
    setEmailVerified(Boolean(user?.emailVerified));
    setIsAdmin(false);
    if (user?.emailVerified) {
      const profile = await getDoc(doc(db, "users", user.uid));
      setIsAdmin(profile.data()?.role === "admin");
    }
  };

  const refreshUser = async () => {
    const user = auth.currentUser;
    if (!user) {
      setCurrentUser(null);
      setEmailVerified(false);
      setIsAdmin(false);
      return false;
    }

    await reload(user);
    await getIdToken(user, true);
    setCurrentUser(user);
    setEmailVerified(user.emailVerified);
    if (user.emailVerified) {
      const profile = await getDoc(doc(db, "users", user.uid));
      setIsAdmin(profile.data()?.role === "admin");
    } else {
      setIsAdmin(false);
    }
    return user.emailVerified;
  };

  const value = {
    currentUser,
    emailVerified,
    isAdmin,
    syncCurrentUser,
    refreshUser,
    logoutUser,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
