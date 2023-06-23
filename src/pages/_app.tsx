import type { AppProps } from 'next/app'
import { globalStyles } from '../styles/global'



// Executando a função de estilos globais
globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
