"use client";

import SideBar from "@/components/SideBar";
import { useSidebar } from "@/context/SidebarContext";

export default function HomePageContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const { sidebarWidth } = useSidebar();

  return (
    <>
      <h1>Olá Mundo</h1>
    </>    
  );

}
