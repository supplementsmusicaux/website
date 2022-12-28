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
        <p>{events.length} Event(s)</p>
        <ol>
          {events.map((event) => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ol>
      </main>
    </>
  )
}
