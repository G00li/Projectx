import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(context.params);

    const likes = await prisma.like.findMany({
      where: {
        postId: id
      },
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

    const users = likes.map(like => like.user);
    return NextResponse.json({ users });
  } catch (error) {
    console.error("[GET_LIKES_USERS]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
} 