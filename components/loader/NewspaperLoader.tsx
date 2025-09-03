'use client';

import { motion, AnimatePresence, Reorder, Variants } from 'framer-motion';
import { useEffect, useState, useMemo, ReactNode, FC, ChangeEvent, KeyboardEvent, useRef } from 'react';

// --- Type Definitions ---

interface JumbleItem {
  id: number;
  char: string;
}

interface WordJumble {
  jumbled: string;
  solved: string;
  hint: string;
}

interface CrosswordInputs {
  [key: string]: string;
}

type SudokuStatus = 'playing' | 'correct' | 'incorrect';
type SudokuCell = number | null;
type SudokuBoard = SudokuCell[][];

type PuzzleKey = 'crossword' | 'sudoku' | 'jumble';


// --- Helper Data ---

const crosswordData = {
  grid: [
    ['S', 'A', 'L', 'E', null],
    [null, null, 'E', null, null],
    ['P', 'L', 'A', 'N', null],
    [null, null, 'D', null, null],
    ['D', 'A', 'T', 'A', null],
  ],
  solution: {
    '0-0': 'S', '0-1': 'A', '0-2': 'L', '0-3': 'E',
    '2-0': 'P', '2-1': 'L', '2-2': 'A', '2-3': 'N',
    '4-0': 'D', '4-1': 'A', '4-2': 'T', '4-3': 'A',
    '1-2': 'E',
    '3-2': 'D',
  },
   clues: {
    across: [
      "1. A transaction of goods or services.",
      "2. A detailed proposal for achieving something.",
      "3. Facts and statistics collected for analysis.",
    ],
    down: [
      "1. An inquiry from a potential customer.",
    ]
  }
};


const sudokuData = {
    puzzle: [
        [1, null, 4, null],
        [null, 2, null, 3],
        [3, null, 2, null],
        [null, 1, null, 4],
    ],
    solution: [
        [1, 3, 4, 2],
        [4, 2, 1, 3],
        [3, 4, 2, 1],
        [2, 1, 3, 4],
    ]
};

const wordJumbles: WordJumble[] = [
  { jumbled: 'ZIBATALS', solved: 'BIZATLAS', hint: "A map for your business." },
  { jumbled: 'TOCIMETORP', solved: 'COMPETITOR', hint: "A rival in the marketplace."},
  { jumbled: 'SYALANIS', solved: 'ANALYSIS', hint: "Detailed examination of elements."},
  { jumbled: 'GARTYETS', solved: 'STRATEGY', hint: "A plan of action to achieve a major aim."},
];


// --- Interactive Puzzle Components ---

const puzzleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: [0.55, 0.055, 0.675, 0.19] } },
};

interface PuzzleProps {
    onSolve: () => void;
}

const InteractiveSudoku: FC<PuzzleProps> = ({ onSolve }) => {
    const [board, setBoard] = useState<SudokuBoard>(sudokuData.puzzle);
    const [status, setStatus] = useState<SudokuStatus>('playing');
    const [isSolved, setIsSolved] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, r: number, c: number) => {
        const val = e.target.value;
        if (/^[1-4]?$/.test(val)) {
            const newBoard = board.map(row => [...row]);
            newBoard[r][c] = val === '' ? null : parseInt(val, 10);
            setBoard(newBoard);
            setStatus('playing');
        }
    };
    
    const checkSolution = () => {
        if (isSolved) return;
        const isCorrect = JSON.stringify(board) === JSON.stringify(sudokuData.solution);
        setStatus(isCorrect ? 'correct' : 'incorrect');
        if(isCorrect) {
            setIsSolved(true);
            setTimeout(onSolve, 600);
        }
    };

    return (
        <motion.div key="sudoku" variants={puzzleVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center">
            <h3 className="font-bold text-lg uppercase tracking-widest mb-4">Mini Sudoku</h3>
            <div className="grid grid-cols-4 gap-1.5 bg-black/50 p-1.5 mx-auto w-fit mb-4">
                {board.map((row, r) =>
                    row.map((cell, c) => (
                        <div key={`${r}-${c}`} className="w-16 h-16 flex items-center justify-center bg-[#f8f5f0]">
                            {sudokuData.puzzle[r][c] !== null ? (
                                <span className="font-mono text-4xl">{cell}</span>
                            ) : (
                                <input
                                    type="tel"
                                    maxLength={1}
                                    value={cell || ''}
                                    onChange={(e) => handleInputChange(e, r, c)}
                                    className="w-full h-full text-center bg-[#e9e4d9] font-mono text-4xl focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] caret-transparent"
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
            <button onClick={checkSolution} className="text-sm font-lora bg-[#1a1a1a] text-[#f8f5f0] px-4 py-2 rounded-sm">Check</button>
            <AnimatePresence>
                {status === 'correct' && <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm text-green-700 font-bold mt-2">Correct!</motion.p>}
                {status === 'incorrect' && <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm text-red-700 font-bold mt-2">Not quite...</motion.p>}
            </AnimatePresence>
        </motion.div>
    );
}

const InteractiveWordJumble: FC<{ jumble: WordJumble } & PuzzleProps> = ({ jumble, onSolve }) => {
    const initialItems = useMemo(() => jumble.jumbled.split('').map((char: string, i: number) => ({ id: i, char })), [jumble]);
    const [items, setItems] = useState<JumbleItem[]>(initialItems);
    const [isSolved, setIsSolved] = useState(false);
    const [hasTriggeredSolve, setHasTriggeredSolve] = useState(false);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const currentWord = items.map((item: JumbleItem) => item.char).join('');
        const solved = currentWord === jumble.solved;
        setIsSolved(solved);

        if (solved && !hasTriggeredSolve) {
            setHasTriggeredSolve(true);
            setTimeout(onSolve, 600);
        }
    }, [items, jumble.solved, onSolve, hasTriggeredSolve]);

    return (
        <motion.div key="jumble" variants={puzzleVariants} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col items-center">
             <h3 className="font-bold text-lg uppercase tracking-widest mb-4">Word Jumble</h3>
             <Reorder.Group
                axis="x"
                values={items}
                onReorder={setItems}
                className={`flex gap-2 p-3 rounded-sm mb-3 transition-colors ${isSolved ? 'bg-green-200' : 'bg-[#e9e4d9]'}`}
             >
                {items.map((item: JumbleItem) => (
                    <Reorder.Item key={item.id} value={item}>
                        <div className="w-12 h-12 flex items-center justify-center font-mono text-3xl cursor-grab active:cursor-grabbing bg-[#f8f5f0] shadow-md">
                            {item.char}
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <AnimatePresence>
              {isSolved && <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm font-bold text-green-700 mb-2">Solved!</motion.p>}
            </AnimatePresence>
            <button onClick={() => setShowHint(true)} className="text-xs font-lora bg-[#1a1a1a]/80 text-[#f8f5f0] px-2 py-1 rounded-sm mb-2">Show Hint</button>
            <AnimatePresence>
                {showHint && <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm text-center text-[#666]">Hint: {jumble.hint}</motion.p>}
            </AnimatePresence>
        </motion.div>
    )
}

const InteractiveCrossword: FC<PuzzleProps> = ({ onSolve }) => {
    const prefilledLetters: CrosswordInputs = {'2-2':'A'}; // Pre-fill intersection
    const [inputs, setInputs] = useState<CrosswordInputs>(prefilledLetters);
    const [isSolved, setIsSolved] = useState(false);
    const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>({row: 0, col: 0});
    const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

    useEffect(() => {
        if(selectedCell) {
            inputRefs.current[selectedCell.row]?.[selectedCell.col]?.focus();
        }
    }, [selectedCell]);
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, r: number, c: number) => {
        const val = e.target.value.toUpperCase();
        if (/^[A-Z]?$/.test(val)) {
            setInputs(prev => ({ ...prev, [`${r}-${c}`]: val }));
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!selectedCell) return;
        let { row, col } = selectedCell;

        const move = (dr: number, dc: number) => {
            let nextRow = row + dr;
            let nextCol = col + dc;
            while(
                nextRow >= 0 && nextRow < crosswordData.grid.length &&
                nextCol >= 0 && nextCol < crosswordData.grid[0].length
            ) {
                if (crosswordData.grid[nextRow][nextCol]) {
                    setSelectedCell({row: nextRow, col: nextCol});
                    return;
                }
                nextRow += dr;
                nextCol += dc;
            }
        };

        switch (e.key) {
            case 'ArrowUp': 
                e.preventDefault();
                move(-1, 0); 
                break;
            case 'ArrowDown':
                e.preventDefault();
                move(1, 0); 
                break;
            case 'ArrowLeft': 
                e.preventDefault();
                move(0, -1); 
                break;
            case 'ArrowRight': 
                e.preventDefault();
                move(0, 1); 
                break;
            case 'Backspace':
                e.preventDefault();
                const key = `${row}-${col}`;
                if (!prefilledLetters[key]) {
                    setInputs(prev => ({ ...prev, [key]: '' }));
                }
                break;
        }
    };

    useEffect(() => {
        if(isSolved) return;
        const solutionKeys = Object.keys(crosswordData.solution);
        const allCorrect = solutionKeys.every(key => inputs[key] === (crosswordData.solution as CrosswordInputs)[key]);

        if (allCorrect) {
            setIsSolved(true);
            setTimeout(onSolve, 600);
        }
    }, [inputs, onSolve, isSolved]);

    return (
        <motion.div key="crossword" variants={puzzleVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center">
            <h3 className="font-bold text-lg uppercase tracking-widest mb-4">BIZATLAS DAILY</h3>
            <div className="flex gap-4">
                 <div className="grid grid-cols-5 gap-0.5 bg-black/50 p-0.5" onKeyDown={handleKeyDown}>
                    {crosswordData.grid.map((row, r) => {
                        if(!inputRefs.current[r]) inputRefs.current[r] = [];
                        return row.map((letter, c) => {
                            const key = `${r}-${c}`;
                             if (!letter) return <div key={key} className="w-10 h-10 bg-[#e9e4d9]" />;
                             const isCorrect = inputs[key] === (crosswordData.solution as CrosswordInputs)[key];
                             const isSelected = selectedCell?.row === r && selectedCell?.col === c;

                             return (
                                <div key={key} className="w-10 h-10 relative" onClick={() => setSelectedCell({row: r, col: c})}>
                                   <input
                                        ref={el => inputRefs.current[r][c] = el}
                                        type="text"
                                        maxLength={1}
                                        value={inputs[key] || ''}
                                        onChange={(e) => handleInputChange(e, r, c)}
                                        disabled={!!prefilledLetters[key]}
                                        className={`w-full h-full text-center uppercase font-mono text-2xl focus:outline-none caret-transparent
                                        ${isSelected ? 'ring-2 ring-blue-500 z-10' : ''}
                                        ${prefilledLetters[key] ? 'bg-gray-300' : ''}
                                        ${inputs[key] && !prefilledLetters[key] ? (isCorrect ? 'bg-green-200' : 'bg-red-200') : 'bg-[#f8f5f0]'}`}
                                   />
                                </div>
                            );
                        })
                    })}
                </div>
                <div className="text-sm font-lora w-48">
                    <b className='uppercase tracking-wider'>Across</b>
                    {crosswordData.clues.across.map(clue => <p key={clue} className='mt-1'>{clue}</p>)}
                    <b className='uppercase tracking-wider mt-3 block'>Down</b>
                    {crosswordData.clues.down.map(clue => <p key={clue} className='mt-1'>{clue}</p>)}
                </div>
            </div>
        </motion.div>
    )
}

const AllPuzzlesSolved: FC = () => (
    <motion.div variants={puzzleVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
        <h3 className="font-playfair text-2xl font-bold">Puzzle Master!</h3>
        <p className="text-base mt-2">You've solved them all. Your report is almost ready...</p>
    </motion.div>
);


// --- Main Loader Component ---

interface LoaderProps {
  isLoading: boolean;
  loadingText?: string;
}

export function InteractiveNewspaperLoader({ isLoading, loadingText = "Compiling Your Report..." }: LoaderProps) {
  const [selectedPuzzle, setSelectedPuzzle] = useState<ReactNode | null>(null);
  const [solvedPuzzleKeys, setSolvedPuzzleKeys] = useState<PuzzleKey[]>([]);

  const puzzleFactory = useMemo(() => ({
    crossword: <InteractiveCrossword key="crossword" onSolve={() => handlePuzzleSolved('crossword')} />,
    sudoku: <InteractiveSudoku key="sudoku" onSolve={() => handlePuzzleSolved('sudoku')} />,
    jumble: <InteractiveWordJumble key="jumble" jumble={wordJumbles[Math.floor(Math.random() * wordJumbles.length)]} onSolve={() => handlePuzzleSolved('jumble')} />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const selectNewPuzzle = (currentSolvedKeys: PuzzleKey[] = []) => {
      const allPuzzleKeys = Object.keys(puzzleFactory) as PuzzleKey[];
      const availablePuzzleKeys = allPuzzleKeys.filter(k => !currentSolvedKeys.includes(k));

      if (availablePuzzleKeys.length > 0) {
          const randomKey = availablePuzzleKeys[Math.floor(Math.random() * availablePuzzleKeys.length)];
          setSelectedPuzzle(puzzleFactory[randomKey]);
      } else {
          setSelectedPuzzle(<AllPuzzlesSolved />);
      }
  };

  const handlePuzzleSolved = (key: PuzzleKey) => {
    setSolvedPuzzleKeys(prevSolvedKeys => {
        const newSolvedKeys = prevSolvedKeys.includes(key)
          ? prevSolvedKeys
          : [...prevSolvedKeys, key];
        selectNewPuzzle(newSolvedKeys);
        return newSolvedKeys;
    });
  };

  useEffect(() => {
    if (isLoading) {
      setSolvedPuzzleKeys([]);
      selectNewPuzzle([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#f8f5f0] border border-[#1a1a1a]/20 rounded-md shadow-lg max-w-4xl w-full p-8 font-lora relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-repeat-x bg-[length:40px_8px]" style={{backgroundImage: 'linear-gradient(to right, #1a1a1a 50%, transparent 50%)'}}/>
            
            <h2 className="font-playfair text-center text-4xl font-bold mb-3 text-[#1a1a1a]">
              Loading
            </h2>
            <p className="text-center text-base text-[#666] mb-4">{loadingText}</p>
            
            {/* Persistent Loading Indicator */}
            <div className="flex justify-center items-center gap-2 mb-6">
                <span className="text-sm text-[#888]">Meanwhile...</span>
                <motion.div
                    className="w-2 h-2 bg-[#1a1a1a] rounded-full"
                    animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="w-2 h-2 bg-[#1a1a1a] rounded-full"
                    animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.div
                    className="w-2 h-2 bg-[#1a1a1a] rounded-full"
                    animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
            </div>

            <div className="min-h-[350px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {selectedPuzzle}
                </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

