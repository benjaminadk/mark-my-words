module.exports = {
  Query: {
    userById: async (root, { userId }, { models }) =>
      await models.User.findById(userId)
  },

  Mutation: {
    autoLogin: async (root, args, { models, user }) => {
      if (user) {
        if (user.googleId === '117803716222757935095') {
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
    }
  }
}
