import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/auth.config';

// Força a rota a ser dinâmica pois usa sessão
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        cookieConsent: true,
        cookieConsentAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao buscar consentimento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar preferências' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        cookieConsent: data.cookieConsent,
        cookieConsentAt: new Date(data.cookieConsentAt),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erro na atualização:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar preferências' },
      { status: 500 }
    );
  }
}