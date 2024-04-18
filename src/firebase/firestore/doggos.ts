import firebase_app from "@/firebase/config";
import {
  query,
  where,
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { DoggoStore } from "./definitions";

const db = getFirestore(firebase_app);
const doggosRef = collection(db, "doggos");

export async function saveDoggoPhoto(data: DoggoStore) {
  let result = null;
  let error = null;

  try {
    result = await addDoc(doggosRef, data);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function getDoggoPhotosByUserId(user_id: string) {
  let result = null;
  let error = null;

  try {
    const q = query(doggosRef, where("user_id", "==", user_id));
    const querySnapshot = await getDocs(q);
    result = querySnapshot.docs;
  } catch (e) {
    error = e;
  }

  return { result, error };
}
