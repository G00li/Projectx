"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useSidebar } from '@/context/SidebarContext';

const Navbar = () => {
  const { data: session } = useSession();
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="flex justify-between items-center max-container padding-container relative z-30 py-3 px-5 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo/logo-gray.svg" alt="logo" width={40} height={40} className="ml-2"/>
          <span className="text-gray-200 font-bold text-xl">ProjetoX</span>
        </Link>
        {session && (
          <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
        >
          <Image 
            src="/icon/menu.svg" 
            alt="Toggle Sidebar" 
            width={24} 
            height={24}
          />
        </button>
        )}
      </div>

      {/* Usuário autenticado */}
      {session ? (

        <div className="flex items-center gap-4">
          <Link href="../pages/profile" className="flex items-center gap-2 cursor-pointer mr-5">
            <span className="text-gray-200 pb-1.5 transition-all hover:font-bold">{session.user?.name}</span>
            <Image
              src={session.user?.image || "/icon/profile-icon.svg"}
              alt="User Profile"
              width={42}
              height={42}
              className="rounded-full ml-2"
            />
          </Link>
        </div>
      ) : (
        <Link
          href="/loginPage"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Entrar
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
