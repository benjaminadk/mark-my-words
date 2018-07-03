import React, { Component } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Root from './containers/Root'

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Root />
      </React.Fragment>
    )
  }
}

export default App
