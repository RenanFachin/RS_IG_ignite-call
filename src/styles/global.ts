import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  // declarando as estilizações
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
    fontFamily: 'var(--font-roboto)',
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },
})
