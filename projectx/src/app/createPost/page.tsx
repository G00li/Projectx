"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@prisma/client";
import { createPost } from "@/services/postService";
import { useSession } from "next-auth/react";

export default function CreatePost() {
  const router = useRouter();
  const { data: session } = useSession();

  const [postData, setPostData] = useState<Omit<Post, "createdAt">>({
    id: crypto.randomUUID(), // Gerando um ID único
    userId: session?.user?.id || "", // Pegando o ID do usuário da sessão
    title: "",
    description: "",
    language: "",
    repoUrl: "",
    duration: "",
    stars: 1,
  });

  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!postData.title || !postData.description || !postData.language) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      await createPost(postData);
      router.push('/viewPost/');
      router.refresh();
    } catch (error) {
      console.error("Erro:", error);
      alert('Erro ao criar post: ' + error);
    }
  };

  const StarRating = () => {
    return (
      <div className="space-y-2">
        <label className="text font-medium text-white/80 flex items-center gap-2 justify-center">
          Dificuldade
        </label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setPostData({ ...postData, stars: star })}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="focus:outline-none p-0.5 hover:scale-110 transition-transform duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`w-8 h-8 transition-colors duration-200 ${
                  star <= (hoveredStar || postData.stars)
                    ? "fill-yellow-400"
                    : "fill-gray-500"
                }`}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-6 lg:p-8 shadow-xl h-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight text-center sm:text-left">
              Criar Novo Post
            </h1>
          </div>

          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-white/80 flex items-center gap-2">
                    Título *
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Digite o título do seu projeto"
                    value={postData.title}
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="language" className="text-sm font-medium text-white/80 flex items-center gap-2">
                    Linguagem *
                  </label>
                  <input
                    id="language"
                    type="text"
                    placeholder="Ex: JavaScript, Python, Java..."
                    value={postData.language}
                    onChange={(e) => setPostData({ ...postData, language: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description" className="text-sm font-medium text-white/80 flex items-center gap-2">
                    Descrição *
                  </label>
                  <textarea
                    id="description"
                    placeholder="Descreva seu projeto detalhadamente"
                    value={postData.description}
                    onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white h-32"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="repoUrl" className="text-sm font-medium text-white/80 flex items-center gap-2">
                    URL do Repositório
                  </label>
                  <input
                    id="repoUrl"
                    type="url"
                    placeholder="https://github.com/seu-usuario/seu-repo"
                    value={postData.repoUrl}
                    onChange={(e) => setPostData({ ...postData, repoUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                    
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium text-white/80 flex items-center gap-2">
                    Duração do Projeto *
                  </label>
                  <input
                    id="duration"
                    type="text"
                    placeholder="Ex: 2 semanas, 3 meses..."
                    value={postData.duration}
                    onChange={(e) => setPostData({ ...postData, duration: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                    required
                  />
                </div>
                <div className="flex flex-1 md:col-span-2 items-center justify-center">
                  <StarRating />
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 
                  to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                  transition-all duration-200 text-sm sm:text-base"
                >
                  Criar Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
