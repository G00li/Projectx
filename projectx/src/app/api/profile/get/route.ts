import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL (req.url)
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({message: "Email é obrigatório."}, {status: 400})
  }

  try {
    const userProfile = await prisma.user.findUnique({
      where: {email}
    });

    if (!userProfile) {
      return NextResponse.json({message: "Usuário não encontrado"}, {status: 404})
    
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao consultar o perfil do usuário.", error}, {status: 500} );
  }
}
