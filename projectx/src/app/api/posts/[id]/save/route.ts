import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/auth.config";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const postId = params.id;

    // Verifica se o post já está salvo
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: user.id,
        },
      },
    });

    if (existingSave) {
      // Se já estiver salvo, remove
      await prisma.savedPost.delete({
        where: {
          id: existingSave.id,
        },
      });
      return NextResponse.json({ saved: false });
    } else {
      // Se não estiver salvo, salva
      await prisma.savedPost.create({
        data: {
          postId: postId,
          userId: user.id,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Erro ao salvar/remover post:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ saved: false });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ saved: false });
    }

    const postId = params.id;

    const existingSave = await prisma.savedPost.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ saved: !!existingSave });
  } catch (error) {
    console.error("Erro ao verificar status de salvamento:", error);
    return NextResponse.json({ saved: false });
  }
} 