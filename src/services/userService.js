import { db } from "../firebase/firebase.js";
import { doc,setDoc,getDoc,updateDoc,arrayUnion } from "firebase/firestore";

export const createUserDoc = async (user, username)=>{
  await setDoc(doc(db,"users",user.uid),{
    username: username,
    email: user.email,
    createdAt: new Date(),
    favorites:{
      teams:[],
      leagues:[],
      players:[],
      matches:[]
    }
  });
};

export const getUserData = async (uid)=>{
  const snap = await getDoc(doc(db,"users",uid));
  return snap.data();
};

export const addFavorite = async (uid,type,item)=>{
  const ref = doc(db,"users",uid);

  await updateDoc(ref,{
    [`favorites.${type}`]: arrayUnion(item)
  });
};

export const removeFav = async (uid, itemID, itemType, idField = "id") => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const favorites = snap.data().favorites?.[itemType] || [];
  const updated = favorites.filter((item) => item[idField] !== itemID);

  await updateDoc(ref, {
    [`favorites.${itemType}`]: updated,
  });

  return updated;
};