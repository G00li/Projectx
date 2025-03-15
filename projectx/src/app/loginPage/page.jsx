"use client"

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen border-gray-900">
      <div className="w-1/3 h-auto bg-gray-700 shadow-lg rounded-2xl p-12 text-center">
        {session ? (
          <p className="text-white">Redirecionando...</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-white">Faça login</h2>
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center px-6 py-3 mb-4 text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition"
            >
              <img src="/icon/login/Github-icon.svg" alt="GitHub Logo" className="w-6 h-6 mr-2" />
              Entrar com GitHub
            </button>

            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center px-6 py-3 mb-4 text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition"
            >
              <img src="/icon/login/Gmail-icon.svg" alt="Google Logo" className="w-6 h-6 mr-2" />
              Entrar com Google
            </button>

          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
