import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { ALL_IMAGES_QUERY } from '../../apollo/queries/allImages'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ListItemText from '@material-ui/core/ListItemText'
import Popper from '@material-ui/core/Popper'
import Zoom from '@material-ui/core/Zoom'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import LinkIcon from '@material-ui/icons/Link'
import PhotoIcon from '@material-ui/icons/Photo'
import VideoIcon from '@material-ui/icons/Videocam'
import BulletListIcon from '@material-ui/icons/FormatListBulleted'
import NumberListIcon from '@material-ui/icons/FormatListNumbered'
import TaskListIcon from '@material-ui/icons/PlaylistAddCheck'
import QuoteIcon from '@material-ui/icons/FormatQuote'
import ExpandIcon from '@material-ui/icons/ExpandMore'
import HelpIcon from '@material-ui/icons/Help'
import CloseIcon from '@material-ui/icons/Close'
import uniqBy from 'lodash/uniqBy'
import { Typography } from '@material-ui/core'

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

const cheats = [
  { name: 'Highlight', example: '==text==' },
  { name: 'Underline', example: '++text++' },
  { name: 'Italic', example: '_text_' },
  { name: 'Bold', example: '**text**' },
  { name: 'Bold Italic', example: '_**text**_' },
  { name: 'Strike Through', example: '~~text~~' },
  { name: 'Heading ID', example: '##text {#id}' },
  { name: 'Sub Script', example: 'H~2~O' },
  { name: 'Super Script', example: '19^th^' },
  { name: 'Footnote 1', example: 'text [^1]' },
  { name: 'Footnote 2', example: '[^1]: text' }
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
  },
  popper: {
    width: '20vw',
    zIndex: 2,
    border: `1px solid ${theme.palette.divider}`
  },
  popperTitle: {
    padding: '.25vw',
    backgroundColor: '#ffce00',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconButton: {
    color: '#000000',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  cheat: {
    padding: '.25vw',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

class SnippetUtility extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open1: false,
      open2: false
    }
    this.anchorEl1 = React.createRef()
    this.anchorEl2 = React.createRef()
  }

  handleOpenImages = () => this.setState({ open1: true })

  onCloseImages = () => this.setState({ open1: false })

  handleImageClick = url => {
    this.onCloseImages()
    this.props.onClick(url)
  }

  handleOpenCheat = () => this.setState({ open2: true })

  onCloseCheat = () => this.setState({ open2: false })

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
          buttonRef={this.anchorEl1}
          classes={{ root: classes.buttonRoot, text: classes.buttonText }}
          onClick={this.handleOpenImages}
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
        <Button
          classes={{ root: classes.buttonRoot, text: classes.buttonText }}
          buttonRef={this.anchorEl2}
          onClick={this.handleOpenCheat}
        >
          <HelpIcon />
        </Button>
      </div>,
      <Menu
        key="menu"
        open={this.state.open1}
        onClose={this.onCloseImages}
        anchorEl={this.anchorEl1.current}
        PaperProps={{ style: { maxHeight: '75vh' } }}
      >
        {allImages &&
          uniqBy(allImages, 'url').map((ai, i) => (
            <MenuItem
              key={`image-${i}`}
              dense
              disableGutters
              onClick={() => this.handleImageClick(ai.url)}
            >
              <img src={ai.url} alt={ai.title} className={classes.thumbnail} />
              <ListItemText primary={ai.title} />
            </MenuItem>
          ))}
      </Menu>,
      <Popper
        key="popper"
        open={this.state.open2}
        anchorEl={this.anchorEl2.current}
        placement="bottom-start"
        transition
        className={classes.popper}
      >
        {({ TransitionProps }) => (
          <Zoom {...TransitionProps}>
            <Paper>
              <div className={classes.popperTitle}>
                <Typography variant="body2">Cheat Sheet</Typography>
                <IconButton
                  onClick={this.onCloseCheat}
                  disableRipple
                  classes={{ root: classes.iconButton }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              {cheats.map(c => (
                <div key={c.name} className={classes.cheat}>
                  <Typography variant="body2">{c.name}</Typography>
                  <Typography variant="body2">{c.example}</Typography>
                </div>
              ))}
            </Paper>
          </Zoom>
        )}
      </Popper>
    ]
  }
}

export default compose(
  withStyles(styles),
  graphql(ALL_IMAGES_QUERY)
)(SnippetUtility)
