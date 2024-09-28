
import { decodedToken } from '@/functions/decodedToken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';




export async function GET(request: NextRequest) {
    try {
        const token = decodedToken(request)

    if (token) {
        const movies = await prisma.movie.findMany({
            where: {
               rented: true,
               userId:token.id 
            }
        });
        return NextResponse.json(movies);}
    } catch (error) {
      console.error("Error fetching movies from database:", error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
}
export async function PATCH(request: NextRequest) {
    const{id,rented,userId}= await request.json();
    try {
        const token = decodedToken(request)

    if (token) {
        const movies = await prisma.movie.update({
            where: {
                id: id,
               
            },
            data: {
                rented: rented,
                userId:userId
            }
        });
        return NextResponse.json(movies);}
    } catch (error) {
      console.error("Error fetching movies from database:", error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
}