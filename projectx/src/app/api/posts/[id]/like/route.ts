import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/auth.config";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await Promise.resolve(context.params); // Aguarda os parâmetros
    
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Verifica se o post existe
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    // Verifica se já existe um like
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId,
        },
      },
    });

    if (existingLike) {
      // Remove o like
      await prisma.$transaction([
        prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        }),
        prisma.post.update({
          where: { id },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        }),
      ]);

      return NextResponse.json({ 
        message: "Like removido com sucesso",
        isLiked: false,
        likeCount: post.likeCount - 1
      });
    }

    // Adiciona novo like
    await prisma.$transaction([
      prisma.like.create({
        data: {
          postId: id,
          userId,
        },
      }),
      prisma.post.update({
        where: { id },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({ 
      message: "Like adicionado com sucesso",
      isLiked: true,
      likeCount: post.likeCount + 1
    });
  } catch (error) {
    console.error("[LIKE_POST]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await Promise.resolve(context.params); // Aguarda os parâmetros
    
    if (!session?.user) {
      return NextResponse.json({ isLiked: false });
    }

    const userId = session.user.id;

    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId,
        },
      },
    });

    return NextResponse.json({ isLiked: !!like });
  } catch (error) {
    console.error("[GET_LIKE_STATUS]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
} 