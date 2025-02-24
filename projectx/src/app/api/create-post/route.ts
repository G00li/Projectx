// api/create-post/route.ts (Backend)
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db"; // Prisma para PostgreSQL
import { getXataClient } from "../../xata";  // XataClient para Xata
import { PostData } from "@/types/Post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const data: PostData = req.body;

  try {
    // Criar post no PostgreSQL usando Prisma
    const post = await prisma.post.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        language: data.language,
        repoUrl: data.repoUrl,
        duration: data.duration, 
        stars: data.stars,
        createdAt: new Date(),
      },
    });

    // Usar Xata para indexar o post
    const xata = getXataClient();
    await xata.db.posts.create({
      id: post.id,
      title: post.title,
      description: post.description,
      language: post.language,
      stars: post.stars,
      createdAt: post.createdAt,
    });

    return res.status(200).json(post);
  } catch (error) {
    console.error("Erro ao criar o post:", error);
    return res.status(500).json({ error: "Erro ao criar o post no Xata e PostgreSQL" });
  }
}
