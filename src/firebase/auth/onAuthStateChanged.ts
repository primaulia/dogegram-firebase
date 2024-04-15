import firebase_app from "@/firebase/config";
import {
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User,
  getAuth,
} from "firebase/auth";

const auth = getAuth(firebase_app);

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, cb);
}
