document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener("keydown", flap)
    if (sessionStorage.getItem('score')){
        document.getElementById('hiscore').innerText= "High score: " + sessionStorage.getItem('score')
    }
    let difficultybar = document.getElementById('difficultybar')
    difficultybar.addEventListener('change', updateDifficulty)
})

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
console.log(sessionStorage.getItem('difficulty'))
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
// y = a(t)^2 + v(t) + h

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
    ctx.beginPath();
    ctx.rect(barx, bary, 100, 150-difficulty);
    ctx.fillStyle = "#95dd00";
    ctx.fill();
    ctx.closePath();
}

function endgame() {
    alert("GAME OVER")
    document.location.reload()
    clearInterval(interval)
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
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {endgame()}

    if ((y < bary || y + 20 > bary + 150 - difficulty) && (barx < x && x < barx+90)) {endgame()}
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
        }
    }
}

let interval = setInterval(draw, 10);