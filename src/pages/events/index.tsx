import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { uniq, map, get } from "lodash/fp"
import { DateTime } from "luxon"

import { gql } from "../../__generated__/gql"
import client from "../../apollo-client"
import { EventsQuery } from "../../__generated__/graphql"
import { formatList, parse } from "../../utils"

interface Props {
  events: EventsQuery["events"]
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  const { data } = await client.query({
    query: gql(`
      query Events {
        events {
          slug
          title

          backgroundColor {
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

export default function Events({ events }: Props) {
  const renderEvent = (event: Props["events"][0]): JSX.Element => {
    const locations: string[] = uniq(map(get("location"), event.performances))
    const dates = map(get("startingAt"), event.performances)

    return (
      <>
        <span style={{ flex: 2 }}>{event.title}</span>
        <span style={{ flex: 2 }}>
          {formatList(map<string, DateTime>(parse, dates))}
        </span>
        <span style={{ flex: 3 }}>{locations.join(", ")}</span>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>suppléments musicaux – alle veranstaltungen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="main-col">
        <ul className="events-list">
          {events.map((event) => (
            <Link href={`/events/${event.slug}`}>
              <li
                key={event.slug}
                style={{
                  color: event.backgroundColor?.hex || "#000",
                }}
              >
                {renderEvent(event)}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  )
}
