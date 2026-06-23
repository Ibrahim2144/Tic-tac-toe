import { useState } from "react";

// The Engine: Returns an object with the winner and the winning coordinates
function getWinner(square) {
  const winningPattern = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6],           // Diagonals
  ];

  for (let i = 0; i < winningPattern.length; i++) {
    const [a, b, c] = winningPattern[i];
    if (square[a] && square[a] === square[b] && square[a] === square[c]) {
      return { winner: square[a], line: [a, b, c] }; // The detailed report
    }
  }
  return null;
}

export default function TicTacToe() {
  const [square, setSquares] = useState(Array(9).fill(""));
  const [isXTurn, setIsXTurn] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  // Derived State (calculated automatically on every move)
  const winInfo = getWinner(square);
  const winner = winInfo?.winner;
  const winningLine = winInfo?.line; // e.g., [0, 1, 2]
  const isDraw = !winner && square.every((item) => item !== "");

  function handleClick(index) {
    // Stop if someone won or square is already filled
    if (winner || square[index]) return;

    const copySquare = [...square];
    copySquare[index] = isXTurn ? "X" : "O";
    setSquares(copySquare);

    // Check if this move caused a win to update scores
    const checkWin = getWinner(copySquare);
    if (checkWin) {
      setScores((prev) => ({
        ...prev,
        [checkWin.winner]: prev[checkWin.winner] + 1,
      }));
    }

    setIsXTurn(!isXTurn);
  }

  function handleRestart() {
    setSquares(Array(9).fill(""));
    setIsXTurn(true);
  }

  return (
    <div className="min-h-screen bg-gray-400 flex flex-col items-center justify-center p-2 font-sans select-none text-slate-800">
      <div className="max-w-md w-full flex flex-col items-center gap-6">
        
        {/* Title */}
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Tic Tac <span className="text-indigo-600">Toe</span>
        </h1>

        {/* Score Board */}
        <div className="flex gap-6 w-full max-w-xs justify-center">
          <div className={`flex-1 text-center p-2 rounded-2xl bg-white shadow-sm border-2 transition-all ${isXTurn && !winner && !isDraw ? 'border-indigo-500 scale-105' : 'border-transparent'}`}>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Player X</div>
            <div className="text-2xl font-black text-indigo-600">{scores.X}</div>
          </div>
          <div className={`flex-1 text-center p-2 rounded-2xl bg-white shadow-sm border-2 transition-all ${!isXTurn && !winner && !isDraw ? 'border-pink-500 scale-105' : 'border-transparent'}`}>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Player O</div>
            <div className="text-2xl font-black text-pink-600">{scores.O}</div>
          </div>
        </div>

        {/* Game Status Announcement */}
        <div className="h-1 flex items-center justify-center">
          <p className="text-lg font-bold tracking-wide">
            {winner ? (
              <span className="text-emerald-600 animate-bounce block">🎉 Winner: {winner}!</span>
            ) : isDraw ? (
              <span className="text-amber-600">🤝 It's a Draw!</span>
            ) : (
              <span>Next Turn: <span className={isXTurn ? 'text-indigo-600' : 'text-pink-600'}>{isXTurn ? 'X' : 'O'}</span></span>
            )}
          </p>
        </div>

        {/* The 3x3 CSS Grid Board */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 bg-slate-200 p-3 rounded-2xl shadow-inner w-72 h-72 sm:w-80 sm:h-80">
          {square.map((val, i) => {
            const isWinningSquare = winningLine?.includes(i);
            
            return (
              <button
                key={i}
                disabled={!!winner || !!val}
                onClick={() => handleClick(i)}
                className={`
                  rounded-xl font-black text-3xl sm:text-4xl flex items-center justify-center transition-all duration-150
                  ${isWinningSquare 
                    ? 'bg-emerald-500 text-white shadow-md scale-105 animate-pulse' 
                    : val 
                      ? 'bg-white shadow-sm' 
                      : 'bg-slate-100/50 hover:bg-white hover:scale-105 active:scale-95 shadow-sm'
                  }
                  ${val === 'X' && !isWinningSquare ? 'text-indigo-600' : ''}
                  ${val === 'O' && !isWinningSquare ? 'text-pink-600' : ''}
                `}
              >
                {val}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <button
          onClick={handleRestart}
          className="px-5.5 py-2.75 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md active:scale-95 transition-all tracking-wide"
        >
          Reset Board
        </button>
      </div>
    </div>
  );
}