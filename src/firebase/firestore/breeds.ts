import firebase_app from "@/firebase/config";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { BreedStore } from "./definitions";

const db = getFirestore(firebase_app);
const breedsRef = collection(db, "breeds");

export async function getBreedsByUserId(user_id: string) {
  let result = null;
  let error = null;

  try {
    const q = query(breedsRef, where("user_id", "==", user_id));
    const querySnapshot = await getDocs(q);
    result = querySnapshot.docs;
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function saveBreed(data: BreedStore) {
  let result = null;
  let error = null;

  try {
    await addDoc(breedsRef, data);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
