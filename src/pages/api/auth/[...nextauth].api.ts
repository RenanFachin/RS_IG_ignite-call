import { PrismaAdapter } from '@/src/lib/auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const userInfoEmail = 'https://www.googleapis.com/auth/userinfo.email'
const userInfoProfile = 'https://www.googleapis.com/auth/userinfo.profile'
const userInfoCalendar = 'https://www.googleapis.com/auth/calendar'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: `${userInfoEmail} ${userInfoProfile} ${userInfoCalendar}`,
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      // Dentro do account teremos acesso as permissões que o usuário deu para a aplicação
      if (!account?.scope?.includes(`${userInfoCalendar}`)) {
        // Caso ele não tenha dado a permissão - Retornar para a página de registro
        return '/register/connect-calendar/?error=permissions'

        // Enviando um query params para sinalizar que deu um erro
      }

      // Precisamos retornar um true para deixar a autenticação seguir o fluxo
      return true
    },
  },
}
export default NextAuth(authOptions)
