import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

const BubbleSort = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [originalArray, setOriginalArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [stepIndex, setStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Enter comma-separated numbers and click Start to begin bubble sort');
  const [steps, setSteps] = useState([]);
  const [showExplanations, setShowExplanations] = useState([]);
  const [passCount, setPassCount] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synthRef.current.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    };
    loadVoices();
    synthRef.current.onvoiceschanged = loadVoices;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (stepIndex < steps.length && isPlaying) {
      timeoutRef.current = setTimeout(() => {
        setStepIndex(stepIndex + 1);
      }, speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [stepIndex, isPlaying, speed, steps]);

  useEffect(() => {
    if (steps.length > 0 && stepIndex < steps.length) {
      const step = steps[stepIndex];
      setArray(step.array);
      setComparing(step.comparing);
      setSwapping(step.swapping);
      setSortedIndices(step.sortedIndices);
      setPassCount(step.passCount);
      setComparisonCount(step.comparisonCount);
      setExplanation(step.explanation);
      setShowExplanations(prev => [...prev, stepIndex]);

      if (voiceEnabled && selectedVoice) {
        if (synthRef.current.speaking) {
          synthRef.current.cancel();
        }
        utteranceRef.current = new SpeechSynthesisUtterance(step.explanation);
        utteranceRef.current.voice = selectedVoice;
        utteranceRef.current.rate = 0.9;
        synthRef.current.speak(utteranceRef.current);
      }
    }
  }, [stepIndex, steps, voiceEnabled, selectedVoice]);

  const validateInput = () => {
    setError('');
    if (!array.length) {
      setError('Array cannot be empty');
      return false;
    }
    return true;
  };

  const startSort = () => {
    if (!validateInput()) return;
    
    const newSteps = [];
    const arr = [...originalArray];
    const n = arr.length;
    let stepCounter = 0;
    let comparisonCounter = 0;

    newSteps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sortedIndices: [],
      passCount: 0,
      comparisonCount: 0,
      explanation: `Starting bubble sort with array: [${arr.join(', ')}]`
    });

    for (let i = 0; i < n; i++) {
      let swapped = false;
      
      newSteps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sortedIndices: [...sortedIndices.slice(0, i)],
        passCount: i + 1,
        comparisonCount: comparisonCounter,
        explanation: `Pass ${i + 1}: Checking ${n - i} elements`
      });

      for (let j = 0; j < n - i - 1; j++) {
        stepCounter++;
        comparisonCounter++;
        
        newSteps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapping: [],
          sortedIndices: [...sortedIndices.slice(0, i)],
          passCount: i + 1,
          comparisonCount: comparisonCounter,
          explanation: `Comparing elements at positions ${j} and ${j + 1}: ${arr[j]} and ${arr[j + 1]}`
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          
          newSteps.push({
            array: [...arr],
            comparing: [j, j + 1],
            swapping: [j, j + 1],
            sortedIndices: [...sortedIndices.slice(0, i)],
            passCount: i + 1,
            comparisonCount: comparisonCounter,
            explanation: `Swapping ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} < ${arr[j]}`
          });
        }
      }

      newSteps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sortedIndices: [...sortedIndices.slice(0, i), n - i - 1],
        passCount: i + 1,
        comparisonCount: comparisonCounter,
        explanation: `Element ${arr[n - i - 1]} is now in its correct position at index ${n - i - 1}`
      });

      if (!swapped) {
        newSteps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          sortedIndices: Array.from({length: n}, (_, k) => k),
          passCount: i + 1,
          comparisonCount: comparisonCounter,
          explanation: `Array is sorted after ${i + 1} pass${i + 1 > 1 ? 'es' : ''} with ${comparisonCounter} comparison${comparisonCounter > 1 ? 's' : ''}`
        });
        break;
      }
    }

    setSteps(newSteps);
    setStepIndex(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  const handleArrayChange = (e) => {
    const input = e.target.value;
    const newArray = input.split(',').map(item => {
      const num = Number(item.trim());
      return isNaN(num) ? 0 : num;
    });
    setArray(newArray);
    setOriginalArray(newArray);
    setError('');
  };

  const handleSpeedChange = (e) => {
    setSpeed(2000 - e.target.value);
  };

  const togglePlay = () => {
    if (steps.length === 0) {
      startSort();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const stepForward = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const stepBackward = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const resetSort = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setArray(originalArray);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setSteps([]);
    setShowExplanations([]);
    setPassCount(0);
    setComparisonCount(0);
    setExplanation('Enter comma-separated numbers and click Start to begin bubble sort');
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
    const voiceName = e.target.value;
    const voice = voices.find(v => v.name === voiceName);
    if (voice) setSelectedVoice(voice);
  };

  const getElementClass = (index) => {
    if (sortedIndices.includes(index)) return 'bg-green-500 text-white';
    if (swapping.includes(index)) return 'bg-orange-500 text-white transform scale-110';
    if (comparing.includes(index)) return 'bg-yellow-400 text-black';
    if (comparing.length === 0 && sortedIndices.length === 0) return 'bg-gray-200 text-black';
    return 'bg-gray-200 text-black';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 animate-fade-in">Bubble Sort Algorithm</h1>
        <p className="text-lg text-gray-700 mb-6">
          Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they're in wrong order.
          Time complexity: O(n²)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interactive Demo</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Array (comma separated):</label>
            <input
              type="text"
              value={array.join(',')}
              onChange={handleArrayChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Enter array values separated by commas"
              disabled={isPlaying}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              aria-label={isPlaying ? "Pause animation" : "Start animation"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? "Pause" : "Start"}
            </button>
            <button
              onClick={stepBackward}
              disabled={stepIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${stepIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
              aria-label="Previous step"
            >
              <StepBack size={20} /> Back
            </button>
            <button
              onClick={stepForward}
              disabled={stepIndex >= steps.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${stepIndex >= steps.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
              aria-label="Next step"
            >
              <StepForward size={20} /> Next
            </button>
            <button
              onClick={resetSort}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              aria-label="Reset sort"
            >
              <RotateCcw size={20} /> Reset
            </button>
          </div>

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

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={toggleVoice}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              aria-label={voiceEnabled ? "Disable voice narration" : "Enable voice narration"}
            >
              {voiceEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
              {voiceEnabled ? "Mute Voice" : "Unmute Voice"}
            </button>
            
            {voices.length > 0 && voiceEnabled && (
              <select
                value={selectedVoice?.name || ''}
                onChange={handleVoiceChange}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                aria-label="Select voice type"
              >
                {voices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {!window.speechSynthesis && (
            <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg border border-yellow-300">
              Voice narration unavailable in this browser
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Algorithm Visualization</h2>
          
          <div className="mb-8 flex flex-wrap justify-center gap-2 min-h-[120px] items-end">
            {array.map((value, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center transition-all duration-500 ease-in-out ${getElementClass(index)}`}
                style={{ 
                  width: '60px', 
                  height: `${value * 5 + 40}px`,
                  transition: 'background-color 0.5s, transform 0.5s'
                }}
              >
                <div className="font-bold mb-1">{value}</div>
                <div className="text-xs mt-auto pb-1">
                  {sortedIndices.includes(index) && "✓"}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mb-4 text-sm text-gray-600">
            <span>Pass: {passCount}</span>
            <span>Comparisons: {comparisonCount}</span>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h3 className="font-bold text-lg text-blue-800 mb-2">Current Step:</h3>
            <div className="text-gray-800 animate-fade-in">
              {explanation}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Step-by-Step Explanation:</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    showExplanations.includes(idx) 
                      ? 'bg-white border-blue-300 shadow-sm' 
                      : 'bg-gray-100 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="font-medium text-blue-700">Step {idx + 1}:</div>
                  <div>{step.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Key Concepts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-lg text-blue-700 mb-2">How It Works</h3>
            <p>Bubble sort compares each pair of adjacent items and swaps them if they are in the wrong order. This process repeats until no swaps are needed.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-lg text-green-700 mb-2">Time Complexity</h3>
            <p>O(n²) - Simple but inefficient for large datasets. Best case O(n) when array is already sorted.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg text-purple-700 mb-2">Real-World Uses</h3>
            <p>Educational purposes, small datasets, detecting nearly sorted arrays, and quick implementation for prototyping.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-lg text-yellow-800 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li>Bubble sort is stable - equal elements maintain their relative order</li>
          <li>Can be optimized by detecting if no swaps occurred in a pass</li>
          <li>Each pass places the largest unsorted element at its correct position</li>
          <li>Not suitable for large datasets due to O(n²) complexity</li>
        </ul>
      </div>
    </div>
  );
};

export default BubbleSort;