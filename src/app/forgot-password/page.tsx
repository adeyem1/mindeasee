"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UnifiedLayout } from "@/components/layout/UnifiedLayout";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/services/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Try again.");
    }
    setIsLoading(false);
  };

  return (
    <UnifiedLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-accent/10 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email to receive a password reset link.
            </p>
          </div>
          <div className="mt-8 mx-5 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            {message && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <Link href="/signin" className="font-medium text-primary hover:text-primary">
                Back to Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
}
