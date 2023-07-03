import '../lib/dayjs'

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { globalStyles } from '../styles/global'

import { Roboto_Flex as Roboto } from 'next/font/google'
const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })

// Executando a função de estilos globais
globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={`${roboto.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}
