import { atom, selector } from 'recoil'

import Lines from './Lines.js'

export const LinesQueueState = atom({
  key: 'LinesQueueState',
  default: []
})

export const EnqueueLinesState = selector({
  key: 'EnqueueLinesState',

  // Return lines at front of queue without removing
  get: ({ get }) => {
    const linesQueue = get(LinesQueueState)
    if (Array.isArray(linesQueue) && linesQueue.length > 0) {
      return linesQueue[0]
    } else {
      return null
    }
  },

  // Add lines to back of queue
  set: ({ get, set }, newValues) => {
    // Get latest lines queue
    const [...linesQueue] = [...get(LinesQueueState)]

    // Ensure new value is an array
    if (!Array.isArray(newValues)) { newValues = [newValues] }

    // Loop over new values and examine type of data provided
    newValues.forEach((newValue) => {
      if (typeof newValue === 'string') {
        linesQueue.push(new Lines(newValue))
      } else if (typeof newValue === 'object' && newValue instanceof Lines) {
        linesQueue.push(newValue)
      } else {
        console.log('ERROR: unknown lines data -', newValue)
      }
    })

    // Update lines queue
    set(LinesQueueState, [...linesQueue])
  }
})

export const DequeueLinesState = selector({
  key: 'DequeueLinesState',

  // Return lines at front of queue without removing
  get: ({ get }) => {
    const linesQueue = get(LinesQueueState)
    if (Array.isArray(linesQueue) && linesQueue.length > 0) {
      return linesQueue[0]
    } else {
      return null
    }
  },

  // Remove lines from front of the queue
  set: ({ get, set }) => {
    // Get latest lines queue
    const [_, ...restQueue] = get(LinesQueueState)

    // Update lines queue
    set(LinesQueueState, restQueue)
  }
})
