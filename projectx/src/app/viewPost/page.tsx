"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/services/postService";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getPosts();
      setPosts(result);
    };
    
    fetchPosts();
  }, []);

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