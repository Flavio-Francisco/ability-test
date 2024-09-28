import { decodedToken } from '@/functions/decodedToken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import fs from 'fs';
import path from 'path';

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Obtém todos os filmes disponíveis para aluguel
 *     description: Retorna uma lista de filmes que ainda não foram alugados.
 *     responses:
 *       200:
 *         description: Lista de filmes disponíveis
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
 *       500:
 *         description: Erro ao buscar filmes
 */
export async function GET(request: NextRequest) {
  try {
    const token = decodedToken(request);
    if (token) {
      const movies = await prisma.movie.findMany({
        where: { rented: false }
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
 * /api/movies:
 *   post:
 *     summary: Cria um novo filme
 *     description: Apenas administradores podem adicionar novos filmes ao sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               overview:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *               price:
 *                 type: number
 *               rented:
 *                 type: boolean
 *               poster:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Filme criado com sucesso
 *       401:
 *         description: Acesso negado
 *       500:
 *         description: Erro ao salvar filme
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = decodedToken(request);

    if (!token.isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }

    let posterPath: string | undefined;
    const poster = formData.get('poster');

    if (poster && poster instanceof File) {
      const buffer = Buffer.from(await poster.arrayBuffer());
      const fileName = `foto-${Date.now()}.jpg`; 
      const filePath = path.join(process.cwd(), 'public/image', fileName);
      fs.writeFileSync(filePath, buffer);
      posterPath = `/image/${fileName}`;
    }

    await prisma.movie.create({
      data: {
        title: formData.get('title') as string,
        overview: formData.get('overview') as string,
        releaseYear: Number(formData.get('releaseYear')),
        price: Number(formData.get('price')),
        posterPath: posterPath || "",
        rented: formData.get('rented') === 'true',
      },
    });

    return NextResponse.json({ message: "Filme salvo com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving movie:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/movies:
 *   patch:
 *     summary: Atualiza um filme existente
 *     description: Apenas administradores podem atualizar filmes no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               overview:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *               price:
 *                 type: number
 *               rented:
 *                 type: boolean
 *               poster:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Filme atualizado com sucesso
 *       401:
 *         description: Acesso negado
 *       500:
 *         description: Erro ao atualizar filme
 */
export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = decodedToken(request);

    if (!token.isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }

    let posterPath: string | undefined;
    const poster = formData.get('poster');

    if (poster && poster instanceof File) {
      const buffer = Buffer.from(await poster.arrayBuffer());
      const fileName = `foto-${Date.now()}.jpg`;
      const filePath = path.join(process.cwd(), 'public/image', fileName);
      fs.writeFileSync(filePath, buffer);
      posterPath = `/image/${fileName}`;
    }

    await prisma.movie.update({
      where: { id: Number(formData.get('id') as string) },
      data: {
        title: formData.get('title') as string,
        overview: formData.get('overview') as string,
        releaseYear: Number(formData.get('releaseYear')),
        price: Number(formData.get('price')),
        posterPath: posterPath || undefined,
        rented: formData.get('rented') === 'true',
      },
    });

    return NextResponse.json({ message: "Filme atualizado com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving movie:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/movies:
 *   delete:
 *     summary: Deleta um filme existente
 *     description: Apenas administradores podem deletar filmes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Filme deletado com sucesso
 *       401:
 *         description: Acesso negado
 *       500:
 *         description: Erro ao deletar filme
 */
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const token = decodedToken(request);

    if (token.isAdmin) {
      await prisma.movie.delete({
        where: { id }
      });
      return NextResponse.json({ message: "Filme deletado com sucesso!" }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
