import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

const KMP = () => {
  const [text, setText] = useState('ABABDABACDABABCABAB');
  const [pattern, setPattern] = useState('ABABCABAB');
  const [currentI, setCurrentI] = useState(-1);
  const [currentJ, setCurrentJ] = useState(-1);
  const [matched, setMatched] = useState(false);
  const [lps, setLps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [explanation, setExplanation] = useState('Enter text and pattern to begin KMP algorithm');
  const [highlightStart, setHighlightStart] = useState(-1);
  const [highlightEnd, setHighlightEnd] = useState(-1);
  const [showExplanations, setShowExplanations] = useState([]);
  const [buildLps, setBuildLps] = useState(false);

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
    if (currentStep < steps.length && isPlaying) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentStep, isPlaying, speed, steps]);

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      setCurrentI(step.i);
      setCurrentJ(step.j);
      setMatched(step.matched);
      setLps(step.lps);
      setBuildLps(step.buildLps || false);
      setHighlightStart(step.highlightStart);
      setHighlightEnd(step.highlightEnd);
      setExplanation(step.explanation);
      setShowExplanations(prev => [...prev, currentStep]);

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
  }, [currentStep, steps, voiceEnabled, selectedVoice]);

  const computeLPS = (pattern) => {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  };

  const startSearch = () => {
    if (!text || !pattern) {
      setExplanation('Please enter both text and pattern');
      return;
    }

    const newSteps = [];
    const lps = computeLPS(pattern);
    
    newSteps.push({
      i: -1,
      j: -1,
      matched: false,
      lps: lps,
      buildLps: true,
      highlightStart: -1,
      highlightEnd: -1,
      explanation: `Building LPS (Longest Prefix Suffix) array for pattern "${pattern}". LPS helps skip unnecessary comparisons.`
    });

    let i = 0;
    let j = 0;

    newSteps.push({
      i: i,
      j: j,
      matched: false,
      lps: lps,
      highlightStart: 0,
      highlightEnd: pattern.length - 1,
      explanation: `Starting search: i=${i}, j=${j}. Comparing pattern with text at position ${i}`
    });

    while (i < text.length) {
      if (pattern[j] === text[i]) {
        newSteps.push({
          i: i,
          j: j,
          matched: false,
          lps: lps,
          highlightStart: i - j,
          highlightEnd: i - j + pattern.length - 1,
          explanation: `Characters match: pattern[${j}]=${pattern[j]} equals text[${i}]=${text[i]}. Incrementing both pointers.`
        });
        i++;
        j++;

        if (j === pattern.length) {
          newSteps.push({
            i: i,
            j: j,
            matched: true,
            lps: lps,
            highlightStart: i - j,
            highlightEnd: i - 1,
            explanation: `Pattern found at index ${i - j}! Found complete match at position ${i - j} to ${i - 1}`
          });
          break;
        }
      } else {
        if (j !== 0) {
          const oldJ = j;
          j = lps[j - 1];
          newSteps.push({
            i: i,
            j: j,
            matched: false,
            lps: lps,
            highlightStart: i - j,
            highlightEnd: i - j + pattern.length - 1,
            explanation: `Mismatch at pattern[${oldJ}]=${pattern[oldJ]} vs text[${i}]=${text[i]}. Using LPS to skip ${oldJ - j} positions. New j=${j}`
          });
        } else {
          newSteps.push({
            i: i,
            j: j,
            matched: false,
            lps: lps,
            highlightStart: i + 1,
            highlightEnd: i + pattern.length,
            explanation: `Mismatch at pattern[${j}]=${pattern[j]} vs text[${i}]=${text[i]}. Since j=0, incrementing i to ${i + 1}`
          });
          i++;
        }
      }
    }

    if (!newSteps.some(step => step.matched)) {
      newSteps.push({
        i: text.length,
        j: j,
        matched: false,
        lps: lps,
        highlightStart: -1,
        highlightEnd: -1,
        explanation: 'Pattern not found in text'
      });
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  const handleSpeedChange = (e) => {
    setSpeed(2000 - e.target.value);
  };

  const togglePlay = () => {
    if (steps.length === 0) {
      startSearch();
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

  const resetSearch = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setCurrentI(-1);
    setCurrentJ(-1);
    setMatched(false);
    setLps([]);
    setSteps([]);
    setShowExplanations([]);
    setExplanation('Enter text and pattern to begin KMP algorithm');
    setHighlightStart(-1);
    setHighlightEnd(-1);
    setBuildLps(false);
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

  const getTextCharClass = (index) => {
    let classes = 'inline-block w-12 h-12 text-center leading-12 text-lg font-mono border ';
    
    if (buildLps) {
      classes += 'bg-gray-200';
    } else if (index >= highlightStart && index <= highlightEnd && highlightStart !== -1) {
      if (index - highlightStart === currentJ && !matched) {
        classes += 'bg-yellow-300 border-yellow-500';
      } else {
        classes += 'bg-blue-200 border-blue-400';
      }
    } else {
      classes += 'bg-gray-100 border-gray-300';
    }
    
    if (index === currentI) {
      classes += ' border-red-500 ring-2 ring-red-400';
    }
    
    return classes;
  };

  const getPatternCharClass = (index) => {
    let classes = 'inline-block w-12 h-12 text-center leading-12 text-lg font-mono border ';
    
    if (buildLps) {
      classes += 'bg-purple-200 border-purple-400';
    } else if (index === currentJ) {
      classes += 'bg-red-400 border-red-600 text-white';
    } else if (index < currentJ) {
      classes += 'bg-green-200 border-green-400';
    } else {
      classes += 'bg-gray-200 border-gray-400';
    }
    
    return classes;
  };

  return (
// Assuming Tailwind CSS dark mode is enabled via the 'class' strategy.
// Add the 'dark' class to your <html> or <body> tag to toggle dark mode.

<div className="max-w-6xl mx-auto p-6 font-sans dark:bg-gray-900">
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-4 animate-fade-in">KMP Algorithm</h1>
    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
      Knuth-Morris-Pratt (KMP) efficiently finds pattern occurrences using LPS array to skip unnecessary comparisons.
      Time complexity: O(n + m)
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:border dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Interactive Demo</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Text String:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
          aria-label="Enter text to search in"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Pattern String:</label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
          aria-label="Enter pattern to search for"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          aria-label={isPlaying ? "Pause animation" : "Start animation"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {isPlaying ? "Pause" : "Start"}
        </button>
        <button
          onClick={stepBackward}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
          aria-label="Previous step"
        >
          <StepBack size={20} /> Back
        </button>
        <button
          onClick={stepForward}
          disabled={currentStep >= steps.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
          aria-label="Next step"
        >
          <StepForward size={20} /> Next
        </button>
        <button
          onClick={resetSearch}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
          aria-label="Reset search"
        >
          <RotateCcw size={20} /> Reset
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Animation Speed:</label>
        <input
          type="range"
          min="100"
          max="1900"
          value={2000 - speed}
          onChange={handleSpeedChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
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
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
          aria-label={voiceEnabled ? "Disable voice narration" : "Enable voice narration"}
        >
          {voiceEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
          {voiceEnabled ? "Mute Voice" : "Unmute Voice"}
        </button>
        
        {voices.length > 0 && voiceEnabled && (
          <select
            value={selectedVoice?.name || ''}
            onChange={handleVoiceChange}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:outline-none"
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
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg border border-yellow-300 dark:border-yellow-700">
          Voice narration unavailable in this browser
        </div>
      )}
    </div>

    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:border dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Algorithm Visualization</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Text:</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {text.split('').map((char, index) => (
            <div key={index} className={getTextCharClass(index)}>
              {char}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 text-xs">
          {Array.from({length: text.length}, (_, i) => (
            <div key={i} className="w-12 text-center text-gray-600 dark:text-gray-400">{i}</div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Pattern:</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {pattern.split('').map((char, index) => (
            <div key={index} className={getPatternCharClass(index)}>
              {char}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 text-xs">
          {Array.from({length: pattern.length}, (_, i) => (
            <div key={i} className="w-12 text-center text-gray-600 dark:text-gray-400">{i}</div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">LPS Array:</h3>
        <div className="flex flex-wrap gap-1">
          {lps.map((val, index) => (
            <div key={index} className="w-12 h-12 bg-purple-200 dark:bg-purple-800 border border-purple-400 dark:border-purple-600 text-center flex items-center justify-center text-lg text-gray-800 dark:text-gray-100">
              {val}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
        <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-2">Current Step:</h3>
        <div className="text-gray-800 dark:text-gray-300 animate-fade-in">
          {explanation}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">Step-by-Step Explanation:</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                showExplanations.includes(idx)
                  ? 'bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-500 shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 opacity-70 dark:opacity-60'
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

  <div className="mt-10 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Key Concepts</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-bold text-lg text-blue-700 dark:text-blue-400 mb-2">How It Works</h3>
        <p className="text-gray-700 dark:text-gray-300">KMP uses the LPS array to skip characters when a mismatch occurs, avoiding re-examination of previously matched characters.</p>
      </div>
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="font-bold text-lg text-green-700 dark:text-green-400 mb-2">Time Complexity</h3>
        <p className="text-gray-700 dark:text-gray-300">O(n + m) - Linear time complexity where n is text length and m is pattern length, making it very efficient for string matching.</p>
      </div>
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="font-bold text-lg text-purple-700 dark:text-purple-400 mb-2">Real-World Uses</h3>
        <p className="text-gray-700 dark:text-gray-300">Text editors for find/replace, plagiarism detection, DNA sequence analysis, file search, and web search engines.</p>
      </div>
    </div>
  </div>

  <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg border border-yellow-200 dark:border-yellow-700">
    <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-300 mb-2">Important Notes</h3>
    <ul className="list-disc pl-5 space-y-1 text-yellow-700 dark:text-yellow-400">
      <li>LPS array is computed in O(m) time before the actual search</li>
      <li>When mismatch occurs, LPS determines how many positions to shift</li>
      <li>KMP never re-examines characters in the text already matched</li>
      <li>Algorithm continues until pattern found or end of text reached</li>
    </ul>
  </div>
</div>
  );
};

export default KMP;