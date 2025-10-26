import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, StepForward, StepBack, RotateCcw, PlayCircle } from 'lucide-react';

const KNIGHT_MOVES = [
  [2, 1], [2, -1], [-2, 1], [-2, -1],
  [1, 2], [1, -2], [-1, 2], [-1, -2]
];

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const codeSnippets = {
    javascript: `function knightsTour(rows, cols) {
  const board = Array(rows).fill(null).map(() => Array(cols).fill(-1));
  const total = rows * cols;
  let moves = 0;

  function isValid(r, c) {
    return r >= 0 && c >= 0 && r < rows && c < cols && board[r][c] === -1;
  }

  function backtrack(r, c, moveCount) {
    if (moveCount === total) return true;
    for (const [dr, dc] of KNIGHT_MOVES) {
      const nr = r + dr, nc = c + dc;
      if (isValid(nr, nc)) {
        board[nr][nc] = moveCount;
        if (backtrack(nr, nc, moveCount + 1)) return true;
        board[nr][nc] = -1;
      }
    }
    return false;
  }
  
  board[0][0] = 0;
  backtrack(0, 0, 1);
  return board;
}`,
    python: `def knights_tour(rows, cols):
    board = [[-1 for _ in range(cols)] for _ in range(rows)]
    total = rows * cols
    moves = 0
    
    def is_valid(r, c):
        return 0 <= r < rows and 0 <= c < cols and board[r][c] == -1
    
    def backtrack(r, c, move_count):
        if move_count == total:
            return True
        for dr, dc in KNIGHT_MOVES:
            nr, nc = r + dr, c + dc
            if is_valid(nr, nc):
                board[nr][nc] = move_count
                if backtrack(nr, nc, move_count + 1):
                    return True
                board[nr][nc] = -1
        return False
    
    board[0][0] = 0
    backtrack(0, 0, 1)
    return board`,
    cpp: `#include <vector>
using namespace std;

vector<vector<int>> knightsTour(int rows, int cols) {
    vector<vector<int>> board(rows, vector<int>(cols, -1));
    int total = rows * cols;
    vector<vector<int>> moves = {{2,1}, {2,-1}, {-2,1}, {-2,-1},
                                {1,2}, {1,-2}, {-1,2}, {-1,-2}};
    
    auto isValid = [&](int r, int c) {
        return r>=0 && c>=0 && r<rows && c<cols && board[r][c]==-1;
    };
    
    function<bool(int,int,int)> backtrack = [&](int r, int c, int moveCount) {
        if (moveCount == total) return true;
        for (auto& m : moves) {
            int nr = r + m[0], nc = c + m[1];
            if (isValid(nr, nc)) {
                board[nr][nc] = moveCount;
                if (backtrack(nr, nc, moveCount+1)) return true;
                board[nr][nc] = -1;
            }
        }
        return false;
    };
    
    board[0][0] = 0;
    backtrack(0, 0, 1);
    return board;
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
          mockOutput = 'Solution found a complete knight\\s tour!';
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
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
        language === lang 
          ? 'bg-gray-700 dark:bg-gray-900 text-white' 
          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
      }`}>
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
    id: 'leetcode-knight-probability',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/knight-probability-in-chessboard/',
    description: 'Find the probability that a knight stays on the board after making a given number of moves.',
    difficulty: 'Medium',
  },
  {
    id: 'hackerrank-knightl',
    platform: 'HackerRank',
    url: 'https://www.hackerrank.com/challenges/knightl-on-chessboard/problem',
    description: '"KnightL on a Chessboard" - Minimal moves for a modified knight to reach bottom-right corner.',
    difficulty: 'Medium'
  },
  {
    id: 'spoj-knight',
    platform: 'SPOJ',
    url: 'https://www.spoj.com/problems/KNGHT/',
    description: 'Find minimal knight moves between two squares on chessboard.',
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

const KnightsTour = () => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [board, setBoard] = useState([]);
  const [path, setPath] = useState([]);
  const [visitedSteps, setVisitedSteps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [stepIndex, setStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('Configure board size and click "Start Tour"');
  const [steps, setSteps] = useState([]);
  const [completedProblems, setCompletedProblems] = useState({});

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('completedKnightsTourProblems');
      if (saved) setCompletedProblems(JSON.parse(saved));
    } catch (err) {
      console.error('Could not load saved progress');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedKnightsTourProblems', JSON.stringify(completedProblems));
  }, [completedProblems]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const available = synthRef.current.getVoices();
        setVoices(available);
        if (available.length) setSelectedVoice(available[0]);
      };
      loadVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    } else {
      setVoiceEnabled(false);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (synthRef.current && synthRef.current.speaking) synthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    if (stepIndex < steps.length && isPlaying) {
      timeoutRef.current = setTimeout(() => setStepIndex(stepIndex + 1), speed);
    } else if (stepIndex >= steps.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [stepIndex, isPlaying, speed, steps]);

  useEffect(() => {
    if (steps.length && stepIndex < steps.length) {
      const st = steps[stepIndex];
      setVisitedSteps(st.visited);
      setPath(st.path);
      setExplanation(st.explanation);
      if (voiceEnabled && selectedVoice && synthRef.current) {
        if (synthRef.current.speaking) synthRef.current.cancel();
        utteranceRef.current = new SpeechSynthesisUtterance(st.explanation);
        utteranceRef.current.voice = selectedVoice;
        utteranceRef.current.rate = 0.95;
        synthRef.current.speak(utteranceRef.current);
      }
    }
  }, [stepIndex, steps, voiceEnabled, selectedVoice]);

  const solveTour = () => {
    let empty = Number.isNaN(rows) || Number.isNaN(cols) || !rows || !cols;
    if (empty || rows*cols < 2) {
      setError('Board must be at least 2x2');
      return;
    }
    if (rows > 30 || cols > 30) {
      setError('Board dimensions too large (≤30)');
      return;
    }
    setError('');
    setSteps([]);
    setStepIndex(0);
    setIsPlaying(false);
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const path = [];
    const trace = [{ visited: JSON.parse(JSON.stringify(visited)), path: [], explanation: 'Tour begins at top-left square' }];
    const total = rows * cols;

    const dfs = (r, c, level) => {
      path.push([r,c]);
      visited[r][c] = true;
      if (level === total) return true;
      const neighbors = KNIGHT_MOVES.map(([dr,dc]) => [r+dr, c+dc]).filter(([nr,nc]) => {
        return nr>=0 && nc>=0 && nr<rows && nc<cols && !visited[nr][nc];
      });
      neighbors.sort((a,b) => {
        const countA = KNIGHT_MOVES.reduce((acc,[dr,dc]) => {
            const [nr,nc]=[a[0]+dr,a[1]+dc];
            return acc + (nr>=0&&nc>=0&&nr<rows&&nc<cols&&!visited[nr][nc]?1:0);
        },0);
        const countB = KNIGHT_MOVES.reduce((acc,[dr,dc]) => {
            const [nr,nc]=[b[0]+dr,b[1]+dc];
            return acc + (nr>=0&&nc>=0&&nr<rows&&nc<cols&&!visited[nr][nc]?1:0);
        },0);
        return countA - countB;
      });
      for (const [nr,nc] of neighbors) {
        trace.push({ visited: JSON.parse(JSON.stringify(visited)), path: path.map(p=>[...p]), explanation: `Move knight to (${nr},${nc})` });
        if (dfs(nr,nc,level+1)) return true;
        path.pop();
        visited[nr][nc]=false;
        trace.push({ visited: JSON.parse(JSON.stringify(visited)), path: path.map(p=>[...p]), explanation: `Backtrack from (${nr},${nc})` });
      }
      path.pop();
      visited[r][c]=false;
      trace.push({ visited: JSON.parse(JSON.stringify(visited)), path: path.map(p=>[...p]), explanation: `Backtrack from (${r},${c})` });
      return false;
    }
    dfs(0,0,1);
    setSteps(trace);
    setIsPlaying(true);
  };

  const handleSizeChange = (setFn, val) => {
    const n = parseInt(val) || 1;
    setFn(Math.max(1, Math.min(30, n)));
  };

  const reset = () => {
    setIsPlaying(false);
    setSteps([]);
    setStepIndex(0);
    setPath([]);
    setVisitedSteps([]);
    if (synthRef.current) synthRef.current.cancel();
  };

  const toggleVoice = () => {
    setVoiceEnabled(prev => !prev);
    if (synthRef.current) synthRef.current.cancel();
  };

  const speedControl = (e) => setSpeed(2000 - e.target.value);

  const playPause = () => setIsPlaying(prev => !prev);

  const prevStep = () => setStepIndex(i => Math.max(0, i-1));

  const nextStep = () => setStepIndex(i => Math.min(steps.length-1, i+1));

  const boardColor = (r,c) => {
    const isVis = visitedSteps.some(([vr,vc])=>vr===r&&vc===c);
    const isCur = path.some(([pr,pc],idx)=>pr===r&&pc===c && idx===path.length-1);
    if (isCur) return { background: 'linear-gradient(135deg, #f59e0b, #fde68a)', border: '2px solid #d97706' };
    if (isVis) return { background: '#10b981', border: '1px solid #047857' };
    return { background: (r+c)%2===0 ? '#e5e7eb' : '#d1d5db', border: '1px solid #9ca3af' };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-700 dark:text-purple-400 mb-4 animate-fade-in">Knight's Tour</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">Warnsdorff's heuristic finds a tour where a knight visits every square exactly once.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Interactive Demo</h2>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Rows:</label>
            <input type="number" value={rows} onChange={e=>handleSizeChange(setRows,e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Cols:</label>
            <input type="number" value={cols} onChange={e=>handleSizeChange(setCols,e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-500">{error}</div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={playPause} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md" aria-label={isPlaying ? 'Pause animation' : 'Start animation'}>
              {isPlaying ? <Pause size={20}/> : <Play size={20}/>}{isPlaying ? 'Pause' : (steps.length===0 || stepIndex>=steps.length-1) ? 'Start Tour' : 'Resume'}
            </button>
            <button onClick={prevStep} disabled={stepIndex===0} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${stepIndex===0 ? 'bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white shadow-md'}`} aria-label="Previous step"><StepBack size="20"/> Back</button>
            <button onClick={nextStep} disabled={stepIndex>=steps.length-1} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${stepIndex>=steps.length-1 ? 'bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white shadow-md'}`} aria-label="Next step"><StepForward size="20"/> Next</button>
            <button onClick={reset} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md" aria-label="Reset"><RotateCcw size={20}/> Reset</button>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Speed:</label>
            <input type="range" min="100" max="1900" value={2000-speed} onChange={speedControl} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" aria-label="Adjust animation speed"/>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Slower</span><span>Faster</span></div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button onClick={toggleVoice} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md" aria-label={voiceEnabled ? 'Mute voice' : 'Unmute voice'}>
              {voiceEnabled ? <VolumeX size={20}/> : <Volume2 size={20}/>}
              {voiceEnabled ? 'Mute Voice' : 'Unmute Voice'}
            </button>
          </div>

          <button onClick={solveTour} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md">
            <PlayCircle size={20}/> Find Tour
          </button>

          {typeof window !== 'undefined' && !window.speechSynthesis && (
            <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-lg border border-yellow-300 dark:border-yellow-500">Voice narration unavailable in this browser</div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Board</h2>
          <div className="mb-6 flex justify-center">
            <div className="inline-block p-2 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
              <div className="font-mono" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))`, gap: 2 }}>
                {Array(rows).fill(0).map((_,r)=>Array(cols).fill(0).map((__,c)=>(
                  <div key={`${r}-${c}`} style={boardColor(r,c)} className="w-10 h-10 flex items-center justify-center rounded text-sm font-bold text-black dark:text-black">{visitedSteps.some(v=>v[0]===r&&v[1]===c) ? visitedSteps.findIndex(v=>v[0]===r&&v[1]===c)+1 : ''}</div>
                )))}
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg border border-purple-200 dark:border-purple-700 mb-6 min-h-[90px]">
            <h3 className="font-bold text-lg text-purple-800 dark:text-purple-300 mb-2">Current Step:</h3>
            <div className="text-gray-800 dark:text-gray-200 animate-fade-in">{explanation}</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">Steps:</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {steps.map((step,idx)=>(
                <div key={idx} className={`p-3 rounded-lg border transition-all duration-300 ${stepIndex===idx ? 'bg-purple-100 dark:bg-purple-900 dark:border-purple-500 shadow-md scale-105 ' : stepIndex>idx ? 'bg-white dark:bg-gray-700 dark:border-purple-500 shadow-sm' : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 opacity-70'}`}>
                  <div className="font-medium text-purple-700 dark:text-purple-400">Step {idx+1}:</div>
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
          <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg border border-purple-200 dark:border-purple-700"><h3 className="font-bold text-lg text-purple-700 dark:text-purple-400 mb-2">Heuristic</h3><p className="text-gray-700 dark:text-gray-300">Warnsdorff picks the square with the fewest onward moves, guiding the search away from deadlock early.</p></div>
          <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-700"><h3 className="font-bold text-lg text-blue-700 dark:text-blue-400 mb-2">Time Complexity</h3><p className="text-gray-700 dark:text-gray-300">Backtracking with heuristics can be quasi-linear in favorable cases, far faster than naive exhaustive search.</p></div>
          <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg border border-green-200 dark:border-green-700"><h3 className="font-bold text-lg text-green-700 dark:text-green-400 mb-2">Real-world Uses</h3><p className="text-gray-700 dark:text-gray-300">The same principle underlies robot path planning, puzzle generators, and network routing with movement constraints.</p></div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-300 mb-2">Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700 dark:text-yellow-400"><li>Square boards with side at least 5×5 usually have solutions while 2×2, 3×3, 4×4 might not.</li><li>An odd-sized board cannot contain a closed tour.</li><li>For a 5×5 or larger Warnsdorff almost always finds a tour.</li></ul>
      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Practice Problems</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {practiceProblems.map(problem => {
            const isCompleted = completedProblems[problem.id];
            return (
              <div key={problem.id} className={`flex flex-col p-4 rounded-lg border bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCompleted ? 'opacity-60 bg-gray-100 dark:bg-gray-800' : 'hover:shadow-lg hover:scale-105'}`}>
                <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-lg text-purple-700 dark:text-purple-400"><a href={problem.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{problem.platform}</a></h3><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyClass(problem.difficulty)}`}>{problem.difficulty}</span></div>
                <p className={`flex-grow text-gray-700 dark:text-gray-300 mb-4 ${isCompleted ? 'line-through' : ''}`}>{problem.description}</p>
                <div className="flex items-center mt-auto"><input type="checkbox" id={`checkbox-${problem.id}`} checked={!!isCompleted} onChange={()=>setCompletedProblems(prev=>({...prev, [problem.id]: !prev[problem.id]}))} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"/><label htmlFor={`checkbox-${problem.id}`} className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">Mark as completed</label></div>
              </div>
            );
          })}
        </div>
      </div>

      <CodeEditor />
    </div>
  );
};

export default KnightsTour;