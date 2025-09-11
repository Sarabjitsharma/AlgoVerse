import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

const HeapSort = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 88, 76, 50]);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Enter array values separated by commas to begin');
  const [showExplanations, setShowExplanations] = useState([]);
  const [heapSize, setHeapSize] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [swapIndices, setSwapIndices] = useState([]);

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
      setHeapSize(step.heapSize);
      setCurrentIndex(step.currentIndex);
      setSwapIndices(step.swapIndices || []);
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
    const inputArray = array.join(',').split(',').map(item => {
      const num = Number(item.trim());
      return isNaN(num) ? null : num;
    });
    
    if (inputArray.some(num => num === null)) {
      setError('Please enter valid numbers separated by commas');
      return false;
    }
    
    if (inputArray.length === 0) {
      setError('Array cannot be empty');
      return false;
    }
    
    return true;
  };

  const heapify = (arr, n, i, newSteps) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    newSteps.push({
      array: [...arr],
      heapSize: n,
      currentIndex: largest,
      swapIndices: [],
      explanation: `Checking node at index ${largest} with value ${arr[largest]}. Comparing with left child at index ${left}${left < n ? ` with value ${arr[left]}` : ' (does not exist)'}, and right child at index ${right}${right < n ? ` with value ${arr[right]}` : ' (does not exist)'}`
    });

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      newSteps.push({
        array: [...arr],
        heapSize: n,
        currentIndex: i,
        swapIndices: [i, largest],
        explanation: `Swapping elements at indices ${i} and ${largest}: ${arr[i]} and ${arr[largest]}`
      });
      
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      
      newSteps.push({
        array: [...arr],
        heapSize: n,
        currentIndex: largest,
        swapIndices: [],
        explanation: `After swapping, continuing heapify from index ${largest}`
      });
      
      heapify(arr, n, largest, newSteps);
    } else {
      newSteps.push({
        array: [...arr],
        heapSize: n,
        currentIndex: i,
        swapIndices: [],
        explanation: `No swap needed. Node at index ${i} is already in correct position for max-heap property`
      });
    }
  };

  const startSort = () => {
    if (!validateInput()) return;
    
    const arr = [...array];
    const n = arr.length;
    const newSteps = [];
    
    newSteps.push({
      array: [...arr],
      heapSize: n,
      currentIndex: -1,
      swapIndices: [],
      explanation: 'Starting heap sort algorithm. First, we build a max-heap from the array.'
    });

    // Build max heap
    newSteps.push({
      array: [...arr],
      heapSize: n,
      currentIndex: -1,
      swapIndices: [],
      explanation: `Building max-heap by heapifying from the last non-leaf node (index ${Math.floor(n/2 - 1)}) to the root`
    });

    for (let i = Math.floor(n / 2 - 1); i >= 0; i--) {
      newSteps.push({
        array: [...arr],
        heapSize: n,
        currentIndex: i,
        swapIndices: [],
        explanation: `Heapifying subtree rooted at index ${i} with value ${arr[i]}`
      });
      heapify(arr, n, i, newSteps);
    }

    newSteps.push({
      array: [...arr],
      heapSize: n,
      currentIndex: -1,
      swapIndices: [],
      explanation: 'Max-heap construction complete. Now extracting elements one by one'
    });

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      newSteps.push({
        array: [...arr],
        heapSize: i + 1,
        currentIndex: 0,
        swapIndices: [0, i],
        explanation: `Extracting maximum element: swapping root (index 0, value ${arr[0]}) with last element (index ${i}, value ${arr[i]})`
      });
      
      [arr[0], arr[i]] = [arr[i], arr[0]];
      
      newSteps.push({
        array: [...arr],
        heapSize: i,
        currentIndex: 0,
        swapIndices: [],
        explanation: `Reduced heap size to ${i}. Heapifying root to maintain max-heap property`
      });
      
      heapify(arr, i, 0, newSteps);
    }

    newSteps.push({
      array: [...arr],
      heapSize: 1,
      currentIndex: -1,
      swapIndices: [],
      explanation: 'Heap sort complete! Array is now sorted in ascending order'
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
      return isNaN(num) ? 0 : num;
    });
    setArray(newArray);
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
    setSteps([]);
    setHeapSize(array.length);
    setCurrentIndex(-1);
    setSwapIndices([]);
    setShowExplanations([]);
    setExplanation('Enter array values separated by commas to begin');
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
    if (swapIndices.includes(index)) return 'bg-red-500 text-white transform scale-110';
    if (index === currentIndex) return 'bg-yellow-400 text-black';
    if (index >= heapSize && heapSize > 0) return 'bg-green-500 text-white';
    return 'bg-gray-200 text-black';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 animate-fade-in">Heap Sort Algorithm</h1>
        <p className="text-lg text-gray-700 mb-6">
          Heap sort is a comparison-based sorting algorithm that uses a binary heap data structure.
          Time complexity: O(n log n), Space complexity: O(1)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interactive Demo</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Array Values (comma separated):</label>
            <input
              type="text"
              value={array.join(',')}
              onChange={handleArrayChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Enter array values separated by commas"
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
          
          <div className="mb-8 flex flex-wrap justify-center gap-3 min-h-[120px] items-end">
            {array.map((value, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center transition-all duration-500 ease-in-out p-3 rounded-lg ${getElementClass(index)}`}
              >
                <div className="font-bold mb-2 text-lg">{value}</div>
                <div className="text-xs mt-auto pb-1">
                  {index === currentIndex && "CURRENT"}
                  {swapIndices.includes(index) && "SWAP"}
                  {index >= heapSize && heapSize > 0 && "SORTED"}
                </div>
                <div className="text-xs text-gray-600 mt-1">[{index}]</div>
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
            <p>Heap sort builds a max-heap where parent nodes are larger than children, then repeatedly extracts the maximum element and places it at the end of the array.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-lg text-green-700 mb-2">Time Complexity</h3>
            <p>O(n log n) for all cases. Building the heap takes O(n) and each extraction takes O(log n) repeated n times.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg text-purple-700 mb-2">Real-World Uses</h3>
            <p>Priority queues, embedded systems where stable sorting isn't required, memory-constrained environments, and when consistent O(n log n) performance is needed.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-lg text-yellow-800 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li>Heap sort is not stable - equal elements may not keep their relative order</li>
          <li>The algorithm uses O(1) extra space making it memory efficient</li>
          <li>Heapify operations ensure the max-heap property is maintained throughout sorting</li>
          <li>After each extraction, the heap size decreases and sorted elements accumulate at the end</li>
        </ul>
      </div>
    </div>
  );
};

export default HeapSort;