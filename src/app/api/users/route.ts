import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    // Obtém o token do cabeçalho Authorization
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Assume o formato: Bearer <token>

    if (!token) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Verifica o token JWT
    try {
      jwt.verify(token, process.env.JWT_SECRET as string);  // Substitua pelo seu segredo JWT
    } catch (err) {
      return NextResponse.json({ err }, { status: 403 });
    }

    // Se o token for válido, retorna os usuários
    const usuarios = await prisma.user.findMany({
      select: {
       name: true,
       email: true, 
        isAdmin: true,  
      },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
    const type = z.object({
        email: z.string().email(),
        password: z.string(),
        isAdmin: z.boolean(),
        name: z.string(),
        cpf: z.string(),
        birthDate: z.date(),
        phone: z.string(),
      });
        
 ;
  
      // Recebendo os dados do corpo da requisição
      const body = await request.json();
      const user = type.parse(body);
    try {
    
  
      const usuarios = await prisma.user.create({
        data: {
              email: user.email,
              isAdmin: user.isAdmin,
              name: user.name,
              password: user.password,
              cpf: user.cpf,
              birthDate: user.birthDate,
              phone:user.phone,
              
        },
      });
  
      return NextResponse.json(usuarios);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  