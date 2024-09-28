import { decodedToken } from '@/functions/decodedToken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

/**
 * @swagger
 * /api/rented-movies:
 *   get:
 *     summary: Obtém todos os filmes alugados por um usuário
 *     description: Retorna uma lista de filmes alugados pelo usuário autenticado.
 *     responses:
 *       200:
 *         description: Lista de filmes alugados pelo usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   overview:
 *                     type: string
 *                   releaseYear:
 *                     type: integer
 *                   price:
 *                     type: number
 *                   posterPath:
 *                     type: string
 *                   rented:
 *                     type: boolean
 *                   userId:
 *                     type: integer
 *       500:
 *         description: Erro ao buscar filmes
 */
export async function GET(request: NextRequest) {
  try {
    const token = decodedToken(request);

    if (token) {
      const movies = await prisma.movie.findMany({
        where: {
          rented: true,
          userId: token.id
        }
      });
      return NextResponse.json(movies);
    }
  } catch (error) {
    console.error("Error fetching movies from database:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * @swagger
 * /api/rented-movies:
 *   patch:
 *     summary: Atualiza o status de aluguel de um filme
 *     description: Atualiza o status de alugado (`rented`) e o ID do usuário (`userId`) do filme.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               rented:
 *                 type: boolean
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar o filme
 */
export async function PATCH(request: NextRequest) {
  const { id, rented, userId } = await request.json();

  try {
    const token = decodedToken(request);

    if (token) {
      await prisma.movie.update({
        where: {
          id: id,
        },
        data: {
          rented: rented,
          userId: userId
        }
      });
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error updating movie in database:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
