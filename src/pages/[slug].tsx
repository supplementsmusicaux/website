import { GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown"

import { gql } from "../__generated__/gql"
import client from "../apollo-client"
import { PageQuery } from "../__generated__/graphql"
import { Layout } from "../components/Layout"
import { NewsletterSignupForm } from "../components"

interface Props {
  slug?: string
  page: PageQuery["page"]
  pages: PageQuery["pages"]
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query({
    query: gql(`
      query PagePaths {
        pages {
          slug
        }
      }
    `),
  })

  return {
    paths: data.pages.map((page) => ({ params: { slug: page.slug } })),
    fallback: false, // can also be true or 'blocking'
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = Array.isArray(params?.slug) ? params?.slug[0] : params?.slug
  const { data } = await client.query({
    query: gql(
      `
      query Page($slug: String) {
        page(where: { slug: $slug }) {
          title
          slug
          menuPosition
          content
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
      slug,
      page: data.page,
      pages: data.pages,
    },
  }
}

export default function Page({ slug, page, pages }: Props) {
  if (!page) return null

  return (
    <Layout pages={pages}>
      <div className="main-col text-styles text-page">
        <ReactMarkdown>{page.content || ""}</ReactMarkdown>
      </div>
      {slug === "amicaux" && (
        <NewsletterSignupForm
          id="100836031458183082"
          title="anmeldung"
          includeName
          description="Melde dich hier mit deinem Namen und deiner E-Mailadresse an, um mehr Informationen (inkl. Kontoangaben) zu den suppléments amicaux per E-Mail zu erhalten."
          submit="Anmelden"
          statusSubmitting="Speichern …"
          statusSuccess="Vielen Dank! Du wirst in Kürze ein E-Mail zur Bestätigung deiner Anmeldung erhalten."
          statusError="Die Anmeldung hat leider nicht geklappt! Melde dich bitte per E-Mail bei uns."
        />
      )}
    </Layout>
  )
}
