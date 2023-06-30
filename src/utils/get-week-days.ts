/**
 * Transformando números em dias da semana
 * 0 = Domingo
 * 1 = Segunda-feira
 * ...
 */

export function getWeekDays() {
  // Formatando para obter em formato escrito por extenso
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  // Criando um array com 7 posições
  // .keys() faz retornar o índice destas posições
  // Para o formatter poder formatar é preciso que seja um objeto date
  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}