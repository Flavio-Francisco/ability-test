import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../../lib/db';
import jwt from 'jsonwebtoken';
import { User } from '@/types/user';

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Autentica o usuário e retorna um token JWT
 *     description: Realiza a autenticação de um usuário com email e senha, e retorna um token JWT em caso de sucesso.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: O email do usuário
 *               password:
 *                 type: string
 *                 description: A senha do usuário
 *     responses:
 *       200:
 *         description: Sucesso - Retorna os dados do usuário e o token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 adm:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       401:
 *         description: Senha incorreta
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
export async function POST(request: NextRequest) {

  try {
    const type = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const body = await request.json();
    const user = type.parse(body);
console.log(user);

    const userPrisma = await prisma.user.findMany({
      where: { email: user.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        isAdmin: true,
      },
    });

    if (userPrisma.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const [userAuth] = userPrisma;

    if (user.password !== userAuth.password) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: userAuth.id,
        name: userAuth.name,
        isAdmin: userAuth.isAdmin,
      },
      process.env.JWT_SECRET as string,
      { subject: userAuth.email, expiresIn: '1 days' }
    );

    const data: User = {
      id: userAuth.id,
      email: userAuth.email,
      name: userAuth.name,
      adm: userAuth.isAdmin,
      token: token,
    };

    return NextResponse.json(data);
  } catch  {
    return NextResponse.json({ message:"Usuário não encontrado" }, { status: 500 });
  }
}
