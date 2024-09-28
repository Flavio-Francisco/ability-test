import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { z } from 'zod';
import { decodedToken } from '@/functions/decodedToken';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtém todos os usuários
 *     description: Retorna uma lista de todos os usuários cadastrados, acessível apenas para administradores.
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   isAdmin:
 *                     type: boolean
 *                   cpf:
 *                     type: string
 *                   birthDate:
 *                     type: string
 *                     format: date
 *                   phone:
 *                     type: string
 *                   password:
 *                     type: string
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro ao buscar usuários
 */
export async function GET(request: NextRequest) {
  try {
    const token = decodedToken(request);

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
          password: true
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

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cadastra um novo usuário, acessível apenas para administradores.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *               name:
 *                 type: string
 *               cpf:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro ao criar usuário
 */
export async function POST(request: NextRequest) {
  const token = decodedToken(request);

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
      const data = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (data?.email) {
        return NextResponse.json({ message: "Já existe um usuário com esse E-mail" });
      } else {
        await prisma.user.create({
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
      }

      return NextResponse.json({ message: "Usuário criado com sucesso" }, { status: 201 });
    } else {
      return NextResponse.json({ message: "Usuário não é administrador" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/users:
 *   patch:
 *     summary: Atualiza um usuário
 *     description: Atualiza as informações de um usuário existente, acessível apenas para administradores.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *               name:
 *                 type: string
 *               cpf:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro ao atualizar usuário
 */
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

  try {
    const token = decodedToken(request);

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

      return NextResponse.json({ message: "Usuário atualizado com sucesso" });
    } else {
      return NextResponse.json({ error: 'Você não possui permissão para acessar este recurso.' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Deleta um usuário
 *     description: Remove um usuário pelo seu ID, acessível apenas para administradores.
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
 *       200:
 *         description: Usuário deletado com sucesso
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro ao deletar usuário
 */
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  try {
    const token = decodedToken(request);
    if (token.isAdmin) {
      const user = await prisma.user.delete({
        where: {
          id: id,
        },
      });
      return NextResponse.json({ message: `Usuário ${user.name} deletado com sucesso!` });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
