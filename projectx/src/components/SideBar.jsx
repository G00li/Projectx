"use client";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";

const MOBILE_NAV_LINKS = [
  NAV_LINKS[0], // Todos os posts
  NAV_LINKS[2], // Pesquisar usuários
  NAV_LINKS[1], // Criar post
  NAV_LINKS[3], // Meus posts
];

const MORE_OPTIONS_LINKS = [
  NAV_LINKS[4], // Posts salvos
  NAV_LINKS[5], // Perfil
];

const SideBar = () => {
  const { sidebarWidth, setSidebarWidth } = useSidebar();
  const [isResizing, setIsResizing] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
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
      {/* Versão Desktop */}
      <div 
        className="hidden md:flex flex-col h-[calc(100vh-61px)] fixed left-0 z-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-white/10 backdrop-blur-lg shadow-xl will-change-[width]"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="relative w-full h-full flex flex-col">
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
          
          {/* Botão de Sair */}
          <div className="mt-auto mb-4 w-full px-2">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={`w-full flex items-center cursor-pointer rounded-xl transition-all duration-300
                ${sidebarWidth >= 160 
                  ? 'justify-start px-4 py-3 bg-red-500/20 hover:bg-red-500/30' 
                  : 'w-12 h-12 flex items-center justify-center'
                }
              `}
            >
              <div 
                className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                  ${sidebarWidth >= 160 
                    ? '' 
                    : 'bg-red-500/20 hover:bg-red-500/30'
                  }
                `}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  <Image
                    src="/icon/sidebar/logout.svg"
                    alt="Logout"
                    width={24}
                    height={24}
                    className="transition-transform duration-300 scale-100 text-red-500"
                  />
                </div>
              </div>
              <span 
                className={`text-red-500 text-sm whitespace-nowrap transition-all duration-300 overflow-hidden
                  ${sidebarWidth >= 160 
                    ? 'opacity-100 w-auto max-w-[150px]' 
                    : 'opacity-0 w-0 max-w-0'
                  }
                `}
              >
                Sair
              </span>
            </button>
          </div>

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

      {/* Versão Mobile (FooterBar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-b from-gray-900/95 to-gray-900 border-t border-white/10 backdrop-blur-lg shadow-2xl">
        <div className="absolute -top-px left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        
        <div className="safe-area-bottom">
          <ul className="flex items-center justify-around px-2 py-2">
            {MOBILE_NAV_LINKS.map((link, index) => {
              const isActive = pathname === link.href;
              const isCreatePost = link.key === 'CreatePost';
              
              return (
                <li key={link.key} className={`relative ${isCreatePost ? 'px-1' : 'px-2'} flex-1`}>
                  <Link
                    href={link.href}
                    className={`flex flex-col items-center relative group
                      ${isCreatePost ? '-mt-6' : ''}
                    `}
                  >
                    {isActive && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                    )}
                    
                    <div className={`relative flex items-center justify-center transition-all duration-300 group-active:scale-90 mb-1.5
                      ${isCreatePost 
                        ? 'w-16 h-16 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50' 
                        : 'w-12 h-12 rounded-2xl ' + (isActive ? 'bg-blue-500/20' : 'hover:bg-white/5')
                      }
                    `}>
                      <Image 
                        src={link.icon} 
                        alt={`${link.label} icon`} 
                        width={isCreatePost ? 28 : 24}
                        height={isCreatePost ? 28 : 24}
                        className={`transition-all duration-300 
                          ${isActive || isCreatePost
                            ? 'scale-110 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]' 
                            : 'scale-100 opacity-70 group-hover:opacity-100'
                          }
                        `}
                      />
                    </div>
                    <span className={`text-[11px] font-medium transition-all duration-300 text-center leading-tight min-h-[24px] px-1
                      ${isActive 
                        ? 'text-blue-400 drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]' 
                        : 'text-gray-400 group-hover:text-gray-300'
                      }
                    `}>
                      {isCreatePost ? 'Criar Post' : link.label.replace('Usuários', 'Users')}
                    </span>
                  </Link>
                </li>
              );
            })}

            {/* Botão Mais Opções */}
            <li className="relative px-2 flex-1">
              <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="flex flex-col items-center relative group w-full"
              >
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group-active:scale-90 mb-1.5
                  ${showMoreOptions ? 'bg-blue-500/20' : 'hover:bg-white/5'}
                `}>
                  <Image 
                    src="/icon/sidebar/more-options.svg"
                    alt="Mais opções"
                    width={24}
                    height={24}
                    className="transition-all duration-300 opacity-70 group-hover:opacity-100"
                  />
                </div>
                <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-300 text-center leading-tight min-h-[24px]">
                  Mais
                </span>
              </button>

              {/* Menu de Mais Opções */}
              {showMoreOptions && (
                <div className="absolute bottom-full mb-2 right-0 min-w-[200px] bg-gray-900 rounded-xl border border-white/10 shadow-xl">
                  <div className="py-2">
                    {MORE_OPTIONS_LINKS.map((link) => (
                      <Link
                        key={link.key}
                        href={link.href}
                        onClick={() => setShowMoreOptions(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                      >
                        <Image 
                          src={link.icon}
                          alt={link.label}
                          width={20}
                          height={20}
                          className="opacity-70"
                        />
                        <span className="text-sm text-gray-300">{link.label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-red-400"
                    >
                      <Image 
                        src="/icon/sidebar/logout.svg"
                        alt="Sair"
                        width={20}
                        height={20}
                        className="opacity-70"
                      />
                      <span className="text-sm">Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay para fechar o menu mais opções */}
      {showMoreOptions && (
        <div 
          className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm"
          onClick={() => setShowMoreOptions(false)}
        />
      )}
    </>
  );
};

export default SideBar;