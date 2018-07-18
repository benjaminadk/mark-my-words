import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
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
import QuoteIcon from '@material-ui/icons/FormatQuote'
import CheckedIcon from '@material-ui/icons/CheckBox'
import UncheckedIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import Remarkable from 'remarkable'
import RemarkableReactRenderer from 'remarkable-react'
import Highlight from 'react-highlight'
import 'highlight.js/styles/atom-one-dark.css'
import { formatDate } from '../../utils/formatDate'
import { readTime } from '../../utils/readTime'
import WhatsHot from './WhatsHot'

const styles = theme => ({
  root: {
    backgroundColor: '#e8e8e8'
  },
  empty: {
    display: 'flex',
    justifyContent: 'center'
  },
  container: {
    padding: theme.spacing.unit * 3,
    marginTop: '10vh',
    marginBottom: '10vh',
    backgroundColor: '#FFFFFF'
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between'
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
  }
})

class Post extends Component {
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
          <div>
            <Typography variant="body2" align="justify">
              {children}
            </Typography>
            <br />
          </div>
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
              <div className={this.props.classes.imageContainer}>
                <Tooltip title={title}>
                  <img
                    src={src}
                    alt={alt}
                    className={this.props.classes.image}
                  />
                </Tooltip>
              </div>
            )
          } else {
            return (
              <div className={this.props.classes.imageContainer}>
                <img src={src} alt={alt} className={this.props.classes.image} />
              </div>
            )
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

  render() {
    const {
      classes,
      latestPost,
      hotCount,
      hotCounter,
      handleHCMouseDown,
      handleHCMouseUp
    } = this.props
    return (
      <Grid container className={classes.root}>
        <Grid item xs={2} className={classes.empty}>
          <WhatsHot
            fire={latestPost.fire}
            hotCount={hotCount}
            hotCounter={hotCounter}
            handleHCMouseDown={handleHCMouseDown}
            handleHCMouseUp={handleHCMouseUp}
          />
        </Grid>
        <Grid item xs={8} className={classes.container}>
          <div className={classes.stats}>
            <Typography variant="body1">
              {formatDate(latestPost.createdAt)}
            </Typography>
            <Typography variant="body1">
              {readTime(latestPost.words)}
            </Typography>
          </div>
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
    )
  }
}

export default withStyles(styles)(Post)
