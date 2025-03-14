import { GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown"

import { gql } from "../../__generated__/gql"
import client from "../../apollo-client"
import { EventsPerYearQuery } from "../../__generated__/graphql"
import { EventContainer, EventTable } from "../../components"
import { format, parse } from "../../utils"
import { Layout } from "../../components/Layout"
import { activeYears, firstActiveYear } from "../../domain"
import Link from "next/link"

interface Props {
  events: EventsPerYearQuery["events"]
  pages: EventsPerYearQuery["pages"]
  year: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: activeYears.map((year) => ({ params: { year: year.toString() } })),
    fallback: false, // can also be true or 'blocking'
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  let year = Array.isArray(params?.year) ? params?.year[0] : params?.year
  year = year ? year : firstActiveYear.toString()

  const { data } = await client.query({
    query: gql(
      `
      query EventsPerYear($year: String) {
        events(
          where: {
            slug_starts_with: $year
          },
          first: 100,
          orderBy: activeUntil_DESC
        ) {
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
    variables: { year },
  })

  return {
    props: {
      events: data.events,
      pages: data.pages,
      year,
    },
  }
}

const YearsLinkBox = ({ selectedYear }: { selectedYear: string }) => (
  <>
    <ul style={{ display: "flex", flexWrap: "wrap" }}>
      {activeYears.map((year) => {
        return (
          <li key={year} style={{ width: "50px" }}>
            {year.toString() === selectedYear ? (
              <span>{year}</span>
            ) : (
              <Link href={`/archiv/${year}`}>{year}</Link>
            )}
          </li>
        )
      })}
    </ul>
  </>
)

export default function EventsPerYearPage({ events, pages, year }: Props) {
  if (!events) return null

  return (
    <Layout pages={pages}>
      <div className="main-col text-styles text-page">
        <h3>Archiv für das Jahr {year}</h3>
        <YearsLinkBox selectedYear={year} />
      </div>
      {events.map((event) => (
        <EventContainer
          key={event.slug}
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
      ))}
    </Layout>
  )
}
