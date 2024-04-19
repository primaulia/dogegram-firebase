"use client";

import { futura } from "@/app/ui/fonts";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import Button from "@/app/components/Button";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useState } from "react";

function SubmitButton({ flow }: { flow: string }) {
  const { pending } = useFormStatus();
  const label = flow === "login" ? "Log in" : "Sign up";

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      {label}
    </Button>
  );
}

function ButtonLink({ flow }: { flow: string }) {
  const label = flow === "login" ? "Sign up" : "Log in";
  const path = flow === "login" ? "signup" : "login";

  return (
    <Link href={`/${path}`}>
      <Button className="mt-2 w-full !bg-white border-solid border-2 border-yellow-600 text-yellow-600 hover:!bg-yellow-100 active:!bg-yellow-300">
        {label}
      </Button>
    </Link>
  );
}

export default function Form({
  handleSubmit,
  flow,
}: {
  handleSubmit: (email: string, password: string) => void;
  flow: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(email, password);
      }}
      className="space-y-3"
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${futura.className} mb-3 text-2xl`}>
          {flow === "login"
            ? "Please log in to continue"
            : "Sign up to receive your daily doggo feed"}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <SubmitButton flow={flow} />
        <ButtonLink flow={flow} />
      </div>
    </form>
  );
}
