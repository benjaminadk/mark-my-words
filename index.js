const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const path = require('path')
const http = require('http')
const passport = require('passport')
const {
  googleOauth,
  googleCallback,
  googleRedirect,
  googleScope
} = require('./services/googleAuth')
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
const keys = require('./config')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) return {}
    const user = await require('./middleware/userAuth')(
      req.headers['authorization']
    )
    return { models, user }
  }
})

const app = express()

passport.use(googleOauth)
app.use(passport.initialize())
app.get('/auth/google', googleScope)
app.get('/auth/google/callback', googleCallback, googleRedirect)

server.applyMiddleware({ app, path: '/graphql' })

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'))
  })
}

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)
httpServer.listen(keys.PORT, () => console.log('SERVER UP'))
