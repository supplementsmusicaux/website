import Link from "next/link"
import { projectDetailPath } from "../domain"

interface Props {
  slug: string
  title: string
  backgroundColor?: string
  textColor?: string
  flyerUrl?: string
  children: React.ReactNode
  omitDetailLink?: boolean
}

export const EventContainer = ({
  slug,
  title,
  backgroundColor,
  textColor,
  flyerUrl,
  children,
  omitDetailLink = false,
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
        {flyerUrl && (
          <div className="flyer">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src={flyerUrl} alt={`Flyer für das Projekt "${title}"`} />
            }
          </div>
        )}
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
          {omitDetailLink ? (
            <h3 className="full">{title}</h3>
          ) : (
            <Link href={projectDetailPath(slug)}>
              <h3>{title}</h3>
            </Link>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
