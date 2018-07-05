import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose, graphql } from 'react-apollo'
import { ALL_POSTS_PAGINATED_QUERY } from '../apollo/queries/allPostsPaginated'
import { ALL_IMAGES_QUERY } from '../apollo/queries/allImages'
import { CREATE_POST_MUTATION } from '../apollo/mutations/createPost'
import { UPDATE_POST_MUTATION } from '../apollo/mutations/updatePost'
import { S3_SIGN_MUTATION } from '../apollo/mutations/s3Sign'
import { CREATE_IMAGE_MUTATION } from '../apollo/mutations/createImage'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import Snack from '../components/Snack'
import EmojiUtility from '../components/NewPost/EmojiUtility'
import SnippetUtility from '../components/NewPost/SnippetUtility'
import Dropzone from 'react-dropzone'
import axios from 'axios'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3
  },
  left: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  leftUpper: {
    display: 'grid',
    gridTemplateColumns: '50% 50%'
  },
  dropzoneContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  utilsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dropzone: {
    width: '10vw',
    height: '10vw',
    border: `2px dashed ${theme.palette.text.secondary}`,
    borderRadius: '10px',
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    marginTop: '2vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
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
  constructor(props) {
    super(props)
    this.state = {
      postId: '',
      title: '',
      subTitle: '',
      body: '',
      tag: '',
      tags: [],
      file: null,
      progress: 0,
      snack: false,
      snackMessage: '',
      snackVariant: ''
    }
    this.textarea = React.createRef()
  }

  componentWillMount() {
    if (this.props.editMode) {
      const { id, title, subTitle, image, body, tags } = this.props.blog
      this.setState({ postId: id, title, subTitle, image, body, tags })
    }
  }

  resetState = (success, message) =>
    this.setState({
      title: '',
      subTitle: '',
      body: '',
      image: '',
      tags: [],
      file: null,
      snack: true,
      snackMessage: message,
      snackVariant: success ? 'success' : 'error'
    })

  errorSnack = () =>
    this.setState({
      snack: true,
      snackVariant: 'error',
      snackMessage: 'error creating post'
    })

  handleUploadImage = async () => {
    const { file } = this.state
    let response = await this.props.s3Sign({
      variables: { filename: file.name, filetype: file.type },
      refetchQueries: [{ query: ALL_IMAGES_QUERY }]
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
    await this.props.createImage({
      variables: { url: imageUrl, title: file.name }
    })
    return imageUrl
  }

  handleCreateBlog = async () => {
    try {
      const { title, subTitle, body, tags } = this.state
      let image = await this.handleUploadImage()
      let response = await this.props.createPost({
        variables: { title, subTitle, body, image, tags },
        refetchQueries: [
          {
            query: ALL_POSTS_PAGINATED_QUERY,
            variables: { first: 5, after: '' }
          }
        ]
      })
      const { success, message } = response.data.createPost
      this.resetState(success, message)
    } catch (error) {
      this.errorSnack()
    }
  }

  handleUpdateBlog = async () => {
    try {
      const { postId, title, subTitle, image, body, tags, file } = this.state
      let imageUrl
      if (file) {
        imageUrl = await this.handleUploadImage()
      }
      let response = await this.props.updatePost({
        variables: {
          postId,
          title,
          subTitle,
          body,
          image: imageUrl ? imageUrl : image,
          tags
        },
        refetchQueries: [
          {
            query: ALL_POSTS_PAGINATED_QUERY,
            variables: { first: 5, after: '' }
          }
        ]
      })
      const { success, message } = response.data.updatePost
      this.resetState(success, message)
    } catch (error) {
      this.errorSnack()
    }
  }

  handleAddTag = () => {
    const { tag } = this.state
    if (!tag.length) return
    this.setState(state => {
      const tags = state.tags ? [...state.tags, tag] : [tag]
      return { tags, tag: '' }
    })
  }

  handleTagKeyUp = e => {
    if (e.keyCode === 13) {
      this.handleAddTag()
    }
  }

  handleDeleteTag = tag => {
    this.setState(state => {
      const tags = [...state.tags]
      const tagToDelete = tags.indexOf(tag)
      tags.splice(tagToDelete, 1)
      return { tags }
    })
  }

  handleEmojiClick = emoji =>
    this.setState(state => {
      const { body } = state
      return { body: body.concat(emoji) }
    })

  handleSnippetClick = snippet => {
    this.setState(state => {
      const { body } = state
      return { body: body.concat(snippet) }
    })
    this.textarea.current.focus()
  }

  handleSnackClose = () => this.setState({ snack: false })

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  handleDrop = files => this.setState({ file: files[0], progress: 0 })

  render() {
    const { classes } = this.props
    return [
      <Grid key="new-post" container spacing={32} className={classes.root}>
        <Grid item xs={4}>
          <div className={classes.left}>
            <div className={classes.leftUpper}>
              <div className={classes.dropzoneContainer}>
                <Typography variant="subheading">Featured Image</Typography>
                <Dropzone
                  accept="image/*"
                  multiple={false}
                  className={classes.dropzone}
                  onDrop={this.handleDrop}
                  style={{
                    backgroundImage: this.state.file
                      ? `url(${this.state.file.preview})`
                      : this.props.editMode
                        ? `url(${this.state.image})`
                        : ''
                  }}
                >
                  {!this.state.file &&
                    !this.state.image && (
                      <Typography
                        align="center"
                        variant="body2"
                        style={{ padding: '1vw' }}
                      >
                        Click || Drag & Drop
                      </Typography>
                    )}
                </Dropzone>
              </div>
              <div className={classes.utilsContainer}>
                <Typography variant="subheading">Insert Emoji</Typography>
                <EmojiUtility onClick={this.handleEmojiClick} />
              </div>
            </div>
            <TextField
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              label="Title"
            />
            <TextField
              type="text"
              name="subTitle"
              value={this.state.subTitle}
              onChange={this.handleChange}
              label="Sub Title"
            />
            <div className={classes.tagInput}>
              <TextField
                type="text"
                name="tag"
                value={this.state.tag}
                onChange={this.handleChange}
                onKeyUp={this.handleTagKeyUp}
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
            <Button
              variant="raised"
              color="primary"
              onClick={
                this.props.editMode
                  ? this.handleUpdateBlog
                  : this.handleCreateBlog
              }
            >
              {this.props.editMode ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </Grid>
        <Grid item xs={8}>
          <SnippetUtility onClick={this.handleSnippetClick} />
          <div>
            <TextField
              type="text"
              name="body"
              value={this.state.body}
              onChange={this.handleChange}
              label="New Post"
              multiline
              fullWidth
              rows={22}
              InputProps={{
                disableUnderline: true,
                classes: { input: classes.customInput },
                inputRef: this.textarea
              }}
              InputLabelProps={{ shrink: true, className: classes.customLabel }}
            />
            <LinearProgress
              variant="determinate"
              value={this.state.progress}
              className={classes.progress}
            />
          </div>
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
  graphql(UPDATE_POST_MUTATION, { name: 'updatePost' }),
  graphql(CREATE_IMAGE_MUTATION, { name: 'createImage' }),
  graphql(S3_SIGN_MUTATION, { name: 's3Sign' })
)(NewPost)
