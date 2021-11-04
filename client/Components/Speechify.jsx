import React, { useEffect, useState } from 'react'

import Axios from 'axios'

import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil'
import { LinesQueueState, EnqueueLinesState, DequeueLinesState } from '../src/globalData.js'

import { Button, Grid, Typography } from '@material-ui/core'

import Lines from '../src/Lines.js'
import SpeechSynthesis from '../src/synthesis.js'

export default function App () {
  // Global state management
  const linesQueue = useRecoilValue(LinesQueueState)
  const [currentLines, dequeueLines] = useRecoilState(DequeueLinesState)
  const enqueueLines = useSetRecoilState(EnqueueLinesState)

  // Local state management
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [utterance, setUtterance] = useState(null)

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

  // Manage the queue
  const handleEnd = (event) => {
    dequeueLines()
  }

  useEffect(() => {
    if (currentLines !== null) {
      const newSynthesis = new SpeechSynthesis({ text: currentLines.text })
      newSynthesis.onend(handleEnd)
      setUtterance(newSynthesis)

      if (isPlaying) { newSynthesis.play() }
    }
  }, [currentLines])

  useEffect(() => {
    // Asynchronous text retrieval function
    const retrieveText = async () => {
      try {
        const response = await Axios.get('./shadowbox/Act1-Pg48.txt')
        if (typeof response?.data === 'string') {
          const matches = response?.data.match(/^(?<character>[A-Z ]+\.)(?<text>.*?)(?:\r?\n)(?:\r?\n)/gms)
          if (matches) {
            const rawLines = []
            matches.forEach((match) => {
              const result = match.match(/^(?<character>[A-Z ]+)\.(?<text>.*?)(?:\r?\n)(?:\r?\n)/ms)
              result.groups.text.split('\n').forEach((text) => {
                rawLines.push(new Lines(text, result.groups.character))
              })
            })
            enqueueLines(rawLines)
          } else {
            console.log('No matches')
            const rawLines = response.data.split('\n')
            enqueueLines(rawLines)
          }
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
      <Grid item xs={4}>
        <Button variant="contained" fullWidth disabled={isPlaying && !isPaused} onClick={handlePlay}>{'Play'}</Button>
      </Grid>
      <Grid item xs={4}>
        <Button variant="contained" fullWidth disabled={isPaused || !isPlaying} onClick={handlePause}>{'Pause'}</Button>
      </Grid>
      <Grid item xs={4}>
        <Button variant="contained" fullWidth disabled={!isPlaying} onClick={handleStop}>{'Stop'}</Button>
      </Grid>
      {linesQueue.map((curLines, i) => (
        <React.Fragment key={i}>
          <Grid item xs={2}>
            <Typography variant="body1">{curLines.character}</Typography>
          </Grid>
          <Grid item xs={10}>
            <Typography variant="body2">{curLines.text}</Typography>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  )
}
