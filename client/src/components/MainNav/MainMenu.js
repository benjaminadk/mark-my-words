import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import AddIcon from '@material-ui/icons/AddBox'
import ViewIcon from '@material-ui/icons/ViewComfy'
import PhotoLibIcon from '@material-ui/icons/PhotoLibrary'

const items = [
  { name: 'Home', icon: <HomeIcon />, path: '/' },
  { name: 'New Post', icon: <AddIcon />, path: '/new-post' },
  { name: 'View Posts', icon: <ViewIcon />, path: '/all-posts' },
  { name: 'Photos', icon: <PhotoLibIcon />, path: '/photos' }
]

const styles = theme => ({})

const MainMenu = ({ classes, handleNavigation }) => (
  <List component="nav" disablePadding>
    {items.map(item => (
      <ListItem
        key={item.name}
        onClick={() => handleNavigation(item.path)}
        button
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.name} />
      </ListItem>
    ))}
  </List>
)

export default withStyles(styles)(MainMenu)
