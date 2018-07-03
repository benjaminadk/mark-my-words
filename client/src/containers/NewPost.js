import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose, graphql } from 'react-apollo'
import { CREATE_POST_MUTATION } from '../apollo/mutations/createPost'
import { S3_SIGN_MUTATION } from '../apollo/mutations/s3Sign'
import { CREATE_IMAGE_MUTATION } from '../apollo/mutations/createImage'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import Snack from '../components/Snack'
import Dropzone from 'react-dropzone'
import axios from 'axios'

const styles = theme => ({
  left: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  dropzone: {
    width: '10vw',
    height: '10vw',
    border: `2px dashed ${theme.palette.text.secondary}`,
    borderRadius: '10px',
    cursor: 'pointer',
    backgroundSize: 'cover',
    alignSelf: 'center'
  },
  tagInput: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addTagButton: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  paper: {
    minHeight: 36
  },
  chip: {
    margin: theme.spacing.unit / 2,
    height: 28,
    fontSize: 11
  },
  customInput: {
    border: '1px solid',
    fontSize: 16,
    padding: '10px 12px',
    fontFamily: 'Fira Code',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: theme.palette.primary.main,
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  customLabel: {
    fontSize: 18
  },
  progress: {
    height: '2vh',
    width: '100%'
  }
})

class NewPost extends Component {
  state = {
    title: '',
    body: '',
    tag: '',
    tags: [],
    file: null,
    progress: 0,
    snack: false,
    snackMessage: '',
    snackVariant: ''
  }

  handleUploadImage = async (file, requestUrl) => {
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
  }

  handleCreatePost = async image => {
    const { title, body } = this.state
    let response = await this.props.createPost({
      variables: { title, body, image }
    })
    const { success, message } = response.data.createPost
    this.setState({
      title: '',
      body: '',
      snack: true,
      snackMessage: message,
      snackVariant: success ? 'success' : 'error'
    })
  }

  handleBlog = async () => {
    try {
      const { file } = this.state
      let response = await this.props.s3Sign({
        variables: { filename: file.name, filetype: file.type }
      })
      const { requestUrl, imageUrl } = response.data.s3Sign
      await this.handleUploadImage(file, requestUrl)
      let response2 = await this.props.createImage({
        variables: { url: imageUrl, title: file.name }
      })
      const { success, message } = response2.data.createImage
      await this.setState({
        snack: true,
        snackVariant: success ? 'success' : 'error',
        snackMessage: message
      })
      await this.handleCreatePost(imageUrl)
    } catch (error) {
      // error
    }
  }

  handleAddTag = () => {
    const { tag } = this.state
    this.setState(state => {
      const tags = state.tags ? [...state.tags, tag] : [tag]
      return { tags, tag: '' }
    })
  }

  handleDeleteTag = tag => {
    this.setState(state => {
      const tags = [...state.tags]
      const tagToDelete = tags.indexOf(tag)
      tags.splice(tagToDelete, 1)
      return { tags }
    })
  }

  handleSnackClose = () => this.setState({ snack: false })

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  handleDrop = files => this.setState({ file: files[0], progress: 0 })

  render() {
    const { classes } = this.props
    return [
      <Grid key="new-post" container spacing={32}>
        <Grid item xs={4}>
          <div className={classes.left}>
            <TextField
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              label="Title"
            />
            <Dropzone
              accept="image/*"
              multiple={false}
              className={classes.dropzone}
              onDrop={this.handleDrop}
              style={{
                backgroundImage: this.state.file
                  ? `url(${this.state.file.preview})`
                  : ''
              }}
            />
            <div className={classes.tagInput}>
              <TextField
                type="text"
                name="tag"
                value={this.state.tag}
                onChange={this.handleChange}
                label="Tag"
              />
              <IconButton
                onClick={this.handleAddTag}
                className={classes.addTagButton}
              >
                <AddIcon />
              </IconButton>
            </div>
            <Paper className={classes.paper}>
              {this.state.tags &&
                this.state.tags.map(t => (
                  <Chip
                    key={t}
                    label={t}
                    onDelete={() => this.handleDeleteTag(t)}
                    className={classes.chip}
                  />
                ))}
            </Paper>
            <Button variant="raised" color="primary" onClick={this.handleBlog}>
              Create Post
            </Button>
          </div>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="text"
            name="body"
            value={this.state.body}
            onChange={this.handleChange}
            label="New Post"
            multiline
            fullWidth
            rows={25}
            InputProps={{
              disableUnderline: true,
              classes: { input: classes.customInput }
            }}
            InputLabelProps={{ shrink: true, className: classes.customLabel }}
          />
          <LinearProgress
            variant="determinate"
            value={this.state.progress}
            className={classes.progress}
          />
        </Grid>
      </Grid>,
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
  graphql(CREATE_POST_MUTATION, { name: 'createPost' }),
  graphql(CREATE_IMAGE_MUTATION, { name: 'createImage' }),
  graphql(S3_SIGN_MUTATION, { name: 's3Sign' })
)(NewPost)
