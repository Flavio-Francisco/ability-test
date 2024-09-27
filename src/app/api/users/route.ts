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
          id: true,
          name: true,
          email: true, 
          isAdmin: true, 
          cpf: true,
          birthDate: true,
          phone: true,
          password:true
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

  const token = decodedToken(request)
  

  
    const type = z.object({
        email: z.string().email(),
        password: z.string(),
        isAdmin: z.boolean(),
        name: z.string(),
        cpf: z.string(),
        birthDate: z.string(),
        phone: z.string(),
      });
        
 
  
   
      const body = await request.json();
      const user = type.parse(body);
  
  
    try {
    
      if (token.isAdmin === true) {

        const data =await prisma.user.findUnique({
                    where: { email: user.email },
                  })

       if (data?.email) {
        return NextResponse.json({message:"já existe um usuário com esse E-mail"});
       }else { await prisma.user.create({
          data: {
                email: user.email,
                isAdmin: user.isAdmin,
                name: user.name,
                password: user.password,
                cpf: user.cpf,
                birthDate: new Date(user.birthDate),
                phone:user.phone,
           
          },
        });}
    
        return NextResponse.json({message:"Usuário Criado com sucesso"});
      } else {
        return NextResponse.json({message:"Usuário não é administrador"}, { status: 403 });
       }
     
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
        birthDate: z.string(),
        phone: z.string(),
      });
        
 
  
   
      const body = await request.json();
  const user = type.parse(body);
  console.log(user);
  
    try {
    
      const token = decodedToken(request)
      
      if (token.isAdmin === true) {
         await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            email: user.email,
            isAdmin: user.isAdmin,
            name: user.name,
            password: user.password,
            cpf: user.cpf,
            birthDate: new Date(user.birthDate),
            phone: user.phone,
              
          },
        });
  
        return NextResponse.json({message:"usuário atualizado  com sucess!!"});
      } else {
        return NextResponse.json({ error: 'Você não possui permissão para acessar este recurso.' }, { status: 403 });
      }
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
}
export async function DELETE(request: NextRequest) {
 
const {id} = await request.json();
  try {
  
    const token = decodedToken(request)
    if (token.isAdmin) {
     const user= await prisma.user.delete({
        where: {
          id: id,
        }
      });
      return NextResponse.json({message:`Usuário ${user.name} deletado com sucesso!!`});
    }
   
    
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}