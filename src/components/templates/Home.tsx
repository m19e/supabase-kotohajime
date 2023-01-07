import { useState, useEffect } from "react"
import type { Session } from "@supabase/supabase-js"

import { supabase } from "@/consts"

const useSession = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const getInitialSession = async () => {
      const initialSession = (await supabase.auth.getSession()).data.session
      setSession(initialSession)
    }
    getInitialSession()

    const authListener = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session)
    })

    return () => {
      authListener.data.subscription.unsubscribe()
    }
  }, [])

  return session
}

export const Home = () => {
  const session = useSession
  const isSignedIn = !!session

  return (
    <div className="flex flex-col h-screen bg-black">
      <main className="grow mx-auto max-w-4xl min-h-0 text-white"></main>
    </div>
  )
}
