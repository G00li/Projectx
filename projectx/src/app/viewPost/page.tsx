"use client";

import { useEffect, useState } from "react";
import { getPosts, deletePost, updatePost } from "@/services/postService";
import { useSession } from "next-auth/react";
import { Post } from "@prisma/client";

export default function Posts() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<(Post & { user: { name: string; image?: string } })[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const CACHE_KEY = 'cached_posts';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

  useEffect(() => {
    const fetchPosts = async () => {
      // Verifica se existe cache
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        // Se o cache não estiver expirado, use os dados do cache
        if (!isExpired) {
          setPosts(data);
          return;
        }
      }

      // Se não houver cache ou estiver expirado, busca novos dados
      const result = await getPosts();
      setPosts(result);

      // Salva os novos dados no cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
    };
    
    fetchPosts();
  }, [CACHE_KEY, CACHE_DURATION]);

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

  const handleEdit = async (post: any) => {
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
            {posts.map((post: any) => (
              <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg transition-all duration-200 hover:bg-white/[0.07]">
                <h2 className="text-xl font-bold text-white/90 mb-2">{post.title}</h2>
                <p className="text-white/70 mb-4">{post.description}</p>
                
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                    {post.language}
                  </span>
                  <div className="flex items-center">
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
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>por {post.user.name}</span>
                    {post.user.image && (
                      <img 
                        src={post.user.image} 
                        alt={post.user.name} 
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                  </div>
                </div>

                {session?.user?.id === post.userId && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex-1"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex-1"
                    >
                      Deletar
                    </button>
                  </div>
                )}
              </div>
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

