import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const userInfoEmail = 'https://www.googleapis.com/auth/userinfo.email'
const userInfoProfile = 'https://www.googleapis.com/auth/userinfo.profile'
const userInfoCalendar = 'https://www.googleapis.com/auth/calendar'

export const authOptions: NextAuthOptions = {
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
}
export default NextAuth(authOptions)
