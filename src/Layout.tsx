import React from "react"
import Link from "next/link"

interface Props {
  children: React.ReactNode
}

export const Layout = ({ children }: Props) => {
  return (
    <>
      <div className="header main-col">
        <h1>
          <Link href="/">suppléments musicaux</Link>
        </h1>
        <ul>
          <li>
            <Link href="/events">veranstaltungen</Link>
          </li>
        </ul>
      </div>
      <main>{children}</main>
    </>
  )
}
