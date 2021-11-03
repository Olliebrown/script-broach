import React from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import { Button, Typography, Grid } from '@material-ui/core'

export default function Dictaphone () {
  const {
    transcript, listening, resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  // Button click callbacks
  const handleStart = (e) => { SpeechRecognition.startListening({ continuous: true }) }
  const handleStop = (e) => { SpeechRecognition.stopListening() }

  // Fallback when browser is not supported
  if (!browserSupportsSpeechRecognition) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1">{'Browser doesn\'t support speech recognition.'}</Typography>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body1">{`Microphone: ${listening ? 'on' : 'off'}`}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" fullWidth onClick={handleStart}>{'Start'}</Button>
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" fullWidth onClick={handleStop}>{'Stop'}</Button>
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" fullWidth onClick={resetTranscript}>{'Reset'}</Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">{transcript}</Typography>
      </Grid>
    </Grid>
  )
}
