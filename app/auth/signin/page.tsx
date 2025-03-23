"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>

      {/* Google Sign-In Button */}
      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="bg-red-500 text-white px-6 py-2 rounded-lg mb-2"
      >
        Sign in with Google
      </button>

      {/* Credentials Sign-In Button */}
      <button
        onClick={() => signIn("credentials", { callbackUrl })}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        Sign in with Email & Password
      </button>
    </div>
  );
}
