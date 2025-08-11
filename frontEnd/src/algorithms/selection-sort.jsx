import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

const SelectionSort = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [originalArray, setOriginalArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [sortedArray, setSortedArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [minIndex, setMinIndex] = useState(-1);
  const [sortedEnd, setSortedEnd] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [stepIndex, setStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Enter comma-separated numbers and click Start to begin sorting');
  const [steps, setSteps] = useState([]);
  const [showExplanations, setShowExplanations] = useState([]);

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
      setCurrentIndex(step.currentIndex);
      setMinIndex(step.minIndex);
      setSortedEnd(step.sortedEnd);
      setArray(step.array);
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
    const newArray = array.filter(n => !isNaN(n));
    if (newArray.length === 0) {
      setError('Please enter at least one valid number');
      return false;
    }
    if (newArray.some(n => isNaN(n))) {
      setError('Please enter valid numbers only');
      return false;
    }
    return true;
  };

  const startSort = () => {
    if (!validateInput()) return;
    
    const arr = [...array];
    const newSteps = [];
    const n = arr.length;
    let stepCounter = 0;

    newSteps.push({
      array: [...arr],
      currentIndex: -1,
      minIndex: -1,
      sortedEnd: -1,
      explanation: `Starting selection sort with ${n} elements`
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      stepCounter++;
      
      newSteps.push({
        array: [...arr],
        currentIndex: i,
        minIndex: minIdx,
        sortedEnd: i - 1,
        explanation: `Step ${stepCounter}: Finding minimum for position ${i}. Current minimum is at index ${minIdx} with value ${arr[minIdx]}`
      });

      for (let j = i + 1; j < n; j++) {
        newSteps.push({
          array: [...arr],
          currentIndex: j,
          minIndex: minIdx,
          sortedEnd: i - 1,
          explanation: `Comparing arr[${j}] = ${arr[j]} with current minimum arr[${minIdx}] = ${arr[minIdx]}`
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          newSteps.push({
            array: [...arr],
            currentIndex: j,
            minIndex: minIdx,
            sortedEnd: i - 1,
            explanation: `Found new minimum! Updated minimum index to ${minIdx} with value ${arr[minIdx]}`
          });
        }
      }

      newSteps.push({
        array: [...arr],
        currentIndex: i,
        minIndex: minIdx,
        sortedEnd: i - 1,
        explanation: `Swapping elements at positions ${i} and ${minIdx}: ${arr[i]} ↔ ${arr[minIdx]}`
      });

      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      
      newSteps.push({
        array: [...arr],
        currentIndex: -1,
        minIndex: -1,
        sortedEnd: i,
        explanation: `After swap, array up to index ${i} is sorted. Smallest element ${arr[i]} is now in correct position`
      });
    }

    newSteps.push({
      array: [...arr],
      currentIndex: -1,
      minIndex: -1,
      sortedEnd: n - 1,
      explanation: `Selection sort complete! Array is now sorted in ascending order`
    });

    setSteps(newSteps);
    setStepIndex(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  const handleArrayChange = (e) => {
    const input = e.target.value;
    const newArray = input.split(',').map(item => {
      const num = Number(item.trim());
      return isNaN(num) ? NaN : num;
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
    setCurrentIndex(-1);
    setMinIndex(-1);
    setSortedEnd(-1);
    setArray(originalArray);
    setSteps([]);
    setShowExplanations([]);
    setExplanation('Enter comma-separated numbers and click Start to begin sorting');
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
    if (index <= sortedEnd) return 'bg-green-500 text-white transform scale-110';
    if (index === currentIndex) return 'bg-red-500 text-white';
    if (index === minIndex) return 'bg-yellow-400 text-black';
    return 'bg-gray-200 text-black';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 animate-fade-in">Selection Sort Algorithm</h1>
        <p className="text-lg text-gray-700 mb-6">
          Selection sort finds the minimum element and places it at the beginning. 
          Then repeats for remaining elements. Time complexity: O(n²)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interactive Demo</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Enter Numbers (comma separated):</label>
            <input
              type="text"
              value={array.map(n => isNaN(n) ? '' : n).filter(n => n !== '').join(',')}
              onChange={handleArrayChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Enter numbers separated by commas"
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
              aria-label="Reset sorting"
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
                  height: `${value * 10 + 40}px`,
                  transition: 'background-color 0.5s, transform 0.5s'
                }}
              >
                <div className="font-bold mb-1">{isNaN(value) ? '?' : value}</div>
                <div className="text-xs mt-auto pb-1">
                  {index === sortedEnd + 1 && "SORTING"}
                  {index === minIndex && "MIN"}
                  {index === currentIndex && "CURRENT"}
                </div>
              </div>
            ))}
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
            <p>Selection sort divides the array into sorted and unsorted parts. It repeatedly selects the smallest element from the unsorted part and places it at the end of the sorted part.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-lg text-green-700 mb-2">Time Complexity</h3>
            <p>O(n²) - Quadratic time complexity. For every element, we scan the remaining array to find the minimum, resulting in n*(n-1)/2 comparisons.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg text-purple-700 mb-2">Real-World Uses</h3>
            <p>Educational purposes, small datasets, memory-constrained environments where swaps are expensive, and when stability isn't required.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-lg text-yellow-800 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li>Selection sort performs at most n-1 swaps, making it efficient when swaps are expensive</li>
          <li>Not a stable sorting algorithm - equal elements may not retain their original order</li>
          <li>Always requires O(n²) comparisons regardless of input</li>
          <li>Best case, average case, and worst case all have O(n²) time complexity</li>
        </ul>
      </div>
    </div>
  );
};

export default SelectionSort;