import React, { useState, useEffect, useRef } from 'react'

export default function BinarySearchTutorial() {
  const [arrayInput, setArrayInput] = useState('1,2,3,4,5,6,7,8,9')
  const [targetInput, setTargetInput] = useState('5')
  const [array, setArray] = useState([])
  const [target, setTarget] = useState(null)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [voiceOn, setVoiceOn] = useState(true)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    setHeaderVisible(true)
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis
      const loadVoices = () => {
        const available = synth.getVoices()
        setVoices(available)
        if (available.length > 0) setSelectedVoice(available[0].voiceURI)
      }
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices
      }
      loadVoices()
    }
  }, [])

  useEffect(() => {
    if (playing && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, speed)
    } else {
      setPlaying(false)
    }
    return () => clearTimeout(timerRef.current)
  }, [playing, currentStep, steps, speed])

  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length && voiceOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(steps[currentStep].description)
      const voice = voices.find(v => v.voiceURI === selectedVoice)
      if (voice) utter.voice = voice
      window.speechSynthesis.speak(utter)
    }
  }, [currentStep, voiceOn, steps, selectedVoice, voices])

  const parseInput = () => {
    const arr = arrayInput
      .split(/[,\\s]+/)
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => Number(s))
      .filter(n => !isNaN(n))
    const tgt = Number(targetInput)
    if (arr.length === 0) {
      alert('Please enter a valid array of numbers.')
      return false
    }
    if (isNaN(tgt)) {
      alert('Please enter a valid target number.')
      return false
    }
    setArray(arr)
    setTarget(tgt)
    return true
  }

  const generateSteps = () => {
    if (!parseInput()) return
    const arr = [...array].sort((a, b) => a - b)
    const tgt = target
    let low = 0
    let high = arr.length - 1
    const newSteps = []
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      if (arr[mid] === tgt) {
        newSteps.push({
          low,
            high,
            mid,
            description: `Found target ${tgt} at index ${mid}.`,
          })
        break
      } else if (arr[mid] < tgt) {
        newSteps.push({
          low: mid + 1,
            high,
            mid,
            description: `arr[${mid}] = ${arr[mid]} is less than ${tgt}, move low to ${mid + 1}.`,
          })
        low = mid + 1
      } else {
        newSteps.push({
          low,
            high: mid - 1,
            mid,
            description: `arr[${mid}] = ${arr[mid]} is greater than ${tgt}, move high to ${mid - 1}.`,
          })
        high = mid - 1
      }
    }
    if (newSteps.length === 0) {
      newSteps.push({
        low: -1,
        high: -1,
        mid: -1,
        description: `Target ${tgt} not found in array.`,
      })
    }
    setSteps(newSteps)
    setCurrentStep(0)
    setPlaying(true)
  }

  const reset = () => {
    setPlaying(false)
    setCurrentStep(-1)
    setSteps([])
    window.speechSynthesis.cancel()
  }

  const stepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1)
  }

  const stepBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  const togglePlay = () => {
    setPlaying(prev => !prev)
  }

  const toggleVoice = () => {
    setVoiceOn(prev => !prev)
    if (!voiceOn) {
      window.speechSynthesis.cancel()
    }
  }

  const current = steps[currentStep] || {}

  const getBoxClass = index => {
    let base = 'w-12 h-12 flex items-center justify-center border-2 mr-1 mb-1 text-sm font-mono'
    if (index === current.mid) return `${base} bg-yellow-200 border-yellow-500`
    if (index === current.low) return `${base} border-blue-500`
    if (index === current.high) return `${base} border-red-500`
    return `${base} border-gray-300`
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className={`text-3xl font-bold mb-4 transition-opacity duration-500 ${headerVisible ? 'opacity-100' : 'opacity-0'}`}>Learn binary-search Algorithm</h1>
      <p className={`text-lg mb-6 transition-opacity duration-500 ${headerVisible ? 'opacity-100' : 'opacity-0'}`}>
        Binary Search efficiently finds an element in a sorted array by repeatedly dividing the search interval in half.
      </p>
      <div className="mb-4">
        <label className="block mb-1">Array (comma or space separated):</label>
        <input
          aria-label="Array input"
          type="text"
          value={arrayInput}
          onChange={e => setArrayInput(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <label className="block mt-2 mb-1">Target value:</label>
        <input
          aria-label="Target input"
          type="text"
          value={targetInput}
          onChange={e => setTargetInput(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          aria-label="Start simulation"
          onClick={generateSteps}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Start
        </button>
        <button
          aria-label="Reset simulation"
          onClick={reset}
          className="mt-3 bg-gray-600 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
      {'speechSynthesis' in window ? null : <div className="text-yellow-600 mb-2">Voice narration unavailable in this browser.</div>}
      <div className="flex items-center mb-2">
        <button
          aria-label="Play/Pause"
          onClick={togglePlay}
          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
        >
          {playing ? '⏸️' : '▶️'}
        </button>
        <button
          aria-label="Step Back"
          onClick={stepBack}
          className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
        >
          ◀️
        </button>
        <button
          aria-label="Step Forward"
          onClick={stepForward}
          className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
        >
          ▶️
        </button>
        <label className="ml-4 mr-2">Speed:</label>
        <input
          aria-label="Speed control"
          type="range"
          min="300"
          max="2000"
          step="100"
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className="mr-2"
        />
        <button
          aria-label="Toggle Voice"
          onClick={toggleVoice}
          className="bg-purple-500 text-white px-3 py-1 rounded"
        >
          {voiceOn ? '🔊 Voice On' : '🔈 Voice Off'}
        </button>
        {'speechSynthesis' in window && voices.length > 0 && (
          <select
            aria-label="Voice selection"
            value={selectedVoice}
            onChange={e => setSelectedVoice(e.target.value)}
            className="ml-2 p-1 rounded"
          >
            {voices.map(v => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="mt-4">
        <div className="flex flex-wrap">
          {array.map((val, idx) => (
            <div key={idx} className={getBoxClass(idx)}>
              {val}
            </div>
          ))}
        </div>
        {currentStep >= 0 && (
          <div className="mt-4 p-3 border rounded bg-gray-50 transition-opacity duration-500">
            {steps[currentStep].description}
          </div>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Pseudocode</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {`function binarySearch(arr, target):
    low = 0
    high = length(arr) - 1
    while low <= high:
        mid = floor((low + high) / 2)
        if arr[mid] == target:
            return mid
        else if arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`}
        </pre>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Complexity</h2>
        <p>Time: O(log n) – each step halves the search space.</p>
        <p>Space: O(1) – only a few variables are used.</p>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Tips</h2>
        <ul className="list-disc ml-5">
          <li>Array must be sorted; otherwise binary search fails.</li>
          <li>If not sorted, sort first or use a different search method.</li>
          <li>Remember to adjust low/high correctly to avoid infinite loops.</li>
        </ul>
      </div>
    </div>
  )
}