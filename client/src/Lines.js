const playRegexGlobal = /^(?<character>[A-Z ]+)\.(?<text>.*?)(?:\r?\n)(?:\r?\n)/gms
const playRegexLocal = /^(?<character>[A-Z ]+)\.(?<text>.*?)(?:\r?\n)(?:\r?\n)/ms

export function lineFactory (text) {
  const matches = text.match(playRegexGlobal)
  if (matches) {
    const rawLines = []
    matches.forEach((match) => {
      const result = match.match(playRegexLocal)
      result.groups.text.split('\n').forEach((text) => {
        rawLines.push(new Lines(text, result.groups.character))
      })
    })
    return rawLines
  } else {
    const rawLines = text.data.split('\n')
    return rawLines.map((curRawLine) => new Lines(curRawLine))
  }
}

export class Lines {
  constructor (text, character) {
    this.text = text.trim()
    this.character = character.trim()
  }
}
