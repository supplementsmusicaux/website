import { get, map, uniq } from "lodash/fp"
import Link from "next/link"
import { DateTime } from "luxon"

import { formatList, parse } from "../utils"
import { HomeQuery } from "../__generated__/graphql"

type Events = HomeQuery["events"]

export const EventTable = ({ events }: { events: Events }) => {
  const renderEvent = (event: Events[0]): JSX.Element => {
    const locations: string[] = uniq(map(get("location"), event.performances))
    const dates = map(get("startingAt"), event.performances)

    return (
      <>
        <span style={{ flex: 4 }}>{event.title}</span>
        <span style={{ flex: 2 }}>
          {formatList(map<string, DateTime>(parse, dates))}
        </span>
        <span style={{ flex: 2 }}>{locations.join(", ")}</span>
      </>
    )
  }

  return (
    <ul className="events-list">
      {events.map((event) => (
        <Link key={event.slug} href={`/archiv/${event.slug}`}>
          <li
            style={{
              color: event.backgroundColor?.hex || "#000",
            }}
          >
            {renderEvent(event)}
          </li>
        </Link>
      ))}
    </ul>
  )
}
