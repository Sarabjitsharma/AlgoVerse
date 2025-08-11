import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

const MergeSort = () => {
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [explanation, setExplanation] = useState('Enter array values separated by commas to begin');
  const [inputValue, setInputValue] = useState('38, 27, 43, 3, 9, 82, 10');
  const [error, setError] = useState('');
  const [showExplanations, setShowExplanations] = useState([]);
  const [originalArray, setOriginalArray] = useState([38, 27, 43, 3, 9, 82, 10]);

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
    if (currentStep < steps.length - 1 && isPlaying) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentStep, isPlaying, speed, steps.length]);

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length && currentStep >= 0) {
      const step = steps[currentStep];
      setArray(step.array);
      setExplanation(step.explanation);
      setShowExplanations(prev => [...prev, currentStep]);

      if (voiceEnabled && selectedVoice && step.explanation) {
        if (synthRef.current.speaking) {
          synthRef.current.cancel();
        }
        utteranceRef.current = new SpeechSynthesisUtterance(step.explanation);
        utteranceRef.current.voice = selectedVoice;
        utteranceRef.current.rate = 0.9;
        synthRef.current.speak(utteranceRef.current);
      }
    }
  }, [currentStep, steps, voiceEnabled, selectedVoice]);

  const validateInput = () => {
    setError('');
    const values = inputValue.split(',').map(val => {
      const num = Number(val.trim());
      return isNaN(num) ? null : num;
    });
    
    if (values.includes(null)) {
      setError('Please enter valid numbers only');
      return false;
    }
    
    if (values.length === 0) {
      setError('Array cannot be empty');
      return false;
    }
    
    return true;
  };

  const generateSteps = (arr) => {
    const steps = [];
    const workingArray = [...arr];
    
    steps.push({
      array: [...workingArray],
      explanation: 'Starting merge sort with array: ' + workingArray.join(', ')
    });

    const mergeSort = (start, end) => {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);
        
        steps.push({
          array: [...workingArray],
          explanation: `Dividing array from index ${start} to ${end}. Midpoint: ${mid}`
        });

        mergeSort(start, mid);
        mergeSort(mid + 1, end);
        merge(start, mid, end);
      }
    };

    const merge = (start, mid, end) => {
      const left = workingArray.slice(start, mid + 1);
      const right = workingArray.slice(mid + 1, end + 1);
      
      steps.push({
        array: [...workingArray],
        explanation: `Merging left [${left.join(', ')}] and right [${right.join(', ')}]`
      });

      let leftIndex = 0;
      let rightIndex = 0;
      let mergeIndex = start;

      while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] <= right[rightIndex]) {
          workingArray[mergeIndex] = left[leftIndex];
          leftIndex++;
        } else {
          workingArray[mergeIndex] = right[rightIndex];
          rightIndex++;
        }
        mergeIndex++;
        
        steps.push({
          array: [...workingArray],
          explanation: `Comparing ${left[leftIndex - 1]} and ${right[rightIndex - 1]}. Placed ${workingArray[mergeIndex - 1]} at position ${mergeIndex - 1}`
        });
      }

      while (leftIndex < left.length) {
        workingArray[mergeIndex] = left[leftIndex];
        leftIndex++;
        mergeIndex++;
      }

      while (rightIndex < right.length) {
        workingArray[mergeIndex] = right[rightIndex];
        rightIndex++;
        mergeIndex++;
      }

      steps.push({
        array: [...workingArray],
        explanation: `Merged successfully. Current state: [${workingArray.slice(start, end + 1).join(', ')}]`
      });
    };

    mergeSort(0, workingArray.length - 1);
    
    steps.push({
      array: [...workingArray],
      explanation: 'Merge sort completed! Final sorted array: ' + workingArray.join(', ')
    });

    return steps;
  };

  const startSort = () => {
    if (!validateInput()) return;
    
    const values = inputValue.split(',').map(val => Number(val.trim()));
    setOriginalArray([...values]);
    const newSteps = generateSteps(values);
    setSteps(newSteps);
    setCurrentStep(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
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
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetSort = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
    setSteps([]);
    setArray([...originalArray]);
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

  const getElementClass = (index, value) => {
    if (currentStep < 0 || currentStep >= steps.length) return 'bg-gray-200 text-black';
    
    const step = steps[currentStep];
    const arrayString = step.array.join(',');
    const previousArrayString = currentStep > 0 ? steps[currentStep - 1].array.join(',') : '';
    
    if (arrayString !== previousArrayString && index < Math.min(array.length, step.array.length)) {
      const prevValue = currentStep > 0 ? steps[currentStep - 1].array[index] : null;
      if (value !== prevValue) {
        return 'bg-green-400 text-white transform scale-110';
      }
    }
    
    return 'bg-blue-500 text-white';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 animate-fade-in">Merge Sort Algorithm</h1>
        <p className="text-lg text-gray-700 mb-6">
          Merge sort is a divide-and-conquer algorithm that divides the array into halves, sorts them, and merges the results.
          Time complexity: O(n log n)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interactive Demo</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Array Values (comma separated):</label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
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
              disabled={currentStep <= 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentStep <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
              aria-label="Previous step"
            >
              <StepBack size={20} /> Back
            </button>
            <button
              onClick={stepForward}
              disabled={currentStep >= steps.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentStep >= steps.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
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
                className={`flex flex-col items-center justify-end transition-all duration-500 ease-in-out ${getElementClass(index, value)}`}
                style={{ 
                  width: '60px', 
                  height: `${Math.max(value * 5, 20) + 40}px`,
                  transition: 'background-color 0.5s, transform 0.5s'
                }}
              >
                <div className="font-bold mb-1">{value}</div>
                <div className="text-xs mt-auto pb-1">
                  {index}
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
            <p>Divide the array into two halves, recursively sort both halves, then merge the sorted halves back together in order.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-lg text-green-700 mb-2">Time Complexity</h3>
            <p>O(n log n) - Consistently good performance. The array is divided log n times, and each merge operation takes O(n) time.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg text-purple-700 mb-2">Real-World Uses</h3>
            <p>Sorting large datasets, external sorting for files too large for memory, and any scenario requiring stable sorting.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-lg text-yellow-800 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li>Merge sort requires additional O(n) space for the temporary arrays</li>
          <li>It's a stable sort - maintains the relative order of equal elements</li>
          <li>Works well for linked lists and external sorting</li>
          <li>Guaranteed O(n log n) performance regardless of input distribution</li>
        </ul>
      </div>
    </div>
  );
};

export default MergeSort;