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
    name: string;
    image?: string;
  };
}

export interface PostCardProps {
  post: PostWithUser;
  onEdit?: (post: PostWithUser) => void;
  onDelete?: (postId: string) => void;
  canEdit?: boolean;
}
