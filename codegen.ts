import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { CodegenConfig } from "@graphql-codegen/cli"

dotenv.config({ path: ".env.local" })

const config: CodegenConfig = {
  schema: [
    {
      [process.env.HYGRAPH_URL || ""]: {
        headers: {
          Authorization: `Bearer ${process.env.HYGRAPH_AUTH_TOKEN}`,
        },
      },
    },
  ],

  documents: ["src/**/*.tsx"],

  generates: {
    "./src/__generated__/": {
      preset: "client",

      plugins: [],

      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },

  ignoreNoDocuments: true,
}

export default config
