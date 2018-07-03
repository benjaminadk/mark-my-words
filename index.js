const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const path = require('path')
const http = require('http')
const {
  fileLoader,
  mergeTypes,
  mergeResolvers
} = require('merge-graphql-schemas')
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './resolvers'))
)
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './typeDefs')))
require('./models/connect')()
const models = require('./models')
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models
  }
})
const app = express()
server.applyMiddleware({ app, path: '/graphql' })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)
httpServer.listen(3001, () => console.log('SERVER UP'))
