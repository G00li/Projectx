"use client";

import { useEffect, useState } from "react";
import { PostCard } from "@/components/PostCard";
import { PostWithUser } from "@/types/Post";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SEO from '@/components/SEO/SEO';
import { PostCardSkeleton } from "@/components/PostCardSkeleton";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function SavedPosts() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/bemVindo");
      return;
    }
  }, [status, router]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await fetch("/api/posts/saved");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Erro ao carregar posts salvos:", error);
        toast.error('Erro ao carregar posts salvos');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchSavedPosts();
    }
  }, [session]);

  const handleSave = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: "POST",
      });
      
      if (response.ok) {
        const data = await response.json();
        // Remove o post da lista quando dessalvo
        setPosts(posts.filter(post => post.id !== postId));
        toast.success('Post removido dos salvos! 📑');
      }
    } catch (error) {
      console.error("Erro ao dessalvar post:", error);
      toast.error('Erro ao remover post dos salvos');
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <SEO 
        title="Posts Salvos"
        description="Confira seus posts salvos"
        type="blog"
      />
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
        <Toaster position="top-center" />
        <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-6 lg:p-8 shadow-xl h-full">
            <h1 className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight mb-6">Posts Salvos</h1>
            
            {loading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <PostCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onSelect={() => {}}
                    onLike={() => {}}
                    onSave={handleSave}
                    canEdit={false}
                    isLiked={false}
                    isSaved={true}
                  />
                ))}
                {posts.length === 0 && (
                  <div className="col-span-full text-center py-8 sm:py-12">
                    <div className="bg-white/5 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white/90 mb-2">Nenhum post salvo</h3>
                    <p className="text-sm sm:text-base text-white/60 max-w-md mx-auto px-4">Você ainda não salvou nenhum post. Explore os posts disponíveis e salve os que você gostar!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 