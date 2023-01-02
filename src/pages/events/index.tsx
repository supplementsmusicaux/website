import { GetStaticProps } from "next"
import Head from "next/head"
import ReactMarkdown from "react-markdown"

import { gql } from "../../__generated__/gql"
import client from "../../apollo-client"
import { EventsQuery } from "../../__generated__/graphql"

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

          performances {
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
                color: event.backgroundColor?.hex || "#000",
              }}
            >
              {event.title}
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
