/**
 * Transformando números em dias da semana
 * 0 = Domingo
 * 1 = Segunda-feira
 * ...
 */

interface GetWeekDaysParams {
  short?: boolean
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  // Formatando para obter em formato escrito por extenso
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  // Criando um array com 7 posições
  // .keys() faz retornar o índice destas posições
  // Para o formatter poder formatar é preciso que seja um objeto date
  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      // Pegando apenas os 3 primeiros caracteres dos dias da semana
      if (short) {
        return weekDay.substring(0, 3).toUpperCase()
      }

      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}
