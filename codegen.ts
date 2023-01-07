import type { CodegenConfig } from "@graphql-codegen/cli"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./src/consts"

const config: CodegenConfig = {
  schema: `${SUPABASE_URL}/graphql/v1?apikey=${SUPABASE_ANON_KEY}`,
  documents: ["src/consts/**.ts"],
  //   documents: ["**/*.tsx", "**/*.ts"],
  generates: {
    "./src/gql/index.tsx": {
      config: {
        withHooks: true,
        withComponent: true,
      },
      plugins: ["typescript", "typescript-operations", "typescript-urql"],
    },
  },
  ignoreNoDocuments: true,
}

export default config
