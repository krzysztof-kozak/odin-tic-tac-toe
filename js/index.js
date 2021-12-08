/* 
GameBoard:
    - need only one GameBoard, so make it a module.
    - holds information about the gameboard in form of an array.
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
