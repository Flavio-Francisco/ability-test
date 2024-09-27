
import { decodedToken } from '@/functions/decodedToken';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../../lib/db';
import fs from 'fs';
import path from 'path';





export async function GET(request: NextRequest) {
    try {
        const token = decodedToken(request)

    if (token.isAdmin) {
        const movies = await prisma.movie.findMany();
        return NextResponse.json(movies);}
    } catch (error) {
      console.error("Error fetching movies from database:", error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
}
export async function POST(request: NextRequest) {
    const type = z.object({
        title: z.string().email(),
        overview: z.string(),
        releaseYear: z.number(),
        price: z.number(),
        posterPath: z.string(),
        rented: z.boolean(),
    
      });
    try {
        const body = await request.json();
      const { title, overview, releaseYear, price, posterPath,rented }  = type.parse(body);
        const token = decodedToken(request)
   

        if (token) {
            const savedMovie = await prisma.movie.create({
                data: {
                    title,
                    overview,
                    releaseYear,
                    price,
                    posterPath,
                    rented
                },
            });
            return NextResponse.json(savedMovie, { status: 201 });
        } else { 
            return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
        }
  
   
    } catch (error) {
      console.error("Error saving movie:", error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } 
  }
  export async function PATCH(request: NextRequest) {
    try {
      const formData = await request.formData();
      const token = decodedToken(request);
  
      if (!token.isAdmin) {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
      }
  
      let posterPath: string | undefined;
  
      // Altere aqui para pegar o arquivo de imagem correto
      const poster = formData.get('poster');
  
      if (poster && poster instanceof File) {
        const buffer = Buffer.from(await poster.arrayBuffer());
        const fileName = `foto-${Date.now()}.jpg`; // Cria um nome único para o arquivo
        const filePath = path.join(process.cwd(), 'public/image', fileName);
        
        // Salva a imagem no sistema de arquivos
        fs.writeFileSync(filePath, buffer);
        posterPath = `/image/${fileName}`; // Armazena apenas o caminho da imagem
      }
  
      // Atualiza o filme no banco de dados
      await prisma.movie.update({
        where: { id: Number(formData.get('id') as string) },
        data: {
          title: formData.get('title') as string,
          overview: formData.get('overview') as string,
          releaseYear: Number(formData.get('releaseYear')),
          price: Number(formData.get('price')),
          posterPath: posterPath || undefined, // Atualiza o caminho da imagem, se fornecido
          rented: formData.get('rented') === 'true', // Converte para booleano
        },
      });
  
      return NextResponse.json({ message: "Filme atualizado com sucesso!" }, { status: 201 });
    } catch (error) {
      console.error("Error saving movie:", error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
  export async function DELETE(request: NextRequest) {
  
    try {
      
      const { id }  = await request.json();
        const token = decodedToken(request)
   

        if (token) {
            const savedMovie = await prisma.movie.delete({
                where: {
                    id
                 }
           
            });
            return NextResponse.json(savedMovie, { status: 201 });
        } else { 
            return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
        }
  
   
    } catch (error) {
      console.error("Error saving movie:", error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } 
  }
  