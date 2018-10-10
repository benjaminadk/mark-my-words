import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { ALL_POSTS_QUERY } from '../apollo/queries/allPosts'
import { DELETE_POST_MUTATION } from '../apollo/mutations/deletePost'
import Grid from '@material-ui/core/Grid'
// import Chip from '@material-ui/core/Chip'
// import Downshift from 'downshift'
// import TextField from '@material-ui/core/TextField'
// import Paper from '@material-ui/core/Paper'
// import MenuItem from '@material-ui/core/MenuItem'
// import Typography from '@material-ui/core/Typography'
// import SearchIcon from '@material-ui/icons/Search'
import Loading from '../components/Loading'
import Snack from '../components/Snack'
import AllPosts from '../components/AllPosts/AllPosts'

const styles = theme => ({})

class AllPostsContainer extends Component {
  state = {
    snack: false,
    snackMessage: '',
    snackVariant: ''
  }

  handleDeletePost = async postId => {
    var areTheySure = window.confirm('Delete Post? Action is permanent.')
    if (!areTheySure) return
    let response = await this.props.deletePost({
      variables: { postId },
      refetchQueries: [{ query: ALL_POSTS_QUERY }]
    })
    const { success, message } = response.data.deletePost
    this.setState({
      snack: true,
      snackVariant: success ? 'success' : 'error',
      snackMessage: message
    })
  }

  handleSnackClose = () => this.setState({ snack: false })

  render() {
    const { snack, snackMessage, snackVariant } = this.state
    const {
      data: { loading, allPosts },
      handleBlog,
      isAdmin
    } = this.props
    if (loading) return <Loading />
    return [
      <Grid key="all-posts" container>
        <Grid item xs={3} />
        <Grid item xs={6}>
          {allPosts &&
            allPosts.map(p => (
              <AllPosts
                key={p.id}
                post={p}
                isAdmin={isAdmin}
                handleDeletePost={this.handleDeletePost}
                handleBlog={handleBlog}
              />
            ))}
        </Grid>
        <Grid item xs={3} />
      </Grid>,
      <Snack
        key="snackbar"
        open={snack}
        variant={snackVariant}
        message={snackMessage}
        handleClose={this.handleSnackClose}
      />
    ]
  }
}

export default compose(
  withStyles(styles),
  graphql(ALL_POSTS_QUERY),
  graphql(DELETE_POST_MUTATION, { name: 'deletePost' })
)(AllPostsContainer)
