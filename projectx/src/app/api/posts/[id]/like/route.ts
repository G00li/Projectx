import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/auth.config";

// Removendo todas as tipagens customizadas e usando apenas o básico
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: { postId: id, userId }
      }
    });

    if (existingLike) {
      const [, updatedPost] = await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id }
        }),
        prisma.post.update({
          where: { id },
          data: { likeCount: { decrement: 1 } },
          select: { likeCount: true }
        })
      ]);

      return NextResponse.json({
        message: "Like removido com sucesso",
        isLiked: false,
        likeCount: updatedPost.likeCount
      });
    }

    const [, updatedPost] = await prisma.$transaction([
      prisma.like.create({
        data: { postId: id, userId }
      }),
      prisma.post.update({
        where: { id },
        data: { likeCount: { increment: 1 } },
        select: { likeCount: true }
      })
    ]);

    return NextResponse.json({
      message: "Like adicionado com sucesso",
      isLiked: true,
      likeCount: updatedPost.likeCount
    });
  } catch (error) {
    console.error("[LIKE_POST]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    const url = new URL(req.url);
    if (url.pathname.endsWith('/likes')) {
      const likes = await prisma.like.findMany({
        where: { postId: id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      });

      return NextResponse.json({ users: likes.map(like => like.user) });
    }

    if (!session?.user) {
      return NextResponse.json({ isLiked: false });
    }

    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: session.user.id
        }
      }
    });

    return NextResponse.json({ isLiked: !!like });
  } catch (error) {
    console.error("[GET_LIKE_STATUS]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
} 