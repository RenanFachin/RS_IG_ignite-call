import { prisma } from '@/src/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // Fazendo uma verificação do método que está sendo chamado
  // Fazendo com que todos os métodos diferente do POST sejam redirecionados para um erro
  if (request.method !== 'POST') {
    return response.status(405).end()
  }

  // Agora sabendo que a rota é do tipo POST, persistir o usuário no db
  const { name, username } = request.body

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  return response.status(201).json(user)
}
