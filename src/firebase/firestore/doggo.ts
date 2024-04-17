import firebase_app from "@/firebase/config";
import { getFirestore, collection, addDoc } from "firebase/firestore";
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
