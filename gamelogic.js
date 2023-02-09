document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener("keydown", flap)
    if (sessionStorage.getItem('score')){
        document.getElementById('hiscore').innerText= sessionStorage.getItem('bestUser') + " high score: " + sessionStorage.getItem('score')
    }
    let difficultybar = document.getElementById('difficultybar')
    difficultybar.addEventListener('change', updateDifficulty)
    document.getElementById('getusername').addEventListener('submit', showgame)
})

function showgame(){
    console.log(this[0].value)
    let username = this[0].value
    if (0 < username.length && username.length <= 15) {
        document.getElementById('gamebox').style.display = 'block'
        document.getElementById('usernameBox').style.display = 'none'
        sessionStorage.setItem('currentUser', username)
    } else {
        document.getElementById('errorMessage').style.display = 'block'
    }
    return false
}
function flap(e){
    if (e.key ===" "){
        spacePressed = true
    }
}

let canvas = document.getElementById('gameCanvas')
let ctx = canvas.getContext('2d')


let difficultybar = document.getElementById('difficultybar')
let spacePressed = false
var ballRadius = 10
var x = canvas.width/4
var y = canvas.height-200
var dx = 2
var dy = 3 
let difficulty = 50

if (sessionStorage.getItem('difficulty')){
    difficulty = sessionStorage.getItem('difficulty')
    difficultybar.value = difficulty
} else {
    difficulty = 50
}
let gap = canvas.height - difficulty
let flapped = 0
let barx = canvas.width - 100
let bary = 100
let score = 0
let goingup = false

function updateDifficulty(){
    difficulty = document.getElementById('difficultybar').value
    sessionStorage.setItem('difficulty', difficulty)
    console.log(difficulty)
}
let image = new Image()
image.src = 'output-onlinepngtools.png'

function drawBird(){
    if (goingup){
        ctx.save()
        ctx.translate(x-35, y-35)
        ctx.rotate(-30*Math.PI/180)
        ctx.drawImage(image, -15,10)
        ctx.restore()
    } else {
        ctx.save()
        ctx.translate(x-35, y-35)
        ctx.rotate(30*Math.PI/180)
        ctx.drawImage(image, 15,-19)
        ctx.restore()
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#b02c3a";
    ctx.fill();
    ctx.closePath();
}

function drawObstacles(){
    //bottom rectangle
    ctx.beginPath();
    ctx.rect(barx, bary + 150 - difficulty, 50, 300);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();

    //top rectangle
    ctx.beginPath();
    ctx.rect(barx, 0, 50, bary);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
}

function endgame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawObstacles()
    drawBall()
    drawBird()
    ctx.font = "24px Arial";
    ctx.fillStyle = "#eeeeee";
    ctx.fillText(`Score: ${score}`, 195, 30);

    ctx.font = "24px Arial";
    ctx.fillStyle = "#eeeeee";
    ctx.fillText("PLAY AGAIN", 170, 170);
    canvas.addEventListener('click', newGame)
}


function newGame(){
    document.getElementById('score').innerText= "Score: " + 0
    flapped = 0
    score = 0
    goingup = false
    endMenu = false
    spacePressed = false
    barx = canvas.width
    bary = 100
    x = canvas.width/4
    y = canvas.height-200
    dx = 2
    dy = 3 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#eeeeee";
  ctx.fillText(`Score: ${score}`, 190, 30);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawObstacles()
    drawBall()
    drawBird()
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {endMenu = true}

    if ((y < bary || y + 20 > bary + 150 - difficulty) && (barx < x && x < barx+50)) {endMenu = true}
    if (spacePressed){
        flapped = 40
        spacePressed = false
    }
    if (flapped > 0) {
        y -= 20
        flapped -= 1
        goingup = true
    } else {
        y += dy 
        goingup = false
    }
    drawScore()
    flapped -= 10
    barx -= 7
    if (barx < 0) {
        barx = canvas.width
        bary = Math.random()*(canvas.height - difficulty - 100)
        score += 1
        document.getElementById('score').innerText= "Score: " + score
        if (score > sessionStorage.getItem('score')) {
            sessionStorage.setItem('score', score)
            sessionStorage.setItem('bestUser', sessionStorage.getItem('currentUser'))
            document.getElementById('hiscore').innerText= sessionStorage.getItem('bestUser') + " high Score: " + score
        }
    }
}

let playbutton = {
    x : canvas.width/2,
    y : canvas.height/2,
    width : 200,
    height : 100
}

function playButtonPressed(){
    displaymenu = false
}

function drawMenu(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    ctx.fillStyle = "#eeeeee";
    ctx.fillText("PLAY", 210, 170);
    canvas.addEventListener('click', playButtonPressed)
}

let displaymenu = true
let endMenu = false
function playGame(){
    if (displaymenu == true){
        drawMenu()
    } else if (endMenu == false){
        draw()
    } else {
        endgame()
    }
}

setInterval(playGame, 10);