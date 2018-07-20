const keys = require('../config')

module.exports = {
  Query: {
    userById: async (root, { userId }, { models }) =>
      await models.User.findById(userId)
  },

  Mutation: {
    autoLogin: async (root, args, { models, user }) => {
      if (user) {
        if (user.googleId === keys.GOOGLE_ID) {
          return {
            success: true,
            message: `ADMIN: ${user.username} LOGGED IN`,
            user,
            admin: true
          }
        } else {
          return {
            success: true,
            message: `welcome back ${user.username}`,
            user,
            admin: false
          }
        }
      } else {
        return {
          success: false,
          message: 'invalid auth token',
          user: null,
          admin: false
        }
      }
    },

    editUsername: async (root, { username }, { models, user }) => {
      try {
        const filter = { _id: user.id }
        const update = { $set: { username } }
        await models.User.findOneAndUpdate(filter, update)
        return {
          success: true,
          message: `new username set as ${username}`
        }
      } catch (error) {
        return {
          success: false,
          message: 'error changing username'
        }
      }
    },

    editEmail: async (root, { email }, { models, user }) => {
      try {
        const filter = { _id: user.id }
        const update = { $set: { email } }
        await models.User.findOneAndUpdate(filter, update)
        return {
          success: true,
          message: `new email set as ${email}`
        }
      } catch (error) {
        return {
          success: false,
          message: 'error changing email'
        }
      }
    },

    editAvatar: async (root, { avatar }, { models, user }) => {
      try {
        const filter = { _id: user.id }
        const update = { $set: { avatar } }
        await models.User.findOneAndUpdate(filter, update)
        return {
          success: true,
          message: 'new avatar set'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error changing avatar'
        }
      }
    }
  }
}
