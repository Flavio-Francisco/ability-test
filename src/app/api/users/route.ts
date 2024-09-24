import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { z } from 'zod';
import { decodedToken } from '@/functions/decodedToken';

export async function GET(request: NextRequest) {
  try {
  
    const token = decodedToken(request)
  

if (token.isAdmin === true) {

      const usuarios = await prisma.user.findMany({
        select: {
         name: true,
         email: true, 
          isAdmin: true,  
        },
      });
  
      return NextResponse.json(usuarios);
} else {
  return NextResponse.json({ error: 'Você não possui permissão para acessar este recurso.' }, { status: 403 });
}
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
  export async function PATCH(request: NextRequest) {
    const type = z.object({
        email: z.string().email(),
        password: z.string(),
        isAdmin: z.boolean(),
        name: z.string(),
        cpf: z.string(),
        birthDate: z.date(),
        phone: z.string(),
      });
        
 
  
      // Recebendo os dados do corpo da requisição
      const body = await request.json();
      const user = type.parse(body);
    try {
    
      const token = decodedToken(request)
      const usuarios = await prisma.user.update({
        where: {
          email:token.sub,
        },
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
export async function DELETE(request: NextRequest) {
 

  try {
  
    const token = decodedToken(request)
    const usuarios = await prisma.user.delete({
      where: {
        email: token.sub,
      }
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}