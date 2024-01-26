/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n      query PagePaths {\n        pages {\n          slug\n        }\n      }\n    ": types.PagePathsDocument,
    "\n      query Page($slug: String) {\n        page(where: { slug: $slug }) {\n          title\n          slug\n          menuPosition\n          content\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    ": types.PageDocument,
    "\n      query EventPaths {\n        events(where: {previewOnly: false}) {\n          slug\n        }\n      }\n    ": types.EventPathsDocument,
    "\n      query Event($slug: String) {\n        event(where: { slug: $slug }) {\n          slug\n          title\n          details\n\n          flyer {\n            url\n          }\n          backgroundColor {\n            hex\n          }\n          textColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    ": types.EventDocument,
    "\n      query AllEvents($today: Date!) {\n        events(where: {previewOnly: false, activeUntil_lt: $today}, orderBy: activeUntil_DESC) {\n          slug\n          title\n          description\n\n          flyer {\n            url\n          }\n          backgroundColor {\n            hex\n          }\n          textColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    ": types.AllEventsDocument,
    "\n      query Events($today: Date!) {\n        events(where: {previewOnly: false, activeUntil_lt: $today}, orderBy: activeUntil_DESC) {\n          slug\n          title\n\n          backgroundColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    ": types.EventsDocument,
    "\n      query Home($cutoffDate: Date!) {\n        events(where: {activeUntil_gte: $cutoffDate}, orderBy: activeUntil_ASC) {\n          slug\n          title\n          description\n          previewOnly\n\n          flyer {\n            url\n          }\n          backgroundColor {\n            hex\n          }\n          textColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n        content: pages (where: { slug: \"startseite\" }) {\n          content\n        }\n      }\n    ": types.HomeDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query PagePaths {\n        pages {\n          slug\n        }\n      }\n    "): (typeof documents)["\n      query PagePaths {\n        pages {\n          slug\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query Page($slug: String) {\n        page(where: { slug: $slug }) {\n          title\n          slug\n          menuPosition\n          content\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    "): (typeof documents)["\n      query Page($slug: String) {\n        page(where: { slug: $slug }) {\n          title\n          slug\n          menuPosition\n          content\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query EventPaths {\n        events(where: {previewOnly: false}) {\n          slug\n        }\n      }\n    "): (typeof documents)["\n      query EventPaths {\n        events(where: {previewOnly: false}) {\n          slug\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query Event($slug: String) {\n        event(where: { slug: $slug }) {\n          slug\n          title\n          details\n\n          flyer {\n            url\n          }\n          backgroundColor {\n            hex\n          }\n          textColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    "): (typeof documents)["\n      query Event($slug: String) {\n        event(where: { slug: $slug }) {\n          slug\n          title\n          details\n\n          flyer {\n            url\n          }\n          backgroundColor {\n            hex\n          }\n          textColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query AllEvents($today: Date!) {\n        events(where: {previewOnly: false, activeUntil_lt: $today}, orderBy: activeUntil_DESC) {\n          slug\n          title\n          description\n\n          flyer {\n            url\n          }\n          backgroundColor {\n            hex\n          }\n          textColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    "): (typeof documents)["\n      query AllEvents($today: Date!) {\n        events(where: {previewOnly: false, activeUntil_lt: $today}, orderBy: activeUntil_DESC) {\n          slug\n          title\n          description\n\n          flyer {\n            url\n          }\n          backgroundColor {\n            hex\n          }\n          textColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query Events($today: Date!) {\n        events(where: {previewOnly: false, activeUntil_lt: $today}, orderBy: activeUntil_DESC) {\n          slug\n          title\n\n          backgroundColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    "): (typeof documents)["\n      query Events($today: Date!) {\n        events(where: {previewOnly: false, activeUntil_lt: $today}, orderBy: activeUntil_DESC) {\n          slug\n          title\n\n          backgroundColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query Home($cutoffDate: Date!) {\n        events(where: {activeUntil_gte: $cutoffDate}, orderBy: activeUntil_ASC) {\n          slug\n          title\n          description\n          previewOnly\n\n          flyer {\n            url\n          }\n          backgroundColor {\n            hex\n          }\n          textColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n        content: pages (where: { slug: \"startseite\" }) {\n          content\n        }\n      }\n    "): (typeof documents)["\n      query Home($cutoffDate: Date!) {\n        events(where: {activeUntil_gte: $cutoffDate}, orderBy: activeUntil_ASC) {\n          slug\n          title\n          description\n          previewOnly\n\n          flyer {\n            url\n          }\n          backgroundColor {\n            hex\n          }\n          textColor {\n            hex\n          }\n\n          performances(orderBy: startingAt_ASC) {\n            startingAt\n            location\n          }\n        }\n        pages (where: { menuPosition_not: null }) {\n          slug\n          menuPosition\n          title\n        }\n        content: pages (where: { slug: \"startseite\" }) {\n          content\n        }\n      }\n    "];

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function gql(source: string): unknown;

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;