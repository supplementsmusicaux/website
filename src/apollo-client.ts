import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, Observable } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { RetryLink } from "@apollo/client/link/retry"
import type { ObservableSubscription } from "@apollo/client/utilities"

const httpLink = createHttpLink({
  uri: process.env.HYGRAPH_URL,
})

const authLink = setContext((_, { headers }) => {
  const token = process.env.HYGRAPH_AUTH_TOKEN
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// Hygraph's Community plan allows 5 req/sec; stay under that even when the
// CDN is missed and requests fall through to the rate-limited origin.
const REQUESTS_PER_SECOND = 4

function createThrottleLink(requestsPerSecond: number): ApolloLink {
  const minIntervalMs = 1000 / requestsPerSecond
  let nextAvailableTime = 0

  return new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      const now = Date.now()
      const scheduledTime = Math.max(now, nextAvailableTime)
      nextAvailableTime = scheduledTime + minIntervalMs

      let subscription: ObservableSubscription | undefined
      const timer = setTimeout(() => {
        subscription = forward(operation).subscribe(observer)
      }, scheduledTime - now)

      return () => {
        clearTimeout(timer)
        subscription?.unsubscribe()
      }
    })
  })
}

const throttleLink = createThrottleLink(REQUESTS_PER_SECOND)

// Safety net for CDN cache misses that still hit the rate-limited origin.
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 10_000,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error) => error?.statusCode === 429,
  },
})

const client = new ApolloClient({
  link: authLink.concat(retryLink).concat(throttleLink).concat(httpLink),

  cache: new InMemoryCache(),
})

export default client
