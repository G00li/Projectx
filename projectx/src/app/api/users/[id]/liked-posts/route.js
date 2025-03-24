import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    // Aguarda os parâmetros serem resolvidos
    const { id } = await params;
    
    const likedPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId: id
          }
        }
      },
      include: {
        user: true,
        likes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Adiciona a contagem de likes para cada post
    const postsWithLikeCount = likedPosts.map(post => ({
      ...post,
      likeCount: post.likes.length
    }));

    return new Response(JSON.stringify(postsWithLikeCount), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Erro ao buscar posts curtidos:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar posts curtidos' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
} 