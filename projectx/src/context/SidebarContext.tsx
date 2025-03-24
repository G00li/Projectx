"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(240);

  const toggleSidebar = () => {
    setSidebarWidth(sidebarWidth === 64 ? 240 : 64);
  };

  return (
    <SidebarContext.Provider value={{ sidebarWidth, setSidebarWidth, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
} 