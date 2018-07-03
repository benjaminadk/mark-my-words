import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose, graphql } from 'react-apollo'
import { POST_QUERY } from '../apollo/queries/postById'
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
import QuoteIcon from '@material-ui/icons/FormatQuote'
import CheckedIcon from '@material-ui/icons/CheckBox'
import UncheckedIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import Loading from '../components/Loading'
import Remarkable from 'remarkable'
import RemarkableReactRenderer from 'remarkable-react'
import Highlight from 'react-highlight'
import 'highlight.js/styles/atom-one-dark.css'
import { HashLink as Link } from 'react-router-hash-link'

const styles = theme => ({})

class Post extends Component {
  componentDidMount() {
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
          <Typography variant="display4">{children}</Typography>
        ),
        h2: ({ children }) => (
          <Typography variant="display3">{children}</Typography>
        ),
        h3: ({ children }) => (
          <Typography variant="display2">{children}</Typography>
        ),
        h4: ({ children }) => (
          <Typography variant="display1">{children}</Typography>
        ),
        h5: ({ children }) => (
          <Typography variant="headline">{children}</Typography>
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
            <Typography varaint="body2">
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
  render() {
    const {
      data: { loading, postById }
    } = this.props
    if (loading) return <Loading />
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="display4">{postById.title}</Typography>
          <div>{this.md.render(postById.body)}</div>
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  withStyles(styles),
  graphql(POST_QUERY, {
    options: props => ({ variables: { postId: props.match.params.postId } })
  })
)(Post)
