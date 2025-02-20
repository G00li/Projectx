export interface Post {
  id: string; 
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  techTags: string[]; 
  mediaUrls: string[];
  likes: number; 
  comments: number; 
  createdAt: Date; 
  updateAt: Date; 
}