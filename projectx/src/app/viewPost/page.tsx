"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/services/postService";

export default function Posts() {
  const [posts, setPosts] = useState([]);
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


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <div key={post.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
            <div className="mt-2">
              <span className="bg-gray-200 px-2 py-1 rounded">{post.language}</span>
              <span className="ml-2">⭐ {post.stars}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              por {post.user.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

