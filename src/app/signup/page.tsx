"use client";

import Form from "@/app/components/Form";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleFormSubmit = async (email: string, password: string) => {
    const { error } = await signUp(email, password);

    if (error) {
      return console.error(error);
    }

    return router.push("/");
  };

  return (
    <div className="relative mx-auto h-full flex justify-center items-center w-full max-w-[400px] space-y-2.5 md:p-4">
      <Form handleSubmit={handleFormSubmit} flow="signup" />
    </div>
  );
}
