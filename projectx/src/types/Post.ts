import { Post } from "@prisma/client";

export interface PostData {
  id: string;
  userId: string;
  title: string;
  description: string;
  language: string;
  repoUrl: string;
  duration: string;
  stars: number;
  createdAt?: Date;
}

export interface PostWithUser extends Post {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: Date | null;
    _count?: {
      posts: number;
      likes: number;
    };
    github?: string | null;
    linkedin?: string | null;
  };
  code?: string;
  likeCount: number;
}

export interface PostCardProps {
  post: PostWithUser;
  onEdit?: (post: PostWithUser) => void;
  onDelete?: (postId: string) => void;
  canEdit?: boolean;
}

// const handleLike = async (postId: string) => {
//   try {
//     const response = await fetch(`/api/posts/${postId}/like`, {
//       method: 'POST',
//     });
    
//     if (response.ok) {
//       // Atualizar o estado local do post
//       // Você pode fazer isso recarregando os posts ou atualizando o estado localmente
//     }
//   } catch (error) {
//     console.error('Erro ao dar like:', error);
//   }
// };

// // Verificar se o usuário atual deu like no post
// const checkLikeStatus = async (postId: string) => {
//   try {
//     const response = await fetch(`/api/posts/${postId}/like`);
//     const data = await response.json();
//     return data.isLiked;
//   } catch (error) {
//     console.error('Erro ao verificar status do like:', error);
//     return false;
//   }
// };
