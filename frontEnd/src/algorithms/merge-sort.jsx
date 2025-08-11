import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

const MergeSort = () => {
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [originalArray, setOriginalArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [explanation, setExplanation] = useState('Enter comma-separated numbers and click Start to begin');
  const [showExplanations, setShowExplanations] = useState([]);
  const [error, setError] = useState('');

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synthRef.current.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0]);
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
      setExplanation(step.explanation);
      setShowExplanations(prev => [...prev, stepIndex]);

      if (voiceEnabled && selectedVoice && synthRef.current) {
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
    if (array.length === 0) {
      setError('Array cannot be empty');
      return false;
    }
    if (array.some(isNaN)) {
      setError('All values must be numbers');
      return false;
    }
    setError('');
    return true;
  };

  const generateSteps = (arr) => {
    const steps = [];
    const temp = [...arr];
    const work = [...arr];
    let stepCounter = 0;

    const addStep = (explanation, level = 0) => {
      steps.push({
        array: [...work],
        left: [],
        right: [],
        merged: [],
        explanation,
        level,
        step: stepCounter++
      });
    };

    const mergeSort = (start, end, level) => {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);
        addStep(`Level ${level}: Splitting array [${work.slice(start, end + 1)}] at index ${mid}`, level);

        mergeSort(start, mid, level + 1);
        mergeSort(mid + 1, end, level + 1);

        const left = work.slice(start, mid + 1);
        const right = work.slice(mid + 1, end + 1);
        addStep(`Merging sorted left [${left}] and right [${right}]`, level);

        let i = 0, j = 0, k = start;
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) {
            work[k] = left[i];
            i++;
          } else {
            work[k] = right[j];
            j++;
          }
          k++;
        }

        while (i < left.length) {
          work[k] = left[i];
          i++;
          k++;
        }

        while (j < right.length) {
          work[k] = right[j];
          j++;
          k++;
        }

        addStep(`Merged result: [${work.slice(start, end + 1)}]`, level);
      }
    };

    addStep('Starting merge sort', 0);
    mergeSort(0, temp.length - 1, 1);
    addStep('Merge sort complete! Array is now sorted', 0);

    return steps;
  };

  const startSort = () => {
    if (!validateInput()) return;
    
    const currentArray = array.map(Number);
    setOriginalArray([...currentArray]);
    const newSteps = generateSteps(currentArray);
    setSteps(newSteps);
    setStepIndex(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  const handleArrayChange = (e) => {
    const input = e.target.value;
    const newArray = input.split(',').map(item => {
      const num = Number(item.trim());
      return isNaN(num) ? null : num;
    }).filter(n => n !== null);
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
    setShowExplanations([]);
    setExplanation('Enter comma-separated numbers and click Start to begin');
    setArray([...originalArray]);
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

  const getElementStyle = (value, index, step) => {
    const currentArray = step?.array || [];
    const isSorted = currentArray.every((v, i) => i === 0 || v >= currentArray[i - 1]);
    
    let baseStyle = 'transition-all duration-500 ease-in-out flex flex-col items-center';
    
    if (step?.level > 0) {
      baseStyle += ' transform scale-90';
    }
    
    return baseStyle;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 animate-fade-in">Merge Sort Algorithm</h1>
        <p className="text-lg text-gray-700 mb-6">
          A divide-and-conquer algorithm that splits arrays into halves, sorts them recursively, and merges the results.
          Time complexity: O(n log n) - Stable and efficient for large datasets
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
          
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 min-h-[120px] items-end">
              {(steps[stepIndex]?.array || array).map((value, index) => (
                <div 
                  key={index} 
                  className={getElementStyle(value, index, steps[stepIndex])}
                  style={{ 
                    width: '60px', 
                    height: `${value * 3 + 40}px`,
                    backgroundColor: steps[stepIndex] ? '#3B82F6' : '#E5E7EB',
                    color: steps[stepIndex] ? 'white' : 'black',
                    borderRadius: '8px',
                    padding: '8px',
                    margin: '2px'
                  }}
                >
                  <div className="font-bold text-sm">{value}</div>
                </div>
              ))}
            </div>
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
                  <div className="text-sm">{step.explanation}</div>
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
            <p>Merge sort recursively divides the array into halves until single elements remain, then merges them back in sorted order using a two-pointer technique.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-lg text-green-700 mb-2">Time Complexity</h3>
            <p>O(n log n) - Consistently fast performance. Divide step takes O(log n) and merge step takes O(n) for each level, making it ideal for large datasets.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg text-purple-700 mb-2">Real-World Uses</h3>
            <p>Sorting large files, merge operations in databases, external sorting in systems with limited memory, and any scenario requiring stable, predictable performance.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-lg text-yellow-800 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li>Merge sort is a stable sort - maintains the relative order of equal elements</li>
          <li>Requires O(n) additional space for the merge operation</li>
          <li>Works efficiently on linked lists without extra space</li>
          <li>Preferred over quicksort when worst-case performance is critical</li>
        </ul>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MergeSort;