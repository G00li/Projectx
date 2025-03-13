"use client";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const { sidebarWidth, setSidebarWidth } = useSidebar();
  const [isResizing, setIsResizing] = useState(false);
  const pathname = usePathname();


  const onMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    
    const onMouseMove = (mouseMoveEvent) => {
      const newWidth = Math.min(Math.max(64, mouseMoveEvent.clientX), 300);
      setSidebarWidth(newWidth);
    };
    
    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <>
      <div 
        className="flex flex-col h-[calc(100vh-61px)] fixed left-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-white/10 backdrop-blur-lg shadow-xl will-change-[width]"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <ul className="flex flex-col items-center gap-4 w-full pt-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.key} className={`w-full flex ${sidebarWidth >= 160 ? 'px-4' : 'justify-center'}`}>
                  <Link
                    href={link.href}
                    className={`flex items-center cursor-pointer rounded-xl transition-all duration-300
                      ${sidebarWidth >= 160 
                        ? `w-full justify-start px-4 py-3 ${isActive ? 'bg-blue-500/20' : ''}`
                        : 'w-12 h-12 flex items-center justify-center'
                      }
                    `}
                  >
                    <div 
                      className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                        ${isActive 
                          ? `${sidebarWidth >= 160 ? '' : 'bg-blue-500/20'}`
                          : 'bg-transparent hover:bg-white/5'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center w-6 h-6">
                        <Image 
                          src={link.icon} 
                          alt={`${link.label} icon`} 
                          width={24}
                          height={24}
                          className={`transition-transform duration-300 ${isActive ? 'scale-110 text-blue-400' : 'scale-100'}`}
                        />
                      </div>
                    </div>
                    <span 
                      className={`text-sm whitespace-nowrap transition-all duration-300 overflow-hidden
                        ${isActive ? 'text-blue-400 font-medium' : 'text-gray-400'}
                        ${sidebarWidth >= 160 
                          ? 'opacity-100 w-auto max-w-[150px]' 
                          : 'opacity-0 w-0 max-w-0'
                        }
                      `}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Barra de redimensionamento com efeito hover */}
          <div
            className="absolute right-0 top-0 w-1 h-full cursor-ew-resize group"
            onMouseDown={onMouseDown}
          >
            <div className="absolute inset-y-0 right-0 w-px bg-white/10 transition-all duration-300 group-hover:w-1 group-hover:bg-blue-500/50" />
          </div>

          {/* Efeito de brilho na base */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </div>
      </div>
    </>
  );
};

export default SideBar;