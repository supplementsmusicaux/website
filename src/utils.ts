import { DateTime } from "luxon"
import { last } from "lodash/fp"

export const parse = (input: string): DateTime => {
  return DateTime.fromISO(input)
}

export const format = (input: DateTime): string => {
  const date = formatShort(input)
  const time = formatTime(input)

  return [date, time].join(", ")
}

export const formatShort = (input: DateTime): string => {
  return input.setLocale("de").toLocaleString(DateTime.DATE_FULL)
}

export const formatRange = (a: DateTime, b: DateTime): string => {
  let firstFormat = "d."
  if (a.year !== b.year) {
    firstFormat += " LLLL yyyy"
  } else if (a.month !== b.month) {
    firstFormat += " LLLL"
  }

  return [
    a.setLocale("de").toFormat(firstFormat),
    b.setLocale("de").toFormat("d. LLLL yyyy"),
  ].join(" – ")
}

export const formatList = (dates: DateTime[]): string => {
  if (dates.length === 1) {
    return formatShort(dates[0])
  } else if (dates.length > 1) {
    if (dates[0].hasSame(last(dates) as DateTime, "day")) {
      return formatShort(dates[0])
    } else {
      return formatRange(dates[0], last(dates) as DateTime)
    }
  } else {
    return ""
  }
}

const formatTime = (input: DateTime): string => {
  if (input.minute !== 0) {
    return `${input.toFormat("H.mm")} Uhr`
  } else {
    return `${input.toFormat("H")} Uhr`
  }
}
