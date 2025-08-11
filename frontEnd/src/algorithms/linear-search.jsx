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
  const [array, setArray] = useState([3, 7, 1, 9, 5, 12, 4, 8, 6, 10]);
  const [target, setTarget] = useState('12');
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [foundIdx, setFoundIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [stepIndex, setStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState(
    'Enter an array and target value to start the linear search.'
  );
  const [steps, setSteps] = useState([]);
  const [showExplanations, setShowExplanations] = useState([]);

  // Speech synthesis refs
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  // ==== Effects ====
  // Load voices once
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

  // Auto‑play next step
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

  // Apply step data
  useEffect(() => {
    if (steps.length && stepIndex < steps.length) {
      const step = steps[stepIndex];
      setCurrentIdx(step.currentIdx);
      setFoundIdx(step.foundIdx);
      setExplanation(step.explanation);
      setShowExplanations((prev) => [...prev, stepIndex]);

      if (voiceEnabled && selectedVoice) {
        if (synthRef.current.speaking) synthRef.current.cancel();
        const utter = new SpeechSynthesisUtterance(step.explanation);
        utter.voice = selectedVoice;
        utter.rate = 0.9;
        synthRef.current.speak(utter);
        utteranceRef.current = utter;
      }
    }
  }, [stepIndex, steps, voiceEnabled, selectedVoice]);

  // ==== Helpers ====
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

  const startSearch = () => {
    if (!validateInput()) return;
    const numTarget = Number(target);
    const newSteps = [];

    // Initial step
    newSteps.push({
      currentIdx: -1,
      foundIdx: -1,
      explanation: `Starting linear search for target ${numTarget} in an array of ${array.length} elements.`,
    });

    let found = false;
    for (let i = 0; i < array.length; i++) {
      newSteps.push({
        currentIdx: i,
        foundIdx: -1,
        explanation: `Step ${i + 1}: Inspecting index ${i} (value = ${array[i]})`,
      });
      if (array[i] === numTarget) {
        found = true;
        newSteps.push({
          currentIdx: i,
          foundIdx: i,
          explanation: `✅ Target found at index ${i} (value = ${array[i]})`,
        });
        break;
      }
    }
    if (!found) {
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

  const handleArrayChange = (e) => {
    const input = e.target.value;
    const newArray = input
      .split(',')
      .map((s) => {
        const n = Number(s.trim());
        return isNaN(n) ? 0 : n;
      })
      .filter((_, idx) => idx < 20); // limit to 20 elements
    setArray(newArray);
    setError('');
  };

  const handleTargetChange = (e) => {
    setTarget(e.target.value);
    setError('');
  };

  const handleSpeedChange = (e) => {
    setSpeed(2000 - Number(e.target.value));
  };

  const togglePlay = () => {
    if (steps.length === 0) startSearch();
    else setIsPlaying(!isPlaying);
  };

  const stepForward = () => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  };

  const stepBackward = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const resetSearch = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setCurrentIdx(-1);
    setFoundIdx(-1);
    setSteps([]);
    setShowExplanations([]);
    setExplanation('Enter an array and target value to start the linear search.');
    setError('');
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
    }
  };

  const handleVoiceChange = (e) => {
    const name = e.target.value;
    const voice = voices.find((v) => v.name === name);
    if (voice) setSelectedVoice(voice);
  };

  const getElementClass = (index) => {
    if (index === foundIdx) return 'bg-green-500 text-white transform scale-110';
    if (index === currentIdx) return 'bg-yellow-400 text-black';
    return 'bg-gray-200 text-black';
  };

  // ==== Render ====
  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 animate-fade-in">
          Linear Search Algorithm
        </h1>
        <p className="text-lg text-gray-700">
          Linear search checks each element sequentially until the target is
          found. Time complexity: O(n)
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
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Array (comma separated):
            </label>
            <input
              type="text"
              value={array.join(',')}
              onChange={handleArrayChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Enter array values separated by commas"
            />
          </div>

          {/* Target Input */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Target Value:</label>
            <input
              type="text"
              value={target}
              onChange={handleTargetChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Enter target value"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
              {error}
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
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
              <StepBack size={20} />
              Back
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
              <StepForward size={20} />
              Next
            </button>

            <button
              onClick={resetSearch}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              aria-label="Reset search"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>

          {/* Speed Slider */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Animation Speed:</label>
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
          <div className="flex items-center gap-4 mb-6">
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

          {!window.speechSynthesis && (
            <div className="p-3 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded">
              Voice narration not supported in this browser.
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Visualization
          </h2>

          {/* Array Bars */}
          <div className="flex flex-wrap justify-center gap-2 min-h-[120px] mb-8 items-end">
            {array.map((val, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center transition-all duration-500 ${getElementClass(
                  idx
                )}`}
                style={{
                  width: '50px',
                  height: `${Math.max(val * 10 + 40, 60)}px`,
                }}
              >
                <div className="font-bold">{val}</div>
                <div className="text-xs mt-auto">
                  {idx === currentIdx && 'CURRENT'}
                  {idx === foundIdx && 'FOUND'}
                </div>
              </div>
            ))}
          </div>

          {/* Current Explanation */}
          <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-6">
            <h3 className="font-bold text-lg text-blue-800 mb-2">
              Current Step
            </h3>
            <p className="text-gray-800">{explanation}</p>
          </div>

          {/* Step-by-step log */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-2">
              Step‑by‑Step Explanation
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`p-3 rounded border transition-all duration-300 ${
                    showExplanations.includes(i)
                      ? 'bg-white border-blue-300 shadow-sm'
                      : 'bg-gray-100 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="font-medium text-blue-700 mb-1">
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
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Key Concepts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border border-blue-200">
            <h3 className="font-bold text-blue-700 mb-2">How It Works</h3>
            <p>
              Linear search iterates through each element of the array,
              comparing it with the target until a match is found or the
              array ends.
            </p>
          </div>
          <div className="bg-white p-4 rounded border border-green-200">
            <h3 className="font-bold text-green-700 mb-2">Time Complexity</h3>
            <p>
              O(n) – each element may be inspected once. Simple but
              reliable for small or unsorted data.
            </p>
          </div>
          <div className="bg-white p-4 rounded border border-purple-200">
            <h3 className="font-bold text-purple-700 mb-2">Real‑World Uses</h3>
            <p>
              Searching in unsorted lists, small datasets, or when
              simplicity is more important than speed.
            </p>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-8 p-4 bg-yellow-50 rounded border border-yellow-200">
        <h3 className="font-bold text-yellow-800 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li>Linear search works on any array, sorted or not.</li>
          <li>All elements are treated as numbers for comparison.</li>
          <li>
            Edge cases: empty array, single‑element array, target not
            present.
          </li>
          <li>
            The algorithm is easy to implement but can be slow for
            large datasets.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LinearSearch;