"use client";

import { useEffect, useState } from "react";
import { getPosts, deletePost, updatePost } from "@/services/postService";
import { useSession } from "next-auth/react";
import { Post } from "@prisma/client";

export default function Posts() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<(Post & { user: { name: string; image?: string } })[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
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
    if (window.confirm('Tem certeza que deseja deletar este post?')) {
      try {
        await deletePost(postId);
        setPosts(posts.filter((post: any) => post.id !== postId));
      } catch (error) {
        console.error('Erro ao deletar post:', error);
        alert('Erro ao deletar post');
      }
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-600">Editar Post</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                className="w-full p-2 mb-2 border rounded text-black"
                placeholder="Título"
              />
              <textarea
                value={editingPost.description}
                onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
                className="w-full p-2 mb-2 border rounded text-black"
                placeholder="Descrição"
              />
              <input
                type="text"
                value={editingPost.language}
                onChange={(e) => setEditingPost({...editingPost, language: e.target.value})}
                className="w-full p-2 mb-2 border rounded text-black"
                placeholder="Linguagem"
              />
              <input
                type="text"
                placeholder="Duração"
                value={editingPost.duration}
                onChange={(e) => setEditingPost({...editingPost, duration: e.target.value})}
                className="w-full p-2 mb-2 border rounded text-black"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <div key={post.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
            <div className="mt-2">
              <span className="bg-gray-800 px-2 py-1 rounded">{post.language}</span>
              <span className="ml-2">⭐ {post.stars}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              por {post.user.name}
            </div>
            {session?.user?.id === post.userId && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Deletar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

