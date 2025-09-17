const cells = document.querySelectorAll('[data-cell]');
const winningMessage = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');

let currentPlayer = 'X'; // Human = X
let gameActive = true;

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

cells.forEach(cell => {
  cell.addEventListener('click', handleClick, { once: true });
});

restartButton.addEventListener('click', startGame);

function handleClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent !== '') return;

  // Player move (X)
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  if (checkWin(currentPlayer)) {
    endGame(`${currentPlayer} Wins! 🎉`);
    return;
  }

  if (isDraw()) {
    endGame("It's a Draw! 🤝");
    return;
  }

  // Switch to AI (O)
  currentPlayer = 'O';
  setTimeout(computerMove, 400); // small delay for realism
}

function computerMove() {
  const bestMove = minimax([...cells].map(cell => cell.textContent), 'O').index;
  cells[bestMove].textContent = 'O';
  cells[bestMove].classList.add('taken');

  if (checkWin('O')) {
    endGame("O Wins! 🤖");
    return;
  }

  if (isDraw()) {
    endGame("It's a Draw! 🤝");
    return;
  }

  currentPlayer = 'X';
}

// ✅ Minimax Algorithm
function minimax(newBoard, player) {
  const availSpots = newBoard
    .map((val, idx) => (val === '' ? idx : null))
    .filter(val => val !== null);

  if (checkWinner(newBoard, 'X')) {
    return { score: -10 };
  } else if (checkWinner(newBoard, 'O')) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === 'O') {
      const result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      const result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    newBoard[availSpots[i]] = '';
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWinner(board, player) {
  return winningCombinations.some(combination => {
    return combination.every(index => board[index] === player);
  });
}

function checkWin(player) {
  return winningCombinations.some(combination => {
    return combination.every(index => {
      return cells[index].textContent === player;
    });
  });
}

function isDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}

function endGame(message) {
  winningMessage.textContent = message;
  winningMessage.classList.remove('hidden');
  gameActive = false;
}

function startGame() {
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });

  winningMessage.classList.add('hidden');
  currentPlayer = 'X';
  gameActive = true;
}
