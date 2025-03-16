"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { PostCardProps } from "../types/Post";

export function PostCard({ post, onEdit, onDelete, canEdit }: PostCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg transition-all duration-200 hover:bg-white/[0.07] cursor-pointer">
          <h2 className="text-xl font-bold text-white/90 mb-2">{post.title}</h2>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
              {post.language}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full text-l text-white/80 flex items-center gap-1">
              {[...Array(post.stars)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-yellow-400"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </span>
          </div>

          {canEdit && (
            <div className="flex gap-3">
              <button
                onClick={() => onEdit?.(post)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex-1"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete?.(post.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex-1"
              >
                Deletar
              </button>
            </div>
          )}
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
              alt={post.user.name}
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