import firebase_app from "@/firebase/config";
import { getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out", error);
  }
}
