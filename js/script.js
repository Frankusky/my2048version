(function () {
	$(document).ready(function () {
		var board;

		function newGame() {
			board = [[0, 0, 0, 0],
					 [0, 0, 0, 0],
					 [0, 0, 0, 0],
					 [0, 0, 0, 0]];
			$(".board").empty();
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++) {
					$(".board").append('<div class="cell" id="' + row + col + '"></div>');
				}
			}
			insertNumber();
			insertNumber();
			updateBoardValues();
		};

		function updateBoardValues() {
			$(".cell").each(function () {
				var boxValue = board[this.id[0]][this.id[1]] == 0 ? "" : board[this.id[0]][this.id[1]];
				$("#" + this.id).empty().append(boxValue);
			});
			actualScore();
		}

		function conditionChecker(firstValue, condition, secondValue) {
			switch (condition) {
			case ">":
				return firstValue > secondValue;

			case "<":
				return firstValue < secondValue;

			}
		}

		function moveValuesHorizontal(direction) {
			var values;
			switch (direction) {
			case "left":
				values = [0, "<", 4, 1, 0, "<", 4, 1];
				break;
			case "right":
				values = [0, "<", 4, 1, 3, ">", -1, -1];
				break;
			}
			for (var row = values[0]; conditionChecker(row, values[1], values[2]); row = row + values[3]) {
				var moveValue;
				var lastZeroCell = null;
				var hasZeroBefore = false;
				for (var col = values[4]; conditionChecker(col, values[5], values[6]); col = col + values[7]) {
					if (board[row][col] == 0 && lastZeroCell == null) {
						hasZeroBefore = true;
						lastZeroCell = (row + "" + col).toString();
					}
					if (hasZeroBefore && board[row][col] != 0) {
						moveValue = board[row][col];
						board[row][col] = 0;
						board[lastZeroCell[0]][lastZeroCell[1]] = moveValue;
						lastZeroCell = null;
						col = values[4];
						hasZeroBefore = false;
					}
				}
			}
		}

		function moveValuesVertical(direction) {
			var values;
			switch (direction) {
			case "up":
				values = [0, "<", 4, 1, 0, "<", 4, 1];
				break;
			case "down":
				values = [0, "<", 4, 1, 3, ">", -1, -1];
				break;
			}
			for (var col = values[0]; conditionChecker(col, values[1], values[2]); col = col + values[3]) {
				var moveValue;
				var lastZeroCell = null;
				var hasZeroBefore = false;
				for (var row = values[4]; conditionChecker(row, values[5], values[6]); row = row + values[7]) {
					if (board[row][col] == 0 && lastZeroCell == null) {
						hasZeroBefore = true;
						lastZeroCell = (row + "" + col).toString();
					}
					if (hasZeroBefore && board[row][col] != 0) {
						moveValue = board[row][col];
						board[row][col] = 0;
						board[lastZeroCell[0]][lastZeroCell[1]] = moveValue;
						lastZeroCell = null;
						row = values[4];
						hasZeroBefore = false;
					}
				}
			}
		}

		function joinCellsHorizontal(direction, board) {
			var values;
			switch (direction) {
			case "left":
				values = [0, "<", 4, 1, 0, "<", 4, 1];
				break;
			case "right":
				values = [0, "<", 4, 1, 3, ">", -1, -1];
				break;
			}
			for (var row = values[0]; conditionChecker(row, values[1], values[2]); row = row + values[3]) {
				for (var col = values[4]; conditionChecker(col, values[5], values[6]); col = col + values[7]) {
					if (board[row][col + 1] != undefined) {
						if (board[row][col] == board[row][col + 1]) {
							board[row][col] = board[row][col] + board[row][col + 1];
							board[row][col + 1] = 0;
							if (direction == "right") {
								col -= 1
							}
						}
					}
				}
			}
		}

		function joinCellsVertical(direction, board) {
			var values;
			switch (direction) {
			case "up":
				values = [0, "<", 4, 1, 0, "<", 4, 1];
				break;
			case "down":
				values = [0, "<", 4, 1, 3, ">", -1, -1];
				break;
			}
			for (var col = values[0]; conditionChecker(col, values[1], values[2]); col = col + values[3]) {
				for (var row = values[4]; conditionChecker(row, values[5], values[6]); row = row + values[7]) {
					if (board[row + 1] != undefined) {
						if (board[row][col] == board[row + 1][col]) {
							board[row][col] = board[row][col] + board[row + 1][col];
							board[row + 1][col] = 0;
						}
					}
				}
			}
		}

		function insertNumber() {
			var row = Math.floor(Math.random() * 4);
			var col = Math.floor(Math.random() * 4);
			var emptyPos = board[row][col];
			if (emptyPos != 0) {
				insertNumber()
			} else {
				if (Math.random() <= .3) {
					board[row][col] = 4;
				} else {
					board[row][col] = 2;
				}
			};
		}

		function boardChanged(tempBoard) {
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++) {
					if (board[row][col] != tempBoard[row][col]) {
						return true
					}
				}
			}
			return false;
		}

		function actualScore() {
			var actualScore = 0;
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++) {
					actualScore += board[row][col];
				}
			}
			$(".score").empty().append(actualScore)
		}

		$(document).keyup(function (e) {
			var tempArray = board.map(function (arr) {
				return arr.slice();
			});
			switch (e.keyCode) {
			case 37: //left
				moveValuesHorizontal("left");
				joinCellsHorizontal("left", board);
				moveValuesHorizontal("left");
				break;
			case 38: //up
				moveValuesVertical("up");
				joinCellsVertical("up", board);
				moveValuesVertical("up");
				break;
			case 39: //right
				moveValuesHorizontal("right");
				joinCellsHorizontal("right", board);
				moveValuesHorizontal("right");
				break;
			case 40: //down
				moveValuesVertical("down");
				joinCellsVertical("down", board);
				moveValuesVertical("down");
				break;
			default:
				break;
			}
			if (boardChanged(tempArray)) {
				insertNumber();
			} else {
				var endGame = true;
				for (var row = 0; row < 4; row++) {
					if (endGame) {
						if (board[row].indexOf(0) != (-1)) {
							endGame = false;
							row=5;
						}
					}
				}
				if (endGame) {
					joinCellsHorizontal("left", tempArray);
					if (!boardChanged(tempArray)) {
						joinCellsHorizontal("right", tempArray);
						if (!boardChanged(tempArray)) {
							joinCellsVertical("up", tempArray);
							if (!boardChanged(tempArray)) {
								joinCellsVertical("down", tempArray);
								if (!boardChanged(tempArray)) {
									/*No more moves*/
									var thisRoundScore = parseInt($(".score").text());
									var oldHighscore = Cookies.get("hg");
									var oldUserName = Cookies.get("username");
									if (oldHighscore == undefined) { //First time play
										var userName = prompt("You got " + thisRoundScore + "pts! \nPlease type your name to save your highscore:");
										Cookies.set('hg', thisRoundScore);
										Cookies.set('username', userName);
										if (confirm("Thanks " + userName + " for playing! Wanna play again?")){
											newGame();
										}else{
											alert("Bye!");
										};
									} else if (parseInt(oldHighscore) < thisRoundScore) { // beated old highscore
										var userName = prompt("Congratulations! You beated " + oldUserName + "(" + oldHighscore + "pts) record! \nPlease type your name to save your new highscore:");
										alert("Thanks " + userName + " for playing! Wanna play again?");
										Cookies.set('hg', thisRoundScore);
										Cookies.set('username', userName);
										if (confirm("Thanks " + userName + " for playing! Wanna play again?")){
											newGame();
										}else{
											alert("Bye!");
										};
									} else {
										if (confirm("Oww... Unlucky! You didn't beat " + oldUserName + "(" + oldHighscore + "pts) highscore...Try again?")) {
											newGame();
										} else {
											alert("Bye!");
										};
									}
								}
							}
						}
					}
				}
			};
			updateBoardValues();
		}); /*keyboard moves*/

		/*Starting game*/
		newGame();

		/*Auto change color
		
		function changeTheme(){
			var themes = [[]]
			$(".cell").css("color","red")
		}
		setTimeout(function(){changeTheme()},1500)*/
	});
})();