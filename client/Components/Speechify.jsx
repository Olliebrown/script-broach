import React, { useEffect, useState } from 'react'

import Axios from 'axios'

import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil'
import { LinesQueueState, EnqueueLinesState, DequeueLinesState } from '../src/globalData.js'

import { Button, Grid, Typography } from '@material-ui/core'

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Levenshtein from 'fast-levenshtein'

import { lineFactory } from '../src/Lines.js'
import SpeechSynthesis from '../src/synthesis.js'

const activeCharacter = 'BRIAN'

export default function App () {
  // Global state management
  const linesQueue = useRecoilValue(LinesQueueState)
  const [currentLines, dequeueLines] = useRecoilState(DequeueLinesState)
  const enqueueLines = useSetRecoilState(EnqueueLinesState)

  // Local state management
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [utterance, setUtterance] = useState(null)

  // Speech recognition state
  const {
    transcript, listening, resetTranscript
  } = useSpeechRecognition()

  // Callback functions
  const handlePlay = () => {
    // Is there a valid utterance?
    if (utterance) {
      // Play or unpause utterance
      if (!isPlaying) {
        utterance.play()
      } else if (isPaused) {
        utterance.resume()
      }
    }

    // Update playing/paused state
    setIsPlaying(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    // Pause the utterance if there is one and it is playing
    if (utterance && isPlaying) {
      utterance.pause()
    }

    // Update paused state
    setIsPaused(true)
  }

  const handleStop = () => {
    // Fully cancel the utterance if there is one and it is playing
    if (isPlaying && utterance) {
      utterance.cancel()
    }

    // Update playing/paused state
    setIsPlaying(false)
    setIsPaused(false)
  }

  const handleNext = (event) => {
    resetTranscript()
    dequeueLines()
  }

  // Manage the queue
  const handleEnd = (event) => {
    dequeueLines()
  }

  useEffect(() => {
    if (currentLines !== null) {
      if (currentLines.character === activeCharacter) {
        if (!listening) { SpeechRecognition.startListening({ continuous: true }) }
        else { resetTranscript() }
      } else {
        if (listening) { SpeechRecognition.stopListening() }
        const newSynthesis = new SpeechSynthesis({ text: currentLines.text })
        newSynthesis.onend(handleEnd)
        setUtterance(newSynthesis)

        if (isPlaying) { newSynthesis.play() }
      }
    }
  }, [currentLines])

  // Move forward once lines match well enough
  useEffect(() => {
    if (listening && Levenshtein.get(transcript, currentLines.text) < 10) {
      resetTranscript()
      dequeueLines()
    }
  }, [transcript])

  useEffect(() => {
    // Asynchronous text retrieval function
    const retrieveText = async () => {
      try {
        const response = await Axios.get('./shadowbox/Act1-Pg37.txt')
        if (typeof response?.data === 'string') {
          const newLines = lineFactory(response.data)
          enqueueLines(newLines)
        }
      } catch (err) {
        console.error('Failed to download text')
        console.error(err)
      }
    }

    // Initiate asynchronous text retrieval
    retrieveText()
  }, [enqueueLines])

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Button variant="contained" fullWidth disabled={isPlaying && !isPaused} onClick={handlePlay}>{'Play'}</Button>
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" fullWidth disabled={isPaused || !isPlaying} onClick={handlePause}>{'Pause'}</Button>
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" fullWidth disabled={!isPlaying} onClick={handleStop}>{'Stop'}</Button>
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" fullWidth disabled={!listening} onClick={handleNext}>{'Next'}</Button>
      </Grid>
      {linesQueue.map((curLines, i) => (
        (i === 0 && curLines.character === activeCharacter
          ? <React.Fragment key={i}>
            <Grid item xs={3} md={2}>
              <Typography variant="body1">{curLines.character}</Typography>
            </Grid>
            <Grid item xs={9} md={10}>
              <Typography variant="body2">{curLines.text}</Typography>
            </Grid>
            <Grid item xs={3} md={2}>
              <Typography variant="body1">{''}</Typography>
            </Grid>
            <Grid item xs={9} md={10}>
              <Typography variant="body2">{transcript}</Typography>
            </Grid>
          </React.Fragment>
          : <React.Fragment key={i}>
            <Grid item xs={3} md={2}>
              <Typography variant="body1">{curLines.character}</Typography>
            </Grid>
            <Grid item xs={9} md={10}>
              <Typography variant="body2">{curLines.text}</Typography>
            </Grid>
          </React.Fragment>)
      ))}
    </Grid>
  )
}
