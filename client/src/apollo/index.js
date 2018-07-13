import { ApolloClient } from 'apollo-client'
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, concat, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const httpLink = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  }),
  new HttpLink({
    uri:
      process.env.NODE_ENV === 'production'
        ? 'https://markmywordsblog.herokuapp.com/graphql'
        : 'http://localhost:3001/graphql',
    credentials: 'same-origin'
  })
])

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('TOKEN') || null
    }
  })
  return forward(operation)
})

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'wss://markmywordsblog.herokuapp.com/graphql'
      : `ws://localhost:3001/graphql`,
  options: {
    reconnect: true
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const linkWithMiddleware = concat(authMiddleware, link)

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch (object.__typename) {
      case 'Post':
        return object.id
      case 'Image':
        return object._id
      case 'User':
        return object._id
      case 'Comment':
        return object._id
      default:
        return defaultDataIdFromObject(object)
    }
  }
})

const client = new ApolloClient({
  link: linkWithMiddleware,
  cache
})

export default client
