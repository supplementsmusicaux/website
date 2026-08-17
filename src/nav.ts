import { gql } from "./__generated__/gql"
import client from "./apollo-client"

let navPagesPromise: ReturnType<typeof fetchNavPages> | undefined

async function fetchNavPages() {
  const { data } = await client.query({
    query: gql(`
      query Nav {
        pages (where: { menuPosition_not: null }) {
          slug
          menuPosition
          title
        }
      }
    `),
  })

  return data.pages
}

// Memoized so the nav/menu query is only fetched once per build, no matter
// how many pages call this during static generation.
export function getNavPages() {
  if (!navPagesPromise) {
    navPagesPromise = fetchNavPages()
  }

  return navPagesPromise
}
