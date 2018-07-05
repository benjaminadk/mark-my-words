import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import { compose } from 'react-apollo'
import Card from '@material-ui/core/Card'
import Chip from '@material-ui/core/Chip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Loading from '../Loading'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'
import { formatDate } from '../../utils/formatDate'
import { InfiniteLoader, List } from 'react-virtualized'
import 'react-virtualized/styles.css'

const styles = theme => ({
  loader: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  list: {
    outline: 'none'
  },
  cardContainer: {
    margin: '2.5vh 10vh'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  iconButton: {
    transition: theme.transitions.create(['transform', 'color'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard
    }),
    '&:hover': {
      backgroundColor: 'transparent',
      transform: 'scale(1.25)',
      color: theme.palette.primary.main
    },
    '&:active': {
      color: theme.palette.primary.dark
    }
  },
  image: {
    height: '15vh',
    minWidth: '15vh',
    backgroundSize: 'cover',
    marginBottom: '4vh'
  },
  postedOn: {
    marginTop: '2vh',
    marginBottom: '4vh'
  },
  chip: {
    margin: theme.spacing.unit / 2,
    height: 28,
    fontSize: 11
  }
})

let virtualizingList = []

class AllPosts extends Component {
  handleViewPost = postId => this.props.history.push(`/post/${postId}`)

  handleEditPost = post => {
    this.props.handleBlog(post)
    this.props.history.push('/edit')
  }

  isRowLoaded = ({ index }) => !!virtualizingList[index]

  noRowsRendered = () => <h1>No Posts returned from Graphql Server</h1>

  rowRenderer = ({ key, index, style }) => {
    let content, classes, tags
    if (index < virtualizingList.length) {
      content = virtualizingList[index].node
      classes = this.props.classes
      tags = virtualizingList[index].node.tags
      if (!content) return null
    } else {
      content = <Loading />
      classes = this.props.classes
    }

    return (
      <div key={key} style={style}>
        <div className={classes.cardContainer}>
          <Card raised>
            <div className={classes.cardContent}>
              <div className={classes.iconButtons}>
                <Tooltip title="View Post">
                  <IconButton
                    classes={{ root: classes.iconButton }}
                    disableRipple
                    onClick={() => this.handleViewPost(content.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Post">
                  <IconButton
                    classes={{ root: classes.iconButton }}
                    disableRipple
                    onClick={() => this.handleEditPost(content)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Post">
                  <IconButton
                    classes={{ root: classes.iconButton }}
                    disableRipple
                    onClick={() => this.props.handleDeletePost(content.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <img className={classes.image} src={content.image} alt="title" />
              <Typography variant="display2" align="center">
                {content.title}
              </Typography>
              <Typography variant="subheading">{content.subTitle}</Typography>
              <Typography variant="caption" className={classes.postedOn}>
                {`Posted On ${formatDate(content.createdAt)}`}
              </Typography>
              <div>
                {tags &&
                  tags.map(t => (
                    <Chip key={t} label={t} className={classes.chip} />
                  ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  render() {
    const { loadMoreRows, posts, totalCount, classes } = this.props
    virtualizingList = posts
    return (
      <div className={classes.loader}>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={totalCount}
        >
          {({ onRowsRendered, registerChild }) => (
            <List
              className={classes.list}
              height={450}
              onRowsRendered={onRowsRendered}
              noRowsRenderer={this.noRowsRendered}
              ref={registerChild}
              rowCount={totalCount}
              rowHeight={400}
              rowRenderer={this.rowRenderer}
              width={800}
              overscanRowCount={5}
            />
          )}
        </InfiniteLoader>
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  withRouter
)(AllPosts)
