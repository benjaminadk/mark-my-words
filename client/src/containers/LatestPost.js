import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose, graphql } from 'react-apollo'
import { LATEST_POST_QUERY } from '../apollo/queries/latestPost'
import { ALL_POSTS_QUERY } from '../apollo/queries/allPosts'
import { ADD_VIEW_MUTATION } from '../apollo/mutations/addView'
import { CREATE_COMMENT_MUTATION } from '../apollo/mutations/createComment'
import { CREATE_SUB_COMMENT_MUTATION } from '../apollo/mutations/createSubComment'
import { HashLink as Link } from 'react-router-hash-link'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import QuoteIcon from '@material-ui/icons/FormatQuote'
import CheckedIcon from '@material-ui/icons/CheckBox'
import UncheckedIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import Loading from '../components/Loading'
import Snack from '../components/Snack'
import Remarkable from 'remarkable'
import RemarkableReactRenderer from 'remarkable-react'
import Highlight from 'react-highlight'
import 'highlight.js/styles/atom-one-dark.css'
import '../styles/post.css'
import { formatDate } from '../utils/formatDate'
import { howLongAgo } from '../utils/howLongAgo'

const styles = theme => ({
  root: {
    backgroundColor: '#e8e8e8'
  },
  container: {
    padding: theme.spacing.unit * 3,
    marginTop: '10vh',
    marginBottom: '10vh',
    backgroundColor: '#FFFFFF'
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  image: {
    height: '20vw',
    minWidth: '20vw',
    margin: '2vh 0'
  },
  subTitle: {
    marginBottom: '5vh'
  },
  divider: {
    marginBottom: '5vh'
  },
  rootComment: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5vh'
  },
  rootCommentInput: {
    marginLeft: '1vw',
    marginRight: '1vw'
  },
  commentContainer: {
    display: 'flex',
    marginTop: '5vh'
  },
  commentMain: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1vw',
    marginRight: '.5vw',
    width: '100%'
  },
  commentData: {
    display: 'flex',
    alignItems: 'center'
  },
  commentUser: {
    marginRight: '1vw'
  },
  replyRoot: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  subCommentButtons: {
    display: 'flex'
  },
  subCommentButton: {
    marginRight: '.5vw'
  }
})

class LatestPost extends Component {
  state = {
    dummy: 0,
    comment: '',
    subComment: '',
    subCommentMode: null,
    snack: false,
    snackMessage: '',
    snackVariant: ''
  }

  componentWillMount() {
    this.md = new Remarkable({
      typographer: true,
      html: true,
      breaks: true,
      linkify: true
    })
    this.md.core.ruler.enable(['abbr'])
    this.md.block.ruler.enable(['footnote', 'deflist'])
    this.md.inline.ruler.enable([
      'footnote_inline',
      'ins',
      'mark',
      'sub',
      'sup'
    ])
    this.md.renderer = new RemarkableReactRenderer({
      components: {
        h1: ({ children }) => (
          <Typography variant="display3">{children}</Typography>
        ),
        h2: ({ children }) => (
          <Typography variant="display2">{children}</Typography>
        ),
        h3: ({ children }) => (
          <Typography variant="display1">{children}</Typography>
        ),
        h4: ({ children }) => (
          <Typography variant="headline">{children}</Typography>
        ),
        h5: ({ children }) => (
          <Typography variant="subheading">{children}</Typography>
        ),
        h6: ({ children }) => (
          <Typography variant="title">{children}</Typography>
        ),
        p: ({ children }) => (
          <Typography variant="body2">{children}</Typography>
        ),
        blockquote: ({ children }) => (
          <div style={{ display: 'flex' }}>
            <QuoteIcon style={{ transform: 'scaleX(-1)' }} />
            <Typography variant="body2">
              {children[0].props.children}
            </Typography>
            <QuoteIcon />
          </div>
        ),
        a: ({ children, href }) => {
          if (href.includes('http')) {
            return (
              <a href={href} target="_blank" className="Post-a">
                {children}
              </a>
            )
          } else {
            return (
              <Link to={`${this.props.location.pathname}#${href}`}>
                {children}
              </Link>
            )
          }
        },
        img: ({ alt, src, title }) => {
          if (title) {
            return (
              <Tooltip title={title}>
                <img src={src} alt={alt} className="Post-img" />
              </Tooltip>
            )
          } else {
            return <img src={src} alt={alt} className="Post-img" />
          }
        },
        table: ({ children }) => <Table>{children}</Table>,
        tbody: ({ children }) => <TableBody>{children}</TableBody>,
        th: ({ children }) => (
          <TableCell className="Post-th" variant="head">
            {children}
          </TableCell>
        ),
        tr: ({ children }) => (
          <TableRow className="Post-tr">{children}</TableRow>
        ),
        td: ({ children }) => <TableCell>{children}</TableCell>,
        li: ({ children }) => {
          const str = children[0].props.children[0]
          if (str.slice(0, 3) === '[ ]') {
            return (
              <ListItem>
                <ListItemIcon>
                  <UncheckedIcon />
                </ListItemIcon>
                <ListItemText primary={str.slice(4)} />
              </ListItem>
            )
          } else if (str.slice(0, 3) === '[x]') {
            return (
              <ListItem>
                <ListItemIcon>
                  <CheckedIcon />
                </ListItemIcon>
                <ListItemText primary={str.slice(4)} />
              </ListItem>
            )
          } else {
            return <li>{children}</li>
          }
        },
        pre: ({ content, params: language }) => (
          <Highlight className={language}>{content}</Highlight>
        ),
        code: ({ content, params: language }) => (
          <span
            style={{
              backgroundColor: 'lightgrey',
              fontSize: 12,
              fontFamily: 'Fira Code',
              borderRadius: '2px',
              padding: '2px'
            }}
          >
            {content}
          </span>
        )
      }
    })
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

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  handleSnackClose = () => this.setState({ snack: false })

  render() {
    const {
      data: { loading, latestPost },
      classes,
      user,
      isAuthenticated
    } = this.props
    const { comment, subComment, subCommentMode } = this.state
    if (loading || !latestPost) return <Loading />
    return [
      <div key="main">
        <Grid container className={classes.root}>
          <Grid item xs={2} className={classes.empty} />
          <Grid item xs={8} className={classes.container}>
            <Typography>{formatDate(latestPost.createdAt)}</Typography>
            <div className={classes.imageContainer}>
              <img
                src={latestPost.image}
                alt="featured"
                className={classes.image}
              />
            </div>
            <Typography variant="display3" align="center">
              {latestPost.title}
            </Typography>
            <Typography
              variant="title"
              align="center"
              className={classes.subTitle}
            >
              {latestPost.subTitle}
            </Typography>
            <Divider className={classes.divider} />
            <div>{this.md && this.md.render(latestPost.body)}</div>
          </Grid>
          <Grid item xs={2} className={classes.empty} />
        </Grid>
        <Grid container className={classes.root}>
          <Grid item xs={2} className={classes.empty} />
          <Grid item xs={8} className={classes.container}>
            <Typography variant="title">Comments</Typography>
            {user &&
              isAuthenticated && (
                <div className={classes.rootComment}>
                  <Avatar src={user.avatar} alt="profile" />
                  <TextField
                    type="text"
                    name="comment"
                    value={comment}
                    onChange={this.handleChange}
                    placeholder="Post a comment..."
                    fullWidth
                    multiline
                    rowsMax={5}
                    className={classes.rootCommentInput}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={!comment}
                    onClick={this.handleCreateComment}
                  >
                    Comment
                  </Button>
                </div>
              )}
            <div className={classes.comments}>
              {latestPost.comments &&
                latestPost.comments.map((c, i) => (
                  <div
                    key={`comment-${i}`}
                    className={classes.commentContainer}
                  >
                    <Avatar src={c.postedBy.avatar} alt="commenter" />
                    <div className={classes.commentMain}>
                      <div className={classes.commentData}>
                        <Typography
                          variant="body2"
                          className={classes.commentUser}
                        >
                          {c.postedBy.username}
                        </Typography>
                        <Typography variant="caption">
                          {howLongAgo(c.createdAt)}
                        </Typography>
                      </div>
                      <Typography variant="body1">{c.text}</Typography>
                      {user &&
                        isAuthenticated && (
                          <div>
                            {subCommentMode === i ? (
                              <div className={classes.rootComment}>
                                <Avatar src={user.avatar} alt="profile" />
                                <TextField
                                  type="text"
                                  name="subComment"
                                  value={subComment}
                                  onChange={this.handleChange}
                                  placeholder="Post a reply..."
                                  fullWidth
                                  multiline
                                  rowsMax={5}
                                  className={classes.rootCommentInput}
                                />
                                <div className={classes.subCommentButtons}>
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    disabled={!subComment}
                                    onClick={() =>
                                      this.handleCreateSubComment(c._id)
                                    }
                                    className={classes.subCommentButton}
                                  >
                                    Reply
                                  </Button>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={this.resetSubCommentMode}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                {c.subComments.length > 0 && (
                                  <Button
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    classes={{ root: classes.replyRoot }}
                                  >
                                    View Replies
                                  </Button>
                                )}
                                <Button
                                  variant="text"
                                  color="secondary"
                                  size="small"
                                  classes={{ root: classes.replyRoot }}
                                  onClick={() => this.handleSubCommentMode(i)}
                                >
                                  Reply
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
            </div>
          </Grid>
          <Grid item xs={2} className={classes.empty} />
        </Grid>
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
  withStyles(styles),
  graphql(LATEST_POST_QUERY),
  graphql(ADD_VIEW_MUTATION, { name: 'addView' }),
  graphql(CREATE_COMMENT_MUTATION, { name: 'createComment' }),
  graphql(CREATE_SUB_COMMENT_MUTATION, { name: 'createSubComment' })
)(LatestPost)
