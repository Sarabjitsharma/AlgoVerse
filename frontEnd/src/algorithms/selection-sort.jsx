import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw, PlayCircle } from 'lucide-react';

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const codeSnippets = {
    javascript: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    // Swap elements
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}

const arr = [64, 25, 12, 22, 11];
console.log("Original array:", arr);
const sorted = selectionSort([...arr]);
console.log("Sorted array:", sorted);`,
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        # Swap elements
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

arr = [64, 25, 12, 22, 11]
print("Original array:", arr)
sorted_arr = selection_sort(arr.copy())
print("Sorted array:", sorted_arr)`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> selectionSort(vector<int> arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
    return arr;
}

int main() {
    vector<int> arr = {64, 25, 12, 22, 11};
    cout << "Original array: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    
    vector<int> sorted = selectionSort(arr);
    cout << "Sorted array: ";
    for (int x : sorted) cout << x << " ";
    cout << endl;
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
          mockOutput = 'Original array: 64 25 12 22 11\nSorted array: 11 12 22 25 64';
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
    id: 'leetcode-selection-sort',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/sort-an-array/',
    description: 'Implement the selection sort algorithm to sort an array of integers.',
    difficulty: 'Easy',
  },
  {
    id: 'hackerrank-selection-sort',
    platform: 'HackerRank',
    url: 'https://www.hackerrank.com/challenges/tutorial-intro/problem',
    description: 'Practice selection sort implementation with various test cases.',
    difficulty: 'Easy'
  },
  {
    id: 'geeksforgeeks-selection-sort',
    platform: 'GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org/selection-sort/',
    description: 'Comprehensive selection sort tutorial with implementation details.',
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

const SelectionSort = () => {
  const [array, setArray] = useState([64, 25, 12, 22, 11]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [stepIndex, setStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Enter array values to begin sorting');
  const [steps, setSteps] = useState([]);
  const [showExplanations, setShowExplanations] = useState([]);
  const [currentI, setCurrentI] = useState(-1);
  const [currentJ, setCurrentJ] = useState(-1);
  const [minIdx, setMinIdx] = useState(-1);
  const [completedProblems, setCompletedProblems] = useState({});

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  // Load completed problems from localStorage on mount
  useEffect(() => {
    try {
        const savedCompleted = localStorage.getItem('completedSelectionSortProblems');
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
        localStorage.setItem('completedSelectionSortProblems', JSON.stringify(completedProblems));
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
      setCurrentI(step.currentI);
      setCurrentJ(step.currentJ);
      setMinIdx(step.minIdx);
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
    if (array.length === 0) {
      setError('Array cannot be empty');
      return false;
    }
    return true;
  };

  const startSort = () => {
    if (!validateInput()) return;
    
    resetSort(false); // Reset without clearing explanation

    const newSteps = [];
    const arr = [...array];
    let stepCounter = 0;

    newSteps.push({
      currentI: -1,
      currentJ: -1,
      minIdx: -1,
      explanation: `Starting selection sort on array of length ${arr.length}`
    });

    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      stepCounter++;
      
      newSteps.push({
        currentI: i,
        currentJ: -1,
        minIdx: minIdx,
        explanation: `Step ${i + 1}: Find minimum in unsorted part starting from index ${i}`
      });

      for (let j = i + 1; j < arr.length; j++) {
        newSteps.push({
          currentI: i,
          currentJ: j,
          minIdx: minIdx,
          explanation: `Comparing arr[${j}] = ${arr[j]} with current minimum arr[${minIdx}] = ${arr[minIdx]}`
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          newSteps.push({
            currentI: i,
            currentJ: j,
            minIdx: minIdx,
            explanation: `New minimum found! minIdx = ${minIdx}`
          });
        }
      }

      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        newSteps.push({
          currentI: i,
          currentJ: -1,
          minIdx: minIdx,
          explanation: `Swapping elements at indices ${i} and ${minIdx}`
        });
      } else {
        newSteps.push({
          currentI: i,
          currentJ: -1,
          minIdx: minIdx,
          explanation: `No swap needed, element at index ${i} is already in correct position`
        });
      }
    }

    newSteps.push({
      currentI: -1,
      currentJ: -1,
      minIdx: -1,
      explanation: `Selection sort complete! Array is now sorted.`
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
    if (steps.length === 0 || stepIndex >= steps.length -1) {
      startSort();
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

  const resetSort = (fullReset = true) => {
    setIsPlaying(false);
    setStepIndex(0);
    setCurrentI(-1);
    setCurrentJ(-1);
    setMinIdx(-1);
    setSteps([]);
    setShowExplanations([]);
    if (fullReset) {
      setExplanation('Enter array values to begin sorting');
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
    if (index === currentI) return 'bg-green-500 text-white transform scale-110';
    if (index === minIdx) return 'bg-yellow-400 dark:bg-yellow-500 text-black';
    if (index === currentJ) return 'bg-red-500 text-white';
    if (index < currentI) return 'bg-gray-400 dark:bg-gray-500 text-gray-800 dark:text-gray-200';
    return 'bg-gray-200 dark:bg-gray-600 text-black dark:text-gray-50';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-4 animate-fade-in">Selection Sort Algorithm</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Selection sort repeatedly finds the minimum element from the unsorted part and moves it to the beginning.
          Time complexity: O(n²)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Interactive Demo</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Array (comma separated):</label>
            <input
              type="text"
              value={array.join(', ')}
              onChange={handleArrayChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition"
              aria-label="Enter array values separated by commas"
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-500">
              {error}
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
              onClick={() => resetSort(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              aria-label="Reset sort"
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
                  {index === currentI && "I"}
                  {index === currentJ && "J"}
                  {index === minIdx && "MIN"}
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
            <p className="text-gray-700 dark:text-gray-300">Selection sort divides the array into sorted and unsorted parts, repeatedly selecting the minimum element from the unsorted part and moving it to the sorted part.</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <h3 className="font-bold text-lg text-green-700 dark:text-green-400 mb-2">Time Complexity</h3>
            <p className="text-gray-700 dark:text-gray-300">O(n²) - Not efficient for large datasets, but simple to understand and implement. Performs well on small arrays and is an in-place sorting algorithm.</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <h3 className="font-bold text-lg text-purple-700 dark:text-purple-400 mb-2">Real-World Uses</h3>
            <p className="text-gray-700 dark:text-gray-300">Useful for small datasets, memory-constrained environments, and educational purposes. Also used when memory writes are expensive operations.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-300 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700 dark:text-yellow-400">
          <li>Selection sort is not stable - equal elements may not maintain their relative order.</li>
          <li>It performs at most n-1 swaps, making it efficient when memory writes are costly.</li>
          <li>The algorithm has predictable performance regardless of input order.</li>
          <li>Consider using more efficient algorithms like quicksort or mergesort for large datasets.</li>
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

export default SelectionSort;