import { createMuiTheme } from '@material-ui/core/styles'

export default createMuiTheme({
  typography: {
    fontFamily: "'Fira Code', 'Roboto', 'Arial'",
    useNextVariants: true,
    suppressDeprecationWarnings: true
  },
  palette: {
    primary: {
      main: '#3f51b5'
    },
    secondary: {
      main: '#c1272d'
    }
  }
})
