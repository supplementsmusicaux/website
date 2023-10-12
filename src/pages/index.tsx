import { GetStaticProps } from "next"
import Head from "next/head"
import ReactMarkdown from "react-markdown"
import { DateTime } from "luxon"
import { get, map, uniq } from "lodash/fp"
import Link from "next/link"

import { Layout } from "../components/Layout"
import { gql } from "../__generated__/gql"
import client from "../apollo-client"
import { HomeQuery } from "../__generated__/graphql"
import { EventContainer, NewsletterSignupForm } from "../components"
import { parse, formatList } from "../utils"

interface Props {
  events: HomeQuery["events"]
  pages: HomeQuery["pages"]
  content: HomeQuery["content"]
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  const cutoffDate = DateTime.now().minus({ weeks: 2 }).toISODate()
  const { data } = await client.query({
    query: gql(`
      query Home($cutoffDate: Date!) {
        events(where: {activeUntil_gte: $cutoffDate}, orderBy: activeUntil_ASC) {
          slug
          title
          description

          flyer {
            url
          }
          backgroundColor {
            hex
          }
          textColor {
            hex
          }

          performances(orderBy: startingAt_ASC) {
            startingAt
            location
          }
        }
        pages (where: { menuPosition_not: null }) {
          slug
          menuPosition
          title
        }
        content: pages (where: { slug: "startseite" }) {
          content
        }
      }
    `),
    variables: {
      cutoffDate,
    },
  })

  return {
    props: {
      events: data.events,
      pages: data.pages,
      content: data.content,
    },
  }
}

export default function Home({ events, pages, content }: Props) {
  return (
    <Layout pages={pages} isHome={true}>
      <Head>
        <title>suppléments musicaux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="hero">
        <div className="main-col text-styles inverted">
          <ReactMarkdown>{content?.[0]?.content || ""}</ReactMarkdown>
          <p className="regular">
            <Link href="/about">mehr</Link>
          </p>
        </div>
      </div>

      <div className="main-col text-styles">
        <h4>aktuell</h4>
      </div>

      <div className="events-wrapper">
        {events.map((event) => {
          const dates = map(get("startingAt"), event.performances)
          const locations: string[] = uniq(
            map(get("location"), event.performances)
          )

          return (
            <EventContainer
              key={event.slug}
              slug={event.slug}
              title={event.title}
              backgroundColor={event.backgroundColor?.hex}
              textColor={event.textColor?.hex}
              flyerUrl={event.flyer?.url}
            >
              <ul>
                <li>{formatList(map<string, DateTime>(parse, dates))}</li>
                <li>{locations.join(", ")}</li>
              </ul>

              <ReactMarkdown>{event.description || ""}</ReactMarkdown>
              <p>
                <br />
                <Link href={`/archiv/${event.slug}`}>
                  Weitere Informationen
                </Link>
              </p>
            </EventContainer>
          )
        })}
      </div>

      <div className="main-col text-styles">
        <p>
          Schau dir die vergangenen Veranstaltungen im{" "}
          <Link href="/archiv">Archiv</Link> an.
        </p>
      </div>

      <NewsletterSignupForm
        id="100835912863188758"
        title="newsletter"
        description="Erhalte Infos über unsere Projekte und Konzerte."
        submit="Anmelden"
        statusSubmitting="Speichern …"
        statusSuccess="Vielen Dank! Du wirst in Kürze ein E-Mail zur Bestätigung deiner Anmeldung erhalten."
        statusError="Die Anmeldung hat leider nicht geklappt! Melde dich bitte per E-Mail bei uns."
      />
    </Layout>
  )
}
