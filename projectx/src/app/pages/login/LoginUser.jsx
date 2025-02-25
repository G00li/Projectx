"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const ProfileUserPage = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-center min-h-screen border-gray-900">
      <div className="w-1/3 h-auto bg-gray-700 shadow-lg rounded-2xl p-12 text-center">
        {session ? (
          <>
            <img
              src={session.user?.image || ""}
              alt="Foto do usuário"
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-white">
              Bem-vindo, {session.user?.name}!
            </h2>
            <button
              onClick={() => signOut()}
              className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-white">Faça login</h2>
            <button
              onClick={() => signIn("github")}
              className="w-full flex items-center justify-center px-6 py-3 mb-4 text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition"
            >
              <img src="/icon/Github-icon.svg" alt="GitHub Logo" className="w-6 h-6 mr-2" />
              Logar com o GitHub
            </button>
            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              <img src="/icon/Gmail-icon.svg" alt="Google Logo" className="w-6 h-6 mr-2" />
              Logar com o Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileUserPage;
