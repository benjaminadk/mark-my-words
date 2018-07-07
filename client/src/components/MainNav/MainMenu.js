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
import NewIcon from '@material-ui/icons/FiberNew'
import PieChartIcon from '@material-ui/icons/PieChart'
import PersonIcon from '@material-ui/icons/Person'

const items = [
  { name: 'Home', icon: <HomeIcon />, path: '/' },
  { name: 'Latest Post', icon: <NewIcon />, path: '/latest-post' },
  { name: 'New Post', icon: <AddIcon />, path: '/new-post' },
  { name: 'View Posts', icon: <ViewIcon />, path: '/all-posts' },
  { name: 'Analytics', icon: <PieChartIcon />, path: '/analytics' },
  { name: 'Photos', icon: <PhotoLibIcon />, path: '/photos' }
]

const styles = theme => ({})

const MainMenu = ({ classes, userId, handleNavigation }) => (
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
    {userId && (
      <ListItem onClick={() => handleNavigation(`/user/${userId}`)} button>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="User Profile" />
      </ListItem>
    )}
  </List>
)

export default withStyles(styles)(MainMenu)
