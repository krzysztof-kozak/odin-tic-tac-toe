/* 
GameBoard:
    - need only one GameBoard, so make it a module.
    - holds information about the gameoard in form of an array.
    - can update gamebard.
*/

const GameBoard = (function () {
	const _MARKS = {
		EMPTY: "",
		X: "x",
		O: "o",
	};

	const _WINNING_STATES = [
		// horizontal win
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],

		// vertical win
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],

		// diagnoal win
		[0, 4, 8],
		[6, 4, 2],
	];

	const gameBoard = Array(9).fill({ mark: _MARKS.EMPTY }, 0);

	function _getMark(symbol) {
		if (symbol === "") return { mark: _MARKS.EMPTY };
		if (symbol === "x") return { mark: _MARKS.X };
		if (symbol === "o") return { mark: _MARKS.O };
	}

	function getWinningStates() {
		return _WINNING_STATES;
	}

	function update(index, mark) {
		mark = _getMark(mark);
		gameBoard[index] = mark;
	}

	function reset() {
		gameBoard.fill({ mark: _MARKS.EMPTY });
	}

	return { gameBoard, update, reset, getWinningStates };
})();

/* 
DisplayController:
    - need only one DisplayController, so make it a module.
    - renders the gameboard on screen.
    - can re-render specific parts of the gameboard to reflect updates.
*/

const DisplayController = (function () {
	const _GAME_CONTAINER = document.querySelector(".container");
	const _GAME_BOARD = GameBoard.gameBoard;

	function render() {
		_GAME_BOARD.forEach((tile, index) => {
			const div = document.createElement("div");

			div.setAttribute("data-index", index);
			div.innerText = tile.mark;

			_GAME_CONTAINER.append(div);
		});
	}

	function update(boardIndex) {
		const div = document.querySelector(`[data-index="${boardIndex}"]`);
		div.textContent = _GAME_BOARD[boardIndex].mark;
	}

	function _RESET() {
		const divs = document.querySelectorAll("[data-index]");
		divs.forEach((div) => (div.innerText = ""));
	}

	function getGameContainer() {
		return _GAME_CONTAINER;
	}

	function announceWinner(winner) {
		swal({
			title: "GAME ENDED",
			text: `${winner.toUpperCase()} has won!`,
			icon: "success",
		}).then((_) => _RESET());
	}

	return { render, update, announceWinner, getGameContainer };
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
	let _WINNER;
	let _HAS_BEEN_INITIALISED = false;
	let _HAS_STARTED = false;

	function _CHECK_FOR_WINNER(boardIndex, symbol) {
		const winningStates = GameBoard.getWinningStates();
		const board = GameBoard.gameBoard;

		const relevantStates = winningStates.filter((state) => state.includes(boardIndex));

		relevantStates.forEach((state) => {
			if (state.every((index) => board[index].mark === symbol)) {
				_WINNER = _CURRENT_TURN.playerSymbol;
			}
		});
	}

	function _VALIDATE_MOVE(boardIndex) {
		const currentMark = GameBoard.gameBoard[boardIndex].mark;
		return currentMark === "";
	}

	function _SWAP_TURNS() {
		_CURRENT_TURN = _CURRENT_TURN === _PLAYER1 ? _PLAYER2 : _PLAYER1;
	}

	function _TURN_HANDLER({ target }) {
		if (!target.dataset.hasOwnProperty("index")) return;

		const boardIndex = target.dataset.index;

		const isValidMove = _VALIDATE_MOVE(boardIndex);
		if (!isValidMove) return;

		GameBoard.update(boardIndex, _CURRENT_TURN.playerSymbol);
		DisplayController.update(boardIndex);

		_CHECK_FOR_WINNER(parseInt(boardIndex, 10), _CURRENT_TURN.playerSymbol);

		if (_WINNER) {
			DisplayController.announceWinner(_WINNER);
			_END();
			return;
		}

		_SWAP_TURNS();
	}

	function _ATTACH_EVENT_LISTENER() {
		const gameboardNode = DisplayController.getGameContainer();
		gameboardNode.addEventListener("click", _TURN_HANDLER);
	}

	function _END() {
		GameBoard.reset();
		_HAS_STARTED = false;
		_WINNER = null;
	}

	function _START() {
		if (_HAS_STARTED) return;
		_HAS_STARTED = true;
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
