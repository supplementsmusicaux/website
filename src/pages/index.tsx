import { GetStaticProps } from "next"
import Head from "next/head"
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
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "row",
              backgroundColor: event.backgroundColor?.hex,
            }}
          >
            <img src={event.flyer?.url} />
            <div style={{ paddingLeft: 16 }}>
              <h3 style={{ color: "#FFF" }}>{event.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.7)" }}>
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </main>
    </>
  )
}
