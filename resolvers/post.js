const mongoose = require('mongoose')

let totalCount = 0

module.exports = {
  Query: {
    allPostsPaginated: (root, { first, after }, { models }) => {
      let edgesArray = []
      let cursorNumeric = parseInt(Buffer.from(after, 'base64').toString('ascii'))
      if (!cursorNumeric) cursorNumeric = 0
      var edgesAndPageInfoPromise = new Promise((resolve, reject) => {
        let edges = models.Post.where('id')
          .gt(cursorNumeric)
          .find({}, (err, result) => {
            if (err) {
              console.error('---Error ' + err)
            }
          })
          .limit(first)
          .cursor()

        edges.on('data', res => {
          edgesArray.push({
            cursor: Buffer.from(res.id.toString()).toString('base64'),
            node: {
              id: res.id,
              title: res.title,
              subTitle: res.subTitle,
              body: res.body,
              image: res.image,
              tags: res.tags,
              createdAt: res.createdAt
            }
          })
        })

        edges.on('error', err => {
          reject(err)
        })

        edges.on('end', () => {
          let endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : NaN
          let hasNextPageFlag = new Promise((resolve, reject) => {
            if (endCursor) {
              let endCursorNumeric = parseInt(Buffer.from(endCursor, 'base64').toString('ascii'))
              models.Post.where('id')
                .gt(endCursorNumeric)
                .count((err, count) => {
                  count > 0 ? resolve(true) : resolve(false)
                })
            } else resolve(false)
          })

          resolve({
            edges: edgesArray,
            pageInfo: {
              endCursor: endCursor,
              hasNextPage: hasNextPageFlag
            }
          })
        })
      })
      let totalCountPromise = new Promise((resolve, reject) => {
        if (totalCount === 0) {
          totalCount = models.Post.count((err, count) => {
            if (err) reject(err)
            resolve(count)
          })
        } else resolve(totalCount)
      })

      let returnValue = Promise.all([edgesAndPageInfoPromise, totalCountPromise]).then(values => {
        return {
          edges: values[0].edges,
          totalCount: values[1],
          pageInfo: {
            endCursor: values[0].pageInfo.endCursor,
            hasNextPage: values[0].pageInfo.hasNextPage
          }
        }
      })
      return returnValue
    },

    allPosts: async (root, args, { models }) => {
      return await models.Post.find()
    },

    postById: async (root, { postId }, { models }) => {
      return await models.Post.findOne({ id: postId })
    },

    latestPost: async (root, args, { models }) => {
      const post = await models.Post.findOne()
        .sort('-createdAt')
        .exec()
      return post
    }
  },

  Mutation: {
    createPost: async (root, args, { models, user }) => {
      try {
        const { title, subTitle, body, words, image, tags } = args
        const post = new models.Post({
          title,
          subTitle,
          body,
          words,
          image,
          tags
        })
        const savedPost = await post.save()
        const notification = new models.Notification({
          type: 'New Post',
          avatar: user.avatar,
          text: title,
          link: `/post/${savedPost.id}`
        })
        const savedNotification = await notification.save()
        const users = await models.User.find().select('_id')
        users.forEach(async u => {
          let filter = { _id: u._id }
          let update = { $push: { notifications: savedNotification._id } }
          await models.User.findOneAndUpdate(filter, update)
        })
        return {
          success: true,
          message: 'new post created'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error creating post'
        }
      }
    },

    updatePost: async (root, args, { models }) => {
      try {
        const { postId, title, subTitle, body, words, image, tags } = args
        const filter = { id: postId }
        const update = { $set: { title, subTitle, body, words, image, tags } }
        await models.Post.findOneAndUpdate(filter, update)
        return {
          success: true,
          message: 'post updated successfully'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error updating post'
        }
      }
    },

    deletePost: async (root, { postId }, { models }) => {
      try {
        await models.Post.findOneAndDelete({ id: postId })
        return {
          success: true,
          message: 'post deleted successfully'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error deleting post'
        }
      }
    },

    addView: async (root, { postId }, { models }) => {
      try {
        const filter = { id: postId }
        const update = { $inc: { views: 1 } }
        await models.Post.findOneAndUpdate(filter, update)
        return {
          success: true,
          message: 'view added to post'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error adding view to post'
        }
      }
    },

    addFire: async (root, { postId, plus }, { models }) => {
      try {
        const filter = { id: postId }
        const update = { $inc: { fire: plus } }
        await models.Post.findOneAndUpdate(filter, update)
        return {
          success: true,
          message: `${plus} fire points added to post`
        }
      } catch (error) {
        return {
          success: false,
          message: 'error adding fire to post'
        }
      }
    },

    dropDatabase: async () => {
      try {
        await mongoose.connection.dropDatabase()
        return {
          success: true,
          message: 'database dropped'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error dropping database'
        }
      }
    }
  }
}
