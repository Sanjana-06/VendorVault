'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <main className="h-screen flex items-center justify-center">
      <button
        onClick={() => signIn('google')}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Sign in with Google
      </button>
    </main>
  );
}
