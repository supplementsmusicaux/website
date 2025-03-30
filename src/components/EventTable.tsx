import { get, map, uniq } from "lodash/fp"
import Link from "next/link"
import { DateTime } from "luxon"

import { formatList, parse } from "../utils"
import { HomeQuery } from "../__generated__/graphql"
import { projectDetailPath } from "../domain"

type Events = HomeQuery["events"]

export const EventTable = ({ events }: { events: Events }) => {
  const renderEvent = (event: Events[0]): JSX.Element => {
    const locations: string[] = uniq(map(get("location"), event.performances))
    const dates = map(get("startingAt"), event.performances)

    const renderTitle = (event: Events[0]) => {
      if (event.previewOnly) return event.title

      return (
        <Link key={event.slug} href={projectDetailPath(event.slug)}>
          {event.title}
        </Link>
      )
    }

    return (
      <>
        <span style={{ flex: 2 }}>{renderTitle(event)}</span>
        <span style={{ flex: 2 }}>
          {formatList(map<string, DateTime>(parse, dates))}
        </span>
        <span style={{ flex: 3 }}>{locations.join(", ")}</span>
      </>
    )
  }

  return (
    <ul className="events-list">
      {events.map((event) => (
        <li
          key={event.title}
          style={{
            color: event.backgroundColor?.hex || "#000",
          }}
        >
          {renderEvent(event)}
        </li>
      ))}
    </ul>
  )
}
