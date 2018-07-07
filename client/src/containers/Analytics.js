import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { ALL_POSTS_QUERY } from '../apollo/queries/allPosts'
import Loading from '../components/Loading'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import ViewsPerPost from '../components/Analytics/ViewsPerPost'
import 'react-vis/dist/style.css'
//import moment from 'moment'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '5vh',
    height: '100%'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1vw',
    height: '25%'
  },
  cardContent: {
    marginTop: '2.5vh'
  },
  cardInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

class Analytics extends Component {
  state = {
    totalPosts: null,
    totalViews: null,
    viewsPerPost: [],
    titles: []
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

    // get total views per post
    const viewsPerPost = allPosts.map((p, i) => ({
      x: p.title,
      y: p.views.length,
      color: i % 3
    }))
    const titles = allPosts.map(p => p.title)
    this.setState({ totalPosts, totalViews, viewsPerPost, titles })
  }

  render() {
    const {
      classes,
      data: { loading }
    } = this.props
    if (loading) return <Loading />
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <Typography variant="title">Overall Statistics</Typography>
          <div className={classes.cardContent}>
            <div className={classes.cardInfo}>
              <Typography variant="body2">Total Posts: </Typography>
              <Typography variant="display1">
                {this.state.totalPosts}
              </Typography>
            </div>
            <div className={classes.cardInfo}>
              <Typography variant="body2">Total Views: </Typography>
              <Typography variant="display1">
                {this.state.totalViews}
              </Typography>
            </div>
          </div>
        </Card>
        <ViewsPerPost
          viewsPerPost={this.state.viewsPerPost}
          titles={this.state.titles}
        />
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  graphql(ALL_POSTS_QUERY)
)(Analytics)
