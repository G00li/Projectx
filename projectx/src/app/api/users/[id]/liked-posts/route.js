import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const userId = params.id;
    
    const likedPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId: userId
          }
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        language: true,
        repoUrl: true,
        duration: true,
        stars: true,
        createdAt: true,
        likeCount: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Formatar as datas
    const formattedPosts = likedPosts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Erro ao buscar posts curtidos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar posts curtidos pelo usuário' },
      { status: 500 }
    );
  }
} 