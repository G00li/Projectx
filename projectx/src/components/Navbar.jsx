"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center max-container padding-container relative z-30 py-3 px-5 border-b border-gray-700">
      {/* Logo */}
      <Link href="/">
        <Image src="/logo/logo-gray.svg" alt="logo" width={40} height={40} />
      </Link>

      {/* Usuário autenticado */}
      {session ? (

        <div className="flex items-center gap-4">
          <ul className="hidden h-full gap-12 lg:flex items-center mr-10">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-gray-50 cursor-pointer pb-1.5 transition-all hover:font-bold"
                >
                  <Image src={link.icon} alt={`${link.label} icon`} width={20} height={20} />
                  <span className="hidden sm:block">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <span className="text-gray-200">{session.user?.name}</span>
          <Image
            src={session.user?.image || "/icon/profile-icon.svg"}
            alt="User Profile"
            width={32}
            height={32}
            className="rounded-full"
          />
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Sair
          </button>
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
