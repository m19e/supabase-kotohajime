import { useState, useEffect } from "react"
import type { FormEventHandler } from "react"
import type { Session } from "@supabase/supabase-js"

import { supabase } from "@/consts"
import {
  AllTasksComponent,
  InsertTasksComponent,
  OrderByDirection,
} from "@/gql"

const useSession = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const getInitialSession = async () => {
      const initialSession = (await supabase.auth.getSession()).data.session
      setSession(initialSession)
    }
    getInitialSession()

    const authListener = supabase.auth.onAuthStateChange(
      async (_, newSession) => {
        setSession(newSession)
      }
    )

    return () => {
      authListener.data.subscription.unsubscribe()
    }
  }, [])

  return session
}

export const Home = () => {
  const session = useSession()
  const isSignedIn = !!session

  return (
    <div className="flex flex-col h-screen bg-black">
      <AppHeader isSignedIn={isSignedIn} />
      <main className="grow mx-auto max-w-4xl min-h-0 text-white">
        {isSignedIn ? <TodoList /> : <LoginForm />}
      </main>
    </div>
  )
}

const AppHeader = ({ isSignedIn }: { isSignedIn: boolean }) => {
  return (
    <header className="bg-black shadow shadow-green-400 navbar">
      <div className="navbar-start"></div>
      <div className="navbar-center">
        <span className="text-lg text-white">Supabase pg_graphql Example</span>
      </div>
      <div className="navbar-end">
        {isSignedIn && (
          <button
            className="text-white normal-case btn"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  )
}

const TodoList = () => {
  return (
    <div className="flex flex-col h-full">
      <AllTasksComponent
        variables={{
          orderBy: [
            {
              created_at: OrderByDirection.DescNullsFirst,
            },
          ],
        }}
      >
        {({ data }) => {
          const tasks = data!.tasksCollection!.edges
          return (
            <div className="overflow-y-auto grow min-h-0">
              {tasks.map(({ node: task }) => (
                <div key={task.id} className="flex p-1 text-lg">
                  <div className="grow">{task.title}</div>
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-6 h-6 ${
                        task.is_completed
                          ? "stroke-green-500"
                          : "stroke-gray-500"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )
        }}
      </AllTasksComponent>
      <InsertTasksComponent>
        {({ executeMutation, fetching }) => {
          const handleSubmit: FormEventHandler<HTMLFormElement> = async (
            event
          ) => {
            const formElement = event.currentTarget
            event.preventDefault()
            const { title } = Object.fromEntries(
              new FormData(event.currentTarget)
            )
            if (typeof title !== "string") return
            if (!title) return
            await executeMutation({ objects: [{ title }] })
            formElement.reset()
          }

          return (
            <form className="input-group" onSubmit={handleSubmit}>
              <input
                className="text-black input"
                type="text"
                name="title"
                placeholder="New Task"
              />
              <button className="btn" type="submit" disabled={fetching}>
                {fetching ? "Saving..." : "Save"}
              </button>
            </form>
          )
        }}
      </InsertTasksComponent>
    </div>
  )
}

const LoginForm = () => {
  const handleSendMagicLink: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const { email } = Object.fromEntries(new FormData(e.currentTarget))
    if (typeof email !== "string") return
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      console.error(error)
      alert(error.message)
    } else {
      alert("Check your email inbox")
    }
  }

  return (
    <form
      className="flex flex-col justify-center px-4 space-y-2 max-w-md h-full"
      onSubmit={handleSendMagicLink}
    >
      <input
        className="text-white bg-black border-green-300 input "
        type="email"
        name="email"
        placeholder="Email"
      />
      <button
        className="text-lg text-black normal-case bg-green-400 btn"
        type="submit"
      >
        Send Magic Link
      </button>
    </form>
  )
}
