import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { ALL_POSTS_PAGINATED_QUERY } from '../apollo/queries/allPostsPaginated'
import { DELETE_POST_MUTATION } from '../apollo/mutations/deletePost'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Downshift from 'downshift'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import Loading from '../components/Loading'
import Snack from '../components/Snack'
import AllPosts from '../components/AllPosts/AllPosts'

const config = {
  options: props => {
    let after = props.endCursor || ''
    return {
      variables: { first: 5, after }
    }
  },
  force: true,
  props: ({ ownProps, data }) => {
    const { loading, allPostsPaginated, fetchMore } = data
    const loadMoreRows = () => {
      return fetchMore({
        variables: {
          after: allPostsPaginated.pageInfo.endCursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          const totalCount = fetchMoreResult.allPostsPaginated.totalCount
          const newEdges = fetchMoreResult.allPostsPaginated.edges
          const pageInfo = fetchMoreResult.allPostsPaginated.pageInfo
          return {
            allPostsPaginated: {
              totalCount,
              edges: [...prev.allPostsPaginated.edges, ...newEdges],
              pageInfo,
              __typename: 'PaginationPayload'
            }
          }
        }
      })
    }
    return { loading, allPostsPaginated, loadMoreRows }
  }
}

const styles = theme => ({
  rootContainer: {
    root: {
      padding: theme.spacing.unit * 3
    }
  },
  outer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  searchTitle: {
    marginTop: '2.5vh'
  },
  searchContainer: {
    marginTop: '2.5vh'
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  inputRoot: {
    flexWrap: 'wrap',
    width: '50vw'
  },
  chip: {
    margin: theme.spacing.unit / 2,
    height: 28,
    fontSize: 11
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  }
})

class AllPostsContainer extends Component {
  state = {
    suggestions: [],
    inputValue: '',
    selectedItem: [],
    snack: false,
    snackMessage: '',
    snackVariant: ''
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.allPostsPaginated && this.props.allPostsPaginated) {
      const allTags = this.props.allPostsPaginated.edges.map(post =>
        post.node.tags.map(t => t)
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

  handleDelete = item => () => {
    console.log(item)
    this.setState(state => {
      const selectedItem = [...state.selectedItem]
      selectedItem.splice(selectedItem.indexOf(item), 1)
      return { selectedItem }
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

  handleSnackClose = () => this.setState({ snack: false })

  handleDeletePost = async postId => {
    var areTheySure = window.confirm('Delete Post? Action is permanent.')
    if (!areTheySure) return
    let response = await this.props.deletePost({
      variables: { postId },
      refetchQueries: [
        { query: ALL_POSTS_PAGINATED_QUERY, variables: { first: 5, after: '' } }
      ]
    })
    const { success, message } = response.data.deletePost
    this.setState({
      snack: true,
      snackVariant: success ? 'success' : 'error',
      snackMessage: message
    })
  }

  filterPosts = posts => {
    const { inputValue, selectedItem } = this.state
    if (selectedItem.length === 0 && !inputValue) return posts
    else if (selectedItem.length === 0 && inputValue) {
      return posts.filter(p =>
        p.node.title.toLowerCase().includes(inputValue.toLowerCase())
      )
    } else {
      return posts.filter(p => {
        let display = true
        for (let i = 0; i < selectedItem.length; i++) {
          if (!p.node.tags.includes(selectedItem[i])) {
            display = false
            break
          }
        }
        return (
          display &&
          p.node.title.toLowerCase().includes(inputValue.toLowerCase())
        )
      })
    }
  }

  render() {
    const {
      loading,
      allPostsPaginated,
      loadMoreRows,
      handleBlog,
      classes
    } = this.props
    const { inputValue, selectedItem } = this.state
    let renderChild
    if (loading) {
      renderChild = <Loading />
    } else {
      renderChild = (
        <AllPosts
          loadMoreRows={loadMoreRows}
          posts={allPostsPaginated.edges}
          totalCount={allPostsPaginated.totalCount}
          handleBlog={handleBlog}
          handleDeletePost={this.handleDeletePost}
        />
      )
    }
    return [
      <Grid key="main" container className={classes.rootContainer}>
        <Grid item xs={12}>
          <div className={classes.outer}>
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
          {renderChild}
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
  graphql(ALL_POSTS_PAGINATED_QUERY, config),
  graphql(DELETE_POST_MUTATION, { name: 'deletePost' })
)(AllPostsContainer)
