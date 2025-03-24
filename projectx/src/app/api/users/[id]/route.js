import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  console.log('Recebida requisição GET para usuário:', params.id);

  try {
    const userId = params.id;
    
    if (!userId) {
      console.error('ID do usuário não fornecido nos parâmetros');
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    console.log('Buscando usuário no banco de dados...');
    
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        birthDate: true,
        address: true,
        github: true,
        linkedin: true,
        createdAt: true,
        posts: {
          select: {
            _count: {
              select: {
                likes: true
              }
            }
          }
        },
        _count: {
          select: {
            posts: true,
            likes: true
          }
        }
      }
    });

    console.log('Resultado da busca:', user);

    if (!user) {
      console.log('Usuário não encontrado para o ID:', userId);
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Formatar a data de nascimento se existir
    if (user.birthDate) {
      user.birthDate = user.birthDate.toISOString();
    }

    // Calcular total de curtidas recebidas
    const totalLikesReceived = user?.posts.reduce((sum, post) => sum + post._count.likes, 0);

    // Adicionar o total ao objeto do usuário
    const userWithTotalLikes = {
      ...user,
      totalLikesReceived
    };

    return NextResponse.json(userWithTotalLikes);
  } catch (error) {
    console.error('Erro detalhado ao buscar usuário:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
    });

    // Tratamento específico para erros do Prisma
    if (error.code) {
      switch (error.code) {
        case 'P2001':
          return NextResponse.json(
            { error: 'Registro não encontrado no banco de dados' },
            { status: 404 }
          );
        case 'P2002':
          return NextResponse.json(
            { error: 'Violação de restrição única' },
            { status: 409 }
          );
        case 'P2025':
          return NextResponse.json(
            { error: 'Registro não encontrado para atualização' },
            { status: 404 }
          );
        default:
          return NextResponse.json(
            { error: `Erro do banco de dados: ${error.code}` },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 