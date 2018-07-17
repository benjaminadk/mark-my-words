import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { LATEST_POST_QUERY } from '../apollo/queries/latestPost'
import { ALL_POSTS_QUERY } from '../apollo/queries/allPosts'
import { ADD_VIEW_MUTATION } from '../apollo/mutations/addView'
import { ADD_FIRE_MUTATION } from '../apollo/mutations/addFire'
import { CREATE_COMMENT_MUTATION } from '../apollo/mutations/createComment'
import { CREATE_SUB_COMMENT_MUTATION } from '../apollo/mutations/createSubComment'
import Post from '../components/LatestPost/Post'
import Comments from '../components/LatestPost/Comments'
import Loading from '../components/Loading'
import Snack from '../components/Snack'

class LatestPost extends Component {
  state = {
    dummy: 0,
    comment: '',
    subComment: '',
    subCommentMode: null,
    subCommentCollapse: null,
    hotCounter: false,
    hotCount: 0,
    snack: false,
    snackMessage: '',
    snackVariant: ''
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.data.loading &&
      !this.props.data.loading &&
      this.props.data.latestPost
    ) {
      await this.props.addView({
        variables: { postId: this.props.data.latestPost.id },
        refetchQueries: [{ query: ALL_POSTS_QUERY }]
      })
    }
  }

  handleCreateComment = async () => {
    let response, success, message
    try {
      response = await this.props.createComment({
        variables: {
          text: this.state.comment,
          postId: this.props.data.latestPost.id
        },
        refetchQueries: [{ query: LATEST_POST_QUERY }]
      })
      success = response.data.createComment.success
      message = response.data.createComment.message
      this.setState({
        snack: success,
        snackMessage: message,
        snackVariant: 'success',
        comment: ''
      })
    } catch (error) {
      this.setState({
        snack: true,
        snackMessage: message,
        snackVariant: 'error'
      })
    }
  }

  handleCreateSubComment = async commentId => {
    let response, success, message
    try {
      response = await this.props.createSubComment({
        variables: {
          text: this.state.subComment,
          commentId
        },
        refetchQueries: [{ query: LATEST_POST_QUERY }]
      })
      success = response.data.createSubComment.success
      message = response.data.createSubComment.message
      this.setState({
        snack: success,
        snackMessage: message,
        snackVariant: 'success',
        subComment: '',
        subCommentMode: null
      })
    } catch (error) {
      this.setState({
        snack: true,
        snackMessage: message,
        snackVariant: 'error'
      })
    }
  }

  handleSubCommentMode = i => this.setState({ subCommentMode: i })

  resetSubCommentMode = () =>
    this.setState({ subComment: '', subCommentMode: null })

  handleSubCommentCollapse = i => {
    if (this.state.subCommentCollapse === i) {
      this.setState({ subCommentCollapse: null })
    } else {
      this.setState({ subCommentCollapse: i })
    }
  }

  handleHC = () => this.setState({ hotCount: this.state.hotCount + 1 })

  handleHCMouseDown = () => {
    this.setState({ hotCounter: true })
    this.counter = setInterval(() => this.handleHC(), 200)
  }

  handleHCMouseUp = async () => {
    clearInterval(this.counter)
    let response = await this.props.addFire({
      variables: {
        postId: this.props.data.latestPost.id,
        plus: this.state.hotCount
      },
      refetchQueries: [{ query: LATEST_POST_QUERY }]
    })
    const { success, message } = response.data.addFire
    await this.setState({
      hotCounter: false,
      hotCount: 0,
      snack: true,
      snackVariant: success ? 'warning' : 'error',
      snackMessage: message
    })
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  handleSnackClose = () => this.setState({ snack: false })

  render() {
    const {
      data: { loading, latestPost },
      user,
      isAuthenticated
    } = this.props
    const {
      comment,
      subComment,
      subCommentMode,
      subCommentCollapse,
      hotCount,
      hotCounter
    } = this.state
    if (loading || !latestPost) return <Loading />
    return [
      <div key="main">
        <Post
          latestPost={latestPost}
          hotCount={hotCount}
          hotCounter={hotCounter}
          handleHCMouseDown={this.handleHCMouseDown}
          handleHCMouseUp={this.handleHCMouseUp}
        />
        <Comments
          user={user}
          isAuthenticated={isAuthenticated}
          comment={comment}
          comments={latestPost.comments}
          subComment={subComment}
          subCommentMode={subCommentMode}
          subCommentCollapse={subCommentCollapse}
          handleChange={this.handleChange}
          handleCreateComment={this.handleCreateComment}
          handleCreateSubComment={this.handleCreateSubComment}
          handleSubCommentMode={this.handleSubCommentMode}
          resetSubCommentMode={this.resetSubCommentMode}
          handleSubCommentCollapse={this.handleSubCommentCollapse}
        />
      </div>,
      <Snack
        key="snackbar"
        open={this.state.snack}
        message={this.state.snackMessage}
        variant={this.state.snackVariant}
        handleClose={this.handleSnackClose}
      />
    ]
  }
}

export default compose(
  graphql(LATEST_POST_QUERY),
  graphql(ADD_VIEW_MUTATION, { name: 'addView' }),
  graphql(ADD_FIRE_MUTATION, { name: 'addFire' }),
  graphql(CREATE_COMMENT_MUTATION, { name: 'createComment' }),
  graphql(CREATE_SUB_COMMENT_MUTATION, { name: 'createSubComment' })
)(LatestPost)
