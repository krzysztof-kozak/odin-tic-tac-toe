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
		O: "o",
	};

	const gameBoard = Array(9).fill({ mark: _MARKS.EMPTY }, 0);

	function _getMark(symbol) {
		if (symbol === "empty") return { mark: _MARKS.EMPTY };
		if (symbol === "x") return { mark: _MARKS.X };
		if (symbol === "o") return { mark: _MARKS.O };
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

	function getGameContainer() {
		return _GAME_CONTAINER;
	}

	return { render, update, getGameContainer };
})();

/* 
Player:
    - need more than one Player, so make it a factory.
    - has a symbol (either x or o).
*/

function Player(symbol) {
	return { playerSymbol: symbol };
}

/* 
Game:
    - need only one Game, so make it a module.
    - holds information about players.
    - holds information about whose turn it is.
    - holds the control flow logic such as, start, end, update turn, etc.
*/

const Game = (function () {
	const _PLAYER1 = Player("x");
	const _PLAYER2 = Player("o");
	let _CURRENT_TURN;
	let _HAS_BEEN_INITIALISED = false;
	let _HAS_STARTED = false;

	function _VALIDATE_MOVE(tileIndex) {
		const currentMark = GameBoard.gameBoard[tileIndex].mark;
		return currentMark === "empty";
	}

	function _SWAP_TURNS() {
		_CURRENT_TURN = _CURRENT_TURN === _PLAYER1 ? _PLAYER2 : _PLAYER1;
	}

	function _TURN_HANDLER({ target }) {
		if (!target.dataset.hasOwnProperty("index")) return;

		const tileIndex = target.dataset.index;

		const isValidMove = _VALIDATE_MOVE(tileIndex);
		if (!isValidMove) return;

		GameBoard.update(tileIndex, _CURRENT_TURN.playerSymbol);
		DisplayController.update(tileIndex);

		_SWAP_TURNS();
	}

	function _ATTACH_EVENT_LISTENER() {
		const gameboardNode = DisplayController.getGameContainer();
		gameboardNode.addEventListener("click", _TURN_HANDLER);
	}

	function _START() {
		if (_HAS_STARTED) return;
		_CURRENT_TURN = _PLAYER1;
	}

	function initialise() {
		if (_HAS_BEEN_INITIALISED) return;
		_HAS_BEEN_INITIALISED = true;

		DisplayController.render();
		_ATTACH_EVENT_LISTENER();

		_START();
	}

	return { initialise };
})();
Game.initialise();
