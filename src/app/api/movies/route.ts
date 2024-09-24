
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


const prisma = new PrismaClient();

export async function GET() {
    try {
      // Obter todos os filmes salvos
      const movies = await prisma.movie.findMany();
  
      return NextResponse.json(movies);
    } catch (error) {
      console.error("Error fetching movies from database:", error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
}
export async function POST(req: Request) {
    try {
      const { title, overview, releaseYear, price, posterPath } = await req.json();
  
      // Salvar o filme no banco de dados
      const savedMovie = await prisma.movie.create({
        data: {
          title,
          overview,
          releaseYear,
          price,
          posterPath, // URL da imagem ou caminho do arquivo no servidor
        },
      });
  
      return NextResponse.json(savedMovie, { status: 201 });
    } catch (error) {
      console.error("Error saving movie:", error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  