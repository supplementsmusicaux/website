import { GetStaticProps } from "next"
import Head from "next/head"
import ReactMarkdown from "react-markdown"
import { DateTime } from "luxon"
import { get, map, uniq } from "lodash/fp"
import Link from "next/link"

import { gql } from "../__generated__/gql"
import client from "../apollo-client"
import { UpcomingEventsQuery } from "../__generated__/graphql"
import { EventContainer } from "../components"
import { parse, formatList } from "../utils"

interface Props {
  events: UpcomingEventsQuery["events"]
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  const { data } = await client.query({
    query: gql(`
      query UpcomingEvents {
        events {
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
      }
    `),
  })

  return {
    props: {
      events: data.events,
    },
  }
}

export default function Home({ events }: Props) {
  return (
    <>
      <Head>
        <title>suppléments musicaux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {events.map((event) => {
        const dates = map(get("startingAt"), event.performances)
        const locations: string[] = uniq(
          map(get("location"), event.performances)
        )

        return (
          <EventContainer
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
              <Link href={`/events/${event.slug}`}>Weitere Informationen</Link>
            </p>
          </EventContainer>
        )
      })}
    </>
  )
}
