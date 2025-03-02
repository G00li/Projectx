import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { name, birthDate, address, github, linkedin, email } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        address,
        github,
        linkedin,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
  }
}

