import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw, PlayCircle } from 'lucide-react';

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const codeSnippets = {
    javascript: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) {
    root.left = insertIntoBST(root.left, val);
  } else {
    root.right = insertIntoBST(root.right, val);
  }
  return root;
}

// Example usage
const root = new TreeNode(4);
insertIntoBST(root, 2);
insertIntoBST(root, 6);
insertIntoBST(root, 1);
insertIntoBST(root, 3);
insertIntoBST(root, 5);
insertIntoBST(root, 7);
console.log("BST after insertions:", root);`,
    python: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert_into_bst(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_into_bst(root.left, val)
    else:
        root.right = insert_into_bst(root.right, val)
    return root

# Example usage
root = TreeNode(4)
insert_into_bst(root, 2)
insert_into_bst(root, 6)
insert_into_bst(root, 1)
insert_into_bst(root, 3)
insert_into_bst(root, 5)
insert_into_bst(root, 7)
print("BST after insertions:", root)`,
    cpp: `#include <iostream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) {
        root->left = insertIntoBST(root->left, val);
    } else {
        root->right = insertIntoBST(root->right, val);
    }
    return root;
}

int main() {
    TreeNode* root = new TreeNode(4);
    insertIntoBST(root, 2);
    insertIntoBST(root, 6);
    insertIntoBST(root, 1);
    insertIntoBST(root, 3);
    insertIntoBST(root, 5);
    insertIntoBST(root, 7);
    cout << "BST after insertions: Done" << endl;
    return 0;
}`
  };

  useEffect(() => {
    setCode(codeSnippets[language]);
    setOutput('');
  }, [language]);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Building BST with values: 4,2,6,1,3,5,7...');
    setTimeout(() => {
      let mockOutput = '';
      switch (language) {
        case 'javascript':
        case 'python':
          mockOutput = 'BST after insertions: TreeNode(4,2,6,1,3,5,7)';
          break;
        case 'cpp':
          mockOutput = 'BST after insertions: Done';
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
    id: 'leetcode-insert-into-bst',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/',
    description: 'Implement insert into a BST with proper tree structure maintenance.',
    difficulty: 'Medium',
  },
  {
    id: 'hackerrank-bst-lowest-common-ancestor',
    platform: 'HackerRank',
    url: 'https://www.hackerrank.com/challenges/binary-search-tree-lowest-common-ancestor/problem',
    description: 'Find the lowest common ancestor in a BST built by insertions.',
    difficulty: 'Easy'
  },
  {
    id: 'codeforces-bst-size',
    platform: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/990/A',
    description: 'Calculate size of BST after multiple insert operations efficiently.',
    difficulty: 'Medium'
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

const TreeVisualizer = ({ root, currentInsert }) => {
  const [positions, setPositions] = useState([]);

  const calculatePositions = (node, x, y, spacing, depth) => {
    if (!node) return [];
    let pos = [{ val: node.val, x, y: y + depth * 80, highlight: node.val === currentInsert }];
    if (node.left) {
      const newSpacing = spacing / 2;
      pos = [...pos, ...calculatePositions(node.left, x - newSpacing, y, newSpacing / 2, depth + 1)];
    }
    if (node.right) {
      const newSpacing = spacing / 2;
      pos = [...pos, ...calculatePositions(node.right, x + newSpacing, y, newSpacing / 2, depth + 1)];
    }
    return pos;
  };

  useEffect(() => {
    setPositions(calculatePositions(root, 300, 0, 150, 0));
  }, [root, currentInsert]);

  return (
    <div className="relative w-full h-96 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-300 dark:border-gray-700 overflow-auto">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
        {positions.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={20}
              className={`fill-current ${p.highlight ? 'text-green-400' : 'text-blue-400 dark:text-blue-600'}`}
            />
            <text
              x={p.x}
              y={p.y + 5}
              textAnchor="middle"
              className="fill-white text-xs font-semibold"
            >
              {p.val}
            </text>
          </g>
        ))}
      </svg>
      {positions.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Empty BST — insert a value to begin
        </div>
      )}
    </div>
  );
};

const BstInsertion = () => {
  const [bst, setBst] = useState(null);
  const [insertValue, setInsertValue] = useState('');
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Create a BST by inserting numeric values. Each insertion respects BST order: left < parent < right.');
  const [showExplanations, setShowExplanations] = useState([]);
  const [completedProblems, setCompletedProblems] = useState({});

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  // Load completed problems from localStorage on mount
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('completedBstInsertionProblems');
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
      localStorage.setItem('completedBstInsertionProblems', JSON.stringify(completedProblems));
    } catch (error) {
      console.error("Could not save completed problems to localStorage", error);
    }
  }, [completedProblems]);

  useEffect(() => {
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

  const handleProblemComplete = (problemId) => {
    setCompletedProblems(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  const validateInput = () => {
    setError('');
    if (!insertValue.trim()) {
      setError('Please enter a value to insert');
      return false;
    }
    const num = Number(insertValue);
    if (isNaN(num)) {
      setError('Value must be a number');
      return false;
    }
    return true;
  };

  const startInsertion = () => {
    if (!validateInput()) return;
    const val = Number(insertValue);
    resetInsert(false);

    const newSteps = [];
    let current = bst;
    let parent = null;
    let direction = '';

    newSteps.push({
      node: current ? current.val : null,
      parent: parent,
      direction,
      currentInsert: val,
      explanation: `Inserting ${val} into the BST...`
    });

    while (current) {
      parent = current;
      if (val < current.val) {
        newSteps.push({
          node: current.val,
          parent,
          direction: 'left',
          currentInsert: val,
          explanation: `${val} is less than ${current.val}, move to the left subtree`
        });
        current = current.left;
      } else {
        newSteps.push({
          node: current.val,
          parent,
          direction: 'right',
          currentInsert: val,
          explanation: `${val} is greater than or equal to ${current.val}, move to the right subtree`
        });
        current = current.right;
      }
    }

    newSteps.push({
      node: null,
      parent,
      direction,
      currentInsert: val,
      explanation: `${val} created as a new node`
    });

    setSteps(newSteps);
    setStepIndex(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  const performInsert = () => {
    const val = Number(insertValue);
    if (!validateInput()) return;
    const newRoot = insertNode(bst, val);
    setBst(newRoot);
    setInsertValue('');
  };

  const insertNode = (root, val) => {
    if (!root) return { val, left: null, right: null };
    const newRoot = { ...root };
    if (val < root.val) {
      newRoot.left = insertNode(root.left, val);
    } else {
      newRoot.right = insertNode(root.right, val);
    }
    return newRoot;
  };

  const handleInsertValueChange = (e) => {
    setInsertValue(e.target.value);
    setError('');
  };

  const handleSpeedChange = (e) => {
    setSpeed(2000 - e.target.value);
  };

  const togglePlay = () => {
    if (steps.length === 0 || stepIndex >= steps.length - 1) {
      startInsertion();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const stepForward = () => {
    setIsPlaying(false);
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      performInsert();
    }
  };

  const stepBackward = () => {
    setIsPlaying(false);
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const resetInsert = (fullReset = true) => {
    setIsPlaying(false);
    setStepIndex(0);
    setSteps([]);
    setShowExplanations([]);
    if (fullReset) {
      setExplanation('Create a BST by inserting numeric values. Each insertion respects BST order: left < parent < right.');
      setBst(null);
      setInsertValue('');
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

  useEffect(() => {
    if (stepIndex < steps.length && isPlaying) {
      timeoutRef.current = setTimeout(() => {
        setStepIndex(stepIndex + 1);
      }, speed);
    } else if (stepIndex >= steps.length && steps.length > 0) {
      setIsPlaying(false);
      performInsert();
    }
  }, [stepIndex, isPlaying, speed, steps]);

  useEffect(() => {
    if (steps.length > 0 && stepIndex < steps.length) {
      const step = steps[stepIndex];
      // Simulate highlighting currentInsert during step
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

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-4 animate-fade-in">BST Insertion Algorithm</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Efficiently insert values into a Binary Search Tree while maintaining the BST property: left , parent , right.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Interactive Demo</h2>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Value to Insert (number):</label>
            <input
              type="text"
              value={insertValue}
              onChange={handleInsertValueChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition"
              aria-label="Enter value to insert"
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
              {isPlaying ? "Pause" : (steps.length === 0 || stepIndex >= steps.length - 1) ? "Start" : "Resume"}
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
              onClick={() => resetInsert(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              aria-label="Reset BST"
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
              <span>Slower</span><span>Faster</span>
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
          </div>

          {typeof window !== 'undefined' && !window.speechSynthesis && (
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-lg border border-yellow-300 dark:border-yellow-500">
              Voice narration unavailable in this browser
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">BST Visualization</h2>
          <TreeVisualizer root={bst} currentInsert={Number(insertValue)} />
          <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-6 min-h-[90px]">
            <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-2">Current Step:</h3>
            <div className="text-gray-800 dark:text-gray-200 animate-fade-in">{explanation}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">Step-by-Step Explanation:</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all duration-300 ${stepIndex === idx
                    ? 'bg-blue-100 dark:bg-blue-900 dark:border-blue-500 shadow-md scale-105'
                    : showExplanations.includes(idx)
                      ? 'bg-white dark:bg-gray-700 dark:border-blue-500 shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 opacity-70'}`}
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
            <p className="text-gray-700 dark:text-gray-300">Start at root, compare new value, move left if smaller, right if larger, and insert at an empty child spot.</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <h3 className="font-bold text-lg text-green-700 dark:text-green-400 mb-2">Time Complexity</h3>
            <p className="text-gray-700 dark:text-gray-300">On average O(log n) per insertion; O(n) in the worst degenerate case. Maintains BST properties after each insertion automatically.</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <h3 className="font-bold text-lg text-purple-700 dark:text-purple-400 mb-2">Real-World Uses</h3>
            <p className="text-gray-700 dark:text-gray-300">Used in databases for indexing, in compilers for symbol tables, search and mapping systems, dynamic ordered datasets.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-300 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700 dark:text-yellow-400">
          <li>Only unique values should typically be inserted to maintain BST properties.</li>
          <li>The tree height impacts performance; balanced trees perform better.</li>
          <li>Recursive insertion is intuitive and maintains clarity.</li>
          <li>Handle empty tree by creating the root node as needed.</li>
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

export default BstInsertion;