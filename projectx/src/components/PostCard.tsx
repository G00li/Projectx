"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostWithUser } from "../types/Post";
import { useState } from "react";

interface PostCardProps {
  post: PostWithUser;
  onEdit: (post: PostWithUser, e: React.MouseEvent) => void;
  onDelete: (postId: string, e: React.MouseEvent) => void;
  onSelect: (post: PostWithUser) => void;
  onLike: (postId: string) => void;
  canEdit: boolean;
  isLiked: boolean;
}

export function PostCard({ post, onEdit, onDelete, onSelect, onLike, canEdit, isLiked }: PostCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(post.user);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  
  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/user/${post.userId}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const handleEditClick = (event: Event) => {
    event.preventDefault();
    setIsMenuOpen(false);
    onEdit(post, event as unknown as React.MouseEvent);
  };

  const handleDeleteClick = (event: Event) => {
    event.preventDefault();
    setIsMenuOpen(false);
    onDelete(post.id, event as unknown as React.MouseEvent);
  };

  // Função para buscar dados atualizados do usuário
  const fetchUserData = async (userId: string) => {
    try {
      setIsLoadingUserData(true);
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setIsLoadingUserData(false);
    }
  };

  return (
    <div className="relative group">
      {/* Card do Post */}
      <div 
        className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer relative z-10 group-hover:z-30"
        onClick={() => onSelect(post)}
      >
        {canEdit && (
          <div 
            className="absolute top-4 right-4" 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white/60"
                >
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="18" r="2" />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="right"
                className="bg-gray-900 border border-white/10 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem
                  onSelect={handleEditClick}
                  className="hover:bg-white/10 cursor-pointer gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-400"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={handleDeleteClick}
                  className="hover:bg-white/10 cursor-pointer gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-red-400"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-xl font-bold text-white/90 mb-4">{post.title}</h2>
          
          {/* Área do autor */}
          <div className="flex items-center gap-2 mb-4 relative">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div 
                  className="flex items-center gap-2 cursor-pointer z-20" 
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => fetchUserData(post.userId)}
                >
                  <img
                    src={userData.image || "/icon/profile-icon.svg"}
                    alt={userData.name || "User avatar"}
                    className="h-8 w-8 rounded-full border border-white/10 hover:opacity-80 transition-opacity"
                    onClick={handleUserClick}
                  />
                  <span 
                    className="text-sm text-white/70 hover:text-blue-400 transition-colors"
                    onClick={handleUserClick}
                  >
                    {userData.name}
                  </span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-80 bg-gray-900 border border-white/10 text-white"
                side="right"
                align="start"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={handleUserClick}>
                    <img
                      src={userData.image || "/icon/profile-icon.svg"}
                      alt={userData.name || "User avatar"}
                      className="h-16 w-16 rounded-full hover:opacity-80 transition-opacity border-2 border-blue-500/20"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-white/90 hover:text-blue-400 transition-colors">
                        {userData.name}
                      </h4>
                      <p className="text-sm text-white/60">
                        Membro desde {userData.createdAt ? 
                          new Date(userData.createdAt).toLocaleDateString('pt-BR', {
                            month: 'long',
                            year: 'numeric'
                          }) : 'Data não disponível'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-white/5 rounded-lg p-3">
                    {isLoadingUserData ? (
                      <>
                        <div className="text-center">
                          <div className="h-8 w-16 bg-white/10 rounded animate-pulse mx-auto mb-1"></div>
                          <p className="text-sm text-white/60">Projetos</p>
                        </div>
                        <div className="text-center">
                          <div className="h-8 w-16 bg-white/10 rounded animate-pulse mx-auto mb-1"></div>
                          <p className="text-sm text-white/60">Curtidas</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-400">{userData._count?.posts || 0}</p>
                          <p className="text-sm text-white/60">Projetos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-400">{userData._count?.likes || 0}</p>
                          <p className="text-sm text-white/60">Curtidas</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {userData.github && (
                      <a
                        href={userData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-sm text-white/80 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                    {userData.linkedin && (
                      <a
                        href={userData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-sm text-white/80 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>

                  <button
                    onClick={handleUserClick}
                    className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors text-sm font-medium"
                  >
                    Ver perfil completo
                  </button>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          {/* Descrição truncada */}
          <p className="text-white/70 text-sm mb-4 line-clamp-2">
            {truncateText(post.description, 150)}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
              {post.language}
            </span>
            <span className="flex items-center gap-1 text-white/80">
              {[...Array(post.stars)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-yellow-400"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.id);
              }}
              className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                className={`${isLiked ? "text-red-500" : "text-white/60"}`}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{post.likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 