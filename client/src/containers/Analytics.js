import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { ALL_POSTS_QUERY } from '../apollo/queries/allPosts'
import Loading from '../components/Loading'
import InfoCard from '../components/Analytics/InfoCard'
import ViewsPerPost from '../components/Analytics/ViewsPerPost'
import FlamesPerPost from '../components/Analytics/FlamesPerPost'
import 'react-vis/dist/style.css'
//import moment from 'moment'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '5vh'
  }
})

class Analytics extends Component {
  state = {
    totalPosts: null,
    totalViews: null,
    viewsPerPost: [],
    firePerPost: [],
    maxViews: 0,
    maxFire: 0
  }

  componentWillMount() {
    if (!this.props.data.loading) {
      this.loadData()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.loading && !this.props.data.loading) {
      this.loadData()
    }
  }

  loadData = () => {
    // get data from apollo
    const { allPosts } = this.props.data

    // get general stats
    // can get more out of this later
    let totalViews = 0
    let totalPosts = allPosts.length
    allPosts.forEach(p => {
      p.views.forEach(v => {
        totalViews += 1
      })
    })

    // get total views per post and max views
    let maxViews = 0
    const viewsPerPost = allPosts.map((p, i) => {
      if (p.views.length > maxViews) {
        maxViews = p.views.length
      }
      return {
        x: p.title,
        y: p.views.length,
        color: i % 3
      }
    })

    // get fire (likes) per post and max fire
    let maxFire = 0
    const firePerPost = allPosts.map((p, i) => {
      if (p.fire > maxFire) {
        maxFire = p.fire
      }
      return {
        x: p.title,
        y: p.fire,
        size: p.fire * 2,
        color: i % 3
      }
    })

    // set everything to state
    this.setState({
      totalPosts,
      totalViews,
      viewsPerPost,
      maxViews,
      firePerPost,
      maxFire
    })
  }

  render() {
    const {
      classes,
      data: { loading }
    } = this.props
    if (loading) return <Loading />
    return (
      <div className={classes.root}>
        <InfoCard
          totalPosts={this.state.totalPosts}
          totalViews={this.state.totalViews}
        />
        <ViewsPerPost
          viewsPerPost={this.state.viewsPerPost}
          maxViews={this.state.maxViews}
        />
        <FlamesPerPost
          firePerPost={this.state.firePerPost}
          maxFire={this.state.maxFire}
        />
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  graphql(ALL_POSTS_QUERY)
)(Analytics)
