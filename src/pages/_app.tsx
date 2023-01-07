import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"
import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  Provider as UrqlProvider,
} from "urql"
import { authExchange } from "@urql/exchange-auth"

import { SUPABASE_URL } from "@/consts"
import { authConfig } from "@/utils"
import "@/styles/globals.css"

const client = createClient({
  url: `${SUPABASE_URL}/graphql/v1`,
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange(authConfig),
    fetchExchange,
  ],
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <UrqlProvider value={client}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </UrqlProvider>
  )
}

export default App
