import React, { useState, useEffect, useRef } from 'react'

export default function InsertionSort() {
  const [input, setInput] = useState('5,2,9,1,5')
  const [array, setArray] = useState([])
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [voiceOn, setVoiceOn] = useState(true)
  const [voiceSupported, setVoiceSupported] = useState('speechSynthesis' in window)
  const timerRef = useRef(null)

  const parseInput = (str) => {
    const parts = str.split(',').map((s) => s.trim())
    if (parts.some((p) => p === '' || isNaN(Number(p)))) || parts.length === 0) {
      alert('Please enter a valid comma‑separated list of numbers.')
      return null
    }
    return parts.map(Number)
  }

  const generateSteps = (arr) => {
    const steps = []
    const a = [...arr]
    for (let i = 1; i < a.length; i++) {
      const key = a[i]
      let j = i - 1
      steps.push({ array: [...a], highlight: [i], description: `Start iteration ${i}, key = ${key}` })
      while (j >= 0 && a[j] > key) {
        steps.push({ array: [...a], highlight: [j, j + 1], description: `Compare ${a[j]} > ${key}, shift ${a[j]}` })
        a[j + 1] = a[j]
        steps.push({ array: [...a], highlight: [j + 1], description: `Shifted ${a[j]} to position ${j + 1}` })
        j--
      }
      a[j + 1] = key
      steps.push({ array: [...a], highlight: [j + 1], description: `Place key ${key} at position ${j + 1}` })
    }
    steps.push({ array: [...a], highlight: [], description: 'Array sorted' })
    return steps
  }

  const startSimulation = () => {
    const arr = parseInput(input)
    if (!arr) return
    setArray(arr)
    const s = generateSteps(arr)
    setSteps(s)
    setCurrentStep(0)
    setPlaying(true)
  }

  const reset = () => {
    setPlaying(false)
    setCurrentStep(0)
    setArray([])
    setSteps([])
  }

  const speak = (text) => {
    if (!voiceOn || !voiceSupported) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utter)
  }

  useEffect(() => {
    if (steps.length === 0) return
    const { description } = steps[currentStep] || {}
    if (description) speak(description)
  }, [currentStep, steps, voiceOn, voiceSupported])

  useEffect(() => {
    if (!playing) {
      clearTimeout(timerRef.current)
      return
    }
    if (currentStep >= steps.length - 1) {
      setPlaying(false)
      return
    }
    timerRef.current = setTimeout(() => {
      setCurrentStep((c) => c + 1)
    }, 1000 / speed)
    return () => clearTimeout(timerRef.current)
  }, [playing, currentStep, steps, speed])

  const handlePlayPause = () => {
    if (steps.length === 0) return
    setPlaying((p) => !p)
    if (playing) window.speechSynthesis.cancel()
  }

  const handleStep = (delta) => {
    setCurrentStep((c) => {
      const newStep = c + delta
      if (newStep < 0) return 0
      if (newStep >= steps.length) return steps.length - 1
      return newStep
    })
  }

  const handleSpeedChange = (e) => {
    setSpeed(Number(e.target.value))
  }

  const toggleVoice = () => {
    setVoiceOn((v) => !v)
    if (!voiceOn) {
      const { description } = steps[currentStep] || {}
      if (description) speak(description)
    } else {
      window.speechSynthesis.cancel()
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 opacity-0 animate-fadeIn">Learn Insertion Sort Algorithm</h1>
        <p className="text-gray-700 opacity-0 animate-fadeIn delay-200">
          Insertion Sort builds a sorted array one element at a time, shifting larger
          elements to make room for the next element.
        </p>
      </header>
      <section className="mb-4">
        <label className="block mb-2 font-medium">Enter array (comma‑separated):</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded p-2 w-full mb-2"
          aria-label="Array input"
        />
        <button
          onClick={startSimulation}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          aria-label="Start simulation"
        >
          Start
        </button>
        <button
          onClick={reset}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          aria-label="Reset"
        >
          Reset
        </button>
        <button
          onClick={handlePlayPause}
          className="bg-green-600 text-white px-4 py-2 rounded mr-2"
          aria-label="Play/Pause"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={() => handleStep(-1)}
          className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
          aria-label="Step back"
        >
          ◀︎
        </button>
        <button
          onClick={() => handleStep(1)}
          className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
          aria-label="Step forward"
        >
          ▶︎
        </button>
        <label className="ml-4 mr-2">Speed:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={handleSpeedChange}
          className="inline-block w-32"
          aria-label="Speed control"
        />
        <button
          onClick={toggleVoice}
          className="ml-4 bg-purple-600 text-white px-4 py-2 rounded"
          aria-label="Toggle voice"
        >
          {voiceOn ? '🔊 Voice On' : '🔈 Voice Off'}
        </button>
        {!voiceSupported && (
          <div className="text-yellow-600 mt-2">
            Voice narration unavailable in this browser.
          </div>
        )}
      </section>
      <section className="mb-6">
        <div className="flex justify-center items-end h-48 mb-4">
          {steps[currentStep]?.array.map((val, idx) => {
            const isHighlighted = steps[currentStep]?.highlight.includes(idx)
            const isSorted = steps[currentStep]?.highlight.length === 0 && currentStep === steps.length - 1
            const bg = isHighlighted ? 'bg-green-400' : 'bg-gray-300'
            return (
              <div
                key={idx}
                className={`mx-1 w-8 text-center text-sm ${bg} transition-all duration-500`}
                style={{ height: `${val * 10 + 20}px` }}
              >
                {val}
              </div>
            )
          })}
        </div>
        <div className="h-24 overflow-y-auto">
          {steps.map((step, idx) => (
            <p
              key={idx}
              className={`transition-opacity duration-500 ${
                idx === currentStep ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {step.description}
            </p>
          ))}
        </div>
      </section>
      <footer className="mt-8 text-sm text-gray-600">
        <p className="mb-2">Tip: Insertion sort is efficient for small or nearly sorted arrays.</p>
        <p>Common pitfalls: forgetting to shift elements correctly.</p>
        <p>Further reading: Algorithms textbooks, online resources.</p>
      </footer>
    </div>
  )
}