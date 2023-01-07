import Link from "next/link"

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
      key={slug}
      style={{
        backgroundColor: backgroundColor || "#444",
      }}
    >
      <div className="event-wrapper main-col text-styles">
        <div className="flyer">
          {flyerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={flyerUrl} alt={`Flyer für das Projekt "${title}"`} />
          )}
        </div>
        <div
          className="info"
          style={{
            color: textColor || "#FFF",
          }}
        >
          <Link href={`/events/${slug}`}>
            <h3>{title}</h3>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
