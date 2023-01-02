import { GetStaticProps } from "next"
import Head from "next/head"
import ReactMarkdown from "react-markdown"

import { gql } from "../__generated__/gql"
import client from "../apollo-client"
import { EventsQuery } from "../__generated__/graphql"

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

export default function Home({ events }: Props) {
  return (
    <>
      <Head>
        <title>suppléments musicaux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <h1>suppléments musicaux</h1>
        {events.map((event) => (
          <div
            key={event.id}
            className="event-wrapper"
            style={{
              backgroundColor: event.backgroundColor?.hex || "#444",
            }}
          >
            <div>
              <img src={event.flyer?.url} />
            </div>
            <div
              style={{
                color: event.textColor?.hex || "#FFF",
              }}
            >
              <h3>{event.title}</h3>
              <ReactMarkdown children={event.description || ""} />
            </div>
          </div>
        ))}
      </main>
    </>
  )
}
