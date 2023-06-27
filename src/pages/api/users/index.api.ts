import { prisma } from '@/src/lib/prisma'
import { setCookie } from 'nookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Fazendo uma verificação do método que está sendo chamado
  // Fazendo com que todos os métodos diferente do POST sejam redirecionados para um erro
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  // Agora sabendo que a rota é do tipo POST, persistir o usuário no db
  const { name, username } = req.body

  // Validando se o usuário já existe no db
  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'username already taken.',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  // Após a criação do usuário, salvar os dados no cookie
  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/', // todas as rotas da aplicação podem acessar
  })

  return res.status(201).json(user)
}
