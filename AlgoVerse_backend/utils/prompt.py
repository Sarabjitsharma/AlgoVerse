from langchain_core.prompts import PromptTemplate

# Store your Binary Search JSX example exactly as it is
binary_search_code = """
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw, PlayCircle } from 'lucide-react';

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const codeSnippets = {
    javascript: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid; // Found
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1; // Not found
}

const arr = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
const target = 12;
const result = binarySearch(arr, target);
console.log(\`Target \${target} found at index: \${result}\`);`,
    python: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid # Found
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1 # Not found

arr = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
target = 12
result = binary_search(arr, target)
print(f"Target {target} found at index: {result}")`,
    cpp: `#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0;
    int high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid; // Found
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1; // Not found
}

int main() {
    std::vector<int> arr = {2, 4, 6, 8, 10, 12, 14, 16, 18, 20};
    int target = 12;
    int result = binarySearch(arr, target);
    std::cout << "Target " << target << " found at index: " << result << std::endl;
    return 0;
}`
  };

  useEffect(() => {
    setCode(codeSnippets[language]);
    setOutput('');
  }, [language]);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Running code...');
    setTimeout(() => {
      let mockOutput = '';
      switch (language) {
        case 'javascript':
        case 'python':
        case 'cpp':
          mockOutput = 'Target 12 found at index: 5';
          break;
        default:
          mockOutput = 'Language not supported for execution.';
      }
      setOutput(mockOutput);
      setIsRunning(false);
    }, 1500);
  };
  
  const LanguageButton = ({ lang, children }) => (
    <button
      onClick={() => setLanguage(lang)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${language === lang ? 'bg-gray-700 dark:bg-gray-900 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Code Playground</h2>
      <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2">
            <div className="flex gap-1">
                <LanguageButton lang="javascript">JavaScript</LanguageButton>
                <LanguageButton lang="python">Python</LanguageButton>
                <LanguageButton lang="cpp">C++</LanguageButton>
            </div>
            <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md disabled:bg-green-400 disabled:cursor-not-allowed"
            >
                <PlayCircle size={20} />
                {isRunning ? 'Running...' : 'Run'}
            </button>
        </div>
        <div className="bg-gray-800 dark:bg-gray-900 font-mono text-sm">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-transparent text-white border-none focus:outline-none resize-none p-4 h-80 whitespace-pre"
              spellCheck="false"
              aria-label="Code editor"
            />
        </div>
        <div className="bg-gray-100 dark:bg-gray-700/50 p-4 border-t border-gray-300 dark:border-gray-600">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Output:</h3>
            <pre className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-md min-h-[50px] font-mono">
                <code>{output}</code>
            </pre>
        </div>
      </div>
    </div>
  );
};

const practiceProblems = [
  {
    id: 'leetcode-binary-search',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/binary-search/',
    description: 'A classic problem to implement the binary search algorithm from scratch.',
    difficulty: 'Easy',
  },
  {
    id: 'hackerrank-icecream-parlor',
    platform: 'HackerRank',
    url: 'https://www.hackerrank.com/challenges/icecream-parlor/problem',
    description: '"Ice Cream Parlor" - A problem where you find two items that sum up to a target.',
    difficulty: 'Medium'
  },
  {
    id: 'codeforces-interesting-drink',
    platform: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/706/B',
    description: '"Interesting drink" - a problem that can be efficiently solved using binary search.',
    difficulty: 'Easy'
  }
];

const getDifficultyClass = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
  }
};

const BinarySearch = () => {
  const [array, setArray] = useState([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
  const [target, setTarget] = useState('12');
  const [low, setLow] = useState(-1);
  const [high, setHigh] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [stepIndex, setStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Enter sorted array and target value to begin');
  const [steps, setSteps] = useState([]);
  const [showExplanations, setShowExplanations] = useState([]);
  const [isSorted, setIsSorted] = useState(true);
  const [completedProblems, setCompletedProblems] = useState({});

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  // Load completed problems from localStorage on mount
  useEffect(() => {
    try {
        const savedCompleted = localStorage.getItem('completedBinarySearchProblems');
        if (savedCompleted) {
            setCompletedProblems(JSON.parse(savedCompleted));
        }
    } catch (error) {
        console.error("Could not parse completed problems from localStorage", error);
    }
  }, []);

  // Save completed problems to localStorage on change
  useEffect(() => {
    try {
        localStorage.setItem('completedBinarySearchProblems', JSON.stringify(completedProblems));
    } catch (error) {
        console.error("Could not save completed problems to localStorage", error);
    }
  }, [completedProblems]);

  useEffect(() => {
    // Check if window.speechSynthesis is available
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0]);
        }
      };
      loadVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    } else {
      console.warn("Speech synthesis not supported in this browser.");
      setVoiceEnabled(false);
    }

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
    } else if (stepIndex >= steps.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [stepIndex, isPlaying, speed, steps]);

  useEffect(() => {
    if (steps.length > 0 && stepIndex < steps.length) {
      const step = steps[stepIndex];
      setLow(step.low);
      setHigh(step.high);
      setMid(step.mid);
      setFoundIndex(step.foundIndex);
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

  const handleProblemComplete = (problemId) => {
    setCompletedProblems(prev => ({
        ...prev,
        [problemId]: !prev[problemId]
    }));
  };

  const validateInput = () => {
    setError('');
    if (!target.trim()) {
      setError('Please enter a target value');
      return false;
    }
    const numTarget = Number(target);
    if (isNaN(numTarget)) {
      setError('Target must be a number');
      return false;
    }
    if (array.length === 0) {
      setError('Array cannot be empty');
      return false;
    }
    for (let i = 1; i < array.length; i++) {
      if (array[i] < array[i - 1]) {
        setIsSorted(false);
        setError('Array must be sorted in ascending order');
        return false;
      }
    }
    setIsSorted(true);
    return true;
  };

  const startSearch = () => {
    if (!validateInput()) return;
    
    resetSearch(false); // Reset without clearing explanation

    const numTarget = Number(target);
    const newSteps = [];
    let currentLow = 0;
    let currentHigh = array.length - 1;
    let currentMid = -1;
    let currentFoundIndex = -1;
    let stepCounter = 0;

    newSteps.push({
      low: currentLow,
      high: currentHigh,
      mid: -1,
      foundIndex: -1,
      explanation: `Starting binary search: low=${currentLow}, high=${currentHigh}, target=${numTarget}`
    });

    while (currentLow <= currentHigh) {
      currentMid = Math.floor((currentLow + currentHigh) / 2);
      stepCounter++;
      
      newSteps.push({
        low: currentLow,
        high: currentHigh,
        mid: currentMid,
        foundIndex: -1,
        explanation: `Step ${stepCounter}: Calculating mid = floor((${currentLow} + ${currentHigh}) / 2) = ${currentMid}`
      });

      if (array[currentMid] === numTarget) {
        currentFoundIndex = currentMid;
        newSteps.push({
          low: currentLow,
          high: currentHigh,
          mid: currentMid,
          foundIndex: currentMid,
          explanation: `Found target at index ${currentMid}! Value = ${array[currentMid]}`
        });
        break;
      } else if (array[currentMid] < numTarget) {
        newSteps.push({
          low: currentLow,
          high: currentHigh,
          mid: currentMid,
          foundIndex: -1,
          explanation: `${array[currentMid]} < ${numTarget}, so set low = mid + 1 = ${currentMid + 1}`
        });
        currentLow = currentMid + 1;
      } else {
        newSteps.push({
          low: currentLow,
          high: currentHigh,
          mid: currentMid,
          foundIndex: -1,
          explanation: `${array[currentMid]} > ${numTarget}, so set high = mid - 1 = ${currentMid - 1}`
        });
        currentHigh = currentMid - 1;
      }
    }

    if (currentFoundIndex === -1) {
      newSteps.push({
        low: -1,
        high: -1,
        mid: -1,
        foundIndex: -1,
        explanation: `Target ${numTarget} not found in the array`
      });
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
    if (steps.length === 0 || stepIndex >= steps.length -1) {
      startSearch();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const stepForward = () => {
    setIsPlaying(false);
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const stepBackward = () => {
    setIsPlaying(false);
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const resetSearch = (fullReset = true) => {
    setIsPlaying(false);
    setStepIndex(0);
    setLow(-1);
    setHigh(-1);
    setMid(-1);
    setFoundIndex(-1);
    setSteps([]);
    setShowExplanations([]);
    if (fullReset) {
      setExplanation('Enter sorted array and target value to begin');
    }
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
    if (index === foundIndex) return 'bg-green-500 text-white transform scale-110';
    if (index === mid) return 'bg-yellow-400 dark:bg-yellow-500 text-black';
    if (low !== -1 && high !== -1 && index >= low && index <= high) return 'bg-blue-500 dark:bg-blue-600 text-white';
    return 'bg-gray-200 dark:bg-gray-600 text-black dark:text-gray-50';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-4 animate-fade-in">Binary Search Algorithm</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Binary search efficiently locates an item in a sorted array by repeatedly dividing the search interval in half.
          Time complexity: O(log n)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Interactive Demo</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Sorted Array (comma separated):</label>
            <input
              type="text"
              value={array.join(', ')}
              onChange={handleArrayChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition"
              aria-label="Enter sorted array values separated by commas"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Target Value:</label>
            <input
              type="text"
              value={target}
              onChange={handleTargetChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition"
              aria-label="Enter target value to search"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-500">
              {error}
            </div>
          )}

          {!isSorted && (
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-lg border border-yellow-300 dark:border-yellow-500">
              Warning: Array is not sorted. Binary search requires sorted arrays.
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              aria-label={isPlaying ? "Pause animation" : "Start animation"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? "Pause" : (steps.length === 0 || stepIndex >= steps.length -1) ? "Start" : "Resume"}
            </button>
            <button
              onClick={stepBackward}
              disabled={stepIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${stepIndex === 0 ? 'bg-gray-300 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white shadow-md'}`}
              aria-label="Previous step"
            >
              <StepBack size={20} /> Back
            </button>
            <button
              onClick={stepForward}
              disabled={stepIndex >= steps.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${stepIndex >= steps.length - 1 ? 'bg-gray-300 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white shadow-md'}`}
              aria-label="Next step"
            >
              <StepForward size={20} /> Next
            </button>
            <button
              onClick={() => resetSearch(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              aria-label="Reset search"
            >
              <RotateCcw size={20} /> Reset
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Animation Speed:</label>
            <input
              type="range"
              min="100"
              max="1900"
              value={2000 - speed}
              onChange={handleSpeedChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Adjust animation speed"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={toggleVoice}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              aria-label={voiceEnabled ? "Disable voice narration" : "Enable voice narration"}
            >
              {voiceEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
              {voiceEnabled ? "Mute Voice" : "Unmute Voice"}
            </button>
            
            {voices.length > 0 && voiceEnabled && (
              <select
                value={selectedVoice?.name || ''}
                onChange={handleVoiceChange}
                className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
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

          {typeof window !== 'undefined' && !window.speechSynthesis && (
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-lg border border-yellow-300 dark:border-yellow-500">
              Voice narration unavailable in this browser
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Algorithm Visualization</h2>
          
          <div className="mb-8 flex flex-wrap justify-center gap-2 min-h-[160px] items-end p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
            {array.map((value, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-end p-1 rounded-t-md transition-all duration-500 ease-in-out ${getElementClass(index)}`}
                style={{
                  width: '50px',
                  height: `${Math.max(value * 5 + 40, 60)}px`,
                }}
              >
                <span className="font-bold text-sm mb-1">{value}</span>
                <span className="text-xs font-mono">[{index}]</span>
                <div className="text-xs mt-auto pb-1 h-4 font-semibold">
                  {index === low && "L"}
                  {index === high && "H"}
                  {index === mid && "M"}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-6 min-h-[90px]">
            <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-2">Current Step:</h3>
            <div className="text-gray-800 dark:text-gray-200 animate-fade-in">
              {explanation}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">Step-by-Step Explanation:</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    stepIndex === idx
                      ? 'bg-blue-100 dark:bg-blue-900 dark:border-blue-500 shadow-md scale-105'
                      : showExplanations.includes(idx)
                        ? 'bg-white dark:bg-gray-700 dark:border-blue-500 shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 opacity-70'
                  }`}
                >
                  <div className="font-medium text-blue-700 dark:text-blue-400">Step {idx + 1}:</div>
                  <div className="text-gray-800 dark:text-gray-300">{step.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Key Concepts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <h3 className="font-bold text-lg text-blue-700 dark:text-blue-400 mb-2">How It Works</h3>
            <p className="text-gray-700 dark:text-gray-300">Binary search works by repeatedly dividing the sorted array in half and narrowing down the search space based on comparisons with the middle element.</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <h3 className="font-bold text-lg text-green-700 dark:text-green-400 mb-2">Time Complexity</h3>
            <p className="text-gray-700 dark:text-gray-300">O(log n) - Extremely efficient for large datasets. Each step halves the search space, making it exponentially faster than linear search.</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <h3 className="font-bold text-lg text-purple-700 dark:text-purple-400 mb-2">Real-World Uses</h3>
            <p className="text-gray-700 dark:text-gray-300">Searching in databases, debugging sorted data, dictionary lookups, and any scenario with sorted data where fast retrieval is critical.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-300 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700 dark:text-yellow-400">
          <li>Binary search requires the input array to be sorted.</li>
          <li>Ensure all elements are numbers for accurate comparisons.</li>
          <li>Midpoint calculation uses floor division to handle even-sized arrays.</li>
          <li>Always check edge cases: empty array, single-element array, target not in array.</li>
        </ul>
      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Practice Problems</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {practiceProblems.map((problem) => {
            const isCompleted = completedProblems[problem.id];
            return (
              <div
                key={problem.id}
                className={`flex flex-col p-4 rounded-lg border bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCompleted ? 'opacity-60 bg-gray-100 dark:bg-gray-800' : 'hover:shadow-lg hover:scale-105'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-blue-700 dark:text-blue-400">
                    <a href={problem.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {problem.platform}
                    </a>
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyClass(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className={`flex-grow text-gray-700 dark:text-gray-300 mb-4 ${isCompleted ? 'line-through' : ''}`}>{problem.description}</p>
                <div className="flex items-center mt-auto">
                  <input
                    type="checkbox"
                    id={`checkbox-${problem.id}`}
                    checked={!!isCompleted}
                    onChange={() => handleProblemComplete(problem.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor={`checkbox-${problem.id}`} className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">Mark as completed</label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <CodeEditor />
    </div>
  );
};

export default BinarySearch;


"""

# Create the PromptTemplate with partial_variables
Prompt = PromptTemplate(
    input_variables=["algorithm"],
    partial_variables={"golden_example": binary_search_code},
    template="""
You are AlgoVerse — an elite AI tutor who generates *production-ready, error-free React pages* that are fully functional and styled using Tailwind CSS.

Your mission: produce an *interactive, narrated learning experience* for the algorithm: {algorithm}.

## Golden Reference — Never Deviate
Below is a *Binary Search component* example that demonstrates the exact structure, style, libraries, and quality you must match for ALL outputs.

<golden-example>
{golden_example}
</golden-example>

## Hard Requirements
- **Output exactly one <code-file name="{algorithm}.jsx">...</code-file> block** containing the full React component.
- Must run instantly in Create React App with Tailwind CSS and lucide-react.
- Absolutely no errors or placeholders — fully functional code only.
- Follow *Binary Search golden example* exactly for:
  - Component structure
  - Voice narration system (SpeechSynthesis API)
  - Lucide icons for controls
  - Tailwind classes with optional Dark Mode and responsive layout
  - Control bar features (play/pause, step, reset, speed)
  - Input validation and error boxes
  - Animations and step highlighting
- Include fade-in header, animated visualization, narrated explanations, and tips section.
- Must be a **self-contained .jsx file** — no external files.
- All accessibility rules from golden example (aria-labels, keyboard navigable) must be included.

## Output Structure
1. <code-file name="{algorithm}.jsx"> — JSX code here — </code-file>
2. <explanation> — 2–3 sentences explaining what the page does and how to run it. </explanation>
3. <dependencies> — List: "react", "react-dom", "lucide-react", "tailwindcss". </dependencies>
4. <metadata> — JSON object with these keys and example values:
   {{
      "title": "algorithm_title",
      "slug": "algorithm_slug",
      "description": "short_description_of_algorithm",
      "category": "algorithm_category",
      "difficulty": "difficulty_level(Beginner/Intermediate/Advanced)",
      "path": "/algorithms/{algorithm}",
      "externalUrl": null,
      "practiceProblems":[list_of_all_the_practiceProblems.id]
   }} </metadata>

Make sure the JSON is valid and well-formatted with double quotes, no trailing commas.

Now, generate the {algorithm} page with *the same quality, tone, and polish as the golden example*, including the metadata JSON as specified.
"""
)
