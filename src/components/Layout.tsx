import React from "react"
import Link from "next/link"
import { get, sortBy } from "lodash/fp"
import { Logo } from "./Logo"

interface Page {
  slug: string
  menuPosition?: number | null
  title: string
}
interface Props {
  pages: Page[]
  children: React.ReactNode
  isHome?: boolean
}

export const Layout = ({ pages, children, isHome }: Props) => {
  const allPages = sortBy(get("menuPosition"))([
    ...pages,
    {
      menuPosition: 0,
      slug: "archiv",
      title: "vergangenes",
    },
  ])

  const classes = ["header", "main-col"]
  if (isHome) classes.push("home")

  return (
    <>
      <div className={classes.join(" ")}>
        <h1>
          <Logo />
          {isHome ? (
            <span>
              <span>suppléments</span> <span>musicaux</span>
            </span>
          ) : (
            <Link href="/">
              <span>suppléments</span> <span>musicaux</span>
            </Link>
          )}
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
