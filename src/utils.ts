import { DateTime } from "luxon"

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

export const formatList = (a: DateTime, b: DateTime): string => {
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

const formatTime = (input: DateTime): string => {
  if (input.minute !== 0) {
    return `${input.toFormat("H.mm")} Uhr`
  } else {
    return `${input.toFormat("H")} Uhr`
  }
}
