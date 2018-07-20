import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import Dropzone from 'react-dropzone'

const styles = theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '40vw',
    height: '50vh'
  },
  dropzone: {
    width: '15vw',
    height: '15vw',
    border: `4px dashed ${theme.palette.text.secondary}`,
    borderRadius: '10px',
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    marginTop: '2vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  progress: {
    height: '2vh',
    width: '90%'
  }
})

const Upload = ({
  classes,
  open,
  file,
  progress,
  handleDrop,
  handleUploadImage,
  handleCloseUpload
}) => (
  <Dialog open={open} onClose={handleCloseUpload}>
    <DialogTitle>Upload An Image</DialogTitle>
    <DialogContent className={classes.content}>
      <Dropzone
        accept="image/*"
        className={classes.dropzone}
        onDrop={handleDrop}
        multiple={false}
        style={{
          backgroundImage: file && `url(${file.preview})`
        }}
      >
        {!file && (
          <Typography align="center" variant="body2" style={{ padding: '1vw' }}>
            Click || Drag & Drop
          </Typography>
        )}
      </Dropzone>
      <LinearProgress
        variant="determinate"
        value={progress}
        className={classes.progress}
      />
    </DialogContent>
    <DialogActions>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUploadImage}
        disabled={!file}
      >
        Upload
      </Button>
      <Button variant="contained" onClick={handleCloseUpload}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
)

export default withStyles(styles)(Upload)
