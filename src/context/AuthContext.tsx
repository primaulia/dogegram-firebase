import { User } from "firebase/auth";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import firebase_app from "@/firebase/config";
import Loader from "@/app/components/Loader";

const auth = getAuth(firebase_app);

interface AuthContextValue {
  user: User | null; // Replace `any` with the actual user object type
}

export const AuthContext = createContext<AuthContextValue>({ user: null });

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
