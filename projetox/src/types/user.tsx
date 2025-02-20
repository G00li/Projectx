import { DefaultSession } from "next-auth"; 

export interface User extends DefaultSession["user"] {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  githubUrl?: string; 
  linkedinUrl?: string;
  createdAt: Date; 
  updateAt: Date; 
}