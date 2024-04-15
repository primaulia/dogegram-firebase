import firebase_app from "@/firebase/config";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";

const db = getFirestore(firebase_app);
export default async function getData() {
  let q = query(collection(db, "restaurants"));

  let results = null;
  let error = null;

  try {
    results = await getDocs(q);
  } catch (e) {
    error = e;
  }

  return { results, error };
}
