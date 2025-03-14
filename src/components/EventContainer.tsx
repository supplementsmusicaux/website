import Link from "next/link"
import { projectDetailPath } from "../domain"

interface Props {
  slug: string
  title: string
  backgroundColor?: string
  textColor?: string
  flyerUrl?: string
  children: React.ReactNode
}

export const EventContainer = ({
  slug,
  title,
  backgroundColor,
  textColor,
  flyerUrl,
  children,
}: Props) => {
  return (
    <div
      className="event-row"
      key={slug}
      style={
        backgroundColor
          ? {
              backgroundColor: backgroundColor,
            }
          : undefined
      }
    >
      <div className="event-wrapper main-col text-styles inverted">
        <div className="flyer">
          {flyerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={flyerUrl} alt={`Flyer für das Projekt "${title}"`} />
          )}
        </div>
        <div
          className="info"
          style={
            textColor
              ? {
                  color: textColor,
                }
              : undefined
          }
        >
          <Link href={projectDetailPath(slug)}>
            <h3>{title}</h3>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
