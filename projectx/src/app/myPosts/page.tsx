"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PostCard } from "@/components/PostCard";
import { PostWithUser } from "../../types/Post";
import { getPosts, deletePost, updatePost } from "@/services/postService";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { PostCardSkeleton } from "@/components/PostCardSkeleton";

export default function MyPosts() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [editingPost, setEditingPost] = useState<PostWithUser | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostWithUser | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [showLikesModal, setShowLikesModal] = useState<boolean>(false);
  const [likeUsers, setLikeUsers] = useState<Array<{ id: string; name: string; image: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyPosts = async () => {
    try {
      setIsLoading(true);
      const allPosts = await getPosts();
      // Filtra apenas os posts do usuário logado
      const userPosts = allPosts.filter(
        (post: PostWithUser) => post.userId === session?.user?.id
      ).sort((a: PostWithUser, b: PostWithUser) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setPosts(userPosts);

      // Verifica o status de like para cada post
      if (session?.user) {
        const likeStatusPromises = userPosts.map(async (post: PostWithUser) => {
          const response = await fetch(`/api/posts/${post.id}/like`);
          if (response.ok) {
            const data = await response.json();
            return { postId: post.id, isLiked: data.isLiked };
          }
          return { postId: post.id, isLiked: false };
        });

        const likeStatuses = await Promise.all(likeStatusPromises);
        const newLikedPosts: Record<string, boolean> = {};
        likeStatuses.forEach(({ postId, isLiked }) => {
          newLikedPosts[postId] = isLiked;
        });
        setLikedPosts(newLikedPosts);
      }
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      toast.error('Erro ao carregar seus posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchMyPosts();
    }
  }, [session]);

  const handleDelete = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingPostId(postId);
  };

  const confirmDelete = async () => {
    if (!deletingPostId) return;
    
    try {
      await toast.promise(
        deletePost(deletingPostId),
        {
          loading: 'Deletando post...',
          success: 'Post deletado com sucesso! 🗑️',
          error: 'Erro ao deletar post 😕'
        }
      );
      setPosts(posts.filter((post) => post.id !== deletingPostId));
      setDeletingPostId(null);
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  const handleEdit = async (post: PostWithUser, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPost(post);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editingPost) {
        throw new Error('Post não encontrado');
      }
      
      const updatedPost = await toast.promise(
        updatePost(editingPost.id, editingPost),
        {
          loading: 'Atualizando post...',
          success: 'Post atualizado com sucesso! ✨',
          error: 'Erro ao atualizar post 😕'
        }
      );
      
      setPosts(prevPosts => 
        prevPosts.map(post => post.id === editingPost.id ? updatedPost : post)
      );
      setEditingPost(null);
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
    }
  };

  const handlePostClick = (post: PostWithUser) => {
    setSelectedPost(post);
  };

  const handleLike = async (postId: string) => {
    try {
      if (!session?.user) {
        toast.error('Você precisa estar logado para curtir posts');
        return;
      }

      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao processar like');
      }

      const data = await response.json();
      
      setLikedPosts(prev => ({
        ...prev,
        [postId]: data.isLiked
      }));
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId
            ? { ...post, likeCount: data.likeCount }
            : post
        )
      );

      toast.success(data.isLiked ? 'Post curtido! ❤️' : 'Like removido! 💔');
    } catch (error) {
      console.error('Erro ao dar like:', error);
      toast.error('Erro ao processar like');
    }
  };

  const fetchLikeUsers = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const data = await response.json();
      setLikeUsers(data.users);
      setShowLikesModal(true);
    } catch (error) {
      console.error('Erro ao buscar usuários que curtiram:', error);
      toast.error('Erro ao carregar usuários');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <Toaster position="top-center" />
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-6 lg:p-8 shadow-xl h-full">
          <h1 className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight mb-6">
            Meus Posts
          </h1>
          
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <PostCardSkeleton key={index} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <p>Você ainda não criou nenhum post</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={(post, e) => handleEdit(post, e)}
                  onDelete={(id, e) => handleDelete(id, e)}
                  onSelect={handlePostClick}
                  onLike={handleLike}
                  isLiked={likedPosts[post.id] || false}
                  canEdit={true}
                  onSave={() => {}}
                  isSaved={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl w-full max-w-4xl border border-white/10 shadow-xl overflow-y-auto max-h-[90vh]">
            {/* Cabeçalho */}
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white/90">{selectedPost.title}</h2>
                
                <div className="flex items-center gap-2">
                  <img
                    src={selectedPost.user?.image || "https://github.com/shadcn.png"}
                    alt={selectedPost.user?.name || "User avatar"}
                    className="h-10 w-10 rounded-full border border-white/10"
                  />
                  <div>
                    <p className="text-white/90 font-medium">{selectedPost.user?.name}</p>
                    <p className="text-sm text-white/60">Autor do Projeto</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Botão de like */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleLike(selectedPost.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={likedPosts[selectedPost.id] ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`${likedPosts[selectedPost.id] ? "text-red-500" : "text-white/60"}`}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchLikeUsers(selectedPost.id);
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {selectedPost.likeCount}
                </button>
              </div>
            </div>

            {/* Informações do Projeto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white/60">Linguagem</p>
                  <p className="text-white/90 font-medium">{selectedPost.language}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white/60">Duração</p>
                  <p className="text-white/90 font-medium">{selectedPost.duration}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white/60">Dificuldade</p>
                  <div className="flex gap-1">
                    {[...Array(selectedPost.stars)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {selectedPost.repoUrl && (
                <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Repositório</p>
                    <a 
                      href={selectedPost.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      Ver código no GitHub
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white/90 mb-4">Descrição do Projeto</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                  {selectedPost.description}
                </p>
              </div>

              {selectedPost.code && (
                <div className="bg-gray-950 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white/90 mb-4">Código</h3>
                  <pre className="text-white/90 overflow-x-auto">
                    <code>{selectedPost.code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

      {showLikesModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white/90">Usuários que curtiram</h3>
              <button
                onClick={() => setShowLikesModal(false)}
                className="bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {likeUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center gap-3 bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                  onClick={() => {
                    window.location.href = `/user/${user.id}`;
                    setShowLikesModal(false);
                  }}
                >
                  <img
                    src={user.image || "https://github.com/shadcn.png"}
                    alt={`${user.name}'s avatar`}
                    className="h-10 w-10 rounded-full border border-white/10 group-hover:border-blue-500/50 transition-colors"
                  />
                  <span className="text-white/90 group-hover:text-blue-400 transition-colors">{user.name}</span>
                </div>
              ))}
              {likeUsers.length === 0 && (
                <p className="text-center text-white/60 py-4">Nenhuma curtida ainda</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 