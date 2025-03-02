import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email é obrigatório.' });
  }

  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json(userProfile);
  } catch (error) {
    // Caso haja algum erro na consulta
    return res.status(500).json({ message: 'Erro ao consultar o perfil do usuário.', error });
  }
}
