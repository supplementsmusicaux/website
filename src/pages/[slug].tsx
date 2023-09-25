import { GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown"

import { gql } from "../__generated__/gql"
import client from "../apollo-client"
import { PageQuery } from "../__generated__/graphql"
import { Layout } from "../components/Layout"

interface Props {
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
      page: data.page,
      pages: data.pages,
    },
  }
}

export default function Page({ page, pages }: Props) {
  if (!page) return null

  return (
    <Layout pages={pages}>
      <div className="main-col text-styles text-page">
        <ReactMarkdown>{page.content || ""}</ReactMarkdown>
      </div>
    </Layout>
  )
}
