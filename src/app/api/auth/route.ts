import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const type = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    // Recebendo os dados do corpo da requisição
    const body = await request.json();
    const user = type.parse(body);

    // Consulta no banco de dados
    const userPrisma = await prisma.user.findMany({
      where: { email: user.email },
      select: {
        name: true,
        email: true,
        password: true,
        isAdmin:true,
      },
    });

    if (userPrisma.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const [userAuth] = userPrisma;

    // Validação da senha
    if (user.password !== userAuth.password) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    // Geração do token JWT
    const token = jwt.sign(
      {
        name: userAuth.name,
        isAdmin: userAuth.isAdmin,
       },
      process.env.JWT_SECRET as string,  
      { subject: userAuth.email, expiresIn: '1 days' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
