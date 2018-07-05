import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { ALL_IMAGES_QUERY } from '../../apollo/queries/allImages'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ListItemText from '@material-ui/core/ListItemText'
import LinkIcon from '@material-ui/icons/Link'
import PhotoIcon from '@material-ui/icons/Photo'
import VideoIcon from '@material-ui/icons/Videocam'
import BulletListIcon from '@material-ui/icons/FormatListBulleted'
import NumberListIcon from '@material-ui/icons/FormatListNumbered'
import TaskListIcon from '@material-ui/icons/PlaylistAddCheck'
import QuoteIcon from '@material-ui/icons/FormatQuote'
import ExpandIcon from '@material-ui/icons/ExpandMore'
import uniqBy from 'lodash/uniqBy'

const snippets = [
  { label: 'H1', value: '#' },
  { label: 'H2', value: '##' },
  { label: 'H3', value: '###' },
  { label: 'H4', value: '####' },
  { label: 'H5', value: '#####' },
  { label: 'HR', value: '---' },
  { label: <LinkIcon />, value: '[LINK TEXT](LINK URL "TOOLTIP)' },
  {
    label: <PhotoIcon />,
    value: '![IMAGE ALT TEXT HERE](IMAGE URL "TOOLTIP")'
  },
  {
    label: <VideoIcon />,
    value:
      '[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](http://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)'
  },
  {
    label: <BulletListIcon />,
    value: '- item one\n- item two\n- item three'
  },
  {
    label: <NumberListIcon />,
    value: '1. item one\n2. item two\n3. item three'
  },
  {
    label: <TaskListIcon />,
    value: '- [ ] task one\n- [ ] task two\n- [ ] task three'
  },
  { label: <QuoteIcon />, value: '> blockquote text here' }
]

const styles = theme => ({
  container: {
    display: 'flex',
    marginLeft: '10vw'
  },
  buttonRoot: {
    width: '35px',
    height: '35px',
    marginRight: '5px',
    minWidth: 0,
    minHeight: 0,
    padding: 0,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF'
  },
  thumbnail: {
    height: '4vh'
  }
})

class SnippetUtility extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.anchorEl = React.createRef()
  }

  handleOpenMenu = () => {
    this.setState({ open: true })
  }

  onClose = () => this.setState({ open: false })

  handleMenuItemClick = url => {
    this.onClose()
    this.props.onClick(url)
  }

  render() {
    const {
      classes,
      onClick,
      data: { loading, allImages }
    } = this.props
    if (loading) return null
    return [
      <div key="snippet-utility" className={classes.container}>
        <Button
          buttonRef={this.anchorEl}
          classes={{
            root: classes.buttonRoot,
            text: classes.buttonText
          }}
          onClick={this.handleOpenMenu}
        >
          <ExpandIcon />
        </Button>
        {snippets.map((s, i) => (
          <Button
            key={`snippet-${i}`}
            classes={{
              root: classes.buttonRoot,
              text: classes.buttonText
            }}
            onClick={() => onClick(s.value)}
          >
            {s.label}
          </Button>
        ))}
      </div>,
      <Menu
        key="menu"
        open={this.state.open}
        onClose={this.onClose}
        anchorEl={this.anchorEl.current}
        PaperProps={{
          style: {
            maxHeight: '75vh'
          }
        }}
      >
        {allImages &&
          uniqBy(allImages, 'url').map((ai, i) => (
            <MenuItem
              key={`image-${i}`}
              dense
              disableGutters
              onClick={() => this.handleMenuItemClick(ai.url)}
            >
              <img src={ai.url} alt={ai.title} className={classes.thumbnail} />
              <ListItemText primary={ai.title} />
            </MenuItem>
          ))}
      </Menu>
    ]
  }
}

export default compose(
  withStyles(styles),
  graphql(ALL_IMAGES_QUERY)
)(SnippetUtility)
