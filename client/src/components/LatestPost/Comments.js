import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import DownIcon from '@material-ui/icons/KeyboardArrowDown'
import UpIcon from '@material-ui/icons/KeyboardArrowUp'
import { howLongAgo } from '../../utils/howLongAgo'

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
  rootSubCommentInput: {
    marginLeft: '1vw',
    marginRight: '1vw',
    fontSize: '10px'
  },
  subCommentButtons: {
    display: 'flex'
  },
  subCommentButton: {
    marginRight: '.5vw'
  },
  subComment: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '3vh'
  },
  subCommentAvatar: {
    height: 30,
    width: 30,
    marginRight: '1vw'
  },
  subCommentMain: {
    display: 'flex',
    flexDirection: 'column'
  },
  subCommentData: {
    display: 'flex',
    alignItems: 'center'
  }
})

const Comments = ({
  user,
  isAuthenticated,
  comment,
  comments,
  subComment,
  subCommentMode,
  subCommentCollapse,
  handleChange,
  handleCreateComment,
  handleCreateSubComment,
  handleSubCommentMode,
  resetSubCommentMode,
  handleSubCommentCollapse,
  classes
}) => (
  <Grid container className={classes.root}>
    <Grid item xs={2} className={classes.empty} />
    <Grid item xs={8} className={classes.container}>
      <Typography variant="title">Comments</Typography>
      {(!user || !isAuthenticated) && (
        <Typography variant="caption">* Login to post comments</Typography>
      )}
      {user &&
        isAuthenticated && (
          <div className={classes.rootComment}>
            <Avatar src={user.avatar} alt="profile" />
            <TextField
              type="text"
              name="comment"
              value={comment}
              onChange={handleChange}
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
              onClick={handleCreateComment}
            >
              Comment
            </Button>
          </div>
        )}
      <div className={classes.comments}>
        {comments &&
          comments.map((c, i) => (
            <div key={`comment-${i}`} className={classes.commentContainer}>
              <Avatar src={c.postedBy.avatar} alt="commenter" />
              <div className={classes.commentMain}>
                <div className={classes.commentData}>
                  <Typography variant="body2" className={classes.commentUser}>
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
                            onChange={handleChange}
                            placeholder="Post a reply..."
                            fullWidth
                            multiline
                            rowsMax={5}
                            classes={{ root: classes.rootSubCommentInput }}
                          />
                          <div className={classes.subCommentButtons}>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              disabled={!subComment}
                              onClick={() => handleCreateSubComment(c._id)}
                              className={classes.subCommentButton}
                            >
                              Reply
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={resetSubCommentMode}
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
                              onClick={() => handleSubCommentCollapse(i)}
                              classes={{ root: classes.replyRoot }}
                            >
                              {subCommentCollapse !== null ? (
                                <UpIcon />
                              ) : (
                                <DownIcon />
                              )}
                              View Replies ({c.subComments.length})
                            </Button>
                          )}
                          <Button
                            variant="text"
                            color="secondary"
                            size="small"
                            classes={{ root: classes.replyRoot }}
                            onClick={() => handleSubCommentMode(i)}
                          >
                            Reply
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                {c.subComments.length > 0 &&
                  c.subComments.map((sub, j) => (
                    <Collapse key={sub._id} in={subCommentCollapse === i}>
                      <div className={classes.subComment}>
                        <Avatar
                          src={sub.postedBy.avatar}
                          alt={sub.postedBy.username}
                          className={classes.subCommentAvatar}
                        />
                        <div className={classes.subCommentMain}>
                          <div className={classes.subCommentData}>
                            <Typography
                              variant="body2"
                              className={classes.commentUser}
                            >
                              {sub.postedBy.username}
                            </Typography>
                            <Typography variant="caption">
                              {howLongAgo(sub.createdAt)}
                            </Typography>
                          </div>
                          <Typography variant="body1">{sub.text}</Typography>
                        </div>
                      </div>
                    </Collapse>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </Grid>
    <Grid item xs={2} className={classes.empty} />
  </Grid>
)

export default withStyles(styles)(Comments)
