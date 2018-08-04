import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '5vh'
  },
  image: {
    width: '25vw',
    borderRadius: '20px',
    marginTop: '5vh'
  },
  text: {
    width: '50vw',
    marginTop: '5vh'
  }
})

class About extends Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Typography variant="display2">About The Author</Typography>
        <img
          src="https://s3-us-west-1.amazonaws.com/benjaminadk/ben%40gmail.com/ariazona+trip+031+(1).JPG"
          alt="me"
          className={classes.image}
        />
        <div>
          <Typography variant="body" align="justify" className={classes.text}>
            Hello Everybody! Thanks for taking the time to check out my blog. As
            of 2018 I am a little over one year into my pursuit of programming.
            I still consider myself a relative beginner but I am putting the
            time in and enjoying it. I really enjoy creating apps with
            JavaScript, and I especially enjoy using React to make the UI for
            those apps. Pretty soon I will be graduating Western Governor's
            University with a B.S. in Software Development. Outside of computer
            stuff I like to cycle and rock climb.
          </Typography>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(About)
