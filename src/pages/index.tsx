import { GetStaticProps } from "next"
import Head from "next/head"
import Image from "next/image"
import ReactMarkdown from "react-markdown"

import { gql } from "../__generated__/gql"
import client from "../apollo-client"
import { UpcomingEventsQuery } from "../__generated__/graphql"
import { parse, format } from "../utils"

interface Props {
  events: UpcomingEventsQuery["events"]
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  const { data } = await client.query({
    query: gql(`
      query UpcomingEvents {
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

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            backgroundColor: event.backgroundColor?.hex || "#444",
          }}
        >
          <div className="event-wrapper main-col">
            <div className="flyer">
              {event.flyer && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.flyer.url || ""}
                  alt={`Flyer für das Projekt "${event.title}"`}
                />
              )}
            </div>
            <div
              className="info"
              style={{
                color: event.textColor?.hex || "#FFF",
              }}
            >
              <h3>{event.title}</h3>
              <ul>
                {event.performances.map((performance) => (
                  <li key={performance.startingAt}>
                    {[
                      format(parse(performance.startingAt)),
                      performance.location,
                    ].join(", ")}
                  </li>
                ))}
              </ul>

              <ReactMarkdown>{event.description || ""}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
