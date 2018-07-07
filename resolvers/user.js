module.exports = {
  Query: {
    userById: async (root, { userId }, { models }) =>
      await models.User.findById(userId)
  },

  Mutation: {
    autoLogin: async (root, args, { models, user }) => {
      if (user) {
        return {
          success: true,
          message: `welcome back ${user.username}`,
          user
        }
      } else {
        return {
          success: false,
          message: 'invalid auth token',
          user: null
        }
      }
    }
  }
}
