import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ChevronRight from '@material-ui/icons/ChevronRight'

const emojis = [
  [`😀`, `😍`, `😂`, `🤣`, `😃`, `😉`, `😊`, `😋`, `😎`],
  [`🤐`, `😴`, `😛`, `🤑`, `😲`, `🤬`, `🤕`, `🤢`, `🤮`],
  [`😇`, `🤠`, `🤡`, `🧐`, `🤓`, `💀`, `👻`, `👽`, `🤖`],
  [`✌️`, `🤟`, `🤘`, `👌`, `🤙`, `💪`, `🖕`, `👍`, `👎`],
  [`💩`, `🧠`, `💥`, `🔥`, `⭐`, `🌈`, `☀️`, `🌎`, `🌙`],
  [`🦍`, `🐘`, `🦏`, `🐪`, `🦈`, `🐊`, `🐅`, `🐳`, `🐖`],
  [`💎`, `⏰`, `💣`, `️💯`, `🛒`, `💡`, `🔮`, `🚲`, `💾`]
]

const styles = theme => ({
  outer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  innerTop: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '90px',
    height: '90px'
  },
  innerBottom: {
    width: '90px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonRoot: {
    width: '28px',
    height: '28px',
    margin: '1px',
    minWidth: 0,
    minHeight: 0,
    padding: 0,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  buttonText: {
    fontSize: 18
  },
  iconButtonRoot: {
    width: 24,
    height: 24,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.dark
    }
  }
})

class EmojiUtility extends Component {
  state = {
    index: 0,
    slide: true
  }

  handleIncrease = async () => {
    await this.setState({ slide: false })
    await this.setState(state => {
      const { index } = state
      return { index: index === 6 ? 0 : index + 1 }
    })
    await this.setState({ slide: true })
  }

  handleDecrease = () => {
    this.setState(state => {
      const { index } = state
      return { index: index === 0 ? 6 : index - 1 }
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.outer}>
        <div className={classes.innerTop}>
          {emojis[this.state.index].map((e, i) => (
            <Button
              key={i}
              classes={{
                root: classes.buttonRoot,
                text: classes.buttonText
              }}
              onClick={() => this.props.onClick(e)}
            >
              {e}
            </Button>
          ))}
        </div>

        <div className={classes.innerBottom}>
          <IconButton
            disableRipple
            classes={{ root: classes.iconButtonRoot }}
            onClick={this.handleDecrease}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            disableRipple
            classes={{ root: classes.iconButtonRoot }}
            onClick={this.handleIncrease}
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(EmojiUtility)
