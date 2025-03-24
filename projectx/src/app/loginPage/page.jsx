"use client"

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Seção esquerda com mensagens convidativas */}
      <div className="flex-1 flex flex-col justify-center px-12 space-y-8">
        <h1 className="text-5xl font-bold text-white mb-6">
          Bem-vindo de volta!
        </h1>
        <div className="space-y-6">
          <div className="max-w-xl">
            <h2 className="text-2xl text-gray-300 leading-relaxed">
              "Conecte-se para acessar sua área personalizada e aproveitar todos os recursos exclusivos."
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-1 w-20 bg-blue-500 rounded"></div>
            <p className="text-gray-400">Acesso rápido e seguro</p>
          </div>
          <div className="grid grid-cols-2 gap-6 max-w-xl">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-blue-400 font-semibold mb-2">Personalização</h3>
              <p className="text-gray-400">Experiência única ajustada ao seu perfil</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-blue-400 font-semibold mb-2">Segurança</h3>
              <p className="text-gray-400">Seus dados protegidos com as melhores práticas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar direita com opções de login */}
      <div className="w-[480px] bg-gray-800 p-12 flex flex-col justify-center">
        {session ? (
          <p className="text-white text-center">Redirecionando...</p>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Faça login</h2>
              <p className="text-gray-400">Escolha seu método preferido</p>
            </div>
            
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center px-6 py-4 text-white bg-gray-700 rounded-xl hover:bg-gray-600 transition-all transform hover:scale-105 duration-200"
            >
              <img src="/icon/login/Github-icon.svg" alt="GitHub Logo" className="w-6 h-6 mr-3" />
              Continuar com GitHub
            </button>

            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center px-6 py-4 text-white bg-gray-700 rounded-xl hover:bg-gray-600 transition-all transform hover:scale-105 duration-200"
            >
              <img src="/icon/login/Gmail-icon.svg" alt="Google Logo" className="w-6 h-6 mr-3" />
              Continuar com Google
            </button>

            <p className="text-sm text-gray-400 text-center mt-6">
              Ao fazer login, você concorda com nossos
              <Link href="/terms" className="text-blue-400 hover:underline ml-1">
                Termos de Serviço
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
