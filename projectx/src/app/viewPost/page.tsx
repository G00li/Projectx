"use client";

import { useEffect, useState } from "react";
import { getPosts, deletePost, updatePost } from "@/services/postService";
import { useSession } from "next-auth/react";
import { PostCard } from "@/components/PostCard";
import { PostWithUser } from "../../types/Post";

export default function Posts() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [editingPost, setEditingPost] = useState<PostWithUser | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const CACHE_KEY = 'cached_posts';
  const CACHE_DURATION = 5 * 1000;
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<number>(0);

  const fetchPosts = async () => {
    try {
      const result = await getPosts();
      
      // Compara se há mudanças antes de atualizar o estado
      if (JSON.stringify(result) !== JSON.stringify(posts)) {
        setPosts(result);
        setLastFetchTimestamp(Date.now());
        
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: result,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  };

  useEffect(() => {
    // Carrega dados do cache inicialmente
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      
      if (!isExpired) {
        setPosts(data);
        setLastFetchTimestamp(timestamp);
      } else {
        fetchPosts();
      }
    } else {
      fetchPosts();
    }

    // Configura o intervalo de polling
    const pollInterval = setInterval(fetchPosts, 5000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(pollInterval);
  }, []); // Array de dependências vazio

  const handleDelete = async (postId: string) => {
    setDeletingPostId(postId);
  };

  const confirmDelete = async () => {
    if (!deletingPostId) return;
    
    try {
      await deletePost(deletingPostId);
      setPosts(posts.filter((post: any) => post.id !== deletingPostId));
      setDeletingPostId(null);
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      alert('Erro ao deletar post');
    }
  };

  const handleEdit = async (post: PostWithUser) => {
    setEditingPost(post);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editingPost) {
        throw new Error('Post não encontrado');
      }
      const updatedPost = await updatePost(editingPost.id, editingPost);
      setPosts(posts.map((post: any) => 
        post.id === updatedPost.id ? updatedPost : post
      ));
      setEditingPost(null);
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      alert('Erro ao atualizar post');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-6 lg:p-8 shadow-xl h-full">
          <h1 className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight mb-6">Posts</h1>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={session?.user?.id === post.userId}
              />
            ))}
          </div>
        </div>
      </div>

      {editingPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white/90">Editar Post</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                placeholder="Título"
              />
              <textarea
                value={editingPost.description}
                onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white h-32"
                placeholder="Descrição"
              />
              <input
                type="text"
                value={editingPost.language}
                onChange={(e) => setEditingPost({...editingPost, language: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                placeholder="Linguagem"
              />
              <input
                type="text"
                placeholder="Duração"
                value={editingPost.duration}
                onChange={(e) => setEditingPost({...editingPost, duration: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {deletingPostId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-white/10 shadow-xl">
            <div className="text-center">
              <svg
                className="mx-auto mb-4 text-red-500 w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              
              <h3 className="text-xl font-bold mb-2 text-white/90">Confirmar Exclusão</h3>
              <p className="text-white/70 mb-6">
                Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeletingPostId(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 min-w-[100px]"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 min-w-[100px]"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

