import { makeOperation } from "@urql/core"
import type { AuthConfig } from "@urql/exchange-auth"

import { supabase, SUPABASE_ANON_KEY } from "@/consts"

type AuthState = {
  token: string
}

export const authConfig: AuthConfig<AuthState> = {
  getAuth: async () => {
    const session = (await supabase.auth.getSession()).data.session
    const token = session ? session.access_token : SUPABASE_ANON_KEY
    return { token }
  },
  addAuthToOperation: ({ authState, operation }) => {
    if (!authState || !authState.token) {
      return operation
    }

    const fetchOptions =
      typeof operation.context.fetchOptions === "function"
        ? operation.context.fetchOptions()
        : operation.context.fetchOptions || {}

    return makeOperation(operation.kind, operation, {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${authState.token}`,
          apikey: SUPABASE_ANON_KEY,
        },
      },
    })
  },
}
