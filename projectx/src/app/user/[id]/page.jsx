"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen';

export default function UserProfilePage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                <div className="grid gap-4">
                  {userPosts.map(post => (
                    <div key={post.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium">{post.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">★</span>
                          <span className="text-gray-300">{post.stars}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{post.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="text-gray-400">
                          <span className="font-medium text-blue-400">{post.language}</span>
                        </div>
                        <div className="text-gray-400">
                          <span className="font-medium text-purple-400">{post.duration}</span>
                        </div>
                        <div className="text-gray-400">
                          <span className="font-medium text-green-400">{post._count.likes}</span> curtidas
                        </div>
                        <a
                          href={post.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Ver repositório
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">Nenhum post criado</p>
              )
            ) : (
              likedPosts.length > 0 ? (
                <div className="grid gap-4">
                  {likedPosts.map(post => (
                    <div key={post.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 relative rounded-full overflow-hidden">
                          <Image
                            src={post.user.image || "/icon/profile-icon.svg"}
                            alt={post.user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-gray-300">{post.user.name}</span>
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium">{post.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">★</span>
                          <span className="text-gray-300">{post.stars}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{post.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="text-gray-400">
                          <span className="font-medium text-blue-400">{post.language}</span>
                        </div>
                        <div className="text-gray-400">
                          <span className="font-medium text-purple-400">{post.duration}</span>
                        </div>
                        <div className="text-gray-400">
                          <span className="font-medium text-green-400">{post._count.likes}</span> curtidas
                        </div>
                        <a
                          href={post.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Ver repositório
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">Nenhum post curtido</p>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 