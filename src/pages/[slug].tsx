import { GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown"

import { gql } from "../__generated__/gql"
import client from "../apollo-client"
import { PageQuery, NavQuery } from "../__generated__/graphql"
import { Layout } from "../components/Layout"
import { NewsletterSignupForm } from "../components"
import { getNavPages } from "../nav"

interface Props {
  slug?: string
  page: PageQuery["page"]
  pages: NavQuery["pages"]
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query({
    query: gql(`
      query PagePaths {
        pages(first: 100) {
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
  const [{ data }, pages] = await Promise.all([
    client.query({
      query: gql(
        `
        query Page($slug: String) {
          page(where: { slug: $slug }) {
            title
            slug
            menuPosition
            content
          }
        }
      `
      ),
      variables: { slug },
    }),
    getNavPages(),
  ])

  return {
    props: {
      slug,
      page: data.page,
      pages,
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
