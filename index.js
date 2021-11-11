class Controller {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.xPlaces = [];
    this.oPlaces = [];
    this.currentTurn = "x";
    this.isGameOver = false;
  }

  // next move
  nextMove(index) {
    if (!this.isGameOver) {
      if (this.currentTurn === "x") {
        this.xPlaces.push(index);
        this.currentTurn = "o";
      } else {
        this.oPlaces.push(index);
        this.currentTurn = "x";
      }
      return this.checkStatus();
    }
  }

  checkStatus() {
    if (this.checkWin("x")) {
      this.isGameOver = true;
      return "x win";
    } else if (this.checkWin("o")) {
      this.isGameOver = true;
      return "o win";
    } else if (
      this.xPlaces.length + this.oPlaces.length ===
      this.boardSize * this.boardSize
    ) {
      this.isGameOver = true;
      return "tie";
    } else {
      return `${this.currentTurn} turn`;
    }
  }

  checkWin(player) {
    let places = player === "x" ? this.xPlaces : this.oPlaces;

    // sort player places
    places.sort((a, b) => a - b);

    for (let i = 0; i < places.length; i++) {
      var countRow, countColumn, countLeftDiagonal, countRightDiagonal;
      countRow = countColumn = countLeftDiagonal = countRightDiagonal = 0;
      for (var j = i; j < places.length; j++) {
        if (
          places[i] % this.boardSize === 0 &&
          places[j] - places[i] === j - i
        ) {
          countRow++;
        }

        if (
          places[i] < this.boardSize &&
          (places[j] - places[i]) % this.boardSize === 0
        ) {
          countColumn++;
        }

        if (
          places[i] === 0 &&
          (places[j] - places[i]) % (this.boardSize + 1) === 0
        ) {
          countLeftDiagonal++;
        }

        if (
          places[i] === this.boardSize - 1 &&
          places[j] - places[i] <= this.boardSize + 1 &&
          (places[j] - places[i]) % (this.boardSize - 1) === 0
        ) {
          countRightDiagonal++;
        }

        if (
          Math.max(
            countRow,
            countColumn,
            countLeftDiagonal,
            countRightDiagonal
          ) === this.boardSize
        ) {
          return true;
        }
      }
    }
    return false;
  }
}

// get the modal
const settingsModal = document.querySelector(".modal");

// get the button that opens the settings modal
document.querySelector(".fa-cog").addEventListener("click", () => {
  // open settings modal
  settingsModal.style.display = "block";
});

// get the <span> element that closes the modal
document.querySelector(".close").addEventListener("click", () => {
  // close settings modal
  settingsModal.style.display = "none";
});

// Board size global variable (Default size: 3x3)
var boardSize = 3;

// Opponent global variable (Default: Noob bot)
var opponent = "noob bot";

// scores
var xWins, oWins;
xWins = oWins = 0;

// Set game opponent setting
document.getElementsByName("opponent").forEach((element) => {
  if (element.value == opponent) {
    element.checked = true;
  }

  element.addEventListener("change", (event) => {
    opponent = event.target.value;
    console.log(`[INFO] Opponent set to ${opponent}.`);
  });
});

// Set game board size setting
document.getElementsByName("boardSize").forEach((element) => {
  if (element.value == boardSize) {
    element.checked = true;
  }

  element.addEventListener("change", (event) => {
    boardSize = parseInt(event.target.value);
    console.log(`[INFO] Board size set to ${boardSize}x${boardSize}.`);
  });
});

document.getElementById("play").addEventListener("click", () => {
  console.log(
    `[INFO] Starting game with ${opponent} on ${boardSize}x${boardSize} board.`
  );
  settingsModal.style.display = "none";
  // reset game
  reset();
});

// reset button
document.querySelector(".fa-redo").addEventListener("click", () => {
  // reset game
  reset();
});

function reset() {
  let gameController = new Controller(boardSize);

  const board = document.querySelector(".board");
  board.innerHTML = "";

  // Create board
  board.style.setProperty("--size", boardSize);
  for (var i = 0; i < boardSize ** 2; i++) {
    document.querySelector(".board").innerHTML += `<div class="cell">
    <i class="fas fa-check" id="placeholder"></i>
  </div>`;
  }

  // reset game status
  document.querySelector(".game-status").innerHTML = "";

  document.querySelectorAll(".cell").forEach((element, num) => {
    element.innerHTML = "";
    element.addEventListener("click", () => {
      if (!gameController.isGameOver && element.innerHTML === "") {
        element.innerHTML = `<i class="${
          gameController.currentTurn == "x" ? "fas fa-times" : "far fa-circle"
        }"></i>`;
        document.querySelector(".game-status").innerHTML = `<h2>${gameController
          .nextMove(num)
          .toUpperCase()}</h2>`;
      }

      if (gameController.isGameOver) {
        gameController.currentTurn == "o" ? xWins++ : oWins++;
        document.querySelectorAll("#score")[0].innerHTML = `<h2>${xWins}</h2>`;
        document.querySelectorAll("#score")[1].innerHTML = `<h2>${oWins}</h2>`;
      }
    });
  });
}

reset();
