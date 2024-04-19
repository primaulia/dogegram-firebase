"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { PowerIcon } from "@heroicons/react/24/outline";
import NavLinks from "@/app/components/NavLinks";
import signOut from "@/firebase/auth/signout";
import { futura } from "@/app/ui/fonts";

// import { onAuthStateChanged } from "@/src/lib/firebase/auth.js";

// function useUserSession(initialUser) {
//   // The initialUser comes from the server via a server component
//   const [user, setUser] = useState(initialUser);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged((authUser) => {
//       setUser(authUser);
//     });

//     return () => unsubscribe();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     onAuthStateChanged((authUser) => {
//       if (user === undefined) return;

//       // refresh when user changed to ease testing
//       if (user?.email !== authUser?.email) {
//         router.refresh();
//       }
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   return user;
// }

export default function SideNav() {
  const user = useAuthContext();
  const router = useRouter();

  const handleLogout = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    signOut();
    router.push("/login");
  };

  const handleLogin = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    router.push("/login");
  };

  useEffect(() => {
    if (user == null) router.refresh();
  }, [user]);

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-yellow-900 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <h1 className={futura.className}>Dogegram</h1>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <button
          className={`flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-lg font-medium hover:bg-yellow-600 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 ${futura.className}`}
          onClick={user ? handleLogout : handleLogin}
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">{user?.email || "Log in"}</div>
        </button>
      </div>
    </div>
  );
}
