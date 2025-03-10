"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@prisma/client";
import { createPost } from "@/services/postService";


export default function CreatePost() {
  const router = useRouter();
  const [postData, setPostData] = useState<Omit<Post, "createdAt">>({
    id: "",
    userId: "",
    title: "",
    description: "",
    language: "",
    repoUrl: "",
    duration: "",
    stars: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost(postData);
      console.log('Post criado com sucesso');
      router.push('/posts');
      router.refresh();
    } catch (error) {
      console.error("Erro:", error);
      alert('Erro ao criar post: ');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-300 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">New post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Título"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        <textarea
          placeholder="Descrição"
          value={postData.description}
          onChange={(e) => setPostData({ ...postData, description: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 text-gray-800"
        />
        <input
          type="text"
          placeholder="Linguagem"
          value={postData.language}
          onChange={(e) => setPostData({ ...postData, language: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        <input
          type="text"
          placeholder="URL do repositório"
          value={postData.repoUrl}
          onChange={(e) => setPostData({ ...postData, repoUrl: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        <input
          type="text"
          placeholder="Duração"
          value={postData.duration}
          onChange={(e) => setPostData({ ...postData, duration: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Create a new post
        </button>
      </form>
    </div>
  );
}
