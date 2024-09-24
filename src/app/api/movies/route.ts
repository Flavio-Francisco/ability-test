
import { decodedToken } from '@/functions/decodedToken';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../../lib/db';




export async function GET(request: NextRequest) {
    try {
        const token = decodedToken(request)

    if (token) {
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
      
      const { id,title, overview, releaseYear, price, posterPath,rented }  = await request.json();
        const token = decodedToken(request)
   

        if (token) {
            const savedMovie = await prisma.movie.update({
                where: {
                    id
                 },
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
  