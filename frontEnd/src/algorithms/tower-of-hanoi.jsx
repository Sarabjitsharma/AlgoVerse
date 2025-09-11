import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

const TowerOfHanoi = () => {
  const [numDisks, setNumDisks] = useState(3);
  const [towers, setTowers] = useState({ A: [3, 2, 1], B: [], C: [] });
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Enter number of disks to begin the Tower of Hanoi');
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
      setTowers({ ...step.towers });
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
    if (numDisks < 1 || numDisks > 8) {
      setError('Please enter between 1 and 8 disks');
      return false;
    }
    return true;
  };

  const generateSteps = (n, source, auxiliary, target, steps) => {
    if (n === 1) {
      const newStep = {
        towers: JSON.parse(JSON.stringify(steps[steps.length - 1]?.towers || { A: [], B: [], C: [] })),
        explanation: `Move disk 1 from ${source} to ${target}`
      };
      const disk = newStep.towers[source].pop();
      newStep.towers[target].push(disk);
      steps.push(newStep);
    } else {
      generateSteps(n - 1, source, target, auxiliary, steps);
      const newStep = {
        towers: JSON.parse(JSON.stringify(steps[steps.length - 1]?.towers || { A: [], B: [], C: [] })),
        explanation: `Move disk ${n} from ${source} to ${target}`
      };
      const disk = newStep.towers[source].pop();
      newStep.towers[target].push(disk);
      steps.push(newStep);
      generateSteps(n - 1, auxiliary, source, target, steps);
    }
  };

  const startHanoi = () => {
    if (!validateInput()) return;
    
    const initialTowers = {
      A: Array.from({ length: numDisks }, (_, i) => numDisks - i),
      B: [],
      C: []
    };
    
    const newSteps = [{
      towers: JSON.parse(JSON.stringify(initialTowers)),
      explanation: `Starting Tower of Hanoi with ${numDisks} disks`
    }];
    
    generateSteps(numDisks, 'A', 'B', 'C', newSteps);
    
    newSteps.push({
      towers: JSON.parse(JSON.stringify(newSteps[newSteps.length - 1].towers)),
      explanation: `Complete! All ${numDisks} disks moved from A to C`
    });
    
    setSteps(newSteps);
    setTowers(initialTowers);
    setStepIndex(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  const handleNumDisksChange = (e) => {
    setNumDisks(parseInt(e.target.value) || 1);
    setError('');
  };

  const handleSpeedChange = (e) => {
    setSpeed(2000 - e.target.value);
  };

  const togglePlay = () => {
    if (steps.length === 0) {
      startHanoi();
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

  const resetHanoi = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setSteps([]);
    setTowers({ A: Array.from({ length: numDisks }, (_, i) => numDisks - i), B: [], C: [] });
    setShowExplanations([]);
    setExplanation('Enter number of disks to begin the Tower of Hanoi');
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

  const getDiskWidth = (diskSize) => {
    return `${diskSize * 30 + 40}px`;
  };

  const getTowerHeight = () => {
    return `${numDisks * 30 + 60}px`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 animate-fade-in">Tower of Hanoi Algorithm</h1>
        <p className="text-lg text-gray-700 mb-6">
          Tower of Hanoi is a classic recursive puzzle that demonstrates algorithmic thinking.
          Move all disks from the starting peg to the destination peg following specific rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interactive Demo</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Number of Disks (1-8):</label>
            <input
              type="number"
              min="1"
              max="8"
              value={numDisks}
              onChange={handleNumDisksChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Enter number of disks for Tower of Hanoi"
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
              onClick={resetHanoi}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              aria-label="Reset puzzle"
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
          
          <div className="mb-8 flex justify-center gap-8">
            {['A', 'B', 'C'].map((tower) => (
              <div key={tower} className="flex flex-col items-center">
                <div className="text-lg font-bold text-gray-800 mb-2">Peg {tower}</div>
                <div 
                  className="relative bg-gray-300 border-2 border-gray-500 border-b-0 border-t-0 border-b-4 border-b-gray-600"
                  style={{ 
                    width: '140px', 
                    height: getTowerHeight(),
                    transition: 'height 0.3s ease'
                  }}
                >
                  {towers[tower].map((disk, index) => (
                    <div
                      key={`${tower}-${disk}`}
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white border-2 border-blue-600 rounded-lg flex items-center justify-center transition-all duration-500 ease-in-out"
                      style={{
                        width: getDiskWidth(disk),
                        height: '25px',
                        bottom: `${index * 30}px`,
                        zIndex: disk
                      }}
                    >
                      {disk}
                    </div>
                  ))}
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
            <p>Tower of Hanoi uses recursion to move disks between pegs. It breaks the problem into smaller subproblems until reaching the base case of moving a single disk.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-lg text-green-700 mb-2">Time Complexity</h3>
            <p>O(2^n) - Exponential time complexity. The minimum number of moves required is 2^n - 1, where n is the number of disks.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg text-purple-700 mb-2">Real-World Uses</h3>
            <p>Understanding recursion, algorithmic thinking, computer science education, and as a benchmark for testing recursive function performance.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-lg text-yellow-800 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li>Only one disk can be moved at a time</li>
          <li>A larger disk cannot be placed on top of a smaller disk</li>
          <li>All disks must be moved from the starting peg to the destination peg</li>
          <li>The minimum number of moves follows the pattern 2^n - 1</li>
        </ul>
      </div>
    </div>
  );
};

export default TowerOfHanoi;