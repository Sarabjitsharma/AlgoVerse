import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

const RedBlackTrees = () => {
  const [tree, setTree] = useState({
    root: {
      value: 10,
      color: 'black',
      left: {
        value: 5,
        color: 'red',
        left: null,
        right: null
      },
      right: {
        value: 15,
        color: 'red',
        left: null,
        right: null
      }
    }
  });
  const [insertValue, setInsertValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [stepIndex, setStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Enter a value to insert into the Red-Black Tree');
  const [steps, setSteps] = useState([]);
  const [showExplanations, setShowExplanations] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [rotationType, setRotationType] = useState('');
  const [recolorNodes, setRecolorNodes] = useState([]);

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
      setExplanation(step.explanation);
      setCurrentNode(step.node);
      setRotationType(step.rotation || '');
      setRecolorNodes(step.recolor || []);
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

  const isRed = (node) => {
    return node && node.color === 'red';
  };

  const isBlack = (node) => {
    return !node || node.color === 'black';
  };

  const rotateLeft = (node) => {
    const right = node.right;
    node.right = right.left;
    right.left = node;
    right.color = node.color;
    node.color = 'red';
    return right;
  };

  const rotateRight = (node) => {
    const left = node.left;
    node.left = left.right;
    left.right = node;
    left.color = node.color;
    node.color = 'red';
    return left;
  };

  const flipColors = (node) => {
    node.color = 'red';
    if (node.left) node.left.color = 'black';
    if (node.right) node.right.color = 'black';
  };

  const insertNode = (node, value, steps) => {
    if (!node) {
      steps.push({
        explanation: `Created new red node with value ${value}`,
        node: { value, color: 'red' }
      });
      return { value, color: 'red', left: null, right: null };
    }

    steps.push({
      explanation: `Comparing ${value} with node ${node.value}`,
      node: node
    });

    if (value < node.value) {
      steps.push({
        explanation: `${value} is less than ${node.value}, inserting into left subtree`,
        node: node
      });
      node.left = insertNode(node.left, value, steps);
    } else if (value > node.value) {
      steps.push({
        explanation: `${value} is greater than ${node.value}, inserting into right subtree`,
        node: node
      });
      node.right = insertNode(node.right, value, steps);
    } else {
      steps.push({
        explanation: `Value ${value} already exists in the tree`,
        node: node
      });
      return node;
    }

    // Fix right-leaning red links
    if (isRed(node.right) && isBlack(node.left)) {
      steps.push({
        explanation: `Right child is red but left child is black - rotating ${node.value} left`,
        node: node,
        rotation: 'left'
      });
      node = rotateLeft(node);
    }

    // Fix two red links in a row
    if (isRed(node.left) && isRed(node.left.left)) {
      steps.push({
        explanation: `Two red links in a row - rotating ${node.value} right`,
        node: node,
        rotation: 'right'
      });
      node = rotateRight(node);
    }

    // Flip colors if both children are red
    if (isRed(node.left) && isRed(node.right)) {
      steps.push({
        explanation: `Both children are red - flipping colors at node ${node.value}`,
        node: node,
        recolor: [node, node.left, node.right]
      });
      flipColors(node);
    }

    return node;
  };

  const insertRedBlackTree = (value) => {
    const newSteps = [];
    newSteps.push({
      explanation: `Starting to insert value ${value} into Red-Black Tree`,
      node: null
    });

    const newTree = { ...tree };
    newTree.root = insertNode(tree.root, value, newSteps);

    // Root must always be black
    if (newTree.root && newTree.root.color === 'red') {
      newSteps.push({
        explanation: 'Making root black to maintain Red-Black Tree property',
        node: newTree.root,
        recolor: [newTree.root]
      });
      newTree.root.color = 'black';
    }

    newSteps.push({
      explanation: `Successfully inserted ${value}. Red-Black Tree properties maintained`,
      node: null
    });

    setSteps(newSteps);
    setStepIndex(0);
    setShowExplanations([]);
    setIsPlaying(true);
    return newTree;
  };

  const startInsert = () => {
    if (!validateInput()) return;
    
    const value = Number(insertValue);
    const newTree = insertRedBlackTree(value);
    setTree(newTree);
    setInsertValue('');
  };

  const handleSpeedChange = (e) => {
    setSpeed(2000 - e.target.value);
  };

  const togglePlay = () => {
    if (steps.length === 0) {
      startInsert();
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

  const resetSearch = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setSteps([]);
    setShowExplanations([]);
    setCurrentNode(null);
    setRotationType('');
    setRecolorNodes([]);
    setExplanation('Enter a value to insert into the Red-Black Tree');
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

  const getNodeClass = (node) => {
    if (!node) return '';
    
    let classes = 'w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all duration-500 ';
    
    if (recolorNodes.includes(node)) {
      classes += 'animate-pulse ';
    }
    
    if (node === currentNode) {
      classes += 'ring-4 ring-yellow-400 transform scale-110 ';
    }
    
    if (rotationType === 'left' && node === currentNode) {
      classes += 'animate-spin ';
    }
    
    if (rotationType === 'right' && node === currentNode) {
      classes += 'animate-spin ';
    }
    
    if (node.color === 'red') {
      classes += 'bg-red-500 shadow-lg';
    } else {
      classes += 'bg-black shadow-lg';
    }
    
    return classes;
  };

  const renderTree = (node, level = 0, position = 'root') => {
    if (!node) return null;
    
    const leftChildren = renderTree(node.left, level + 1, 'left');
    const rightChildren = renderTree(node.right, level + 1, 'right');
    
    return (
      <div key={`${node.value}-${level}-${position}`} className="flex flex-col items-center">
        <div className={getNodeClass(node)}>
          {node.value}
        </div>
        {node.color === 'red' && (
          <div className="text-red-500 text-xs font-bold mt-1">RED</div>
        )}
        {node.color === 'black' && (
          <div className="text-gray-500 text-xs font-bold mt-1">BLACK</div>
        )}
        <div className="flex gap-8 mt-4">
          {leftChildren}
          {rightChildren}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 animate-fade-in">Red-Black Trees</h1>
        <p className="text-lg text-gray-700 mb-6">
          Red-Black Trees are self-balancing binary search trees where each node has an extra bit (color) 
          to ensure the tree remains balanced. Time complexity: O(log n) for all operations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interactive Demo</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Value to Insert:</label>
            <input
              type="text"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Enter value to insert"
              placeholder="Enter a number"
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
              {isPlaying ? "Pause" : "Insert"}
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
              onClick={resetSearch}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              aria-label="Reset tree"
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tree Visualization</h2>
          
          <div className="mb-8 flex justify-center min-h-[300px] overflow-auto">
            {renderTree(tree.root)}
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
            <h3 className="font-bold text-lg text-blue-700 mb-2">Red-Black Properties</h3>
            <p>Every node is either red or black. The root is always black. Red nodes cannot have red children (no two reds in a row). All paths have the same number of black nodes.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-lg text-green-700 mb-2">Self-Balancing</h3>
            <p>Through rotations and recoloring, the tree maintains O(log n) height. Left and right rotations reorganize the tree structure while preserving the binary search property.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg text-purple-700 mb-2">Real-World Uses</h3>
            <p>Java's TreeMap, C++ STL map/multimap, Linux kernel's Completely Fair Scheduler. Used in databases, file systems, and anywhere balanced trees are needed.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-lg text-yellow-800 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li>New nodes are always inserted as red nodes</li>
          <li>All leaf nodes (nulls) are considered black</li>
          <li>Rotations maintain the binary search tree property</li>
          <li>The tree height is always O(log n) where n is the number of nodes</li>
        </ul>
      </div>
    </div>
  );
};

export default RedBlackTrees;