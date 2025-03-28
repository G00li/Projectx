"use client";

import { useEffect, useState } from "react";
import { getPosts, deletePost, updatePost } from "@/services/postService";
import { useSession } from "next-auth/react";
import { PostCard } from "@/components/PostCard";
import { PostWithUser } from "../../types/Post";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { PostCardSkeleton } from "@/components/PostCardSkeleton";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays, differenceInMonths } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import SEO from '@/components/SEO'

export default function ViewAllPosts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [editingPost, setEditingPost] = useState<PostWithUser | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostWithUser | null>(null);
  const CACHE_KEY = 'cached_posts';
  const CACHE_DURATION = 30 * 1000;
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<number>(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [showLikesModal, setShowLikesModal] = useState<boolean>(false);
  const [likeUsers, setLikeUsers] = useState<Array<{ id: string; name: string; image: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dates, setDates] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/bemVindo");
      return;
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const fetchPosts = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }

      const result = await getPosts();
      
      // Compara os posts existentes com os novos
      const existingPostIds = new Set(posts.map((post: PostWithUser) => post.id));
      const newPosts = result.filter((post: PostWithUser) => !existingPostIds.has(post.id));
      
      if (newPosts.length > 0 || isFirstLoad) {
        // Ordena apenas os novos posts e adiciona ao início
        const sortedNewPosts = newPosts.sort((a: PostWithUser, b: PostWithUser) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const updatedPosts = isFirstLoad ? sortedNewPosts : [...sortedNewPosts, ...posts];
        setPosts(updatedPosts);
        setLastFetchTimestamp(Date.now());
        
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: updatedPosts,
          timestamp: Date.now()
        }));

        // Verifica o status de like apenas para os novos posts
        if (session?.user && newPosts.length > 0) {
          const newLikedPosts: Record<string, boolean> = { ...likedPosts };
          
          await Promise.all(
            newPosts.map(async (post: PostWithUser) => {
              try {
                const response = await fetch(`/api/posts/${post.id}/likes`);
                if (response.ok) {
                  const data = await response.json();
                  newLikedPosts[post.id] = data.users.some(
                    (user: { id: string }) => user.id === session.user?.id
                  );
                }
              } catch (error) {
                console.error(`Erro ao verificar like do post ${post.id}:`, error);
                newLikedPosts[post.id] = false;
              }
            })
          );
          
          setLikedPosts(newLikedPosts);
        }

        // Notifica o usuário sobre novos posts apenas se não for o primeiro carregamento
        if (!isFirstLoad && newPosts.length > 0) {
          toast.success(`${newPosts.length} ${newPosts.length === 1 ? 'novo post adicionado' : 'novos posts adicionados'} 🎉`);
        }
      }

      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      if (!isFirstLoad) {
        toast.error('Erro ao atualizar posts');
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      
      if (!isExpired) {
        setPosts(data);
        setLastFetchTimestamp(timestamp);
        setIsLoading(false);
        // Ainda faz uma verificação em background
        fetchPosts(false);
      } else {
        fetchPosts(true);
      }
    } else {
      fetchPosts(true);
    }

    // Configura o intervalo de polling
    const pollInterval = setInterval(() => fetchPosts(false), 10000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(pollInterval);
  }, []);

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
      setPosts(posts.filter((post: any) => post.id !== deletingPostId));
      setDeletingPostId(null);
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  const handleEdit = async (post: PostWithUser, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPost(post);
    setDates({
      startDate: post.startDate,
      endDate: post.endDate,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editingPost) {
        throw new Error('Post não encontrado');
      }

      if (!dates.startDate || !dates.endDate) {
        toast.error('Por favor, selecione as datas de início e término do projeto');
        return;
      }
      
      const postToUpdate = {
        ...editingPost,
        startDate: dates.startDate,
        endDate: dates.endDate,
      };
      
      const updatedPost = await toast.promise(
        updatePost(editingPost.id, postToUpdate),
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
      setDates({ startDate: undefined, endDate: undefined });
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
      
      // Atualiza o estado local dos likes
      setLikedPosts(prev => ({
        ...prev,
        [postId]: data.isLiked
      }));
      
      // Atualiza a contagem de likes no post
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId
            ? { ...post, likeCount: data.likeCount }
            : post
        )
      );

      setSelectedPost(prev => {
        if (prev && prev.id === postId) {
          return { ...prev, likeCount: data.likeCount };
        }
        return prev;
      });

      toast.success(data.isLiked ? 'Post curtido! ❤️' : 'Like removido! 💔');
    } catch (error) {
      console.error('Erro ao dar like:', error);
      toast.error('Erro ao processar like');
    }
  };

  const checkLikeStatus = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar status do like');
      }

      const data = await response.json();
      return data.isLiked;
    } catch (error) {
      console.error('Erro ao verificar status do like:', error);
      return false;
    }
  };

  const checkAllLikes = async () => {
    try {
      if (!session?.user) return;

      const likeStatuses: Record<string, boolean> = {};
      for (const post of posts) {
        const isLiked = await checkLikeStatus(post.id);
        likeStatuses[post.id] = isLiked;
      }
      setLikedPosts(likeStatuses);
    } catch (error) {
      console.error('Erro ao verificar likes:', error);
    }
  };

  // Adicione este useEffect para verificar os likes quando os posts são carregados
  useEffect(() => {
    if (posts.length > 0 && session?.user) {
      checkAllLikes();
    }
  }, [posts, session]);

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

  const fetchLikeUsersWithoutModal = async (postId: string) => {
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
    } catch (error) {
      console.error('Erro ao buscar usuários que curtiram:', error);
    }
  };

  useEffect(() => {
    if (selectedPost) {
      fetchLikeUsersWithoutModal(selectedPost.id);
    }
  }, [selectedPost]);

  // Adicione esta função para lidar com o fechamento do modal
  const handleCloseModal = () => {
    setSelectedPost(null);
    setLikeUsers([]);
  };

  // Adicione este useEffect para lidar com a tecla Esc
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (selectedPost) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedPost]);

  // Função para calcular e atualizar a duração
  const updateDuration = (start: Date | undefined, end: Date | undefined) => {
    if (start && end) {
      const days = differenceInDays(end, start);
      const months = differenceInMonths(end, start);
      
      let duration = "";
      if (months > 0) {
        duration = `${months} ${months === 1 ? 'mês' : 'meses'}`;
        if (days % 30 > 0) {
          duration += ` e ${days % 30} ${days % 30 === 1 ? 'dia' : 'dias'}`;
        }
      } else {
        duration = `${days} ${days === 1 ? 'dia' : 'dias'}`;
      }
      
      if (editingPost) {
        setEditingPost({ ...editingPost, duration });
      }
    }
  };

  return (
    <>
      <SEO 
        title="Todos os Posts"
        description="Confira todos os posts disponíveis em nossa plataforma"
        type="blog"
      />
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
        <Toaster position="top-center" />
        <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-6 lg:p-8 shadow-xl h-full">
            <h1 className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight mb-6">Posts</h1>
            
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <PostCardSkeleton key={index} />
                ))}
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
                    canEdit={session?.user?.id === post.userId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedPost && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 z-40 overflow-y-auto"
            onClick={handleCloseModal}
          >
            <div 
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8 rounded-2xl w-full max-w-4xl border border-white/10 shadow-xl my-4 sm:my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cabeçalho */}
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-white/90">{selectedPost.title}</h2>
                  
                  <div className="flex items-center gap-2">
                    <div 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/user/${selectedPost.userId}`;
                      }}
                    >
                      <img
                        src={selectedPost.user?.image || "https://github.com/shadcn.png"}
                        alt={selectedPost.user?.name || "User avatar"}
                        className="h-10 w-10 rounded-full border border-white/10"
                      />
                    </div>
                    <div>
                      <p 
                        className="text-white/90 font-medium cursor-pointer hover:text-blue-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/user/${selectedPost.userId}`;
                        }}
                      >
                        {selectedPost.user?.name}
                      </p>
                      <p className="text-sm text-white/60">Autor do Projeto</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
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
                    className="group flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 relative"
                  >
                    <div className="flex items-center">
                      <span className="font-semibold text-white/90 group-hover:text-white mr-2">
                        {selectedPost.likeCount}
                      </span>
                      {selectedPost.likeCount > 0 && (
                        <div className="flex -space-x-2 ml-1">
                          {likeUsers.slice(0, 3).map((user) => (
                            <img
                              key={user.id}
                              src={user.image || "https://github.com/shadcn.png"}
                              alt={`${user.name}'s avatar`}
                              className="w-6 h-6 rounded-full border-2 border-gray-900 transition-transform group-hover:scale-105"
                            />
                          ))}
                          {selectedPost.likeCount > 3 && (
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/80 border-2 border-gray-900">
                              +{selectedPost.likeCount - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Ver quem curtiu
                    </div>
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8 rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl my-4 sm:my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white/90">Editar Projeto</h2>
                <button
                  onClick={() => setEditingPost(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Título do Projeto</label>
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-white placeholder-white/30"
                    placeholder="Digite o título do projeto"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Descrição</label>
                  <textarea
                    value={editingPost.description}
                    onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-white placeholder-white/30 min-h-[120px] resize-y"
                    placeholder="Descreva seu projeto em detalhes"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Linguagem</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editingPost.language}
                        onChange={(e) => setEditingPost({...editingPost, language: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-white placeholder-white/30"
                        placeholder="ex: JavaScript, Python"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Dificuldade</label>
                    <div className="flex items-center justify-center bg-white/5 rounded-lg py-3 border border-white/10">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditingPost({ ...editingPost, stars: star })}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="focus:outline-none p-0.5 hover:scale-110 transition-transform duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className={`w-8 h-8 transition-colors duration-200 ${
                              hoveredStar > 0
                                ? star <= hoveredStar
                                  ? "fill-yellow-400"
                                  : "fill-gray-500"
                                : star <= editingPost.stars
                                  ? "fill-yellow-400"
                                  : "fill-gray-500"
                            }`}
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">URL do GitHub</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editingPost.repoUrl || ''}
                        onChange={(e) => setEditingPost({...editingPost, repoUrl: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-white placeholder-white/30"
                        placeholder="https://github.com/seu-usuario/seu-repo"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/70">Período do Projeto</label>
                    {(dates.startDate || dates.endDate) && (
                      <button
                        type="button"
                        onClick={() => {
                          setDates({ startDate: undefined, endDate: undefined });
                          if (editingPost) {
                            setEditingPost({ ...editingPost, duration: '' });
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 
                        bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Limpar datas
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <DatePicker
                        selected={dates.startDate}
                        onChange={(date: Date | null) => {
                          setDates({ ...dates, startDate: date || undefined });
                          updateDuration(date || undefined, dates.endDate);
                        }}
                        selectsStart
                        startDate={dates.startDate}
                        endDate={dates.endDate}
                        locale={ptBR}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Data de início"
                        className="w-full px-4 py-3 pr-10 rounded-lg bg-white/5 border border-white/10 focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                        maxDate={new Date()}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <DatePicker
                        selected={dates.endDate}
                        onChange={(date: Date | null) => {
                          setDates({ ...dates, endDate: date || undefined });
                          updateDuration(dates.startDate, date || undefined);
                        }}
                        selectsEnd
                        startDate={dates.startDate}
                        endDate={dates.endDate}
                        minDate={dates.startDate}
                        locale={ptBR}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Data de término"
                        className="w-full px-4 py-3 pr-10 rounded-lg bg-white/5 border border-white/10 focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                        maxDate={new Date()}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {(dates.startDate || dates.endDate) && (
                    <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-white/80">
                        Duração calculada: <span className="text-white font-medium">{editingPost?.duration}</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-6 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-white/80 hover:text-white transition-all duration-200 focus:ring-2 focus:ring-white/10"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Salvar Alterações
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-2xl w-full max-w-md border border-white/10 my-4 sm:my-8">
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
                    className="flex items-center gap-3 bg-white/5 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setShowLikesModal(false);
                      router.push(`/user/${user.id}`);
                    }}
                  >
                    <img
                      src={user.image || "/icon/profile-icon.svg"}
                      alt={`${user.name}'s avatar`}
                      className="h-10 w-10 rounded-full border border-white/10"
                    />
                    <span className="text-white/90">{user.name}</span>
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
    </>
  );
}

