import { useState } from "react"
import type { Session } from "@supabase/supabase-js"

export const Home = () => {
  const [session, setSession] = useState<Session | null>(null)

  return (
    <div className="flex flex-col h-screen bg-black">
      <main className="grow mx-auto max-w-4xl min-h-0 text-white"></main>
    </div>
  )
}

