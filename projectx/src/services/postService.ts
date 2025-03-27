import { Post } from "@prisma/client";

export const getPosts = async () => {
    try {
        console.log('Iniciando requisição para /api/posts');
        const response = await fetch('/api/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store' // Desabilita o cache para debug
        });

        console.log('Status da resposta:', response.status);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta da API não ok:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Erro ao buscar posts: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
        return data;
    } catch (error) {
        console.error('Erro detalhado:', error);
        throw error;
    }
};

  
export const createPost = async (postData: Omit<Post, "createdAt">) => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar post');
  }

  return response.json();
};

export const deletePost = async (postId: string) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao deletar post');
  }
  return await response.json();
};

export const updatePost = async (postId: string, data: any) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar post');
  }
  return await response.json();
};

