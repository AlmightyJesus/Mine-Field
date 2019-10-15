
function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function creatArray(amount) {
  var nums = []
  for (var i = 1; i <= amount; i++) {
    nums.push(i)
  }
  return nums
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
//define a cell :
// var cellCoord = { i: currCell.i, j: currCell.j }

// timer functions:

var startTime;
var myTimerInterval;

function stopTimer() {

  clearInterval(myTimerInterval);
}

function startTimer() {
  startTime = new Date().getTime();
  myTimerInterval = setInterval(function () { myTimer() }, 50);
}

function myTimer() {
  var interval = new Date().getTime() - startTime;
  var minuets = Math.floor(interval / 1000 / 60);
  var seconds = Math.floor(interval / 1000 % 60);
  document.getElementById("min").innerHTML = pad2(minuets);
  document.getElementById("sec").innerHTML = pad2(seconds);
}
function pad2(number) {

  if (number < 10) {
    return '0' + number
  }
  else {
    return '' + number
  }
}

function highScore() {

  var min = document.getElementById("min").innerHTML;
  var sec = document.getElementById("sec").innerHTML;
  var total = min * 60 + sec;
  final = localStorage.getItem('bestTime');
  if (total < final) {
    document.getElementById('bestTime').innerHTML = 'Best score:  ' + min + ':' + sec;
    localStorage.setItem('bestTime', total)
    final = min + ':' + sec;
  }
}

function showBestTime() {
  if (final) {
    document.getElementById('bestTime').innerHTML = 'Best score: ' + final;
  }
  if (!final) {
    localStorage.setItem('bestTime', 999999999)
    document.getElementById('bestTime').innerHTML = 'No Best'
  }
  if (final > 9999999) {
    document.getElementById('bestTime').innerHTML = 'No Best'
  }
}