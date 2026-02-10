import { db } from "../firebase/firebase";
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
