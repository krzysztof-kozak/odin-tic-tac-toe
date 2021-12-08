/* 
GameBoard:
    - need only one GameBoard, so make it a module.
    - holds information about the gameoard in form of an array.
    - can update gamebard.
*/

const GameBoard = (function () {
	const _MARKS = {
		EMPTY: "empty",
		X: "x",
		Y: "y",
	};

	const gameBoard = Array(9).fill({ mark: _MARKS.EMPTY }, 0);

	function _getMark(symbol) {
		if (symbol === "empty") return { mark: _MARKS.EMPTY };
		if (symbol === "x") return { mark: _MARKS.X };
		if (symbol === "y") return { mark: _MARKS.Y };
	}

	function update(index, mark) {
		mark = _getMark(mark);
		gameBoard[index] = mark;
	}

	return { gameBoard, update };
})();

/* 
DisplayController:
    - need only one DisplayController, so make it a module.
    - renders the gameboard on screen.
    - can re-render specific parts of the gameboard to reflect updates.
*/
const DisplayController = (function () {
	const _GAME_CONTAINER = document.querySelector("body");
	const _GAME_BOARD = GameBoard.gameBoard;

	function render() {
		_GAME_BOARD.forEach((tile, index) => {
			const div = document.createElement("div");

			div.setAttribute("data-index", index);
			div.innerText = tile.mark;

			_GAME_CONTAINER.append(div);
		});
	}

	function update(tileIndex) {
		const div = document.querySelector(`[data-index="${tileIndex}"]`);
		div.textContent = _GAME_BOARD[tileIndex].mark;
	}

	return { render, update };
})();
