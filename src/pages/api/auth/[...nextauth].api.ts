import { PrismaAdapter } from '@/src/lib/auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import type { NextApiRequest, NextApiResponse, NextPageContext } from 'next'

const userInfoEmail = 'https://www.googleapis.com/auth/userinfo.email'
const userInfoProfile = 'https://www.googleapis.com/auth/userinfo.profile'
const userInfoCalendar = 'https://www.googleapis.com/auth/calendar'

export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
            scope: `${userInfoEmail} ${userInfoProfile} ${userInfoCalendar}`,
          },
        },
        // método profile = mapeia os campos internos do usuário com o perfil retornado do google
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            username: '',
            email: profile.email,
            avatar_url: profile.picture,
          }
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

      // função para modificar os dados contidos na session
      async session({ session, user }) {
        return {
          ...session,
          // substituindo as informações do usuário, passando mais do que só o nome e o email para que o front-end tenha acesso a mais informações
          user,
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}
