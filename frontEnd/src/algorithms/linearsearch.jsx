import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  StepForward,
  StepBack,
  RotateCcw,
} from 'lucide-react';

const LinearSearch = () => {
  // ==== State ====
  const [array, setArray] = useState([5, 3, 9, 1, 7, 8, 2, 6, 4, 10]);
  const [target, setTarget] = useState('7');
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [foundIdx, setFoundIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [explanation, setExplanation] = useState(
    'Enter an array and a target value to start the linear search.'
  );
  const [showExplanations, setShowExplanations] = useState([]);
  const [error, setError] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // ==== Speech Synthesis refs & setup
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const load = () => {
      const available = synthRef.current.getVoices();
      setVoices(available);
      if (available.length > 0) setSelectedVoice(available[0]);
    };
    load();
    synthRef.current.onvoiceschanged = load;
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // ==== Auto‑play handling
  useEffect(() => {
    if (stepIndex < steps.length && isPlaying) {
      timeoutRef.current = setTimeout(() => {
        setStepIndex((i) => i + 1);
      }, speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [stepIndex, isPlaying, speed, steps]);

  // ==== Apply step changes + voice
  useEffect(() => {
    if (steps.length && stepIndex < steps.length) {
      const step = steps[stepIndex];
      setCurrentIdx(step.currentIdx);
      setFoundIdx(step.foundIdx);
      setExplanation(step.explanation);
      setShowExplanations((prev) => [...prev, stepIndex]);

      if (voiceEnabled && selectedVoice) {
        if (synthRef.current.speaking) synthRef.current.cancel();
        utteranceRef.current = new SpeechSynthesisUtterance(step.explanation);
        utteranceRef.current.voice = selectedVoice;
        utteranceRef.current.rate = 0.9;
        synthRef.current.speak(utteranceRef.current);
      }
    }
  }, [stepIndex, steps, voiceEnabled, selectedVoice]);

  // ==== Input validation
  const validateInput = () => {
    setError('');
    if (!target.trim()) {
      setError('Please enter a target value.');
      return false;
    }
    const numTarget = Number(target);
    if (isNaN(numTarget)) {
      setError('Target must be a number.');
      return false;
    }
    if (array.length === 0) {
      setError('Array cannot be empty.');
      return false;
    }
    return true;
  };

  // ==== Generate steps
  const startSearch = () => {
    if (!validateInput()) return;
    const numTarget = Number(target);
    const newSteps = [];
    let idx = 0;
    let found = -1;

    // initial step
    newSteps.push({
      currentIdx: -1,
      foundIdx: -1,
      explanation: `Starting linear search for ${numTarget} in array of length ${array.length}.`,
    });

    while (idx < array.length) {
      const val = array[idx];
      newSteps.push({
        currentIdx: idx,
        foundIdx: -1,
        explanation: `Step ${idx + 1}: Checking index ${idx}, value = ${val}.`,
      });

      if (val === numTarget) {
        found = idx;
        newSteps.push({
          currentIdx: idx,
          foundIdx: idx,
          explanation: `✅ Found target ${numTarget} at index ${idx}.`,
        });
        break;
      }
      idx += 1;
    }

    if (found === -1) {
      newSteps.push({
        currentIdx: -1,
        foundIdx: -1,
        explanation: `❌ Target ${numTarget} not found in the array.`,
      });
    }

    setSteps(newSteps);
    setStepIndex(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  // ==== Handlers
  const handleArrayChange = (e) => {
    const input = e.target.value;
    const newArr = input
      .split(',')
      .map((x) => {
        const n = Number(x.trim());
        return isNaN(n) ? 0 : n;
      });
    setArray(newArr);
    setError('');
  };

  const handleTargetChange = (e) => {
    setTarget(e.target.value);
    setError('');
  };

  const handleSpeedChange = (e) => {
    setSpeed(2000 - e.target.value);
  };

  const togglePlay = () => {
    if (steps.length === 0) startSearch();
    else setIsPlaying((p) => !p);
  };

  const stepForward = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
  };
  const stepBackward = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };
  const resetSearch = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setCurrentIdx(-1);
    setFoundIdx(-1);
    setSteps([]);
    setShowExplanations([]);
    setExplanation('Enter an array and target value to begin.');
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
    }
  };
  const toggleVoice = () => {
    setVoiceEnabled((v) => !v);
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
    }
  };
  const handleVoiceChange = (e) => {
    const voice = voices.find((v) => v.name === e.target.value);
    if (voice) setSelectedVoice(voice);
  };

  // ==== Styling helpers
  const getElementClass = (idx) => {
    if (idx === foundIdx) return 'bg-green-500 text-white transform scale-110';
    if (idx === currentIdx) return 'bg-yellow-400 text-black';
    return 'bg-gray-200 text-black';
  };

  // ==== Render
  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 animate-fade-in">
          Linear Search Algorithm
        </h1>
        <p className="text-lg text-gray-700">
          Linear search checks each element in order until it finds the target. Time
          complexity: O(n)
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Interactive Demo
          </h2>

          {/* Array Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">
              Array (comma separated):
            </label>
            <input
              type="text"
              value={array.join(',')}
              onChange={handleArrayChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              aria-label="Enter array values separated by commas"
            />
          </div>

          {/* Target Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Target Value:</label>
            <input
              type="text"
              value={target}
              onChange={handleTargetChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              aria-label="Enter target value to search"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-800 rounded border border-red-300">
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              aria-label={isPlaying ? 'Pause animation' : 'Start animation'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={stepBackward}
              disabled={stepIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                stepIndex === 0
                  ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
              aria-label="Previous step"
            >
              <StepBack size={20} /> Back
            </button>
            <button
              onClick={stepForward}
              disabled={stepIndex >= steps.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                stepIndex >= steps.length - 1
                  ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
              aria-label="Next step"
            >
              <StepForward size={20} /> Next
            </button>
            <button
              onClick={resetSearch}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              aria-label="Reset search"
            >
              <RotateCcw size={20} /> Reset
            </button>
          </div>

          {/* Speed Slider */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Animation Speed:</label>
            <input
              type="range"
              min="100"
              max="1900"
              value={2000 - speed}
              onChange={handleSpeedChange}
              className="w-full"
              aria-label="Adjust animation speed"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={toggleVoice}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              aria-label={voiceEnabled ? 'Mute voice' : 'Unmute voice'}
            >
              {voiceEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
              {voiceEnabled ? 'Mute Voice' : 'Unmute Voice'}
            </button>
            {voices.length > 0 && voiceEnabled && (
              <select
                value={selectedVoice?.name || ''}
                onChange={handleVoiceChange}
                className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
                aria-label="Select voice"
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Speech Synthesis Not Available */}
          {!window.speechSynthesis && (
            <div className="p-3 bg-yellow-100 text-yellow-800 rounded border border-yellow-300">
              Voice narration is not supported in this browser.
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Algorithm Visualization
          </h2>

          {/* Array bars */}
          <div className="flex flex-wrap justify-center gap-2 min-h-[120px] mb-6 items-end">
            {array.map((val, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center transition-all duration-500 ${getElementClass(
                  idx
                )} rounded-t-lg`}
                style={{
                  width: '40px',
                  height: `${val * 10 + 40}px`,
                }}
              >
                <span className="font-bold text-sm">{val}</span>
                <span className="text-xs mt-auto">
                  {idx === currentIdx && 'CURRENT'}
                  {idx === foundIdx && 'FOUND'}
                </span>
              </div>
            ))}
          </div>

          {/* Current explanation */}
          <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-4">
            <h3 className="font-bold text-blue-800 mb-1">Current Step</h3>
            <p className="text-gray-800">{explanation}</p>
          </div>

          {/* Step‑by‑step list */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">Step‑by‑Step</h3>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`p-2 rounded border transition-colors ${
                    showExplanations.includes(i)
                      ? 'bg-white border-blue-300 shadow-sm'
                      : 'bg-gray-100 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="font-medium text-blue-700">
                    Step {i + 1}:
                  </div>
                  <div>{s.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Key Concepts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border border-blue-200">
            <h3 className="font-bold text-blue-700 mb-2">How It Works</h3>
            <p>
              Linear search iterates through the array from start to finish,
              comparing each element to the target until a match is found or
              the array ends.
            </p>
          </div>
          <div className="bg-white p-4 rounded border border-green-200">
            <h3 className="font-bold text-green-700 mb-2">Time Complexity</h3>
            <p>
              O(n) – In the worst case you examine every element.
              Simple, no‑pre‑conditions required.
            </p>
          </div>
          <div className="bg-white p-4 rounded border border-purple-200">
            <h3 className="font-bold text-purple-700 mb-2">When to Use</h3>
            <p>
              Small or unsorted datasets, quick one‑off searches,
              or when the data cannot be sorted.
            </p>
          </div>
        </div>
      </div>

      {/* Important notes */}
      <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
        <h3 className="font-bold text-yellow-800 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 text-yellow-700 space-y-1">
          <li>The array can be in any order; linear search works on any list.</li>
          <li>All elements should be numbers for accurate comparison.</li>
          <li>Edge cases: empty array, single‑element array, target not present.</li>
        </ul>
      </div>
    </div>
  );
};

export default LinearSearch;