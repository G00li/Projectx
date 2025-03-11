"use client";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';

const SideBar = () => {
  const { sidebarWidth, setSidebarWidth } = useSidebar();
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (mouseMoveEvent) => {
      const newWidth = mouseMoveEvent.clientX;
      if (newWidth >= 64 && newWidth <= 300) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div 
        className="flex flex-col h-[calc(100vh-61px)] fixed left-0 bg-gray-900 border-r border-gray-700"
        style={{ width: `${sidebarWidth}px` }}
      >
        <ul className="flex flex-col items-center gap-6 w-full pt-8">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-gray-50 cursor-pointer pb-1.5 transition-all hover:font-bold text-xs md:text-base"
              >
                <Image src={link.icon} alt={`${link.label} icon`} width={20} height={20} className="hover:scale-110 transition-all" />
                {sidebarWidth >= 160 && (
                  <span className="text-center">{link.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div
          className="absolute right-0 top-0 w-1 h-full cursor-ew-resize hover:bg-blue-500 transition-colors"
          onMouseDown={startResizing}
        />
      </div>
      {isResizing && (
        <div className="fixed inset-0 cursor-ew-resize" style={{ zIndex: 9999 }} />
      )}
    </>
  );
};

export default SideBar;