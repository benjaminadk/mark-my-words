import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1vw',
    height: '25%',
    marginBottom: '10vh'
  },
  cardContent: {
    marginTop: '2.5vh'
  },
  cardInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

const InfoCard = ({ classes, totalPosts, totalViews }) => (
  <Card className={classes.card}>
    <Typography variant="display1">Overall Statistics</Typography>
    <div className={classes.cardContent}>
      <div className={classes.cardInfo}>
        <Typography variant="body2">Total Posts: </Typography>
        <Typography variant="display1">{totalPosts}</Typography>
      </div>
      <div className={classes.cardInfo}>
        <Typography variant="body2">Total Views: </Typography>
        <Typography variant="display1">{totalViews}</Typography>
      </div>
    </div>
  </Card>
)

export default withStyles(styles)(InfoCard)
