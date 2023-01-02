import { GetStaticProps } from "next"
import Head from "next/head"
import { uniq, map, get, last } from "lodash/fp"

import { gql } from "../../__generated__/gql"
import client from "../../apollo-client"
import { EventsQuery } from "../../__generated__/graphql"
import { parse, formatList, formatShort } from "../../utils"

interface Props {
  events: EventsQuery["events"]
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  const { data } = await client.query({
    query: gql(`
      query Events {
        events {
          id
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
    let dateInfo: string = ""
    if (event.performances.length === 1)
      dateInfo = formatShort(parse(event.performances[0].startingAt))
    if (event.performances.length > 1) {
      dateInfo = formatList(
        parse(event.performances[0].startingAt),
        parse(last(event.performances)?.startingAt)
      )
    }
    const locations: string[] = uniq(map(get("location"), event.performances))

    return (
      <>
        <span style={{ flex: 1 }}>{event.title}</span>
        <span style={{ flex: 2 }}>{dateInfo}</span>
        <span style={{ flex: 2 }}>{locations.join(", ")}</span>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>suppléments musicaux – alle veranstaltungen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="main-col">
        <h1>suppléments musicaux</h1>
        <ul className="events-list">
          {events.map((event) => (
            <li
              key={event.id}
              style={{
                display: "flex",
                color: event.backgroundColor?.hex || "#000",
              }}
            >
              {renderEvent(event)}
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
