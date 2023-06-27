import axios from 'axios'

export const api = axios.create({
  // Como o back-end e o front-end estão sendo executados no mesmo arquivo, ele já "sabe" a baseUrl padrão
  baseURL: '/api',
})
