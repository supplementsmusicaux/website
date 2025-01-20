import { GetStaticProps } from "next"
import Head from "next/head"
import ReactMarkdown from "react-markdown"
import { DateTime } from "luxon"
import { get, map, uniq } from "lodash/fp"
import Link from "next/link"

import { Layout } from "../../components/Layout"
import { gql } from "../../__generated__/gql"
import client from "../../apollo-client"
import { AllEventsQuery } from "../../__generated__/graphql"
import { EventContainer } from "../../components"
import { parse, formatList } from "../../utils"

interface Props {
  events: AllEventsQuery["events"]
  pages: AllEventsQuery["pages"]
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  const today = DateTime.now().toISODate()
  const { data } = await client.query({
    query: gql(`
      query AllEvents($today: Date!) {
        events(first: 100, where: {previewOnly: false, activeUntil_lt: $today}, orderBy: activeUntil_DESC) {
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
      }
    `),
    variables: {
      today,
    },
  })

  return {
    props: {
      events: data.events,
      pages: data.pages,
    },
  }
}

export default function AllEvents({ events, pages }: Props) {
  return (
    <Layout pages={pages}>
      <Head>
        <title>suppléments musicaux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

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
          die restlichen vergangenen veranstaltungen sind wir noch am erfassen,
          sie werden in zukunft hier erscheinen.
        </p>
      </div>
    </Layout>
  )
}
