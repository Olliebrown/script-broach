export default class SpeechSynthesis {
  constructor (props) {
    // Find the requested voice
    this.selectedVoice = SpeechSynthesis.getVoice(props.voice)

    // Build the utterance
    this.utterance = new window.SpeechSynthesisUtterance()
    this.utterance.voice = this.selectedVoice
    this.utterance.text = props.text.replace(/\n/g, '')
    this.utterance.lang = props.lang || 'en-GB'
    this.utterance.pitch = parseFloat(props.pitch, 10) || 0.8
    this.utterance.rate = parseFloat(props.rate, 10) || 1
    this.utterance.volume = parseFloat(props.volume, 10) || 1
  }

  // Basic static API access
  static supported () { return !(!window.speechSynthesis) }
  static getVoice (selectedVoice) {
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(voice => voice.name === selectedVoice)
    return (voice !== undefined ? voice : voices[0])
  }

  // Callback functions
  onend (func) { this.utterance.onend = func }
  onerror (func) { this.utterance.onerror = func }

  speak () {
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(this.utterance)
  }

  pause () { window.speechSynthesis.pause() }
  cancel () { window.speechSynthesis.cancel() }
  resume () { window.speechSynthesis.resume() }
}
