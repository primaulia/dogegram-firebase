import firebase_app from "@/firebase/config";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { BreedStore } from "./definitions";
import { TBreed } from "@/lib/definitions";

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
    result = await addDoc(breedsRef, data);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function deleteBreedById(breedId: string, userId: string) {
  let result = null;
  let error = null;

  try {
    const breedRef = doc(db, "breeds", breedId);
    const docSnap = await getDoc(breedRef);
    const data = docSnap.data();

    if (docSnap.exists() && data?.user_id === userId) {
      // ensure deleted data is owned by the user
      result = await deleteDoc(breedRef);
    }
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function deleteBreedByName(breed: TBreed, userId: string) {
  let result = null;
  let error = null;

  try {
    const q =
      breed.type === "sub"
        ? query(
            breedsRef,
            where("user_id", "==", userId),
            where("name", "==", breed.name),
            where("parent", "==", breed.parent)
          )
        : query(
            breedsRef,
            where("user_id", "==", userId),
            where("name", "==", breed.name)
          );
    const querySnapshot = await getDocs(q);
    const deletedBreedId = querySnapshot.docs[0].id;
    result = await deleteDoc(doc(db, "breeds", deletedBreedId));
  } catch (e) {
    error = e;
  }

  return { result, error };
}
