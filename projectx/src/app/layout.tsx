"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { SessionProvider, useSession } from "next-auth/react";
import AuthWrapper from "../components/AuthWrapper";
import CookieConsent from "@/components/CookieConsent";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import SideBar from "@/components/SideBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <title>Projeto X</title>
      </head>

      <body className={`${inter.variable} antialiased pt-[61px]`}>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="32bcc95d-cdca-4f1c-8025-ebc8ff9b0234"></script>
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
          className="flex-1"
          style={{ marginLeft: isAuthenticated ? `${sidebarWidth}px` : "2" }}
        >
          {children}
        </main> 
      </div>
      <CookieConsent />
    </>
  );
}
