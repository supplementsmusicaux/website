import React from "react"
import Link from "next/link"
import { get, sortBy } from "lodash/fp"

interface Page {
  slug: string
  menuPosition?: number | null
  title: string
}
interface Props {
  pages: Page[]
  children: React.ReactNode
}

export const Layout = ({ pages, children }: Props) => {
  const allPages = sortBy(get("menuPosition"))([
    ...pages,
    {
      menuPosition: 0,
      slug: "events",
      title: "vergangenes",
    },
  ])

  return (
    <>
      <div className="header main-col">
        <h1>
          <Link href="/">suppléments musicaux</Link>
        </h1>
        <ul>
          {allPages.map((page) => (
            <li key={page.slug}>
              <Link href={`/${page.slug}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <main>{children}</main>
    </>
  )
}
