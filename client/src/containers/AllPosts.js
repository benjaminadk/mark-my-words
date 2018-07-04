import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose, graphql } from 'react-apollo'
import { ALL_POSTS_QUERY } from '../apollo/queries/allPosts'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Chip from '@material-ui/core/Chip'
import Downshift from 'downshift'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import Loading from '../components/Loading'
import SearchIcon from '@material-ui/icons/Search'
import { formatDate } from '../utils/formatDate'

const styles = theme => ({
  rootContainer: {
    root: {
      padding: theme.spacing.unit * 3
    }
  },
  searchTitle: {
    marginTop: '5vh'
  },
  searchContainer: {
    marginTop: '2.5vh'
  },
  root: {
    flexGrow: 1,
    height: 250
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit / 2,
    height: 28,
    fontSize: 11
  },
  cardContainer: {
    marginTop: '5vh',
    marginBottom: '5vh'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer'
  },
  image: {
    height: '33vh',
    minWidth: '33vh',
    backgroundSize: 'cover',
    marginTop: '2vh',
    marginBottom: '4vh'
  },
  postedOn: {
    marginTop: '2vh',
    marginBottom: '4vh'
  }
})

class AllPosts extends Component {
  state = {
    suggestions: [],
    inputValue: '',
    selectedItem: []
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.loading && !this.props.data.loading) {
      const allTags = this.props.data.allPosts.map(post =>
        post.tags.map(t => t)
      )
      const flattened = [].concat.apply([], allTags)
      const suggestions = flattened
        .filter((f, index) => flattened.indexOf(f) === index)
        .map(s => ({ label: s }))
      this.setState({ suggestions })
    }
  }

  renderInput = inputProps => {
    const { InputProps, classes, ref, ...other } = inputProps
    return (
      <TextField
        InputProps={{
          inputRef: ref,
          classes: {
            root: classes.inputRoot
          },
          ...InputProps
        }}
        {...other}
      />
    )
  }

  renderSuggestion = ({
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  }) => {
    const isHighlighted = highlightedIndex === index
    const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1
    return (
      <MenuItem
        {...itemProps}
        key={suggestion.label}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
      >
        {suggestion.label}
      </MenuItem>
    )
  }

  getSuggestions = inputValue => {
    let count = 0

    return this.state.suggestions.filter(suggestion => {
      const keep =
        (!inputValue ||
          suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !==
            -1) &&
        count < 5

      if (keep) {
        count += 1
      }

      return keep
    })
  }

  handleKeyDown = e => {
    const { inputValue, selectedItem } = this.state
    if (selectedItem.length && !inputValue.length && e.keycode === 8) {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1)
      })
    }
  }

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value })
  }

  handleChange = item => {
    let { selectedItem } = this.state

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item]
    }

    this.setState({
      inputValue: '',
      selectedItem
    })
  }

  handleDelete = item => () => {
    this.setState(state => {
      const selectedItem = [...state.selectedItem]
      selectedItem.splice(selectedItem.indexOf(item), 1)
      return { selectedItem }
    })
  }

  filterPosts = posts => {
    const { inputValue, selectedItem } = this.state
    if (selectedItem.length === 0 && !inputValue) return posts
    else if (selectedItem.length === 0 && inputValue) {
      return posts.filter(p =>
        p.title.toLowerCase().includes(inputValue.toLowerCase())
      )
    } else {
      return posts.filter(p => {
        let display = true
        for (let i = 0; i < selectedItem.length; i++) {
          if (!p.tags.includes(selectedItem[i])) {
            display = false
            break
          }
        }
        return (
          display && p.title.toLowerCase().includes(inputValue.toLowerCase())
        )
      })
    }
  }

  handleNavigation = postId => this.props.history.push(`/post/${postId}`)

  render() {
    const {
      data: { loading, allPosts },
      classes
    } = this.props
    const { inputValue, selectedItem } = this.state
    if (loading) return <Loading />
    return (
      <Grid container className={classes.rootContainer}>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <div>
            <Typography variant="title" className={classes.searchTitle}>
              Search Posts
            </Typography>
            <div className={classes.searchContainer}>
              <Downshift
                inputValue={inputValue}
                onChange={this.handleChange}
                selectedItem={selectedItem}
              >
                {({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue: inputValue2,
                  selectedItem: selectedItem2,
                  highlightedIndex
                }) => (
                  <div className={classes.container}>
                    {this.renderInput({
                      fullWidth: true,
                      classes,
                      InputProps: getInputProps({
                        startAdornment: selectedItem.map(item => (
                          <Chip
                            key={item}
                            tabIndex={-1}
                            label={item}
                            className={classes.chip}
                            onDelete={this.handleDelete(item)}
                          />
                        )),
                        onChange: this.handleInputChange,
                        onKeyDown: this.handleKeyDown,
                        placeholder: 'Select multiple tags',
                        id: 'integration-downshift-multiple',
                        endAdornment: <SearchIcon />
                      })
                    })}
                    {isOpen ? (
                      <Paper className={classes.paper} square>
                        {this.getSuggestions(inputValue2).map(
                          (suggestion, index) =>
                            this.renderSuggestion({
                              suggestion,
                              index,
                              itemProps: getItemProps({
                                item: suggestion.label
                              }),
                              highlightedIndex,
                              selectedItem: selectedItem2
                            })
                        )}
                      </Paper>
                    ) : null}
                  </div>
                )}
              </Downshift>
            </div>
          </div>
          {allPosts &&
            this.filterPosts(allPosts).map(post => (
              <div key={post.title} className={classes.cardContainer}>
                <Card raised onClick={() => this.handleNavigation(post.id)}>
                  <div className={classes.cardContent}>
                    <img
                      className={classes.image}
                      src={post.image}
                      alt="title"
                    />
                    <Typography variant="display2" align="center">
                      {post.title}
                    </Typography>
                    <Typography variant="subheading">
                      {post.subTitle}
                    </Typography>
                    <Typography variant="caption" className={classes.postedOn}>
                      {`Posted On ${formatDate(post.createdAt)}`}
                    </Typography>
                    <div className={classes.tags}>
                      {post.tags.map(t => (
                        <Chip key={t} label={t} className={classes.chip} />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
        </Grid>
        <Grid item xs={3} />
      </Grid>
    )
  }
}

export default compose(
  withStyles(styles),
  graphql(ALL_POSTS_QUERY)
)(AllPosts)
