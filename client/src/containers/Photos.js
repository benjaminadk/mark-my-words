import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { ALL_IMAGES_QUERY } from '../apollo/queries/allImages'
import { S3_SIGN_MUTATION } from '../apollo/mutations/s3Sign'
import { CREATE_IMAGE_MUTATION } from '../apollo/mutations/createImage'
import { DELETE_IMAGE_MUTATION } from '../apollo/mutations/deleteImage'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Upload from '../components/Photos/Upload'
import Loading from '../components/Loading'
import Snack from '../components/Snack'
import UploadIcon from '@material-ui/icons/Publish'
import { copy } from '../utils/copy'
import uniqBy from 'lodash/uniqBy'
import axios from 'axios'

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
    open: false,
    file: null,
    progress: 0,
    snack: false,
    snackMessage: '',
    snackVariant: ''
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

  handleOpenUpload = () => this.setState({ open: true })

  handleCloseUpload = () => this.setState({ open: false })

  handleDrop = files => this.setState({ file: files[0], progress: 0 })

  handleUploadImage = async () => {
    const { file } = this.state
    let response = await this.props.s3Sign({
      variables: { filename: file.name, filetype: file.type }
    })
    const { requestUrl, imageUrl } = response.data.s3Sign
    const options = {
      headers: { 'Content-Type': file.type },
      onUploadProgress: progressEvent => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        this.setState({ progress: percentCompleted })
      }
    }
    await axios.put(requestUrl, file, options)
    let response2 = await this.props.createImage({
      variables: { url: imageUrl, title: file.name },
      refetchQueries: [{ query: ALL_IMAGES_QUERY }]
    })
    const { success, message } = response2.data.createImage
    await this.setState({
      snack: true,
      snackMessage: message,
      snackVariant: success ? 'success' : 'error'
    })
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
        <Button
          variant="extendedFab"
          color="primary"
          className={classes.fab}
          onClick={this.handleOpenUpload}
        >
          <UploadIcon />Upload
        </Button>
      </div>,
      <Snack
        key="snackbar"
        open={this.state.snack}
        variant={this.state.snackVariant}
        message={this.state.snackMessage}
        handleClose={this.handleSnackClose}
      />,
      <Upload
        open={this.state.open}
        progress={this.state.progress}
        file={this.state.file}
        handleDrop={this.handleDrop}
        handleUploadImage={this.handleUploadImage}
        handleCloseUpload={this.handleCloseUpload}
      />
    ]
  }
}

export default compose(
  withStyles(styles),
  graphql(ALL_IMAGES_QUERY),
  graphql(S3_SIGN_MUTATION, { name: 's3Sign' }),
  graphql(CREATE_IMAGE_MUTATION, { name: 'createImage' }),
  graphql(DELETE_IMAGE_MUTATION, { name: 'deleteImage' })
)(Photos)
