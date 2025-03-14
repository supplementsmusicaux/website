import { GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown"

import { gql } from "../../__generated__/gql"
import client from "../../apollo-client"
import { EventQuery } from "../../__generated__/graphql"
import { EventContainer } from "../../components"
import { format, parse } from "../../utils"
import { Layout } from "../../components/Layout"

interface Props {
  event: EventQuery["event"]
  pages: EventQuery["pages"]
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query({
    query: gql(`
      query EventPaths {
        events(first: 100, where: {previewOnly: false}) {
          slug
        }
      }
    `),
  })

  return {
    paths: data.events.map((event) => ({ params: { slug: event.slug } })),
    fallback: false, // can also be true or 'blocking'
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = Array.isArray(params?.slug) ? params?.slug[0] : params?.slug
  const { data } = await client.query({
    query: gql(
      `
      query Event($slug: String) {
        event(where: { slug: $slug }) {
          slug
          title
          details

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
    `
    ),
    variables: { slug },
  })

  return {
    props: {
      event: data.event,
      pages: data.pages,
    },
  }
}

export default function EventPage({ event, pages }: Props) {
  if (!event) return null

  return (
    <Layout pages={pages}>
      <EventContainer
        slug={event.slug}
        title={event.title}
        backgroundColor={event.backgroundColor?.hex}
        textColor={event.textColor?.hex}
        flyerUrl={event.flyer?.url}
      >
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

        <ReactMarkdown>{event.details || ""}</ReactMarkdown>
      </EventContainer>
    </Layout>
  )
}
