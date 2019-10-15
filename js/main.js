'use strict'
// NOTE : if i do stuff like (something.gameElement===null) - 
// and not (!something.gameElement) its because sometimes it checks if gameElement exists
// as a key in the object and returnes the wrong output...
// havent figured out what is the reason for it so im using this 
// method most of the time.
// Also please use 'go live' to see the background - big bug in css!!!

// whats added :different flag icon, colors for numbers (line 130), support for lives , indication on wrong flags when game lost(line 273),
// fixed safeClicks bug, size is ok now - accidently it was 175% size all the time (on 'go live' in chrome) so everything was small.


var gBoard;
var FLOOR = 'FLOOR';
var MINE = 'MINE'
var FLAG = 'FLAG'
var clicks = 0
var FLAG_ICON = '&#x1F6A9;'
var MINE_ICON = '&#x1F4A3;'
var WRONG_FLAG_ICON = '&#x274C;'

var gGame = {
    isOn: false,
}
//making 3 different vars to enable costumization later
//game default medium
var difficultyRow = 8;
var difficultyCol = 8;
var mineCount = 12;
var gameOnSmily = '&#128512;'
var gameLostSmily = '&#128565;'
var gameWonSmily = '&#128526;'
var safeClicksLeft = 3
var final;
var isGameWon = false
var gLives = 3

//funcions on page load:
function init() {
    stopTimer()
    var header = document.querySelector(`h1`);
    header.innerText = "Its just a Mine Game"
    var smily = document.querySelector('h1 span')
    smily.innerHTML = gameOnSmily
    gGame.isOn = true;
    gBoard = buildBoard();
    renderBoard(gBoard);
    clicks = 0
    safeClicksLeft = 3
    gLives = 3
    var elLives = document.querySelector(".lives span")
    elLives.innerText = gLives
    isGameWon = false
    var elBtn = document.querySelector(".safeclick span")
    elBtn.innerText = ` ${safeClicksLeft} left!`
    showBestTime()
}

//actions that run when a cell is clicked
function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;

    clicks++;
    if (clicks === 1) {

        startTimer();
    }
    var currCell = gBoard[i][j]
    var cellCoord = { i: currCell.i, j: currCell.j }
    if (currCell.flagged) return;
    if (currCell.revealed) return;
    currCell.revealed = true
    //assures that mine cant be stepped on 1st play:
    if (clicks === 1) {
        setMinesOnBoard(gBoard, mineCount)
        setMinesNegsCount(gBoard)
    }
    if (currCell.gameElement !== MINE && elCell.innerText !== '') {
        elCell.classList.remove("hidden")
        checkIfVictory()
        return;
    }
    revealCellsAround(elCell, cellCoord)
    checkIfVictory()
    if (currCell.gameElement === MINE) {
        elCell.classList.add("explode")
        gameOver(elCell)
    }
}

//reveals selected cell - if not a num reveals every empty cell like in the 
//real game. uses recursion!
function revealCellsAround(elCell, cellCoord) {
    for (var i = cellCoord.i - 1; i <= cellCoord.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellCoord.j - 1; j <= cellCoord.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            var currCell = gBoard[i][j]
            var currCellCoord = { i: currCell.i, j: currCell.j }
            var elCheckinCell = document.querySelector(`.cell-${i}-${j}`);
            if (elCheckinCell.innerText !== '') {
                elCheckinCell.classList.remove("hidden")
                currCell.revealed = true
                continue;
            }
            if (currCell.gameElement !== MINE && elCell.innerText === '' && currCell.revealed === false) {
                currCell.revealed = true
                if (i === cellCoord.i && j === cellCoord.j) continue;
                revealCellsAround(elCell, currCellCoord)
            }
            else if (currCell.gameElement !== MINE) {
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.classList.remove("hidden")
                currCell.revealed = true
            }
        }
    }
}


//checks for mines around each cells
function findMinesAround(cellCoord) {
    var negsMineCount = 0
    var currCell = gBoard[cellCoord.i][cellCoord.j]
    for (var i = cellCoord.i - 1; i <= cellCoord.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellCoord.j - 1; j <= cellCoord.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === cellCoord.i && j === cellCoord.j) continue;
            if (gBoard[i][j].gameElement === MINE) {
                negsMineCount++
            }
        }
    }
    var elCell = document.querySelector(`.cell-${cellCoord.i}-${cellCoord.j}`);
    if (currCell.gameElement === MINE) {
        return;
    }
    if (negsMineCount > 0) {
        elCell.innerText = negsMineCount;
        switch (negsMineCount) {
            case 1:
                elCell.style.color = "blue";
                break;
            case 2:
                elCell.style.color = "green";
                break;
            case 3:
                elCell.style.color = "red";
                break;
            case 4:
                elCell.style.color = "black";
                break;
            case 5:
                elCell.style.color = "rgb(93, 18, 143)";
                break;
            case 6:
                elCell.style.color = "rgb(50, 156, 160)";
                break;
            case 7:
                elCell.style.color = "gray";
                break;
            case 8:
                elCell.style.color = "gray";
                break;
            case 9:
                elCell.style.color = "gray";
                break;

            default:
                break;
        }
    }
    if (negsMineCount === 0) {
        return ''
    }
    return negsMineCount
}

//sets the numbers on the cells
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellCoord = { i: currCell.i, j: currCell.j }
            findMinesAround(cellCoord)
        }
    }
}

// spreading the mines randomly on the board
//used on 2 different vars (i&j) to enable costumized matrix later that 
//might not be a square
function setMinesOnBoard(board, mineCount) {
    for (var i = 0; i < mineCount; i++) {
        var iNum = getRandomInt(0, board.length)
        var jNum = getRandomInt(0, board[0].length)

        if (board[iNum][jNum].revealed) {
            i -= 1
            continue;
        }
        if (board[iNum][jNum].gameElement === MINE) {
            i -= 1
            continue;
        }
        board[iNum][jNum].gameElement = MINE
    }
}


// actions that run when flagging a cell
function flagCell(elCell, event, i, j) {
    clicks++;
    if (clicks === 1) {
        startTimer();
        setMinesOnBoard(gBoard, mineCount)
        setMinesNegsCount(gBoard)
    }
    var currCell = gBoard[i][j]
    var currGameElement = currCell.gameElement
    var cellCoord = { i: currCell.i, j: currCell.j }
    if (!gGame.isOn) return;
    if (currCell.revealed) return;
    if (event.type === "contextmenu" && currCell.flagged === false) {
        event.preventDefault()
        currCell.flagged = true
        elCell.classList.remove("hidden")
        elCell.classList.add("flagged")
        elCell.innerHTML = FLAG_ICON;

    } else if (event.type === "contextmenu" && currCell.flagged === true && currGameElement === null) {
        event.preventDefault()
        currCell.flagged = false
        elCell.classList.remove("flagged")
        elCell.classList.add("hidden")
        elCell.innerHTML = findMinesAround(cellCoord)
    } else if (event.type === "contextmenu" && currCell.flagged === true && currGameElement === MINE) {
        event.preventDefault()
        currCell.flagged = false
        elCell.classList.remove("flagged")
        elCell.classList.add("hidden")
        elCell.innerHTML = MINE_ICON
    }
    checkIfVictory()
}

//when game is over by loss. also used when over by victory with a few changes
function gameOver(elCell) {
    gLives -= 1
    var elLives = document.querySelector(".lives span")
    elLives.innerText = gLives
    if (gLives > 0 && !isGameWon) {
        elCell.classList.remove("hidden")
        elCell.innerHTML = MINE_ICON
        return;
    }
    gGame.isOn = false;
    stopTimer()
    var header = document.querySelector(`h1`);
    header.innerText = "RIP"
    var smily = document.querySelector('h1 span')
    smily.innerHTML = gameLostSmily
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            if (currCell.gameElement === MINE) {
                elCell.classList.remove("hidden")
                elCell.classList.remove("flagged")
                elCell.innerHTML = MINE_ICON
            }
            if (currCell.gameElement !== MINE && (currCell.flagged)) {
                elCell.innerHTML = WRONG_FLAG_ICON
            }
        }
    }
}

// used after every click, checking if the game is won
function checkIfVictory() {
    var isVictory = false
    var mineCount = 0
    var cellCount = 0
    var flaggedMinesCount = 0
    var revealedCellsCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.gameElement === MINE) {
                mineCount++
            }
            if (currCell.gameElement === null) {
                cellCount++
            }
            if (currCell.gameElement === MINE && (currCell.flagged || currCell.revealed)) {
                flaggedMinesCount++
            }
            if (currCell.gameElement === null && currCell.revealed) {
                revealedCellsCount++
            }
        }
    }
    if (mineCount === flaggedMinesCount && cellCount === revealedCellsCount) {
        isVictory = true
    }
    if (isVictory) {
        Victory()
    }
}

//if game is won:
function Victory() {
    isGameWon = true
    gameOver()
    var header = document.querySelector(`h1`);
    header.innerText = "AMAZING"
    var smily = document.querySelector('h1 span')
    smily.innerHTML = gameWonSmily
    highScore()
}

//just what is sounds like (and another recurtion!)
function safeClick() {
    if (!gGame.isOn) return;
    if (safeClicksLeft === 0) return;
    clicks++;
    if (clicks === 1) {
        setMinesOnBoard(gBoard, mineCount)
        setMinesNegsCount(gBoard)
    }
    safeClicksLeft--
    var iNum = getRandomInt(0, gBoard.length)
    var jNum = getRandomInt(0, gBoard[0].length)
    var currCell = gBoard[iNum][jNum]
    if (currCell.revealed) {
        safeClicksLeft++
        safeClick();
        return;
    }
    if (currCell.gameElement === MINE) {
        safeClicksLeft++
        safeClick()
        return;
    }
    var elCell = document.querySelector(`.cell-${iNum}-${jNum}`);
    elCell.classList.add("hint")
    setTimeout(function () {
        elCell.classList.remove("hint")
    }, 3000)
    var elBtn = document.querySelector(".safeclick span")
    elBtn.innerText = ` ${safeClicksLeft} left!`
}

//customize the board if u wanna
function customize() {
    difficultyRow = +prompt('How many rows do you want m8?')
    difficultyCol = +prompt('How many columns do you want m8?')
    mineCount = +prompt('How many mines do you want m8?')
    init()
}

// Create the board:
function buildBoard() {
    var board = new Array(difficultyRow);
    for (var i = 0; i < board.length; i++) {
        board[i] = new Array(difficultyCol);
    }
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = { type: 'FLOOR', gameElement: null, flagged: false, revealed: false, i: i, j: j }
        }
    }
    return board;
}

//rendering board to HTML
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var cellClass = getClassName({ i: i, j: j })

            if (currCell.type === FLOOR) cellClass += ' floor';
            strHTML += `\t<td class=" hidden cell ${cellClass}" onclick="cellClicked(this,${i},${j})" oncontextmenu ="flagCell(this,event,${i},${j})" >\n`;
            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

//used to naming the cells by classes, makes it easy to adress a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

//difficulty changers:
function changeEasy() {
    difficultyRow = 4
    difficultyCol = 4
    mineCount = 2
    stopTimer()
    init()
    clicks = 0
}

function changeMedium() {
    difficultyRow = 8
    difficultyCol = 8
    mineCount = 12
    stopTimer()
    init()
    clicks = 0
}

function changeHard() {
    difficultyRow = 12
    difficultyCol = 12
    mineCount = 30
    stopTimer()
    init()
    clicks = 0
}