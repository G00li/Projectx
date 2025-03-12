"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { SessionProvider, useSession } from "next-auth/react";
import AuthWrapper from "../components/AuthWrapper";
import CookieConsent from "@/components/CookieConsent";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import SideBar from "@/components/SideBar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <AuthWrapper>
            <SidebarProvider>
              <RootLayoutContent>{children}</RootLayoutContent>
            </SidebarProvider>
          </AuthWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { sidebarWidth } = useSidebar();
  const {status} = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <>
      <Navbar />
      <div className="flex">
        {isAuthenticated && <SideBar />}
        <main 
          className="flex-1 p-4"
          style={{ marginLeft: isAuthenticated ? `${sidebarWidth}px` : "2" }}
        >
          {children}
        </main> 
      </div>
      <CookieConsent />
    </>
  );
}
