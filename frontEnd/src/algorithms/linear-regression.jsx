import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

const LinearRegression = () => {
  const [points, setPoints] = useState([
    { x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }, { x: 4, y: 8 },
    { x: 5, y: 10 }, { x: 6, y: 12 }, { x: 7, y: 14 }, { x: 8, y: 16 }
  ]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Enter data points to perform linear regression');
  const [steps, setSteps] = useState([]);
  const [showExplanations, setShowExplanations] = useState([]);
  const [slope, setSlope] = useState(0);
  const [intercept, setIntercept] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

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
      setCurrentStep(step.step);
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
    if (points.length < 2) {
      setError('Need at least 2 data points for linear regression');
      return false;
    }
    for (let i = 0; i < points.length; i++) {
      if (isNaN(points[i].x) || isNaN(points[i].y)) {
        setError('All coordinates must be numbers');
        return false;
      }
    }
    return true;
  };

  const calculateLinearRegression = () => {
    if (!validateInput()) return;

    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;

    const newSteps = [];
    let stepCounter = 0;

    newSteps.push({
      step: 'init',
      explanation: 'Starting linear regression calculation with ' + n + ' data points'
    });

    newSteps.push({
      step: 'means',
      explanation: 'Calculating means: x̄ = ' + meanX.toFixed(2) + ', ȳ = ' + meanY.toFixed(2)
    });

    const numerator = n * sumXY - sumX * sumY;
    const denominator = n * sumXX - sumX * sumX;
    
    newSteps.push({
      step: 'numerator',
      explanation: 'Numerator = n·Σxy - Σx·Σy = ' + n + '·' + sumXY + ' - ' + sumX + '·' + sumY + ' = ' + numerator
    });

    newSteps.push({
      step: 'denominator',
      explanation: 'Denominator = n·Σx² - (Σx)² = ' + n + '·' + sumXX + ' - ' + sumX + '² = ' + denominator
    });

    const m = numerator / denominator;
    const b = meanY - m * meanX;

    newSteps.push({
      step: 'slope',
      explanation: 'Slope m = numerator / denominator = ' + numerator + ' / ' + denominator + ' = ' + m.toFixed(4)
    });

    newSteps.push({
      step: 'intercept',
      explanation: 'Intercept b = ȳ - m·x̄ = ' + meanY.toFixed(2) + ' - ' + m.toFixed(4) + '·' + meanX.toFixed(2) + ' = ' + b.toFixed(4)
    });

    newSteps.push({
      step: 'equation',
      explanation: 'Linear equation: y = ' + m.toFixed(4) + 'x + ' + b.toFixed(4)
    });

    setSteps(newSteps);
    setSlope(m);
    setIntercept(b);
    setStepIndex(0);
    setShowExplanations([]);
    setIsPlaying(true);
  };

  const handlePointsChange = (e) => {
    const input = e.target.value;
    const pairs = input.split(';');
    const newPoints = [];
    for (let pair of pairs) {
      const coords = pair.split(',').map(n => parseFloat(n.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        newPoints.push({ x: coords[0], y: coords[1] });
      }
    }
    setPoints(newPoints);
    setError('');
  };

  const handleSpeedChange = (e) => {
    setSpeed(2000 - e.target.value);
  };

  const togglePlay = () => {
    if (steps.length === 0) {
      calculateLinearRegression();
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

  const reset = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setSteps([]);
    setSlope(0);
    setIntercept(0);
    setCurrentStep('');
    setExplanation('Enter data points to perform linear regression');
    setShowExplanations([]);
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

  const getPointClass = (index) => {
    if (currentStep === 'equation') return 'bg-green-500 text-white';
    return 'bg-blue-500 text-white';
  };

  const predict = (x) => slope * x + intercept;

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700 mb-4 animate-fade-in">Linear Regression Algorithm</h1>
        <p className="text-lg text-gray-700 mb-6">
          Linear regression finds the best-fitting straight line through a set of data points using the least squares method.
          Time complexity: O(n) for n data points
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interactive Demo</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Data Points (x,y pairs separated by semicolons):</label>
            <input
              type="text"
              value={points.map(p => p.x + ',' + p.y).join(';')}
              onChange={handlePointsChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              aria-label="Enter data points as x,y pairs separated by semicolons"
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
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
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
              onClick={reset}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              aria-label="Reset calculation"
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
            {points.map((point, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center transition-all duration-500 ease-in-out ${getPointClass(index)} rounded`} 
                style={{ 
                  width: '60px', 
                  height: `${point.y * 10 + 40}px`,
                  transition: 'background-color 0.5s, transform 0.5s'
                }}
              >
                <div className="font-bold mb-1">({point.x},{point.y})</div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
            <h3 className="font-bold text-lg text-green-800 mb-2">Current Step:</h3>
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
                      ? 'bg-white border-green-300 shadow-sm' 
                      : 'bg-gray-100 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="font-medium text-green-700">Step {idx + 1}:</div>
                  <div>{step.explanation}</div>
                </div>
              ))}
            </div>
          </div>

          {(slope !== 0 || intercept !== 0) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-lg text-blue-800 mb-2">Regression Results:</h3>
              <div className="text-gray-800">
                <div>Slope (m): <strong>{slope.toFixed(4)}</strong></div>
                <div>Intercept (b): <strong>{intercept.toFixed(4)}</strong></div>
                <div>Equation: <strong>y = {slope.toFixed(4)}x + {intercept.toFixed(4)}</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Key Concepts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-lg text-blue-700 mb-2">How It Works</h3>
            <p>Linear regression minimizes the sum of squared vertical distances (residuals) between the data points and the fitted line to find the best-fit line.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-lg text-green-700 mb-2">Time Complexity</h3>
            <p>O(n) for n data points - processes each point once to compute sums and then solves the normal equations to find slope and intercept.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg text-purple-700 mb-2">Real-World Uses</h3>
            <p>Trend analysis, stock market forecasting, sales predictions, medical dose-response relationships, and any scenario with linear relationships.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-lg text-yellow-800 mb-2">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li>Ensure at least 2 distinct data points for meaningful regression</li>
          <li>Verify data is approximately linear for best results</li>
          <li>Check for outliers that could skew the fit</li>
          <li>Always validate model performance on unseen data</li>
        </ul>
      </div>
    </div>
  );
};

export default LinearRegression;