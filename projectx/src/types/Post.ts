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
  startDate: Date;
  endDate: Date;
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
