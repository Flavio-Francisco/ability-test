import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../../lib/db';
import jwt from 'jsonwebtoken';
import { User } from '@/types/user';


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
        id: true,
        name: true,
        email: true,
        password: true,
        isAdmin: true,
    
      },
    });

    if (userPrisma.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const [userAuth] = userPrisma;

    
    if (user.password !== userAuth.password) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    
    const token = jwt.sign(
      {
        id: userAuth.id,
        name: userAuth.name,
        isAdmin: userAuth.isAdmin,
       },
      process.env.JWT_SECRET as string,  
      { subject: userAuth.email, expiresIn: '1 days' }
    );
    const data: User = {
      id: userAuth.id,
      email: userAuth.email,
      name: userAuth.name,
      adm: userAuth.isAdmin,
      token: token
      
}
    return NextResponse.json( data );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
