import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth.config";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true
          }
        }
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json({ error: 'Erro ao buscar posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const data = await req.json();
    
    const post = await prisma.post.create({
      data: {
        id: uuidv4(),
        userId: session.user.id,
        title: data.title,
        description: data.description,
        language: data.language,
        repoUrl: data.repoUrl,
        duration: data.duration,
        stars: data.stars || 1,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return NextResponse.json(
      { error: "Erro ao criar post" },
      { status: 500 }
    );
  }
}