"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen';
import { PostCard } from '@/components/PostCard';
import { useSession } from "next-auth/react";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function UserProfilePage() {
  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPostsMap, setLikedPostsMap] = useState({});
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likeUsers, setLikeUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        console.error('ID não fornecido');
        setError('ID do usuário não fornecido');
        setLoading(false);
        return;
      }

      console.log('Iniciando busca de dados para o usuário:', id);

      try {
        setLoading(true);
        setError(null);

        // Buscar dados do usuário
        console.log('Buscando dados do usuário...');
        const userResponse = await axios.get(`/api/users/${id}`);
        console.log('Resposta dos dados do usuário:', userResponse);
        setUserData(userResponse.data);
        
        // Buscar posts do usuário
        console.log('Buscando posts do usuário...');
        const postsResponse = await axios.get(`/api/users/${id}/posts`);
        console.log('Resposta dos posts:', postsResponse);
        setUserPosts(postsResponse.data);
        
        // Buscar posts curtidos
        console.log('Buscando posts curtidos...');
        const likedResponse = await axios.get(`/api/users/${id}/liked-posts`);
        console.log('Resposta dos posts curtidos:', likedResponse);
        setLikedPosts(likedResponse.data);

      } catch (error) {
        console.error('Erro ao carregar dados:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });

        let errorMessage = 'Erro ao carregar dados do usuário';

        if (error.response) {
          // O servidor respondeu com um status de erro
          errorMessage = error.response.data?.error || 
                        `Erro ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
          // A requisição foi feita mas não houve resposta
          errorMessage = 'Servidor não respondeu à requisição';
        } else {
          // Erro ao configurar a requisição
          errorMessage = error.message;
        }

        setError(errorMessage);
        setUserData(null);
        setUserPosts([]);
        setLikedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handlePostSelect = (post) => {
    console.log('Post selecionado:', post);
    setSelectedPost({
      ...post,
      userId: post.user?.id || post.userId
    });
  };

  const handlePostLike = async (postId) => {
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
      
      // Atualiza o estado dos likes
      setLikedPostsMap(prev => ({
        ...prev,
        [postId]: data.isLiked
      }));
      
      // Atualiza a contagem de likes nos posts
      const updatePosts = (posts) => 
        posts.map(post => 
          post.id === postId 
            ? { ...post, likeCount: data.likeCount }
            : post
        );
      
      setUserPosts(updatePosts(userPosts));
      setLikedPosts(updatePosts(likedPosts));

      // Atualiza o post selecionado se ele existir
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => ({
          ...prev,
          likeCount: data.likeCount
        }));

        // Atualiza a lista de usuários que curtiram
        await fetchLikeUsersWithoutModal(postId);
      }

      // Feedback visual para o usuário
      toast.success(data.isLiked ? 'Post curtido! ❤️' : 'Like removido! 💔', {
        duration: 1500
      });

    } catch (error) {
      console.error('Erro ao processar like:', error);
      toast.error('Erro ao processar like');
    }
  };

  // Verifica o status dos likes quando os posts são carregados
  useEffect(() => {
    const checkLikes = async () => {
      if (!session?.user) return;
      
      const allPosts = [...userPosts, ...likedPosts];
      const likes = {};
      
      for (const post of allPosts) {
        try {
          const response = await fetch(`/api/posts/${post.id}/likes`);
          const data = await response.json();
          likes[post.id] = data.users?.some(user => user.id === session.user.id) || false;
        } catch (error) {
          console.error(`Erro ao verificar like do post ${post.id}:`, error);
        }
      }
      setLikedPostsMap(likes);
    };

    checkLikes();
  }, [userPosts, likedPosts, session]);

  const handlePostEdit = (post, e) => {
    // Implementar lógica de edição se necessário
    console.log('Editar post:', post);
  };

  const handlePostDelete = (postId, e) => {
    // Implementar lógica de deleção se necessário
    console.log('Deletar post:', postId);
  };

  // Função para navegar para o perfil do usuário
  const handleUserProfileClick = (userId) => {
    router.push(`/user/${userId}`);
  };

  const fetchLikeUsers = async (postId) => {
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

  const fetchLikeUsersWithoutModal = async (postId) => {
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

  if (loading) {
    return <LoadingScreen message="Carregando perfil do usuário..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-red-400 text-xl font-semibold mb-2 text-center">
            Erro ao carregar perfil
          </h2>
          <p className="text-red-400 text-center">
            {error}
          </p>
          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Usuário não encontrado</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Seção do Perfil */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-32 h-32">
              <Image
                src={userData.image || "/icon/profile-icon.svg"}
                alt={userData.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-white mb-2">{userData.name}</h1>
              <p className="text-gray-400 mb-4">{userData.email}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {userData.birthDate && (
                  <div className="flex items-center gap-2">
                    <Image src="/icon/profile/calendar-icon.svg" alt="Data" width={16} height={16} />
                    <span className="text-gray-300">
                      {new Date(userData.birthDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                
                {userData.address && (
                  <div className="flex items-center gap-2">
                    <Image src="/icon/profile/address-icon.svg" alt="Endereço" width={16} height={16} />
                    <span className="text-gray-300">{userData.address}</span>
                  </div>
                )}
                
                {userData.github && (
                  <div className="flex items-center gap-2">
                    <Image src="/icon/profile/github-icon.svg" alt="GitHub" width={16} height={16} />
                    <a href={userData.github} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-400 hover:text-blue-300">
                      GitHub
                    </a>
                  </div>
                )}
                
                {userData.linkedin && (
                  <div className="flex items-center gap-2">
                    <Image src="/icon/profile/linkedin-icon.svg" alt="LinkedIn" width={16} height={16} />
                    <a href={userData.linkedin} target="_blank" rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300">
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-center md:justify-start gap-4 text-sm">
                <div className="text-gray-400">
                  <span className="text-white font-semibold">{userData._count?.posts || 0}</span> posts
                </div>
                <div className="text-gray-400">
                  <span className="text-white font-semibold">{userData.totalLikesReceived || 0}</span> curtidas recebidas
                </div>
                <div className="text-gray-400">
                  <span className="text-white font-semibold">{userData._count?.likes || 0}</span> posts curtidos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Posts */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-6 py-4 text-sm font-medium ${
                activeTab === 'posts'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Posts Criados ({userPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 px-6 py-4 text-sm font-medium ${
                activeTab === 'liked'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Posts Curtidos ({likedPosts.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'posts' ? (
              userPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={{
                        ...post,
                        user: {
                          ...userData,
                          id: userData.id
                        },
                        likeCount: post._count?.likes || post.likeCount || 0
                      }}
                      onEdit={handlePostEdit}
                      onDelete={handlePostDelete}
                      onSelect={handlePostSelect}
                      onLike={handlePostLike}
                      canEdit={session?.user?.id === post.userId}
                      isLiked={likedPostsMap[post.id] || false}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">Nenhum post criado</p>
              )
            ) : (
              likedPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {likedPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={{
                        ...post,
                        user: post.user || {
                          ...userData,
                          id: userData.id
                        },
                        likeCount: post._count?.likes || post.likeCount || 0
                      }}
                      onEdit={handlePostEdit}
                      onDelete={handlePostDelete}
                      onSelect={handlePostSelect}
                      onLike={handlePostLike}
                      canEdit={session?.user?.id === post.userId}
                      isLiked={likedPostsMap[post.id] || false}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">Nenhum post curtido</p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Modal de Post Selecionado */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-40"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl w-full max-w-4xl border border-white/10 shadow-xl overflow-y-auto max-h-[90vh]"
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
                      const userId = selectedPost.user?.id || selectedPost.userId;
                      if (userId) {
                        handleUserProfileClick(userId);
                      }
                    }}
                  >
                    <img
                      src={selectedPost.user?.image || "/icon/profile-icon.svg"}
                      alt={selectedPost.user?.name || "User avatar"}
                      className="h-10 w-10 rounded-full border border-white/10"
                    />
                  </div>
                  <div>
                    <p 
                      className="text-white/90 font-medium cursor-pointer hover:text-blue-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const userId = selectedPost.user?.id || selectedPost.userId;
                        if (userId) {
                          handleUserProfileClick(userId);
                        }
                      }}
                    >
                      {selectedPost.user?.name}
                    </p>
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

            {/* Botão de like com visualização de usuários */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePostLike(selectedPost.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={likedPostsMap[selectedPost.id] ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`${likedPostsMap[selectedPost.id] ? "text-red-500" : "text-white/60"}`}
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
                      {selectedPost.likeCount || 0}
                    </span>
                    {selectedPost.likeCount > 0 && (
                      <div className="flex -space-x-2 ml-1">
                        {likeUsers.slice(0, 3).map((user) => (
                          <img
                            key={user.id}
                            src={user.image || "/icon/profile-icon.svg"}
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
            </div>
          </div>
        </div>
      )}

      {/* Modal de Likes */}
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
                <div key={user.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
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

      <Toaster position="top-center" />
    </main>
  );
} 