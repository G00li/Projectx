"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { SessionProvider } from "next-auth/react";
import AuthWrapper from "../components/AuthWrapper";
import CookieConsent from "@/components/CookieConsent";
import SideBar from "@/components/SideBar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

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

  return (
    <>
      <Navbar />
      <div className="flex">
        <SideBar />
        <main 
          className="flex-1 p-4" 
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          {children}
        </main>
      </div>
      <CookieConsent />
    </>
  );
}
