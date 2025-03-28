"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { SessionProvider, useSession } from "next-auth/react";
import AuthWrapper from "../components/AuthWrapper";
import CookieConsent from "@/components/CookieConsent";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import SideBar from "@/components/SideBar";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(() => import('../components/GoogleAnalytics'), {
  ssr: false,
  loading: () => null
});

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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex">
        {isAuthenticated && <SideBar />}
        <main 
          className="flex-1 transition-all duration-300"
          style={{ 
            marginLeft: isAuthenticated && !isMobile ? `${sidebarWidth}px` : "0" 
          }}
        >
          <div className={`${isAuthenticated ? 'md:pb-0 pb-[84px]' : ''}`}>
            {children}
          </div>
        </main> 
      </div>
      <CookieConsent />
    </>
  );
}
