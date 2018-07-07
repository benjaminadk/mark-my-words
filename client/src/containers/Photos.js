import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { ALL_IMAGES_QUERY } from '../apollo/queries/allImages'
import { DELETE_IMAGE_MUTATION } from '../apollo/mutations/deleteImage'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Loading from '../components/Loading'
import Snack from '../components/Snack'
import UploadIcon from '@material-ui/icons/Publish'
import { copy } from '../utils/copy'
import uniqBy from 'lodash/uniqBy'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing.unit * 3
  },
  card: {
    marginRight: '2vw',
    marginBottom: '2vh'
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: '25vh',
    margin: '1vh'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonRoot: {
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '&:active': {
      backgroundColor: 'transparent'
    }
  },
  deleteText: {
    color: '#ea4335'
  },
  fab: {
    position: 'absolute',
    right: '5vh',
    bottom: '5vh'
  }
})

class Photos extends Component {
  state = {
    snack: false,
    snackMessage: '',
    snackVariant: ''
  }

  handleDeleteImage = async image => {
    var areTheySure = window.confirm(
      `Delete Image ${image.title}? This action is permanent.`
    )
    if (!areTheySure) return
    let response = await this.props.deleteImage({
      variables: { imageId: image.id, imageUrl: image.url },
      refetchQueries: [{ query: ALL_IMAGES_QUERY }]
    })
    const { success, message } = response.data.deleteImage
    this.setState({
      snack: true,
      snackMessage: message,
      snackVariant: success ? 'success' : 'error'
    })
  }

  handleCopy = text => {
    try {
      copy(text)
      this.setState({
        snack: true,
        snackMessage: 'image url copied to clipboard',
        snackVariant: 'success'
      })
    } catch (error) {
      this.setState({
        snack: true,
        snackMessage: 'error copying to clipboard',
        snackVariant: 'error'
      })
    }
  }

  handleSnackClose = () => this.setState({ snack: false })

  render() {
    const {
      data: { loading, allImages },
      classes
    } = this.props
    if (loading) return <Loading />
    return [
      <div key="main" className={classes.container}>
        {allImages &&
          uniqBy(allImages, 'url').map(ai => (
            <Card key={ai.id} className={classes.card}>
              <div className={classes.imageContainer}>
                <img src={ai.url} alt={ai.title} className={classes.image} />
              </div>
              <div>
                <Typography variant="caption" align="center">
                  {ai.title}
                </Typography>
                <div className={classes.buttonContainer}>
                  <Button
                    color="primary"
                    classes={{ root: classes.buttonRoot }}
                    onClick={() => this.handleCopy(ai.url)}
                  >
                    Copy Url
                  </Button>
                  <Button
                    classes={{
                      root: classes.buttonRoot,
                      text: classes.deleteText
                    }}
                    onClick={() => this.handleDeleteImage(ai)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        <Button variant="extendedFab" color="primary" className={classes.fab}>
          <UploadIcon />Upload
        </Button>
      </div>,
      <Snack
        key="snackbar"
        open={this.state.snack}
        variant={this.state.snackVariant}
        message={this.state.snackMessage}
        handleClose={this.handleSnackClose}
      />
    ]
  }
}

export default compose(
  withStyles(styles),
  graphql(ALL_IMAGES_QUERY),
  graphql(DELETE_IMAGE_MUTATION, { name: 'deleteImage' })
)(Photos)
