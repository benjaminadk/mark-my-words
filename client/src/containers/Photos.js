import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { ALL_IMAGES_QUERY } from '../apollo/queries/allImages'
import Loading from '../components/Loading'

const styles = theme => ({})

class Photos extends Component {
  render() {
    const {
      data: { loading, allImages }
    } = this.props
    if (loading) return <Loading />
    return <div>Photos {allImages && allImages.length}</div>
  }
}

export default compose(
  withStyles(styles),
  graphql(ALL_IMAGES_QUERY)
)(Photos)
