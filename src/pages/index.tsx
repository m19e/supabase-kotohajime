import type { NextPage } from "next"
import Head from "next/head"

import { Home } from "@/components/templates/Home"

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Supabase pg_graphql Example</title>
      </Head>
      <Home />
    </>
  )
}

export default HomePage
