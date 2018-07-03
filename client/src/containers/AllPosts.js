import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose, graphql } from 'react-apollo'
import { ALL_POSTS_QUERY } from '../apollo/queries/allPosts'
import Grid from '@material-ui/core/Grid'
import Loading from '../components/Loading'

const styles = theme => ({})

class AllPosts extends Component {
  handleNavigation = postId => this.props.history.push(`/post/${postId}`)

  render() {
    const {
      data: { loading, allPosts },
      classes
    } = this.props
    if (loading) return <Loading />
    return (
      <Grid container>
        <Grid item xs={12}>
          {allPosts &&
            allPosts.map(post => (
              <h1
                key={post.title}
                onClick={() => this.handleNavigation(post.id)}
              >
                {post.title}
              </h1>
            ))}
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  withStyles(styles),
  graphql(ALL_POSTS_QUERY)
)(AllPosts)
