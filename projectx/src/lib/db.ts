import { prisma } from "@/lib/prisma";
import { PostData } from "@/types/Post";
import { getXataClient } from '@/xata';

const xata = getXataClient();

export async function createPost(data:PostData) {
  // Salvar no PostgreSQL (Prisma)
  const post = await prisma.post.create({ data });

  // Indexar no Xata para buscas rápidas
  await xata.db.posts.create({
    id: post.id,
    title: post.title,
    description: post.description,
    language: post.language,
    repoUrl: post.repoUrl,
    duration: post.duration, 
    stars: post.stars,
    createdAt: post.createdAt,
  });

  return post;
}

export { prisma, xata };