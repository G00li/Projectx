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
  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/user/${post.userId}`;
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer relative"
             onClick={() => onSelect(post)}>
          {canEdit && (
            <div 
              className="absolute top-4 right-4" 
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <DropdownMenu modal={false}>
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
                  className="bg-gray-900 border-white/10 text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      onEdit(post, e as any);
                    }}
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
                    onSelect={(e) => {
                      e.preventDefault();
                      onDelete(post.id, e as any);
                    }}
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

          <div onClick={() => onSelect(post)}>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white/90 mb-4">{post.title}</h2>
              
              <div className="flex items-center gap-2 mb-4">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <img
                      src={post.user.image || "https://github.com/shadcn.png"}
                      alt={post.user.name || "User avatar"}
                      className="h-8 w-8 rounded-full border border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={handleUserClick}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-gray-900 border border-white/10 text-white">
                    <div className="flex justify-between space-x-4">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={handleUserClick}>
                        <img
                          src={post.user.image || "https://github.com/shadcn.png"}
                          alt={post.user.name || "User avatar"}
                          className="h-12 w-12 rounded-full hover:opacity-80 transition-opacity"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-white/90 hover:text-blue-400 transition-colors">{post.user.name}</h4>
                          <p className="text-xs text-white/60">Membro desde {post.user.createdAt ? new Date(post.user.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }).replace(/\bof\b/g, 'de') : 'Data não disponível'}</p>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <span 
                  className="text-sm text-white/70 cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={handleUserClick}
                >
                  {post.user.name}
                </span>
              </div>

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
      </HoverCardTrigger>
      <HoverCardContent className="w-96 bg-gray-900 border border-white/10 text-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">{post.title}</h4>
            <p className="text-sm text-white/80">{post.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">{post.language}</span>
            <div className="flex items-center gap-1">
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
            </div>
          </div>

          <div className="text-xs text-white/60">
            <span>Duração: {post.duration}</span>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            <img
              src={post.user.image || "https://github.com/shadcn.png"}
              alt={post.user.name || "User avatar"}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium text-white/90">{post.user.name}</p>
              <p className="text-xs text-white/60">Autor do Post</p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
} 