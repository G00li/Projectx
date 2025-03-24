import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Força a rota a ser dinâmica pois usa parâmetros de busca
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Usando nextUrl.searchParams em vez de new URL()
    const query = request.nextUrl.searchParams.get('q') || '';

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
      },
      take: 50,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : 'Erro desconhecido');

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erro interno ao buscar usuários'
      },
      { status: 500 }
    );
  }
} 