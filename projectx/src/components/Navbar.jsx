"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useSidebar } from '@/context/SidebarContext';

const Navbar = () => {
  const { data: session } = useSession();
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-between items-center z-30 h-[61px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-white/10 backdrop-blur-lg shadow-lg">
      <div className="flex items-center gap-4 px-3 md:px-5">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <Image 
            src="/logo/logo-gray.svg" 
            alt="logo" 
            width={36} 
            height={36}
            className="md:w-[40px] md:h-[40px] transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-gray-200 font-bold text-lg md:text-xl bg-gradient-to-r from-gray-200 to-blue-400 bg-clip-text text-transparent">
            ProjetoX
          </span>
        </Link>
        {/* Botão Toggle apenas para Desktop */}
        {session && (
          <button
            onClick={toggleSidebar}
            className="hidden md:flex relative items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:bg-white/5"
          >
            <Image 
              src="/icon/navBar/menu.svg" 
              alt="Toggle Sidebar" 
              width={24} 
              height={24}
              className="transition-transform duration-300 hover:scale-110"
            />
          </button>
        )}
      </div>

      {/* Usuário autenticado */}
      {session ? (
        <div className="flex items-center gap-2 px-3 md:px-5">
          <Link 
            href="../profile" 
            className="flex items-center gap-2 md:gap-3 group p-2 rounded-xl transition-all duration-300 hover:bg-white/5"
          >
            <span className="hidden md:block text-gray-300 transition-all duration-300 group-hover:text-blue-400">
              {session.user?.name}
            </span>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Image
                src={session.user?.image || "/icon/profile-icon.svg"}
                alt="User Profile"
                width={38}
                height={38}
                className="md:w-[42px] md:h-[42px] rounded-full relative transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>
        </div>
      ) : (
        <div className="px-3 md:px-5">
          <Link
            href="/loginPage"
            className="px-4 md:px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm md:text-base font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105"
          >
            Entrar
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
