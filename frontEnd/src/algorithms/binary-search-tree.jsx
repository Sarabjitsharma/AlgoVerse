import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw, PlayCircle, Plus, Trash2 } from 'lucide-react';

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

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(val) {
    const node = new TreeNode(val);
    if (!this.root) {
      this.root = node;
      return;
    }
    let curr = this.root;
    while (true) {
      if (val < curr.val) {
        if (!curr.left) {
          curr.left = node;
          return;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = node;
          return;
        }
        curr = curr.right;
      }
    }
  }

  search(val) {
    let curr = this.root;
    while (curr) {
      if (val === curr.val) return true;
      if (val < curr.val) curr = curr.left;
      else curr = curr.right;
    }
    return false;
  }
}

const bst = new BinarySearchTree();
[8, 3, 10, 1, 6, 14, 4, 7, 13].forEach((v) => bst.insert(v));
console.log("10 found:", bst.search(10));
console.log("15 found:", bst.search(15));`,
    python: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, val):
        node = TreeNode(val)
        if not self.root:
            self.root = node
            return
        curr = self.root
        while True:
            if val < curr.val:
                if not curr.left:
                    curr.left = node
                    return
                curr = curr.left
            else:
                if not curr.right:
                    curr.right = node
                    return
                curr = curr.right

    def search(self, val):
        curr = self.root
        while curr:
            if val == curr.val:
                return True
            if val < curr.val:
                curr = curr.left
            else:
                curr = curr.right
        return False

bst = BinarySearchTree()
for v in [8, 3, 10, 1, 6, 14, 4, 7, 13]:
    bst.insert(v)
print("10 found:", bst.search(10))
print("15 found:", bst.search(15))`,
    cpp: `#include <iostream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BinarySearchTree {
public:
    TreeNode* root;
    BinarySearchTree() : root(nullptr) {}

    void insert(int val) {
        if (!root) {
            root = new TreeNode(val);
            return;
        }
        TreeNode* curr = root;
        while (true) {
            if (val < curr->val) {
                if (!curr->left) {
                    curr->left = new TreeNode(val);
                    return;
                }
                curr = curr->left;
            } else {
                if (!curr->right) {
                    curr->right = new TreeNode(val);
                    return;
                }
                curr = curr->right;
            }
        }
    }

    bool search(int val) {
        TreeNode* curr = root;
        while (curr) {
            if (val == curr->val) return true;
            if (val < curr->val) curr = curr->left;
            else curr = curr->right;
        }
        return false;
    }
};

int main() {
    BinarySearchTree bst;
    for (int v : {8, 3, 10, 1, 6, 14, 4, 7, 13})
        bst.insert(v);
    cout << "10 found: " << bst.search(10) << endl;
    cout << "15 found: " << bst.search(15) << endl;
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
          mockOutput = '10 found: true\n15 found: false';
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
              className="w-full bg-transparent text-white border-none focus:outline-none resize-none p-4 h-96 whitespace-pre"
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
    id: 'leetcode-validate-bst',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/validate-binary-search-tree/',
    description: 'Check whether a given binary tree is a valid Binary Search Tree.',
    difficulty: 'Medium'
  },
  {
    id: 'hackerrank-insert-search',
    platform: 'HackerRank',
    url: 'https://www.hackerrank.com/challenges/binary-search-tree-insertion/problem',
    description: 'Implement insertion in a Binary Search Tree.',
    difficulty: 'Easy'
  },
  {
    id: 'codeforces-substitution',
    platform: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1300/A',
    description: 'Problem involving BST properties and transformation.',
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

const BinarySearchTree = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [stepIndex, setStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Build a tree and click Start to watch insertions.');
  const [steps, setSteps] = useState([]);
  const [showExplanations, setShowExplanations] = useState([]);
  const [completedProblems, setCompletedProblems] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [tree, setTree] = useState({
    root: {
      val: 8,
      left: {
        val: 3,
        left: { val: 1, left: null, right: null },
        right: {
          val: 6,
          left: { val: 4, left: null, right: null },
          right: { val: 7, left: null, right: null },
        },
      },
      right: {
        val: 10,
        left: null,
        right: {
          val: 14,
          left: { val: 13, left: null, right: null },
          right: null,
        },
      },
    },
  });

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('completedBSTProblems');
      if (savedCompleted) setCompletedProblems(JSON.parse(savedCompleted));
    } catch (e) {
      console.warn("Could not load completion state");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('completedBSTProblems', JSON.stringify(completedProblems));
    } catch (e) {
      console.warn("Could not save completion state");
    }
  }, [completedProblems]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0) setSelectedVoice(availableVoices[0]);
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
      setExplanation(step);
      setShowExplanations(prev => [...prev, stepIndex]);
      if (voiceEnabled && selectedVoice && synthRef.current) {
        if (synthRef.current.speaking) synthRef.current.cancel();
        utteranceRef.current = new SpeechSynthesisUtterance(step);
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

  const validateInput = (val) => {
    const num = Number(val);
    if (isNaN(num)) {
      setError('Please enter a valid number');
      return false;
    }
    setError('');
    return true;
  };

  const insertValue = () => {
    if (!validateInput(inputValue)) return;
    const newSteps = [];
    const val = Number(inputValue);

    let found = false;
    function dfs(node, path) {
      if (!node || found) return;
      newSteps.push(`Visiting node ${node.val}`);
      if (val < node.val && node.left) {
        dfs(node.left, [...path, {name: String(node.val), side: 'left'}]);
      } else if (val >= node.val && node.right) {
        dfs(node.right, [...path, {name: String(node.val), side: 'right'}]);
      }
    }

    const clone = JSON.parse(JSON.stringify(tree));
    function insert(root, path) {
      if (!root) return { val, left: null, right: null };
      if (val < root.val) {
        const side = 'left';
        newSteps.push(`${val} < ${root.val}, moving left`);
        root.left = insert(root.left, [...path, { name: String(root.val), side }]);
      }
      else {
        const side = 'right';
        newSteps.push(`${val} >= ${root.val}, moving right`);
        root.right = insert(root.right, [...path, { name: String(root.val), side }]);
      }
      return root;
    }
    clone.root = insert(clone.root, []);
    newSteps.push(`Inserted ${val} into the BST`);
    setTree(clone);
    setSteps(newSteps);
    setStepIndex(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  const handleSearch = () => {
    if (!validateInput(searchValue)) return;
    const val = Number(searchValue);
    const newSteps = [];
    function dfs(node) {
      if (!node) {
        newSteps.push(`Null node reached; ${val} not found`);
        return false;
      }
      newSteps.push(`Searching at node ${node.val}`);
      if (val === node.val) {
        newSteps.push(`Found ${val} at node ${node.val}`);
        return true;
      }
      if (val < node.val) {
        newSteps.push(`${val} < ${node.val}, search left subtree`);
        return dfs(node.left);
      } else {
        newSteps.push(`${val} >= ${node.val}, search right subtree`);
        return dfs(node.right);
      }
    }
    dfs(tree.root);
    setSteps(newSteps);
    setStepIndex(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  const handleSpeedChange = (e) => setSpeed(2000 - e.target.value);

  const togglePlay = () => {
    if (steps.length === 0 || stepIndex >= steps.length - 1) {
      setSteps([]);
      setStepIndex(0);
      setExplanation('Insert or search to view steps');
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const stepForward = () => {
    setIsPlaying(false);
    if (stepIndex < steps.length - 1) setStepIndex(i => i + 1);
  };

  const stepBackward = () => {
    setIsPlaying(false);
    if (stepIndex > 0) setStepIndex(i => i - 1);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setSteps([]);
    setStepIndex(0);
    setShowExplanations([]);
    if (synthRef.current && synthRef.current.speaking) synthRef.current.cancel();
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (synthRef.current && synthRef.current.speaking) synthRef.current.cancel();
  };

  const handleVoiceChange = (e) => {
    const voice = voices.find(v => v.name === e.target.value);
    if (voice) setSelectedVoice(voice);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-4 animate-fade-in">Binary Search Tree</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          A Binary Search Tree keeps data in sorted order, enabling fast search, insert, delete with average time O(log n).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Interactive Demo</h2>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Insert Number into BST:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="e.g. 5"
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Insert value into BST"
              />
              <button
                onClick={insertValue}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                aria-label="Insert node"
              >
                <Plus size={20} /> Insert
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Search for a Node:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="e.g. 10"
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                aria-label="Search BST for value"
              />
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                aria-label="Search node"
              >
                Search
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-500">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={togglePlay}
              disabled={!steps.length}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              aria-label={isPlaying ? "Pause animation" : "Start animation"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? "Pause" : "Start"}
            </button>
            <button
              onClick={stepBackward}
              disabled={stepIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${stepIndex === 0 ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white shadow-md'}`}
              aria-label="Previous step"
            >
              <StepBack size={18} /> Back
            </button>
            <button
              onClick={stepForward}
              disabled={stepIndex >= steps.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${stepIndex >= steps.length - 1 ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white shadow-md'}`}
              aria-label="Next step"
            >
              <StepForward size={18} /> Next
            </button>
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              aria-label="Reset animation"
            >
              <RotateCcw size={18} /> Reset
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

          <div className="flex items-center gap-4">
            <button
              onClick={toggleVoice}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              aria-label={voiceEnabled ? "Disable voice narration" : "Enable voice narration"}
            >
              {voiceEnabled ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
                  <option key={voice.name} value={voice.name}>{voice.name}</option>
                ))}
              </select>
            )}
          </div>
          {typeof window !== 'undefined' && !window.speechSynthesis && (
            <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-lg border border-yellow-300">
              Voice narration unavailable in this browser
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">BST Visualization</h2>

          <div className="mb-6 relative overflow-auto min-h-[300px] p-4 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-2 items-center">
              <pre className="text-green-700 dark:text-green-300 font-mono text-sm">
                {explanation}
              </pre>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-6 min-h-[90px]">
            <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-2">Current Step:</h3>
            <div className="text-gray-800 dark:text-gray-200 animate-fade-in">
              {explanation}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">Step-by-Step Explanation:</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
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
                  <div className="font-medium text-blue-700 dark:text-blue-400">Step {idx + 1}</div>
                  <div className="text-gray-800 dark:text-gray-300">{step}</div>
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
            <p className="text-gray-700 dark:text-gray-300">Each node has at most two children; left child has smaller values and right child has larger values, enabling efficient insertion and look-ups.</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <h3 className="font-bold text-lg text-green-700 dark:text-green-400 mb-2">Time Complexity</h3>
            <p className="text-gray-700 dark:text-gray-300">Average O(log n) for balanced trees; O(1) for perfect balance, O(n) worst-case for unbalanced trees.</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <h3 className="font-bold text-lg text-purple-700 dark:text-purple-400 mb-2">Real-World Uses</h3>
            <p className="text-gray-700 dark:text-gray-300">Database indexing, file systems, compiler syntax trees, implementing sets and maps, and maintaining sorted dictionaries.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-300 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700 dark:text-yellow-400">
          <li>BST requires a comparison order between elements.</li>
          <li>Balanced BSTs (AVL/Red-Black) guarantee O(log n) operations.</li>
          <li>Duplicate values are typically inserted into the right subtree.</li>
          <li>Inorder traversal yields sorted sequence.</li>
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
                className={`flex flex-col p-4 rounded-lg border transition-all duration-300 ${isCompleted ? 'opacity-60 bg-gray-100 dark:bg-gray-800' : 'hover:shadow-lg hover:scale-105'} bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700`}
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

export default BinarySearchTree;