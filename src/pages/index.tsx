import { Heading, Text } from '@ignite-ui/react'

import { Roboto_Flex as Roboto } from 'next/font/google'
const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })



export default function Home() {
  return (
    <main className={`${roboto.variable} font-sans`}>
      <Heading>Hello</Heading>
    </main>
  )
}
