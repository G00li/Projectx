import NextAuth from "next-auth";
import { User as PrismaUser } from "@prisma/client";

// Estendendo os tipos do NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;  // Adiciona o campo id à sessão
      email: string;
      name?: string | null;
      image?: string | null;
    } & PrismaUser; // Adiciona os outros campos do modelo User
  }

  interface User {
    id: string;
  }
}
