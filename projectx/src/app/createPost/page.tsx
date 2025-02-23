// Frontend: src/app/createPost/page.tsx
"use client"

import { useState } from "react";
import { PostData } from "@/types/Post";
import { createPost } from "@/services/postService";

export default function CreatePost() {
  const [postData, setPostData] = useState<PostData>({
    id: "",
    userId: "",  // Isso deve ser preenchido com o ID do usuário autenticado
    title: "",
    description: "",
    language: "",
    repoUrl: "",
    duration: "",
    stars: 1,
    createdAt: new Date(),  // O Prisma irá ignorar esse campo
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createPost(postData);  // Envia para a API
      console.log("Post criado:", response);
    } catch (error) {
      console.error("Erro ao criar o post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={postData.title}
        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
      />
      <textarea
        placeholder="Descrição"
        value={postData.description}
        onChange={(e) => setPostData({ ...postData, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Linguagem"
        value={postData.language}
        onChange={(e) => setPostData({ ...postData, language: e.target.value })}
      />
      <input
        type="text"
        placeholder="URL do repositório"
        value={postData.repoUrl}
        onChange={(e) => setPostData({ ...postData, repoUrl: e.target.value })}
      />
      <input
        type="text"
        placeholder="Duração"
        value={postData.duration}
        onChange={(e) => setPostData({ ...postData, duration: e.target.value })}
      />
      <button type="submit">Criar Post</button>
    </form>
  );
}
