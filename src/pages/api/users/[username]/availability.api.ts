import { prisma } from '@/src/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query
  // http://localhost:3333/api/users/renan-fachin/availability?date=2023-07-04

  if (!date) {
    return res.status(400).json({ message: 'Date not provided' })
  }

  // Buscar usuário no db
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  // Validando se usuário existe
  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  // Buscando a disponibilidade do usuário
  const referenceDate = dayjs(String(date))

  // Validação 1 -> Datas antigas não devem ter horários disponíveis
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  // Convertendo os dados de minutos para hora
  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  // Criando um array com todas horas disponíveis. ex: [10, 11, 12, 13, 14, 15, 16]
  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  // Procurar por todos agendamentos marcados no dia
  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        // gte => greater than or equal
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time,
    )

    const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({ possibleTimes, availableTimes })
}
